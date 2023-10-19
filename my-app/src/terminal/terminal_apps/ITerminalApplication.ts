export interface ITerminalApplication {
    // returns None if terminal should remain in this mode (e.g. less)
    // i.e. the mode is handling its own writing
    // returns a string if it's a one-off command (e.g. grep, cd)
    // i.e. the app is a function with a return value
    onExec(args: Array<string>): string | undefined;
    onKey(keyEvent: { key: string, domEvent: KeyboardEvent }): void;
    onData(data: string): void;
}