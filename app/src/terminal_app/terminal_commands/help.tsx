import { TerminalContext } from '../terminal_fs/FakeFileSystem';

export const welcomeText = (
`Welcome back, MAG.
You have two (2) new messages in your inbox.
Use the 'help' command to view available commands. `
)

const helpText = (
`GNU bash, version 4.4.23(1)-release (x86_64-pc-msys)
These shell commands are defined internally.  Type 'help' to see this list.

A star (*) next to a name means that the command is disabled.
Use '--help' after a command, e.g. 'ls --help', to see details on how to use the command.

exit  return to graphical mode
ls    view directory information.`
)

export function help(context: TerminalContext, args: Array<string>, flags: Set<string>): Array<string> {
    return helpText.split('\n');
}