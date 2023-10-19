import MyFileSystem from "../filesystem/FileSystem";
import { MACHINE_NAME } from "./Constants";

export class Path {
    full_path: Array<string>;

    constructor(path: Array<string> | string) {
        if(typeof(path) == 'string'){
            this.full_path = path.split('/');
        } else {
            this.full_path = path;
        }

        if(!this.full_path){
            this.full_path = ['/'];
        }
        else if(this.full_path && this.full_path[0] != '/'){
            this.full_path.unshift('/');
        }
        this.full_path = this.full_path.filter(c => c);
    }

    toString(): string {
        return '/' + this.full_path.slice(1).join('/');
    }

    basename(): string {
        return this.full_path[this.full_path.length - 1];
    }

    up(): Path {
        if(this.full_path.length > 1){
            return new Path(this.full_path.slice(0, -1));
        }
        return new Path(this.full_path);
    }

    to(toDir: string): Path {
        return new Path(this.full_path.concat([toDir]));
    }
}

export class MyTerminalContext {
    user: string;
    machine: string;
    cwd: Path;
    fs: MyFileSystem;

    constructor() {
        this.user = "mag";
        this.machine = MACHINE_NAME;
        this.cwd = new Path('/');
        this.fs = new MyFileSystem();
    }

    home() {
        return new Path('/home/' + this.user);
    }
}