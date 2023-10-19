import { Terminal } from "xterm";
import { MyTerminalContext, Path, resolvePath } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";

export default class ChangeDirectory implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;

    constructor(terminal: Terminal, context: MyTerminalContext) {
        this.terminal = terminal;
        this.context = context;
    }

    onExec(args: Array<string>): string | undefined {
        let navToDir = '~';
        if(args.length > 0){
            navToDir = args[0];
        }
        let resolvedPath = resolvePath(this.context, navToDir);
        if(this.context.fs.exists(resolvedPath) && this.context.fs.get(resolvedPath)?.isDirectory()){
            this.context.cwd = resolvedPath;
        }
        return '';
    }

    onData(data: string) {}
    onKey (keyEvent: { key: string, domEvent: KeyboardEvent }) {}
}