export interface ITerminalApplication {
    // returns true if terminal should remain in this mode (e.g. less)
    // returns false if it's a one-off command (e.g. grep, cd)
    onExec(args: Array<string>): boolean;
    onKey(keyEvent: { key: string, domEvent: KeyboardEvent }): void;
    onData(data: string): void;
}