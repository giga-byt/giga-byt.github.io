import React from "react";
import { XTermWrapper } from '../ThirdParty/XTerm'
import { FitAddon } from 'xterm-addon-fit';
import './MyTerminal.css'
import { ITerminalApplication } from "./terminal_apps/ITerminalApplication";
import Shell from "./terminal_apps/shell";
import { MyTerminalContext } from "./MyTerminalContext";
import Help from "./terminal_apps/help";
import { connector, PropsFromRedux } from "../filesystem/redux/hooks";
import ListDir from "./terminal_apps/ls";
import ChangeDirectory from "./terminal_apps/cd";
import Less from "./terminal_apps/less";
import Clear from "./terminal_apps/clear";
import Echo from "./terminal_apps/echo";
import Edit from "./terminal_apps/edit";

interface IProps extends PropsFromRedux {}
interface IState {}

class MyTerminal extends React.Component<IProps, IState> {
  fitAddon: FitAddon;
  xtermRef: React.RefObject<XTermWrapper>;
  apps: Map<string, ITerminalApplication>;
  termContext: MyTerminalContext;
  current_app: string;
  exec_queue: Array<string>;

  constructor(props: IProps) {
    super(props);
    this.xtermRef = React.createRef();
    this.fitAddon = new FitAddon();
    this.apps = new Map<string, ITerminalApplication>();
    this.termContext = new MyTerminalContext();
    this.current_app = 'shell';
    this.exec_queue = [];
  }

  componentDidMount(): void {
    window.addEventListener('resize', this.onResize);
    let terminal = this.xtermRef?.current?.terminal;
    if(terminal){
      this.apps.set('shell', new Shell(terminal, this.termContext, this.queue_command, this.exec));
      this.apps.set('echo', new Echo(terminal, this.termContext));
      this.apps.set('help', new Help(terminal, this.termContext));
      this.apps.set('ls', new ListDir(terminal, this.termContext));
      this.apps.set('cd', new ChangeDirectory(terminal, this.termContext));
      this.apps.set('less', new Less(terminal, this.termContext, () => this.exec('clear && shell')));
      this.apps.set('clear', new Clear(terminal, this.termContext));
      this.apps.set('edit', new Edit(terminal, this.termContext, () => this.exec('clear && shell')));

      this.fitAddon.fit();
      this.exec('shell');
    }
  }

  _run_command(c: string) {
    this.xtermRef?.current?.terminal.write(c);
  }

  queue_command = (command: string) => {
    this.exec_queue.unshift(command);
  }

  exec = (command: string) => {
    this.exec_queue.unshift(command);
    this._resolve_queue();
  }

  // returns command+args, and the remainder of the command string
  // which is unprocessed (as a result of | or &&)
  process_command(command: string): [Array<string>, string] {
    let args: Array<string> = [];
    let remainder = '';
    let as_words = command.split(' ');
    let idx = 0;
    while(idx < as_words.length) {
      let curr = as_words[idx];
      if(curr == '&&'){
        remainder = as_words.slice(idx + 1).join(' ');
        break;
      }
      args.push(curr);
      idx += 1;
    }
    return [args, remainder];
  }

  _resolve_queue(): void {
    let returnToShell = false;
    while(this.exec_queue.length > 0) {
      let command = this.exec_queue.shift();
      if(!command) {
        returnToShell = true;
        continue;
      }
      // process
      let [args, remainder] = this.process_command(command);
      if(remainder){
        this.exec_queue.unshift(remainder);
      }
      if(!args){
        returnToShell = true;
        continue;
      }
      let cmd = args[0];
      let app = this.apps.get(cmd);
      if(!app){
        returnToShell = true;
        this._run_command(`shell: ${cmd}: command not found\n`);
        continue;
      }
      let cargs = args.slice(1);
      let ret = app.onExec(cargs);
      if(ret != undefined){
        this._run_command(ret + '\n');
        returnToShell = true;
      } else {
        this.current_app = cmd
        returnToShell = false;
      }
    }
    if(returnToShell){
      this.exec('shell');
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.fitAddon.fit();
  }

  onData = (data: string) => {
    let app = this.apps.get(this.current_app);
    if(app){
      app.onData(data);
    }
  }

  onKey = (keyEvent: any) => {
    let app = this.apps.get(this.current_app);
    if(app){
      app.onKey(keyEvent);
    }
    console.log(keyEvent);
  }

  render() {
    return (
      <div>
        <XTermWrapper //className="xterm-wrapper"
          ref={this.xtermRef} addons={[this.fitAddon]} onKey={this.onKey} onData={this.onData}/>
        {this.props.files.count}
      </div>
    );
  }
}

export default connector(MyTerminal);