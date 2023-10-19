import { Terminal } from "xterm";
import { MyTerminalContext } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";

export default class Help implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;
    constructor(terminal: Terminal, context: MyTerminalContext) {
        this.terminal = terminal;
        this.context = context;
    }

    onExec(args: Array<string>) {
        this.terminal.write(`
GNU bash, version 4.4.23(1)-release (x86_64-pc-msys)\r
These shell commands are defined internally.  Type 'help' to see this list.\r

A star (*) next to a name means that the command is disabled.\r
Use '--help' after a command, e.g. 'ls --help', to see details on how to use the command.\r

    exit  return to graphical mode\r
    ls    view directory information.\r\n`);
        return false;
    }

    onData(data: string){}
    onKey (keyEvent: { key: string, domEvent: KeyboardEvent }){}
}