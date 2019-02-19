import React from "react";
const classNames = require('classnames');

import "typeface-montserrat";
import "typeface-raleway";
import "typeface-roboto";

import "./App.css";
import "./box-sizing.css";

import VisibilityToggle from "./VisibilityToggle";
import ClosedCaption from "./ClosedCaption";
import Controls from "./Controls";
import { withTwitchPlayerContext } from '../../context/provider/TwitchPlayer'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {},
      isDragged: false,
      fontSize: 'medium'
    };
  }

  toggleCCVisibility = () => {
    this.setState(state => {
      return {
        hideCC: !state.hideCC
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

  onSelectTextSize = (size) => {
    this.setState({ fontSize: size });
  }

  renderCaptions() {
    let { hideCC, reset, fontSize } = this.state;
    let { interimText, finalText, settings } = this.props;

    if(reset) {
      return null;
    }

    return (
      <ClosedCaption fontSize={fontSize} hide={hideCC} onDragEnd={this.onDragEnd} interimText={interimText} finalText={finalText} settings={settings} />
    );
  }

  render() {
    let { playerContext } = this.props;
    window.Twitch.ext.rig.log(playerContext)
    var containerClass = classNames({
      "standard-position": !playerContext.arePlayerControlsVisible && !this.state.isDragged,
      "raise-video-controls": playerContext.arePlayerControlsVisible || this.state.isDragged,
    });

    return (
      <div id="app-container" className={containerClass}>
        <div className="drag-boundary">
          {this.renderCaptions()}
          <VisibilityToggle isCCDisabled={this.state.hideCC} onClick={this.toggleCCVisibility} />
          <Controls onReset={this.onReset} onSelectTextSize={this.onSelectTextSize} />
        </div>
      </div>
    );
  }
}

export default withTwitchPlayerContext(App);