import { stringify } from "querystring";
import React from "react";

import FsBase from '../data/fs.json'
import './TextFormatting.css'
class DFile {
  name: string;
  content: JSX.Element;

  constructor(name: string, content: JSX.Element){
    this.name = name;
    this.content = content;
  }
}

class Directory {
  name: string;
  parent: Nullable<Directory>;
  contents: Map<string, Directory | DFile>;

  constructor(name: string, parent: Nullable<Directory>, contents: Map<string, Directory | DFile>){
    this.name = name;
    this.parent = parent;
    this.contents = contents;
  }

  listContents = (): string => {
    let keys = Array.from(this.contents.keys());
    keys.reverse()
    keys.push('..');
    keys.push('.');
    keys.reverse();
    console.log(keys.join(' '))
    return keys.join(' ');
  }
}

export default class FakeFileSystem {
  cwd: Directory;
  pathMap: Map<string, Directory>;
  constructor() {
    let rootDir = new Directory('/', null, new Map())
    let homeDir = this.populateFs(FsBase, 'home', rootDir)
    rootDir.contents.set('home', homeDir)
    this.pathMap = new Map<string, Directory>();
    this.pathMap.set('~', homeDir)
    this.cwd = this.pathMap.get('~')!;
  }

  parseComponent = (fsContent: string): JSX.Element => {
    return <div>hello</div>
  }

  populateFs = (fsObj: Object, name: string, parentDir: Directory): Directory => {
    let newDir = new Directory(name, parentDir, new Map())
    Object.keys(fsObj).forEach(key => {
      if(typeof fsObj[key as keyof Object] == 'string'){
        newDir.contents.set(key, new DFile(key, this.parseComponent(fsObj[key as keyof Object] as unknown as string)));
      } else {
        newDir.contents.set(key, this.populateFs(fsObj[key as keyof Object], key, newDir))
      }
    });
    return newDir
  }

  ls = (directory?: Directory | DFile): JSX.Element => {
    if (!directory) {
      return <span className="multiple-space-span">{this.cwd.listContents()}</span>;
    }
    else if (directory instanceof DFile) {
      return <span className="multiple-space-span">{directory.name}</span>;
    }
    else {
      return <span className="multiple-space-span">{directory.listContents()}</span>;
    }
  }

  cd = (directory?: Directory | DFile) => {
    if (directory == null) {
      this.cwd = this.pathMap.get('~')!;
    }
    else if (directory instanceof DFile) {
      throw TypeError(`cd: ${directory.name}: Not a directory`)
    }
    else {
      this.cwd = directory;
    }
  }

}
