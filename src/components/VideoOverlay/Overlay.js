import React from "react";
import PropTypes from "prop-types";
const classNames = require('classnames');
import { connect } from "react-redux";

import "typeface-montserrat";
import "typeface-raleway";
import "typeface-roboto";

import VisibilityToggle from "./VisibilityToggle";
import ClosedCaption from "./ClosedCaption";
import Controls from "../shared/Controls";

class Overlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragged: false,
      size: 'medium',
    };
  }

  onDragEnd = () => {
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
    this.setState({ size: size });
  }

  renderCaptions() {
    const { hideCC, reset, size, isBoxSize } = this.state;

    if(reset) {
      return null;
    }

    return (
      <ClosedCaption
        size={size}
        onDragEnd={this.onDragEnd}
      />
    );
  }

  render() {
    const { videoPlayerContext } = this.props;

    var containerClass = classNames({
      "standard-position": !videoPlayerContext.arePlayerControlsVisible && !this.state.isDragged,
      "raise-video-controls": videoPlayerContext.arePlayerControlsVisible || this.state.isDragged,
    });

    return (
      <div id="app-container" className={containerClass}>
        <div className="drag-boundary">
          {this.renderCaptions()}
          <Controls
            onReset={this.onReset}
            onSelectTextSize={this.onSelectTextSize}
          />
        </div>
      </div>
    );
  }
}

Overlay.propTypes = {
  videoPlayerContext: PropTypes.object,
  configSettings: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  configSettings: state.configSettings,
  videoPlayerContext: state.videoPlayerContext,
  ...ownProps,
});

export default connect(mapStateToProps)(Overlay);
