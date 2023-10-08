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

    basename(): string {
        return this.full_path[this.full_path.length - 1];
    }
}

export class MyTerminalContext {
    user: string;
    machine: string;
    cwd: Path;

    constructor() {
        this.user = "mag";
        this.machine = MACHINE_NAME;
        this.cwd = new Path('/')
    }
}