import { MyFileSystem } from "../filesystem/FileSystem";
import { increment } from "../filesystem/redux/fileslice";
import { store } from "../filesystem/redux/store";
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
        return new Path(this.toString() + toDir);
    }

    static equals(p1: Path, p2: Path): boolean {
        return p1.toString() == p2.toString();
    }
}

export function pathIsChild(parent: Path, child: Path): boolean {
    if(parent.full_path.length + 1 == child.full_path.length) {
        return parent.full_path.toString() == child.full_path.slice(0, -1).toString();
    }
    return false;
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

    count() {
        return store.getState().files.count;
    }

    increment() {
        store.dispatch(increment());
    }

    home() {
        return new Path('/home/' + this.user);
    }
}

export function resolvePath(context: MyTerminalContext, navTo: string): Path {
    if(navTo == '~') {
        return context.home();
    } else if (navTo == '..') {
        return context.cwd.up();
    } else if (navTo == '.') {
        return context.cwd;
    } else {
        if(navTo.startsWith('/')) {
            return new Path(navTo);
        } else {
            return context.cwd.to(navTo);
        }
    }
}