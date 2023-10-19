import { Terminal } from "xterm";
import { insert, remove } from "../../utils/str_utils";
import { MyTerminalContext } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";
import CC from './ControlCodes';
import { KC } from './KeyCodes'

export default class Shell implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;
    history: Array<string>;
    currLine: number;
    currChar: number;
    queueCb: (str: string) => void;
    execCb: (str: string) => void;

    constructor(terminal: Terminal, context: MyTerminalContext, queueCb: (str: string) => void, execCb: (str: string) => void) {
        this.terminal = terminal;
        this.context = context;
        this.history = [''];
        this.currLine = 0;
        this.currChar = 0;
        this.queueCb = queueCb;
        this.execCb = execCb;
    }

    _write_tag() {
        let tag = CC.newLine();
        tag += `${this.context.user}@${this.context.machine} MINGW64 ${this.context.cwd.basename()}`;
        tag += CC.newLine();
        this.terminal.write(tag);
        this.writeBuffer()
    }

    onExec(args: Array<string>): string | undefined {
        this.history = this.history.filter((item, index) => this.history.indexOf(item) === index);
        this.history.push('');
        this.currChar = 0;
        this.currLine = this.history.length - 1;
        if(args.length != 0){
            this.setCurrBuffer(args.join(' '));
            this.queueCb(this.currBuffer());
            return;
        }
        this._write_tag();
        return;
    }

    currBuffer() {
        return this.history[this.currLine];
    }

    setCurrBuffer(str: string) {
        this.history[this.currLine] = str;
    }

    writeBuffer() {
        let cmd = CC.clearLine() + CC.moveToLineStart();
        cmd += `$ ${this.currBuffer()}`
        cmd += CC.moveToLineStart();
        cmd += CC.moveRight(this.currChar + 2);
        this.terminal.write(cmd);
    }

    onData(data: string) {
        ;
    }

    _moveCursorUp() {
        this.currLine = Math.max(0, this.currLine - 1);
        this.currChar = this.currBuffer().length;
    }

    _moveCursorDown() {
        this.currLine = Math.min(this.history.length - 1, this.currLine + 1);
        this.currChar = this.currBuffer().length;
    }

    _moveCursorLeft() {
        this.currChar = Math.max(0, this.currChar - 1);
    }

    _moveCursorRight() {
        this.currChar = Math.min(this.currBuffer().length, this.currChar + 1);
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
            this.terminal.write(CC.newLine());
            this.execCb(this.currBuffer());
            return;
        }
        // backspace
        if(key == KC.BACKSPACE) {
            let cline = remove(this.currBuffer(), this.currChar - 1);
            this.setCurrBuffer(cline);
            this._moveCursorLeft();
            this.writeBuffer();
            return;
        }
        if(key == KC.LEFT){ // left arrow
            this._moveCursorLeft();
            this.writeBuffer();
            return;
        }
        if(key == KC.RIGHT){ // right arrow
            this._moveCursorRight();
            this.writeBuffer();
            return;
        }
        if(key == KC.UP){ // up arrow
            this._moveCursorUp();
            this.writeBuffer();
            return;
        }
        if(key == KC.DOWN){ // down arrow
            this._moveCursorDown();
            this.writeBuffer();
            return;
        }
        if(key.length == 1){
            let cline = insert(this.currBuffer(), this.currChar, key);
            this.setCurrBuffer(cline);
            this.currChar += 1;
            this.writeBuffer();
            return;
        }
    }
}