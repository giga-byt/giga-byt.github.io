import { Terminal } from "xterm";
import { MyTerminalContext } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";

export default class Echo implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;
    constructor(terminal: Terminal, context: MyTerminalContext) {
        this.terminal = terminal;
        this.context = context;
    }

    onExec(args: Array<string>): string | undefined {
        return args.join(' ');
    }

    onData(data: string){}
    onKey (keyEvent: { key: string, domEvent: KeyboardEvent }){}
}