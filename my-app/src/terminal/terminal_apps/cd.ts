import { Terminal } from "xterm";
import { MyTerminalContext, Path } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";

export default class ChangeDirectory implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;

    constructor(terminal: Terminal, context: MyTerminalContext) {
        this.terminal = terminal;
        this.context = context;
    }

    onExec(args: Array<string>): boolean {
        let navToDir = '~';
        if(args.length > 1){
            navToDir = args[0];
        }
        if(navToDir == '~'){
            this.context.cwd = this.context.home();
        } else if(navToDir == '..'){
            this.context.cwd = this.context.cwd.up()
        } else if (navToDir == '.'){
            ;
        } else {
            let nextDir = this.context.cwd.to(navToDir);
            if(this.context.fs.exists(nextDir) && this.context.fs.get(nextDir)?.isDirectory()) {
                this.context.cwd = nextDir;
            }
        }
        return false;
    }

    onData(data: string) {}
    onKey (keyEvent: { key: string, domEvent: KeyboardEvent }) {}
}