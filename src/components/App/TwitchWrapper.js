import React, { Component } from "react";
import App from "./App";
import { MAX_TEXT_DISPLAY_TIME, SECOND, CONTEXT_EVENTS_WHITELIST } from "../../utils/Constants";
import Authentication from "../Authentication/Authentication";
import { TwitchPlayerContext } from "../../context/twitch-player";
const debounce = require("lodash/debounce");

export default class TwitchWrapper extends Component {
  constructor(props) {
    super(props);

    this.Authentication = new Authentication();
    this.twitch = window.Twitch ? window.Twitch.ext : null;

    this.state = {
      finishedLoading: false,
      interimText: "",
      finalText: "",
      controlsShowing: false,
      videoPlayerContext: {},
      settings: {},
    };
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.onAuthorized(this.onAuthorized);
      this.twitch.onContext(this.contextUpdate);
      this.twitch.configuration.onChanged(this.setConfigurationSettings);
      this.twitch.listen("broadcast", this.pubSubMessageHandler);
    }
  }

  componentWillUnmount() {
    if (this.twitch) {
      this.twitch.unlisten("broadcast", () => (null));
    }
  }

  onAuthorized = auth => {
    this.Authentication.setToken(auth.token, auth.userId);
    if (!this.state.finishedLoading) {
      this.setState(() => {
        return { finishedLoading: true };
      });
    }
  };

  contextUpdate = (context, delta) => {
    if (this.contextStateUpdated(delta)) {
      let newData = this.fetchChangedContextValues(context, delta);

      window.Twitch.ext.rig.log('getting', newData)
      this.setState(state => {
        return {
          videoPlayerContext: Object.assign(
            this.state.videoPlayerContext,
            newData
          )
        };
      });
    }
  };

  fetchChangedContextValues(context, delta) {
    let newData = {};
    delta.forEach(event => {
      newData[event] = context[event];
    });

    return newData;
  }

  contextStateUpdated(delta) {
    return delta.find(event => {
      return CONTEXT_EVENTS_WHITELIST.includes(event);
    });
  }

  setConfigurationSettings = () => {
    let config = this.twitch.configuration.broadcaster
      ? this.twitch.configuration.broadcaster.content
      : "";

    try {
      config = JSON.parse(config);
    } catch (e) {
      config = {};
    }

    this.setState(() => {
      return {
        settings: config
      };
    });
  };

  pubSubMessageHandler = (target, contentType, message) => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      parsedMessage = {
        interim: message
      }
    }
    this.displayClosedCaptioningText(parsedMessage.interim, parsedMessage.final);
  };

  displayClosedCaptioningText(interimText, finalText="") {
    let delayTime =
      this.state.videoPlayerContext.hlsLatencyBroadcaster * SECOND;

    this.clearClosedCaptioning();

    setTimeout(() => {
      this.setState((state, props) => ({
        finalText,
        interimText
      }));
    }, delayTime);
  }

  clearClosedCaptioning = debounce(() => {
    this.setState((state, props) => ({
      finalText: "",
      interimText: ""
    }));
  }, MAX_TEXT_DISPLAY_TIME);

  render() {
    let {videoPlayerContext} = this.state;

    return (
      <TwitchPlayerContext.Provider value={videoPlayerContext}>
        <App {...this.state} />
      </TwitchPlayerContext.Provider>
    );
  }
}