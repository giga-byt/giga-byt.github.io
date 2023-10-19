import { Terminal } from "xterm";
import { MyTerminalContext, Path, resolvePath } from "../MyTerminalContext";
import { ITerminalApplication } from "./ITerminalApplication";

export default class ListDir implements ITerminalApplication {
    terminal: Terminal;
    context: MyTerminalContext;

    constructor(terminal: Terminal, context: MyTerminalContext) {
        this.terminal = terminal;
        this.context = context;
    }

    onExec(args: Array<string>): string | undefined {
        let listDirs = ['.'];
        if(args.length > 0){
            listDirs = args;
        }
        let basenames: Array<string> = [];
        listDirs.forEach(listDir => {
            let resolvedPath = resolvePath(this.context, listDir);
            let file = this.context.fs.get(resolvedPath);
            if(file) {
                if(file.isDirectory()){
                    let children = this.context.fs.children(resolvedPath);
                    basenames = basenames.concat(children.map((p) => p.basename()));
                } else {
                    basenames.push(file.name());
                }
            }
        });
        return basenames.join('  ');
    }

    onData(data: string) {}
    onKey(keyEvent: { key: string, domEvent: KeyboardEvent }) {}
}