import { TerminalContext } from '../terminal_fs/FakeFileSystem';

export function echo(context: TerminalContext, args: Array<string>, flags: Set<string>): Array<string> {
    return args || [];
}