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

  }


  ls = (directory?: Directory | DFile): Array<string> => {
    if(directory == undefined){
      return this.cwd.listContents();
  } else if(list === "function") {
      return dir
    }
  }

}
