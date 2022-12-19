import { DFile, Directory, TerminalContext } from "../terminal_fs/FakeFileSystem";

export function ls(context: TerminalContext, args?: Array<string>): Array<string> {
  function listContents(dir: Directory): Array<string> {
    let keys = dir.children()
    keys.reverse()
    keys.push('..');
    keys.push('.');
    keys.reverse();
    return [keys.join(' ')];
  }
  if(!args) {
    return listContents(context.cwd);
  }
  let argPath = args[0];
  console.log(argPath)
  let [resolvedPath, errorCode] = context.fs.resolvePath(argPath, context.cwd);
  if(!resolvedPath){
    return [""];
    // log error code
  }
  if(resolvedPath instanceof DFile) {
    return [""];
  }
  return listContents(resolvedPath);
}