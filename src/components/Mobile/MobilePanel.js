import React from "react";
import PropTypes from "prop-types";
const classNames = require('classnames');

import "typeface-montserrat";
import "typeface-raleway";
import "typeface-roboto";

import MobileClosedCaption from "./MobileClosedCaption";
import Controls from "../shared/Controls";

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

    if(reset) {
      return null;
    }

    return (
      <MobileClosedCaption size={size} onDragEnd={this.onDragEnd} />
    );
  }

  render() {
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

export default MobilePanel;