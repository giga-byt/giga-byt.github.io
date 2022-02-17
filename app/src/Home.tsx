import React from "react";
import TerminalApp from "./terminal_app/TerminalApp";

interface IProps {}

interface IState {
  terminalMode: boolean;
}

export default class FullPage extends React.Component<IProps, IState> {
  constructor() {
    super({});
    this.state = {
      terminalMode: true
    }
  }

  render() {
    return (
      <div>
        {this.state.terminalMode ? <TerminalApp/> : "goodbye"}
      </div>
    );
  }
}