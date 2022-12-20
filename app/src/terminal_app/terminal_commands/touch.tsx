import { Directory, TerminalContext, DFile } from '../terminal_fs/FakeFileSystem';

const helpText = (
`Usage: touch FILE...
Update the access and modification times of each FILE to the current time.

A FILE argument that does not exist is created empty.`
)

export function touch(context: TerminalContext, args: Array<string>, flags: Set<string>): Array<string> {
    if(flags.has('help') || flags.has('h')) {
        return helpText.split('\n');
    }
    function tryCreateFile(dir: Directory, fname: string): Array<string> {
        let file = new DFile(fname, '');
        dir.addChild(file);
        return [];
    }
    if(!args || !args[0]) {
      return ['touch: missing file operand', "Try 'touch --help' for more information."];
    }
    return [];
}