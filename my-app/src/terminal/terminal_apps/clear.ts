import { Terminal } from "xterm";
import { MyTerminalContext, Path, resolvePath } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";
import CC from './ControlCodes'

export default class Clear implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;

    constructor(terminal: Terminal, context: MyTerminalContext) {
        this.terminal = terminal;
        this.context = context;
    }

    onExec(args: Array<string>): string | undefined {
        let cmd = CC.clearScreen();
        cmd += CC.moveToTopLeft();
        return cmd;
    }

    onData(data: string) {}
    onKey(keyEvent: { key: string, domEvent: KeyboardEvent }) {}
}