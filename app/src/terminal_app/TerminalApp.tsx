import React from "react";
import { ReactTerminal } from "react-terminal";

import { helpFunc, ls } from "./TerminalFunctions"

import "./TerminalApp.css"
import FakeFileSystem, { TerminalContext } from "./FakeFileSystem";

interface IProps {}

interface IState {
  context: TerminalContext;
}

interface CallableWithContext {
  (context: TerminalContext, args?: Array<string>): Array<string>;
}

export default class TerminalApp extends React.Component<IProps, IState> {
  commands;
  fs;

  constructor() {
    super({});
    this.fs = new FakeFileSystem()
    let callWithContextAndFormat = (callback: CallableWithContext) => {
      return (argstr: string) => {
        // preprocess args
        let args = argstr.split(' ');
        let ret = callback(this.state.context, args);
        return <div>{ret}</div>
      }
    }
    this.commands = {
      help: callWithContextAndFormat(helpFunc),
      ls: callWithContextAndFormat(ls),
    }
    this.state = {
      context: new TerminalContext(this.fs.pathMap.get('~')!, this.fs)
    }
  }

  getPrompt = () => {
    return "user@my_pc:" + this.state.context.cwd.name
  }

  render() {
    return (
      <div id="terminal-wrapper">
        <div id="terminal">
        <ReactTerminal
          commands={this.commands}
          prompt={this.getPrompt()}
          theme={"dracula"}
          showControlBar={false}
          showControlButtons={false}
        />
        </div>
      </div>
    );
  }
}