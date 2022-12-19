import { TerminalContext } from '../terminal_fs/FakeFileSystem';
import './TextFormatting.css'

export const helpText = (
`GNU bash, version 4.4.23(1)-release (x86_64-pc-msys)
These shell commands are defined internally.  Type 'help' to see this list.

A star (*) next to a name means that the command is disabled.

exit  return to graphical mode
ls    view`
)

function help(context: TerminalContext, args?: Array<string>): Array<string> {
    return helpText.split('\n');
}