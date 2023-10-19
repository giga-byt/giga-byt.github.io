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

interface IProps extends PropsFromRedux {}
interface IState {}

class MyTerminal extends React.Component<IProps, IState> {
  fitAddon: FitAddon;
  xtermRef: React.RefObject<XTermWrapper>;
  apps: Map<string, ITerminalApplication>;
  termContext: MyTerminalContext;
  current_app: string;

  constructor(props: IProps) {
    super(props);
    this.xtermRef = React.createRef();
    this.fitAddon = new FitAddon();
    this.apps = new Map<string, ITerminalApplication>();
    this.termContext = new MyTerminalContext();
    this.current_app = 'shell';
  }

  componentDidMount(): void {
    window.addEventListener('resize', this.onResize);
    let terminal = this.xtermRef?.current?.terminal;
    if(terminal){
      this.apps.set('shell', new Shell(terminal, this.termContext, this.exec));
      this.apps.set('help', new Help(terminal, this.termContext));
      this.apps.set('ls', new ListDir(terminal, this.termContext));
      this.apps.set('cd', new ChangeDirectory(terminal, this.termContext));

      this.fitAddon.fit();
      this.exec('shell');
    }
  }

  _run_command(c: string) {
    this.xtermRef?.current?.terminal.write(c);
  }

  exec = (command: string) => {
    console.log("execing", command)
    let args = command.split(' ');
    if(!args){
      this.exec('shell');
      return;
    }
    let cmd = args[0];
    let app = this.apps.get(cmd);
    if(!app){
      this.exec('shell');
      return;
    }
    let cargs = args.slice(1);
    if(app.onExec(cargs)){
      this.current_app = cmd;
    } else {
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