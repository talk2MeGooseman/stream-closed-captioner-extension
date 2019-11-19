import React from 'react';
import Authentication from '../Authentication/Authentication';
import ConfigContainer from './ConfigContainer/ConfigContainer';

import 'typeface-montserrat';
import 'typeface-raleway';
import 'typeface-roboto';

import './Config.css';

export default class ConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    // if the extension is running on twitch or dev rig, set the shorthand here.
    // otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      theme: 'light',
      commands: [],
    };
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  componentDidMount() {
    // do config page setup as needed here
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          this.setState(() => ({ finishedLoading: true }));
        }
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });

      this.twitch.configuration.onChanged(() => {
        let config = this.twitch.configuration.broadcaster
          ? this.twitch.configuration.broadcaster.content : [];
        try {
          config = JSON.parse(config);
        } catch (e) {
          config = [];
        }

        this.setState(() => ({
          commands: config,
        }));
      });
    }
  }

  saveConfig(commands) {
    this.twitch.configuration.set('broadcaster', '1.0', JSON.stringify(commands));

    this.setState(() => ({
      commands,
    }));
  }

  render() {
    if (this.state.finishedLoading && this.Authentication.isModerator()) {
      return (
        <div className="Config">
          <div className={this.state.theme === 'light' ? 'Config-light' : 'Config-dark'}>
            <ConfigContainer
              commands={this.state.commands}
              saveConfig={commands => this.saveConfig(commands)}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="Config">
        <div className={this.state.theme === 'light' ? 'Config-light' : 'Config-dark'}>
                        Loading...
        </div>
      </div>
    );
  }
}
