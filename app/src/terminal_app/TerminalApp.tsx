import React from "react";
import { ReactTerminal } from "react-terminal";

import { helpFunc } from "./TerminalFunctions"

import "./TerminalApp.css"
import FakeFileSystem from "./FakeFileSystem";

interface IProps {}

interface IState {
  cwd: string
}

export default class TerminalApp extends React.Component<IProps, IState> {
  commands;
  fs;

  constructor() {
    super({});
    this.fs = new FakeFileSystem()
    this.commands = {
      help: helpFunc,
      ls: this.fs.ls
    }
    this.state = {
      cwd: "~"
    }
  }

  getPrompt = () => {
    return "user@my_pc:" + this.state.cwd
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