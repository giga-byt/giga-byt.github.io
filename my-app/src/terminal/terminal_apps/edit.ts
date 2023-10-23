import { Terminal } from "xterm";
import { insert, remove } from "../../utils/str_utils";
import { MyTerminalContext, resolvePath } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";
import CC, { TBGColor, TColor } from './ControlCodes'
import { KC } from "./KeyCodes";
import { Cursor } from "./CursorUtils";

const NCOMMANDROWS = 3;
const NCOMMANDCOLS = 1;

enum EditMode {
    EDIT = 0,
    SAVE = 1
}

const FILE_PREFIX = 'File Name to Write: ';



export default class Edit implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;
    contents: Array<string>;
    scroll: [number, number];
    cpos: [number, number];
    statusTimer: number;
    statusBuffer: string;
    mode: EditMode;

    // variables used to control save mode
    fname: string;
    save_cursor_pos: number;

    exit: () => void;

    constructor(terminal: Terminal, context: MyTerminalContext, exitCb: () => void) {
        this.terminal = terminal;
        this.context = context;
        this.contents = [];
        this.scroll = [0, 0];
        this.cpos = [0, 0];
        this.statusTimer = 0;
        this.statusBuffer = '';
        this.fname = '';
        this.save_cursor_pos = 0;
        this.mode = EditMode.EDIT;
        this.exit = exitCb;
    }

    _viewportRows() {
        return this.terminal.rows - NCOMMANDROWS;
    }

    _viewportCols() {
        return this.terminal.cols - NCOMMANDCOLS;
    }

    _statusRow(): number {
        return this._viewportRows();
    }

    _cursorUp() {
        let [x, y] = this.cpos;
        if(y == 0){
            if(this._cursorLine() == 0){
                return;
            }
            this._scrollUp();
        } else {
            this.cpos[1] -= 1;
        }
        this._fixScroll();
    }

    _cursorDown() {
        let [x, y] = this.cpos;
        if(this._cursorLine() == this.contents.length - 1){
            return;
        }
        else if(y ==  this._viewportRows() - 1) {
            this._scrollDown();
        } else {
            this.cpos[1] += 1;
        }
        this._fixScroll();
    }

    _cursorLeft() {
        let [x, y] = this.cpos;
        if(x == 0) {
            this._scrollLeft();
        } else {
            this.cpos[0] -= 1;
        }
    }

    _cursorRight() {
        let [x, y] = this.cpos;
        if(x == this._numVisibleChars(this._cursorLine())){
            return
        } else if (x == this._viewportCols()) {
            this._scrollRight();
        } else {
            this.cpos[0] += 1;
        }
    }

    _fixScroll() {
        let numVisibleCharsInCurrentLine = this._numVisibleChars(this._cursorLine());
        if(numVisibleCharsInCurrentLine < 0){
            this.scroll[0] = this._hscroll() + numVisibleCharsInCurrentLine - 1;
        }
        numVisibleCharsInCurrentLine = this._numVisibleChars(this._cursorLine());
        this.cpos[0] = Math.min(this.cpos[0], numVisibleCharsInCurrentLine);
    }

    _numVisibleChars(linenum: number) {
        return this.contents[linenum].length - this._hscroll();
    }

    _cursorLine() {
        return this.cpos[1] + this._vscroll();
    }

    _cursorChar() {
        return this.cpos[0] + this._hscroll();
    }

    _hscroll () {
        return this.scroll[0];
    }

    _vscroll() {
        return this.scroll[1];
    }

    _scrollRight() {
        this.scroll[0] = this._hscroll() + 1;
    }

    _scrollLeft() {
        this.scroll[0] = Math.max(0, this._hscroll() - 1);
    }

    _scrollDown() {
        this.scroll[1] = this._vscroll() + 1;
    }

    _scrollUp() {
        this.scroll[1] = Math.max(0, this._vscroll() - 1);
    }

    _currentLine(): string {
        return this.contents[this._cursorLine()];
    }

    _setCurrentLine(s: string): void {
        this.contents[this._cursorLine()] = s;
    }

    _getStatusMessage(): string {
        return this.statusTimer != 0 ? this.statusBuffer : '';
    }

    _getDisplayCursorPos(): [number, number] {
        if(this.mode == EditMode.EDIT) {
            return this.cpos;
        } else {
            return [this.save_cursor_pos + FILE_PREFIX.length, this._statusRow()];
        }
    }

    _writeStatusMessage(message: string, timer: number = 50) {
        this.statusTimer = timer;
        let statusMsg = '';
        statusMsg += CC.moveRight(Math.round(this.terminal.cols / 2 - message.length / 2));
        statusMsg += CC.color(message, TColor.BLACK, TBGColor.LIGHT_GRAY, true);
        this.statusBuffer = statusMsg;
    }

    _writeFileDialog() {
        // lasts forever
        this.statusTimer = -1;
        let msg = FILE_PREFIX;
        msg += this.fname;
        // fill rest with spaces
        msg = msg.padEnd(this.terminal.cols);
        msg = CC.color(msg, TColor.BLACK, TBGColor.LIGHT_GRAY, true);
        this.statusBuffer = msg;
    }

    _displayDocument() {
        if(this.statusTimer != 0){
            this.statusTimer -= 1;
        }
        let cmd = CC.clearScreen();
        cmd += CC.moveToTopLeft();
        let nrows = this._viewportRows();
        let ncols = this._viewportCols();
        let lines = this.contents.slice(this._vscroll(), this._vscroll() + nrows);
        lines.forEach(line => {
            let lScrolledLine = line.slice(this._hscroll(), this._hscroll() + ncols);
            cmd += lScrolledLine;
            cmd += CC.newLine();
        });
        // write commands
        cmd += CC.moveToTopLeft();
        cmd += CC.moveDown(this._viewportRows());
        let statusMsg = this._getStatusMessage();
        cmd += statusMsg + CC.newLine();
        cmd += CC.color('^O', TColor.BLACK, TBGColor.LIGHT_GRAY, true) + ' Write Out' + CC.newLine();
        cmd += CC.color('^X', TColor.BLACK, TBGColor.LIGHT_GRAY, true) + ' Exit';

        cmd += CC.moveToTopLeft();
        let pos = this._getDisplayCursorPos();
        cmd += CC.moveRight(pos[0]);
        cmd += CC.moveDown(pos[1]);
        this.terminal.write(cmd);
    }

    onExec(args: Array<string>): string | undefined {
        this.mode = EditMode.EDIT;
        if(args.length == 0){
            return 'no arg';
        }
        let fname = args[0];
        let resolvedPath = resolvePath(this.context, fname);
        let file = this.context.fs.get(resolvedPath);
        if(!file){
            return 'no file';
        }
        if(file.isDirectory()){
            return 'is dir';
        }
        this.fname = file.name();
        this.contents = file.contents().split('\n');
        this.scroll = [0, 0];
        this.cpos = [0, 0];
        this.terminal.clear();
        this._writeStatusMessage(`Read ${this.contents.length} lines.`)
        this._displayDocument();
        return;
    }

    onData(data: string) {
        ;
    }

    onKey (keyEvent: { key: string, domEvent: KeyboardEvent }) {
        if(this.mode == EditMode.EDIT) {
            this.onKeyEditMode(keyEvent);
        } else {
            this.onKeySaveMode(keyEvent);
        }
    }

    onKeySaveMode (keyEvent: { key: string, domEvent: KeyboardEvent }) {
        let key = keyEvent.key;
        let ctrl = keyEvent.domEvent.ctrlKey;
        let alt = keyEvent.domEvent.altKey;
        if(ctrl || alt) {
            return;
        }
        switch(key) {
            case '\r': // Fallthrough
            case '\n':
                this._writeStatusMessage(`[ Wrote ${this.contents.length} line${this.contents.length > 1 ? 's' : ''} ]`);
                this.mode = EditMode.EDIT;
                this._displayDocument();
                return;
            case KC.BACKSPACE:
                this.fname = remove(this.fname, this.save_cursor_pos - 1);
                this.save_cursor_pos = Cursor.Left(this.save_cursor_pos);
                break;
            case KC.LEFT:
                this.save_cursor_pos = Cursor.Left(this.save_cursor_pos);
                break;
            case KC.RIGHT:
                this.save_cursor_pos = Cursor.Right(this.save_cursor_pos, this.fname.length);
                break;
            default:
                if(key.length == 1) {
                    this.fname = insert(this.fname, this.save_cursor_pos, key);
                    this.save_cursor_pos = Cursor.Right(this.save_cursor_pos, this.fname.length);
                }
        }
        this._writeFileDialog();
        this._displayDocument();
    }

    onKeyEditMode (keyEvent: { key: string, domEvent: KeyboardEvent }) {
        let key = keyEvent.key;
        let ctrl = keyEvent.domEvent.ctrlKey;
        let alt = keyEvent.domEvent.altKey;
        if(alt) {
            return;
        }
        if (ctrl) {
            if(key == KC.CTRLX){
                this.exit();
                return;
            } else if (key == KC.CTRLO){
                this.mode = EditMode.SAVE;
                this.save_cursor_pos = this.fname.length;
                this._writeFileDialog();
                this._displayDocument();
                return;
            }
            return;
        }

        switch(key) {
            case '\r': // Fallthrough
            case '\n':
                let cline = insert(this._currentLine(), this._cursorChar(), '\n');
                let lines = cline.split('\n');
                lines.reverse();
                this.contents.splice(this._cursorLine(), 1);
                for(let line of lines){
                    this.contents.splice(this._cursorLine(), 0, line);
                }
                this._cursorDown();
                this.scroll[0] = 0;
                this.cpos[0] = 0;
                break;
            case KC.BACKSPACE:
                this._setCurrentLine(remove(this._currentLine(), this._cursorChar() - 1));
                this._cursorLeft();
                break;
            case KC.UP:
                this._cursorUp();
                break;
            case KC.DOWN:
                this._cursorDown();
                break;
            case KC.LEFT:
                this._cursorLeft();
                break;
            case KC.RIGHT:
                this._cursorRight();
                break;
            default:
                if(key.length == 1){
                    let cline = insert(this._currentLine(), this._cursorChar(), key);
                    this._setCurrentLine(cline);
                    this.cpos[0] += 1;
                    this._displayDocument();
                    return;
                }
        }
        this._displayDocument();
    }
}