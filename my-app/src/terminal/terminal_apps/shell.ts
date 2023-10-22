import { Terminal } from "xterm";
import { escapeRegExp, expandToken, insert, longestCommonPrefix, parseTokens, remove } from "../../utils/str_utils";
import { MyTerminalContext } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";
import CC from './ControlCodes';
import { KC } from './KeyCodes'


const SPECIAL_ARGS = {
    'prev_cmd': CC.moveUp(1),
}
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
        this.history = this.history.filter((item, index) => item != '');
        this.history.push('');
        this.currChar = 0;
        this.currLine = this.history.length - 1;
        if(args.length != 0){
            if(args[0] == SPECIAL_ARGS.prev_cmd){
                this._moveCursorUp();
                this._write_tag();
                return;
            }
            else {
                // do something when passed args?
            }
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

    _expand_buffer(buf: string): string {
        let asTokens = parseTokens(buf);
        let expanded: Array<string> = [];
        for(let tok of asTokens){
            if(tok.includes('*')){
                expanded = expanded.concat(expandToken(tok, this.context.cwdChildren()));
            } else {
                expanded.push(tok);
            }
        }
        return expanded.join(' ');
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
            this.execCb(this._expand_buffer(this.currBuffer()));
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
        if(key == '\t') {
            if(this.currChar != this.currBuffer().length){
                return;
            }
            let asTokens = parseTokens(this.currBuffer());
            if(!asTokens) {
                return;
            }
            let lastTok = asTokens.pop()!;
            let matches = expandToken(lastTok + '*', this.context.cwdChildren());
            if(matches.length == 0) {
                return;
            }
            if(matches.length == 1) {
                asTokens.push(matches[0])
                this.setCurrBuffer(asTokens.join(' '));
                this.currChar = this.currBuffer().length;
                this.writeBuffer();
                return;
            }
            // multiple matches
            let lcp = longestCommonPrefix(matches);
            if(lastTok != lcp) {
                asTokens.push(longestCommonPrefix(matches));
                this.setCurrBuffer(asTokens.join(' '));
                this.currChar = this.currBuffer().length;
                this.writeBuffer();
            } else {
                this.terminal.write(CC.newLine());
                this.execCb(`echo ${matches.join(' ')} && shell ${SPECIAL_ARGS.prev_cmd}`)
            }
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