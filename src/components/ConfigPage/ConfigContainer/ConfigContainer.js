import React from "react";
import ConfigCommand from "./ConfigCommand/ConfigCommand";
import { Button, Card, Elevation } from "@blueprintjs/core";

import "./ConfigContainer.css";

export default class ConfigContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commands: this.props.commands
    };
  }

  onSubmit(event) {
    event.preventDefault();

    if (this.state.commands.length <= 5) {
      this.setState(prevState => {
        let commands = prevState.commands;
        commands.push({
          command: this.state.command,
          description: this.state.description,
          date: new Date()
        });
        return {
          commands
        };
      });
      this.commandInput.value = "";
      this.descriptionInput.value = "";
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  deleteCommand(key) {
    this.setState(prevState => {
      return {
        commands: prevState.commands.filter(old => old.date != key)
      };
    });
  }

  render() {
    return (
      <Card elevation={Elevation.TWO}>
        <h1 className="">Configuration</h1>
        <strong>
          A companion website is required in order for you to be able to use the
          Speech To Text Closed Captioning.
        </strong>
        <h3>Getting Started is Easy</h3>
        <ol className="bp3-list">
          <li>
            Enable <em>Stream Closed Captioner</em> as a Video Overlay
          </li>
          <li>
            Visit:
            <a
              className="bp3-button bp3-intent-primary site-link"
              target="_blank"
              role="button"
              href="https://stream-cc.gooseman.codes"
            >
              https://stream-cc.gooseman.codes
            </a>
          </li>
          <li>
            Login with your Twitch Account.{" "}
            <em>This is needed so Speech to Text works</em>.
          </li>
          <li>
            Visit the <em>Dashboard</em>
          </li>
          <li>
            To start <em>Closed Captioning</em> for your stream, toggle "Closed
            Captioning" <strong>On</strong>.
          </li>
          <li>
            When you're done streaming or want to disable Closed Captioning you can, toggle "Closed
            Captioning" <strong>Off</strong> or close the <em>Dashboard</em>.
          </li>
        </ol>
      </Card>
    );
  }
}
