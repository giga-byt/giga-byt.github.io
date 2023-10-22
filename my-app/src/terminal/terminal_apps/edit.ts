import { Terminal } from "xterm";
import { insert, remove } from "../../utils/str_utils";
import { MyTerminalContext, resolvePath } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";
import CC from './ControlCodes'
import { KC } from "./KeyCodes";

const NCOMMANDROWS = 2;
const NCOMMANDCOLS = 1;

export default class Edit implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;
    contents: Array<string>;
    scroll: [number, number];
    cpos: [number, number];
    exit: () => void;

    constructor(terminal: Terminal, context: MyTerminalContext, exitCb: () => void) {
        this.terminal = terminal;
        this.context = context;
        this.contents = [];
        this.scroll = [0, 0];
        this.cpos = [0, 0];
        this.exit = exitCb;
    }

    _viewportRows() {
        return this.terminal.rows - NCOMMANDROWS;
    }

    _viewportCols() {
        return this.terminal.cols - NCOMMANDCOLS;
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

    _enterChar() {

    }


    _displayDocument() {
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
        cmd += CC.moveToTopLeft();
        console.log(this.cpos);
        cmd += CC.moveRight(this.cpos[0]);
        cmd += CC.moveDown(this.cpos[1]);
        this.terminal.write(cmd);
    }

    onExec(args: Array<string>): string | undefined {
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
        this.contents = file.contents().split('\n');
        this.scroll = [0, 0];
        this.cpos = [0, 0];
        this.terminal.clear();
        this._displayDocument();
        return;
    }

    onData(data: string) {
        ;
    }

    onKey (keyEvent: { key: string, domEvent: KeyboardEvent }) {
        let key = keyEvent.key;
        let ctrl = keyEvent.domEvent.ctrlKey;
        let alt = keyEvent.domEvent.altKey;

        if(ctrl || alt){
            return;
        }
        // enter
        if(key == '\r' || key == '\n'){
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
            this._displayDocument();
            return;
        }
        if(key == KC.BACKSPACE) {
            let cline = remove(this._currentLine(), this._cursorChar() - 1);
            this._setCurrentLine(cline);
            this._cursorLeft();
            this._displayDocument();
            return;
        }
        if(key == KC.UP) {
            this._cursorUp();
            this._displayDocument();
            return;
        }
        if(key == KC.DOWN) {
            this._cursorDown();
            this._displayDocument();
            return;
        }
        if(key == KC.LEFT) {
            this._cursorLeft();
            this._displayDocument();
            return;
        }
        if(key == KC.RIGHT) {
            this._cursorRight();
            this._displayDocument();
            return;
        }
        if(key.length == 1){
            let cline = insert(this._currentLine(), this._cursorChar(), key);
            this._setCurrentLine(cline);
            this.cpos[0] += 1;
            this._displayDocument();
            return;
        }
    }
}