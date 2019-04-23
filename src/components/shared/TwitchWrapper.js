import React, { Component } from "react";
import { MAX_TEXT_DISPLAY_TIME, SECOND, CONTEXT_EVENTS_WHITELIST } from "../../utils/Constants";
import Authentication from "../Authentication/Authentication";
import { TwitchPlayerContext } from "../../context/twitch-player";
import { ConfigSettingsContext } from "../../context/config-settings";
import { CCStateContext } from "../../context/cc-state";
const debounce = require("lodash/debounce");

export function withTwitchData(WrappedComponent) {
  return class TwitchWrapper extends Component {
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
        ccState: {
          finalTextQueue: [],
          interimText: "",
        }
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
        this.twitch.unlisten("broadcast", () => null);
      }
    }

    onAuthorized = auth => {
      this.Authentication.setToken(auth.token, auth.userId);
    };

    contextUpdate = (context, delta) => {
      if (this.contextStateUpdated(delta)) {
        let newData = this.fetchChangedContextValues(context, delta);

        this.setState(state => {
          return {
            videoPlayerContext: Object.assign(state.videoPlayerContext, newData),
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

      this.setState(state => {
        return {
          finishedLoading: true,
          settings: config,
        };
      });
    };

    pubSubMessageHandler = (target, contentType, message) => {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (error) {
        parsedMessage = {
          interim: message,
        };
      }
      this.displayClosedCaptioningText(parsedMessage.interim, parsedMessage.final);
    };

    displayClosedCaptioningText(interimText, finalText = "") {
      let delayTime = this.state.videoPlayerContext.hlsLatencyBroadcaster * SECOND;

      this.clearClosedCaptioning();

      setTimeout(() => {
        let finalTextQueue = this.state.ccState.finalTextQueue;

        finalTextQueue = this.updateFinalTextQueue(finalTextQueue, finalText);
        this.limitQueueSize(finalTextQueue);

        this.setState({
          ccState: {
            finalTextQueue,
            interimText,
          }
        });
      }, delayTime);
    }

    clearClosedCaptioning = debounce(() => {
      this.setState((state, props) => ({
        finalText: "",
        interimText: "",
      }));
    }, MAX_TEXT_DISPLAY_TIME);

    limitQueueSize(finalTextQueue) {
      if (finalTextQueue.length > 20)
      {
        finalTextQueue.shift();
      }
    }

    updateFinalTextQueue(finalTextQueue, finalText) {
      let lastText = finalTextQueue[finalTextQueue.length - 1];
      if (lastText !== finalText)
      {
        finalTextQueue = [...finalTextQueue, finalText];
      }
      return finalTextQueue;
    }

    render() {
      let { videoPlayerContext, settings, finishedLoading, ccState } = this.state;

      if (!finishedLoading) {
        return null;
      }

      return (
        <TwitchPlayerContext.Provider value={videoPlayerContext}>
          <ConfigSettingsContext.Provider value={settings}>
            <CCStateContext.Provider value={ccState}>
              <WrappedComponent {...this.state} />
            </CCStateContext.Provider>
          </ConfigSettingsContext.Provider>
        </TwitchPlayerContext.Provider>
      );
    }
  };
}
