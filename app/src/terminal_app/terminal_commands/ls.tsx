import { DFile, Directory, TerminalContext } from "../terminal_fs/FakeFileSystem";

const helpText = (
`Usage: ls [OPTION]... [DIR]...
List information about the DIRs (the current directory by default).
Sort entries alphabetically.

Mandatory arguments to long options are mandatory for short options too.
  -a, --all                  do not ignore entries starting with .
  -A, --almost-all           do not list implied . and ..
  -l                         use a long listing format`
)

function listContents(dir: Directory, flags: Set<string>): Array<string> {
  let keys = dir.children();
  if(flags.has('a') || flags.has('all')) { // show all
    keys = keys;
  } else if(flags.has('A') || flags.has('almost-all')) { // show all except ., ..
    keys = keys.filter( (value) => { return value !== '.' && value !== '..'; });
  } else { // don't show hidden
    keys = keys.filter( (value) => { return !value.startsWith('.'); });
  }
  if(flags.has('l')){
    let ret: Array<string> = [];
    ret.push('Owner\tLast Changed\t\tName');
    keys.forEach(key => {
      let obj = dir.getChild(key);
      if(obj) {
        ret.push(`${obj.owner}\t${obj.lastChanged.toLocaleString().replace(',', '')}\t${key}`)
      }
    });
    return ret;
  } else {
    return [keys.join(' ')];
  }
}

export function ls(context: TerminalContext, args: Array<string>, flags: Set<string>): Array<string> {
  if(flags.has('help') || flags.has('h')) {
    return helpText.split('\n');
  }
  if(!args || !args[0]) {
    return listContents(context.cwd, flags);
  }
  let argPath = args[0];
  let [resolvedPath, errorCode] = context.fs.resolvePath(argPath, context.cwd);
  if(!resolvedPath){
    if(errorCode === 1){
      return [`ls: cannot access '${argPath}': No such file or directory`]
    } else if (errorCode === 2){
      return [`ls: cannot access '${argPath}': Not a directory`]
    }
    return [""];
    // log error code
  }
  if(resolvedPath instanceof DFile) {
    return [resolvedPath.name];
  }
  return listContents(resolvedPath, flags);
}