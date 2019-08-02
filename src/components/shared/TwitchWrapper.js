import React, { Component } from "react";
const debounce = require("lodash/debounce");
import { Drawer, Classes, Position } from "@blueprintjs/core";
import { MAX_TEXT_DISPLAY_TIME, SECOND, CONTEXT_EVENTS_WHITELIST } from "../../utils/Constants";
import Authentication from "../Authentication/Authentication";
import { TwitchPlayerContext } from "../../context/twitch-player";
import { ConfigSettingsContext, defaultSettings } from "../../context/config-settings";
import { CCStateContext } from "../../context/cc-state";
import { updateFinalTextQueue, limitQueueSize } from "../../helpers/text-helpers";
import { isVideoOverlay } from "../../helpers/video-helpers";

// Resub - rw_grim

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
        settings: defaultSettings,
        ccState: {
          finalTextQueue: [],
          interimText: "",
        },
      };

      this.state.settings.useBits = this.useBits;
    }

    componentDidMount() {
      if (this.twitch) {
        this.twitch.onAuthorized(this.onAuthorized);
        this.twitch.onContext(this.contextUpdate);
        this.twitch.configuration.onChanged(this.setConfigurationSettings);
        this.twitch.listen("broadcast", this.pubSubMessageHandler);
        this.twitch.bits.getProducts().then(this.parseProducts);
        this.twitch.bits.onTransactionComplete(this.onTransactionComplete);
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

    parseProducts = p => {
      const { settings } = this.state;
      const products = p.sort(this.compare);

      this.setState({ settings: { ...settings, products } });
    };

    compare(a, b) {
      if (a.displayName > b.displayName) {
        return -1;
      }
      if (a.displayName < b.displayName) {
        return 1;
      }
      return 0;
    }

    onTransactionComplete = transaction => {
      console.log(
        "onTransactionComplete() fired, received transactionReceipt: " +
          transaction.transactionReceipt,
      );

      // TODO - Handle the complete transaction, probably have to send to the backend so
      // It can process it and then publish to all other instances for channel
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
          settings: { ...state.settings, ...config },
        };
      });
    };

    pubSubMessageHandler = (target, contentType, message) => {
      // TODO - Parse message body a sku event

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

        finalTextQueue = updateFinalTextQueue(finalTextQueue, finalText);
        limitQueueSize(finalTextQueue);

        this.setState({
          ccState: {
            finalTextQueue,
            interimText,
          },
        });
      }, delayTime);
    }

    useBits = skuId => {
      // this.twitch.bits.useBits('quote1');
      this.setState({
        isOpen: true,
      });
    };

    onDrawerClose = () => {
      this.setState({
        isOpen: false,
      });
    }

    clearClosedCaptioning = debounce(() => {
      this.setState((state, props) => ({
        interimText: "",
      }));
    }, MAX_TEXT_DISPLAY_TIME);

    render() {
      let { videoPlayerContext, settings, finishedLoading, ccState } = this.state;

      if (!finishedLoading) {
        return null;
      }

      let drawerWidth = Drawer.SIZE_STANDARD;
      if (!isVideoOverlay()) {
        drawerWidth = Drawer.SIZE_LARGE
      }

      return (
        <TwitchPlayerContext.Provider value={videoPlayerContext}>
          <ConfigSettingsContext.Provider value={settings}>
            <CCStateContext.Provider value={ccState}>
              <Drawer
                position="left"
                title="Share a CC Quote"
                canOutsideClickClose={true}
                isOpen={this.state.isOpen}
                onClose={this.onDrawerClose}
                size={drawerWidth}
              >
                <div className={Classes.DRAWER_BODY}>
                  <div className={Classes.DIALOG_BODY}>
                    { ccState.finalTextQueue.map((q) => { return <div key={q.id}>{q.text}</div> }) }
                  </div>
                </div>
                <div className={Classes.DRAWER_FOOTER}></div>
              </Drawer>
              <WrappedComponent {...this.state} />
            </CCStateContext.Provider>
          </ConfigSettingsContext.Provider>
        </TwitchPlayerContext.Provider>
      );
    }
  };
}
