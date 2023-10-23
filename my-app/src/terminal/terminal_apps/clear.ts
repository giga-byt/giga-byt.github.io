import { Terminal } from "xterm";
import { MyTerminalContext, Path, resolvePath } from "../MyTerminalContext";
import ControlCodes from "./ControlCodes";
import { ITerminalApplication } from "./ITerminalApplication";

export default class Clear implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;

    constructor(terminal: Terminal, context: MyTerminalContext) {
        this.terminal = terminal;
        this.context = context;
    }

    onExec(args: Array<string>): string | undefined {
        this.terminal.clear();
        return ControlCodes.clearScreen();
    }

    onData(data: string) {}
    onKey(keyEvent: { key: string, domEvent: KeyboardEvent }) {}
}