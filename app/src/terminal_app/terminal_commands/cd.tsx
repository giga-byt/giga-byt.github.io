import { DFile, TerminalContext } from "../terminal_fs/FakeFileSystem";

export function cd(context: TerminalContext, args?: Array<string>): Array<string> {
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