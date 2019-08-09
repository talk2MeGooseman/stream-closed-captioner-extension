import React, { Component } from "react";
const debounce = require("lodash/debounce");
import { Drawer, Classes, Position } from "@blueprintjs/core";
import { MAX_TEXT_DISPLAY_TIME, SECOND, CONTEXT_EVENTS_WHITELIST } from "../../utils/Constants";
import Authentication from "../Authentication/Authentication";
import { updateFinalTextQueue, limitQueueSize } from "../../helpers/text-helpers";
import { isVideoOverlay } from "../../helpers/video-helpers";
import { connect, Provider } from 'react-redux'
import { updateCCState } from '../../redux/cc-state'
import { updateConfigSettings } from "../../redux/config-settings-action-reducer";
import { updatePlayerContext } from "../../redux/twitch-player-action-reducers";

// Resub - rw_grim
//

export function withTwitchData(WrappedComponent, store) {
  class TwitchWrapper extends Component {
    constructor(props) {
      super(props);

      this.Authentication = new Authentication();
      this.twitch = window.Twitch ? window.Twitch.ext : null;

      this.state = {
        controlsShowing: false,
      };

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
      const products = p.sort(this.compare);
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
        let newContext = this.fetchChangedContextValues(context, delta);

        this.props.updatePlayerContext(newContext);
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

      this.props.updateConfigSettings({
        finishedLoading: true,
        settings: config,
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
      this.displayClosedCaptioningText(parsedMessage);
    };

    displayClosedCaptioningText({ interim, final, translations } = message) {
      const { hlsLatencyBroadcaster } = this.props.videoPlayerContext;
      let delayTime = hlsLatencyBroadcaster * SECOND;

      // this.clearClosedCaptioning();

      setTimeout(() => {
        let finalTextQueue = this.props.ccState.finalTextQueue;

        finalTextQueue = updateFinalTextQueue(finalTextQueue, final);
        limitQueueSize(finalTextQueue);

        this.props.updateCCState(
          {
            finalTextQueue,
            interimText: interim,
            translations,
          }
        )
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
    }, MAX_TEXT_DISPLAY_TIME);

    render() {
      const { finishedLoading } = this.props.configSettings;

      if (!finishedLoading) {
        return null;
      }

      let drawerWidth = Drawer.SIZE_STANDARD;
      if (!isVideoOverlay()) {
        drawerWidth = Drawer.SIZE_LARGE
      }

      return (
        <Provider store={store}>
          <WrappedComponent />
        </Provider>
      );
    }
  };

  const mapStateToProps = (state /*, ownProps*/) => {
    return {
      ccState: state.ccState,
      configSettings: state.configSettings,
      videoPlayerContext: state.videoPlayerContext
    }
  }

 const mapDispatchToProps = dispatch => {
  return {
    updateCCState: (state) => dispatch(updateCCState(state)),
    updateConfigSettings: (settings) => dispatch(updateConfigSettings(settings)),
    updatePlayerContext: (state) => dispatch(updatePlayerContext(state))
  }
}

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TwitchWrapper)
}
              // <Drawer
              //   position="left"
              //   title="Share a CC Quote"
              //   canOutsideClickClose={true}
              //   isOpen={this.state.isOpen}
              //   onClose={this.onDrawerClose}
              //   size={drawerWidth}
              // >
              //   <div className={Classes.DRAWER_BODY}>
              //     <div className={Classes.DIALOG_BODY}>
              //       { ccState.finalTextQueue.map((q) => { return <div key={q.id}>{q.text}</div> }) }
              //     </div>
              //   </div>
              //   <div className={Classes.DRAWER_FOOTER}></div>
              // </Drawer>
