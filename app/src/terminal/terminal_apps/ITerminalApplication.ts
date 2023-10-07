export interface ITerminalApplication {
    onExec(args: Array<string>): void;
    onKey(keyEvent: { key: string, domEvent: KeyboardEvent }): void;
    onData(data: string): void;
}