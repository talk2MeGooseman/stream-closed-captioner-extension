import React from "react";
import Authentication from "../Authentication/Authentication";
import { TwitchPlayerContext } from "../../context/twitch-player";
const debounce = require("lodash/debounce");
const classNames = require('classnames');
import { MAX_TEXT_DISPLAY_TIME, SECOND, CONTEXT_EVENTS_WHITELIST } from "../../utils/Constants";

import "typeface-montserrat";
import "typeface-raleway";
import "typeface-roboto";

import "./App.css";
import "./box-sizing.css";

import VisibilityToggle from "./VisibilityToggle";
import ClosedCaption from "./ClosedCaption";
import Controls from "./Controls";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    this.twitch = window.Twitch ? window.Twitch.ext : null;

    this.state = {
      finishedLoading: false,
      interimText: "",
      finalText: "",
      controlsShowing: false,
      hideCC: false,
      videoPlayerContext: {},
      settings: {},
      isDragged: false
    };

    this.clearClosedCaptioning.bind(this);
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.onAuthorized(this.onAuthorized);
      this.twitch.onContext(this.contextUpdate);
      this.twitch.configuration.onChanged(this.setConfigurationSettings);
      this.twitch.listen("broadcast", this.pubSubMessageHandler);
    }
  }

  contextUpdate = (context, delta) => {
    if (this.contextStateUpdated(delta)) {
      let newData = this.fetchChangedContextValues(context, delta);

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

  toggleCCVisibility = () => {
    this.setState(state => {
      return {
        hideCC: !state.hideCC
      };
    });
  };

  onAuthorized = auth => {
    this.Authentication.setToken(auth.token, auth.userId);
    if (!this.state.finishedLoading) {
      this.setState(() => {
        return { finishedLoading: true };
      });
    }
  };

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

  onDragEnd = () => {
    window.Twitch.ext.rig.log('Dragged')
    if (this.state.isDragged) {
      return;
    }

    this.setState(() => {
      return {
        isDragged: true,
      }
    });
  }

  onReset = () => {
    this.setState({ reset: true }, () => this.setState({ reset: false, isDragged: false }));
  }

  componentWillUnmount() {
    if (this.twitch) {
      this.twitch.unlisten("broadcast", () => (null));
    }
  }

  renderCaptions() {
    let { interimText, finalText, hideCC , settings, reset } = this.state;

    if(reset) {
      return null;
    }

    return (
      <ClosedCaption hide={hideCC} onDragEnd={this.onDragEnd} interimText={interimText} finalText={finalText} settings={settings} />
    );
  }

  render() {
    let {  videoPlayerContext } = this.state;

    var containerClass = classNames({
      "standard-position": !videoPlayerContext.arePlayerControlsVisible && !this.state.isDragged,
      "raise-video-controls": videoPlayerContext.arePlayerControlsVisible || this.state.isDragged,
    });

    return (
      <TwitchPlayerContext.Provider value={videoPlayerContext}>
        <div id="app-container" className={containerClass}>
          <div className="drag-boundary">
            {this.renderCaptions()}
            <VisibilityToggle isCCDisabled={this.state.hideCC} onClick={this.toggleCCVisibility} />
            <Controls onReset={this.onReset} />
          </div>
        </div>
      </TwitchPlayerContext.Provider>
    );
  }
}
