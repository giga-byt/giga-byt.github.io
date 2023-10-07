export interface ITerminalApplication {
    onExec(args: Array<string>): boolean;
    onKey(keyEvent: { key: string, domEvent: KeyboardEvent }): void;
    onData(data: string): void;
}