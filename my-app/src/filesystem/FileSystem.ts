import { Path } from "../terminal/MyTerminalContext";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector((state) => state.files)
  const dispatch = useAppDispatch()
export class MyFileSystem {

    constructor() {
    }

    exists(path: Path): boolean {
        return false;
    }

    get(path: Path): MyFile | undefined {
        return undefined;
    }


}


/* all files are stored as arrays of primitives:
[
    path, (string, which doubles as identifier)
    isDirectory, (bool, indicates if this is a directory)
    contents, (string; directories will have newline-separated children as contents)
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