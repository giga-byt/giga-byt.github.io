import { stringify } from "querystring";
import React from "react";

import FsBase from '../data/FS_GENERATED.json'
import './TextFormatting.css'
export class DFile {
  name: string;
  content: string;

  constructor(name: string, content: string){
    this.name = name;
    this.content = content;
  }
}

export class Directory {
  name: string;
  parent: Nullable<Directory>;
  contents: Map<string, Directory | DFile>;

  constructor(name: string, parent: Nullable<Directory>, contents: Map<string, Directory | DFile>){
    this.name = name;
    this.parent = parent;
    this.contents = contents;
  }

  public children(): Array<string> {
    return Array.from(this.contents.keys());
  }
}

export class TerminalContext {
  cwd: Directory;
  fs: FakeFileSystem;

  constructor(dir: Directory, fs: FakeFileSystem){
    this.cwd = dir;
    this.fs = fs;
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
      if(typeof fsObj[key as keyof Object] == 'string'){
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
    } else if(ocwd == undefined){
      return [undefined, -1];
    } else {
      cwd = ocwd;
    }
    let fullPath = path.split("/").reverse();
    while(fullPath.length != 0){
      let child = fullPath.pop()
      if(!child){
        break;
      }
      let childObj = cwd.contents.get(child);
      if(!childObj){
        return [undefined, -1];
      } else if(childObj instanceof DFile){
        if(!fullPath){
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
