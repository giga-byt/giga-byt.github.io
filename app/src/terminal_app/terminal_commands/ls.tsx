import { DFile, Directory, TerminalContext } from "../terminal_fs/FakeFileSystem";

export function ls(context: TerminalContext, args?: Array<string>): Array<string> {
  function listContents(dir: Directory): Array<string> {
    let keys = dir.children()
    return [keys.join(' ')];
  }
  if(!args || !args[0]) {
    return listContents(context.cwd);
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
  return listContents(resolvedPath);
}