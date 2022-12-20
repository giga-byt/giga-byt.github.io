import { Directory, TerminalContext, DFile } from '../terminal_fs/FakeFileSystem';

const helpText = (
`Usage: touch FILE...
Update the access and modification times of each FILE to the current time.

A FILE argument that does not exist is created empty.`
)
function createOrTouch(dir: Directory, fname: string): void {
    let file = new DFile(fname, '');
    if(!dir.addChild(file)){
        let child = dir.getChild(fname)!;
        child.lastChanged = new Date();
    }
}

export function touch(context: TerminalContext, args: Array<string>, flags: Set<string>): Array<string> {
    if(flags.has('help') || flags.has('h')) {
        return helpText.split('\n');
    }
    if(!args || !args[0]) {
      return ['touch: missing file operand', "Try 'touch --help' for more information."];
    }
    let argPath = args[0]
    let fullPath = argPath.split('/');
    let dirPath = fullPath.slice(0, -1).join('/');
    let fname = fullPath.slice(-1)[0];
    let resolvedPath: Directory | DFile | undefined;
    if(dirPath){
        [resolvedPath, ] = context.fs.resolvePath(dirPath, context.cwd);
    } else {
        resolvedPath = context.cwd;
    }
    if(!resolvedPath){
        return [`touch: cannot touch '${argPath}': No such file or directory`]
    }
    if(resolvedPath instanceof DFile) {
      return [`touch: cannot touch '${argPath}': Not a directory`];
    }
    createOrTouch(resolvedPath, fname);
    return [];
}