import React from "react";
import PropTypes from "prop-types";
const classNames = require('classnames');

import "typeface-montserrat";
import "typeface-raleway";
import "typeface-roboto";

import "./App.css";
import "./box-sizing.css";

import MobileClosedCaption from "./MobileClosedCaption";
import Controls from "./Controls";
import { withTwitchPlayerContext } from '../../context/provider/TwitchPlayer'
import { withConfigSettings } from "../../context/provider/ConfigSettings";

class MobilePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {},
      size: 'medium',
    };
  }

  onSelectTextSize = (size) => {
    this.setState({ size: size });
  }

  renderCaptions() {
    let { reset, size } = this.state;
    let { interimText, finalText} = this.props;

    if(reset) {
      return null;
    }

    return (
      <MobileClosedCaption size={size} onDragEnd={this.onDragEnd} interimText={interimText} finalText={finalText} />
    );
  }

  render() {
    let { playerContext } = this.props;

    var containerClass = classNames({
    });

    return (
      <div id="mobile-container" className={containerClass}>
        <div className="">
          {this.renderCaptions()}
          <Controls onReset={this.onReset} onSelectTextSize={this.onSelectTextSize} />
        </div>
      </div>
    );
  }
}

MobilePanel.propTypes = {
  interimText: PropTypes.string,
  finalText: PropTypes.string,
  playerContext: PropTypes.object,
  configSettings: PropTypes.object,
};

export default withTwitchPlayerContext(withConfigSettings(MobilePanel));