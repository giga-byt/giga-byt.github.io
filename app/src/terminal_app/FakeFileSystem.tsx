import React from "react";

class DFile {
  name: string;
  content: React.Component;

  constructor(name: string, content: React.Component){
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

  listContents = (): Array<string> => {
    let keys = Array.from(this.contents.keys());
    keys.push('..');
    keys.push('.');
    return keys;
  }
}

export default class FakeFileSystem {
  cwd: Directory;
  pathMap: Map<string, Directory>;
  constructor() {
    this.pathMap = new Map<string, Directory>();
    this.cwd = this.pathMap.get('~')!;
  }

  ls = (directory?: Directory | DFile): Array<string> => {
    if (directory == null) {
      return this.cwd.listContents();
    }
    else if (directory instanceof DFile) {
      return [directory.name];
    }
    else {
      return directory.listContents();
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
