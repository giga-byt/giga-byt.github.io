import React from "react";
import { ReactTerminal } from "react-terminal";

interface IProps {}

interface IState {
}

export default class TerminalApp extends React.Component<IProps, IState> {
  constructor() {
    super({});
    let commands = {
      help: "jackharper",
    };
    this.commands = commands
    this.state = {
      cwd: "~"
    }
  }

  getPrompt = () => {
    return "user@my_pc:" + this.state.cwd
  }

  render() {
    return (
      <div>
        hello
        <ReactTerminal
          commands={this.commands}
          prompt={this.getPrompt()}
        />
      </div>
    );
  }
}