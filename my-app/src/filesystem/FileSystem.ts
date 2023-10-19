import { Path, pathIsChild } from "../terminal/MyTerminalContext";
import { store } from "./redux/store";
export class MyFileSystem {
    constructor() {}

    _files(): Array<MyFile> {
        return store.getState().files.files.map((ser) => new MyFile(ser));
    }

    children(path: Path): Array<Path> {
        return this._files().filter((f) => pathIsChild(path, f.path())).map((f) => f.path());
    }

    exists(path: Path): boolean {
        return this.get(path) != undefined;
    }

    get(path: Path): MyFile | undefined {
        console.log(this._files().map((f) => f.path().toString()));
        let found = this._files().filter((f) => Path.equals(path, f.path()));
        if(found) {
            return found[0];
        }
    }


}


/* all files are stored as arrays of primitives:
[
    path, (string, which doubles as identifier)
    isDirectory, (bool, indicates if this is a directory)
    contents, (string)
]
*/
export type MFTuple = [string, boolean, string]
export class MyFile {
    _data: MFTuple;
    constructor(data: MFTuple) {
        this._data = data;
    }

    name(): string {
        return new Path(this._data[0]).basename();
    }

    path(): Path {
        return new Path(this._data[0]);
    }

    isDirectory(): boolean {
        return this._data[1];
    }

    serialize(): MFTuple {
        return this._data;
    }

    setContents(s: string) {
        this._data[2] = s;
    }
}