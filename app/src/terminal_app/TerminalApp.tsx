import React from "react";
import { ReactTerminal } from "react-terminal";

import { ls } from "./terminal_commands/ls"
import { help } from "./terminal_commands/help"

import "./TerminalApp.css"
import FakeFileSystem, { Directory, TerminalContext } from "./terminal_fs/FakeFileSystem";
import { displayStringArray } from "./TerminalDisplayDriver";
import { cd } from "./terminal_commands/cd";

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
        // actually call program with args
        let ret = callback(this.state.context, args);
        // postprocess return value (list of strings, each str is one line)
        return displayStringArray(ret);
      }
    }
    this.commands = {
      help: callWithContextAndFormat(help),
      ls: callWithContextAndFormat(ls),
      cd: callWithContextAndFormat(cd),
    }
    this.state = {
      context: new TerminalContext(this.fs.pathMap.get('~')!, this.fs, this.updateCwd)
    }
  }

  updateCwd = (dir: Directory) => {
    let context = new TerminalContext(dir, this.fs, this.updateCwd);
    this.setState({
      context: context
    });
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