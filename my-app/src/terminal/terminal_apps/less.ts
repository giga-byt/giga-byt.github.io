import { Terminal } from "xterm";
import { insert, remove } from "../../utils/str_utils";
import { MyTerminalContext, resolvePath } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";
import CC from './ControlCodes'
import { KC } from "./KeyCodes";

export default class Less implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;
    contents: string;
    scroll: number;
    exit: () => void;

    constructor(terminal: Terminal, context: MyTerminalContext, exitCb: () => void) {
        this.terminal = terminal;
        this.context = context;
        this.contents = '';
        this.scroll = 0;
        this.exit = exitCb;
    }

    contentsAsLines(): Array<string> {
        return this.contents.split('\n');
    }

    _errorNoArgs(): string {
        return 'Missing filename ("less --help" for help)';
    }

    _errorNoPath(arg: string): string {
        return `${arg}: No such file or directory`;
    }

    _errorDirArg(arg: string): string {
        return `${arg} is a directory`;
    }

    _scrollDown() {
        this.scroll = Math.min(this.contentsAsLines().length - 1, this.scroll + 1);
    }

    _scrollUp() {
        this.scroll = Math.max(0, this.scroll - 1);
    }

    _writeDocument() {
        let cmd = CC.clearScreen();
        cmd += CC.moveToTopLeft();
        let nrows = this.terminal.rows - 1;
        let lines = this.contentsAsLines().slice(this.scroll, this.scroll + nrows);
        lines.forEach(line => {
            cmd += line;
            cmd += CC.newLine();
        });
        cmd += CC.moveToTopLeft();
        cmd += CC.moveDown(nrows);
        this.terminal.write(cmd);
    }

    onExec(args: Array<string>): string | undefined {
        if(args.length == 0){
            this.terminal.writeln(this._errorNoArgs());
            return '';
        }
        let fname = args[0];
        let resolvedPath = resolvePath(this.context, fname);
        let file = this.context.fs.get(resolvedPath);
        if(!file){
            this.terminal.writeln(this._errorNoPath(fname));
            return '';
        }
        if(file.isDirectory()){
            this.terminal.writeln(this._errorDirArg(fname));
            return '';
        }
        this.contents = file.contents();
        this.scroll = 0;
        this.terminal.clear();
        this._writeDocument();
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
        if(key == KC.UP){ // up arrow
            this._scrollUp();
            this._writeDocument();
            return;
        }
        if(key == KC.DOWN){ // down arrow
            this._scrollDown();
            this._writeDocument();
            return;
        }
        if(key == 'q'){
            this.exit()
        }
    }
}