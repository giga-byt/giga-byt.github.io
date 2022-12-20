import FsBase from '../../data/FS_GENERATED.json'

export class DFile {
  name: string;
  content: string;
  lastChanged: Date;
  owner: string;

  constructor(name: string, content: string){
    this.name = name;
    this.content = content;
    this.lastChanged = new Date();
    this.owner = "";
  }
}

export class Directory {
  name: string;
  parent: Nullable<Directory>;
  contents: Map<string, Directory | DFile>;
  lastChanged: Date;
  owner: string;

  constructor(name: string, parent: Nullable<Directory>, contents: Map<string, Directory | DFile>){
    this.name = name;
    this.parent = parent;
    this.contents = contents;
    this.contents.set('.', this);
    this.contents.set('..', parent || this);
    this.lastChanged = new Date();
    this.owner = "";
  }

  public children(): Array<string> {
    return Array.from(this.contents.keys());
  }

  public addChild(nchild: Directory | DFile): boolean {
    let nname = nchild.name;
    if(!(nname in this.children())) {
      this.contents.set(nname, nchild);
      return true;
    }
    return false;
  }

  public getChild(fname: string): DFile | Directory | undefined {
    return this.contents.get(fname);
  }
}


interface UpdateContext {
  (dir: Directory): void;
}

export class TerminalContext {
  cwd: Directory;
  fs: FakeFileSystem;
  changeCwd: UpdateContext;

  constructor(dir: Directory, fs: FakeFileSystem, changeCwd: UpdateContext){
    this.cwd = dir;
    this.fs = fs;
    this.changeCwd = changeCwd;
  }
}

export default class FakeFileSystem {
  pathMap: Map<string, Directory>;
  rootDir: Directory;

  constructor() {
    this.rootDir = new Directory('/', null, new Map())
    let homeDir = this.populateFs(FsBase, 'home', this.rootDir)
    this.rootDir.contents.set('home', homeDir)
    this.pathMap = new Map<string, Directory>();
    this.pathMap.set('~', homeDir)
  }

  populateFs = (fsObj: Object, name: string, parentDir: Directory): Directory => {
    let newDir = new Directory(name, parentDir, new Map())
    Object.keys(fsObj).forEach(key => {
      if(typeof fsObj[key as keyof Object] === 'string'){
        newDir.contents.set(key, new DFile(key, fsObj[key as keyof Object] as unknown as string));
      } else {
        newDir.contents.set(key, this.populateFs(fsObj[key as keyof Object], key, newDir))
      }
    });
    return newDir
  }

  resolvePath = (path: string, ocwd?: Directory): [Directory | DFile | undefined, number] => {
    if(!path) {
      return [undefined, -1];
    }
    let cwd: Directory;
    if(path.startsWith('/')) { // absolute search
      cwd = this.rootDir;
      path = path.slice(1, path.length);
    } else if(ocwd === undefined){
      return [undefined, -1];
    } else {
      cwd = ocwd;
    }
    let fullPath = path.split("/").reverse();
    while(fullPath.length !== 0){
      let child = fullPath.pop()
      if(!child){
        break;
      }
      let childObj = cwd.contents.get(child);
      if(!childObj){
        return [undefined, 1];
      } else if(childObj instanceof DFile){
        if(fullPath.length === 0){
          return [childObj, 0];
        }
        return [undefined, 2];
      } else {
        cwd = childObj;
      }
    }
    return [cwd, 0];
  }
}
