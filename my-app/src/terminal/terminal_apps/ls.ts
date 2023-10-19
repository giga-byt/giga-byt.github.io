import { Terminal } from "xterm";
import { MyTerminalContext, Path, resolvePath } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";

export default class ListDir implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;

    constructor(terminal: Terminal, context: MyTerminalContext) {
        this.terminal = terminal;
        this.context = context;
    }

    onExec(args: Array<string>): boolean {
        let listDir = '.';
        if(args.length > 1){
            listDir = args[0];
        }
        let resolvedPath = resolvePath(this.context, listDir);
        if(this.context.fs.exists(resolvedPath) && this.context.fs.get(resolvedPath)?.isDirectory()){
            let children = this.context.fs.children(resolvedPath);
            let basenames = children.map((p) => p.basename());
            this.terminal.writeln(basenames.join('  '));
        }
        return false;
    }

    onData(data: string) {}
    onKey (keyEvent: { key: string, domEvent: KeyboardEvent }) {}
}