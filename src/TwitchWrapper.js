/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { MAX_TEXT_DISPLAY_TIME, SECOND, CONTEXT_EVENTS_WHITELIST } from './utils/Constants';
import Authentication from './components/Authentication/Authentication';
import { actionUpdateCCText } from './redux/cc-state';
import { updateBroadcasterSettings } from '@/redux/settingsSlice';
import { requestTranslationStatus } from '@/redux/translationSlice';
import { updateVideoPlayerContext } from '@/redux/videoPlayerContextSlice';
import {
  setProducts,
  completeBitsTransaction,
  setChannelId,
} from './redux/productsSlice';
import { BitsDrawer } from '@/components/Drawer';

const debounce = require('lodash/debounce');

// Resub - rw_grim
//

function fetchChangedContextValues(context, delta) {
  const newData = {};
  delta.forEach((event) => {
    newData[event] = context[event];
  });

  return newData;
}

function contextStateUpdated(delta) {
  return delta.find((event) => CONTEXT_EVENTS_WHITELIST.includes(event));
}

export function withTwitchData(WrappedComponent, store) {
  class TwitchWrapper extends Component {
    state = {
      ready: false,
    };

    constructor(props) {
      super(props);

      this.Authentication = new Authentication();
      this.twitch = window.Twitch ? window.Twitch.ext : null;
    }

    componentDidMount() {
      if (this.twitch) {
        // TODO: REMOVE WHEN RELEASING
        // this.twitch.bits.setUseLoopback = true;

        this.twitch.onAuthorized(this.onAuthorized);
        this.twitch.onContext(this.contextUpdate);
        this.twitch.configuration.onChanged(this.setConfigurationSettings);
        this.twitch.listen('broadcast', this.pubSubMessageHandler);
        this.twitch.bits.getProducts().then(this.parseProducts);
        this.twitch.bits.onTransactionComplete(this.onTransactionComplete);
      }
    }

    componentWillUnmount() {
      if (this.twitch) {
        this.twitch.unlisten('broadcast', () => null);
      }
    }

    onAuthorized = (auth) => {
      this.props.onChannelIdReceived(auth.channelId);
      this.Authentication.setToken(auth.token, auth.userId);
      this.props.fetchTranslationStatus();
    };

    parseProducts = (products) => {
      this.props.setProducts(products);
    };

    onTransactionComplete = (transaction) => {
      this.props.onCompleteTransaction(transaction);
    };

    contextUpdate = (context, delta) => {
      if (contextStateUpdated(delta)) {
        const newContext = fetchChangedContextValues(context, delta);
        this.props.updateVideoPlayerContext(newContext);
      }
    };


    setConfigurationSettings = () => {
      let config = this.twitch.configuration.broadcaster
        ? this.twitch.configuration.broadcaster.content
        : '';

      try {
        config = JSON.parse(config);
      } catch (e) {
        config = {};
      }

      this.props.updateBroadcasterSettings({
        ...config,
        isBitsEnabled: this.twitch.features.isBitsEnabled,
      });

      this.setState({
        ready: true,
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

      this.displayClosedCaptioningText(parsedMessage);
    };

    displayClosedCaptioningText(message) {
      const { hlsLatencyBroadcaster } = this.props.videoPlayerContext;
      let delayTime = hlsLatencyBroadcaster * SECOND;
      if (message.delay) {
        delayTime -= message.delay * SECOND;
      }

      // this.clearClosedCaptioning();
      setTimeout(() => {
        this.props.updateCCText(message);
      }, delayTime);
    }

    clearClosedCaptioning = debounce(() => {}, MAX_TEXT_DISPLAY_TIME);

    render() {
      const { ready } = this.state;

      if (!ready) {
        return null;
      }

      return (
        <Provider store={store}>
          <BitsDrawer />
          <WrappedComponent />
        </Provider>
      );
    }
  }

  const mapStateToProps = (state) => ({
    ccState: state.ccState,
    configSettings: state.configSettings,
    videoPlayerContext: state.videoPlayerContext,
  });

  const mapDispatchToProps = (dispatch) => ({
    updateVideoPlayerContext: (state) => dispatch(updateVideoPlayerContext(state)),
    updateCCText: (state) => dispatch(actionUpdateCCText(state)),
    updateBroadcasterSettings: (settings) => dispatch(updateBroadcasterSettings(settings)),
    setProducts: (products) => dispatch(setProducts(products)),
    onCompleteTransaction: (transaction) => dispatch(completeBitsTransaction(transaction)),
    onChannelIdReceived: (channelId) => dispatch(setChannelId(channelId)),
    fetchTranslationStatus: () => dispatch(requestTranslationStatus()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(TwitchWrapper);
}
