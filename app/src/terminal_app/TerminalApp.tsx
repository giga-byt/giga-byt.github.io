import React from "react";
import { ReactTerminal } from "react-terminal";

import { helpFunc } from "./TerminalFunctions"

import "./TerminalApp.css"

interface IProps {}

interface IState {
  cwd: string
}

export default class TerminalApp extends React.Component<IProps, IState> {
  commands;

  constructor() {
    super({});
    this.commands = {
      help: helpFunc,
      test: (d: string) => <div style={{backgroundColor: 'red'}}><p>hello</p> <p>goodbye</p></div>
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