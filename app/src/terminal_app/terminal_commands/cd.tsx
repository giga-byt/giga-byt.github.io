import { DFile, TerminalContext } from "../terminal_fs/FakeFileSystem";

const helpText = (
`cd: cd [dir]
Change the shell working directory.

Change the current directory to DIR. The default DIR is HOME.`
)

export function cd(context: TerminalContext, args: Array<string>, flags: Set<string>): Array<string> {
  if(flags.has('help') || flags.has('h')) {
    return helpText.split('\n');
  }
  if(!args || !args[0]) {
    context.changeCwd(context.fs.pathMap.get('~')!);
  } else { // there's an actual path we need to get to
    let argPath = args[0];
    let [resolvedPath, errorCode] = context.fs.resolvePath(argPath, context.cwd);
    if(!resolvedPath){
      if(errorCode === 1) {
        return [`cd: ${argPath}: No such file or directory`]
      } else if (errorCode === 2) {
        return [`cd: ${argPath}: Not a directory`]
      }
      return [];
    }
    if(resolvedPath instanceof DFile) {
      return [`cd: ${argPath}: Not a directory`];
    }
    context.changeCwd(resolvedPath);
  }
  return [];
}