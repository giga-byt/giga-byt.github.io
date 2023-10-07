import React from "react";
import MyTerminal from "./terminal/MyTerminal";

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
      <MyTerminal/>
    );
  }
}