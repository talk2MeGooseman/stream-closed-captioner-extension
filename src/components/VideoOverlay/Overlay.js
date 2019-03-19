import React from "react";
import PropTypes from "prop-types";
const classNames = require('classnames');

import "typeface-montserrat";
import "typeface-raleway";
import "typeface-roboto";

import VisibilityToggle from "./VisibilityToggle";
import ClosedCaption from "./ClosedCaption";
import Controls from "../shared/Controls";
import { withTwitchPlayerContext } from '../../context/provider/TwitchPlayer'
import { withConfigSettings } from "../../context/provider/ConfigSettings";

class Overlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragged: false,
      size: 'medium',
      hideCC: false,
      isViewerBoxSize: false,
    };
  }

  componentDidMount() {
    let { hideCC } = this.props.configSettings;
    window.Twitch.ext.rig.log('Mounted') 
    // Set state based off config settings
    this.setState(state => {
      return {
        hideCC
      };
    });
  }

  toggleCCVisibility = () => {
    this.setState(state => {
      return {
        hideCC: !state.hideCC
      };
    });
  };

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

  onSelectBoxSize = () => {
    const { isViewerBoxSize } = this.state;
    this.setState({ isViewerBoxSize: !isViewerBoxSize });
  }

  renderCaptions() {
    const { hideCC, reset, size, isViewerBoxSize } = this.state;

    if(reset) {
      return null;
    }

    return (
      <ClosedCaption 
        size={size}
        hide={hideCC}
        onDragEnd={this.onDragEnd}
        isViewerBoxSize={isViewerBoxSize}
      />
    );
  }

  render() {
    const { playerContext } = this.props;
    const { isViewerBoxSize } = this.state;

    var containerClass = classNames({
      "standard-position": !playerContext.arePlayerControlsVisible && !this.state.isDragged,
      "raise-video-controls": playerContext.arePlayerControlsVisible || this.state.isDragged,
    });

    return (
      <div id="app-container" className={containerClass}>
        <div className="drag-boundary">
          {this.renderCaptions()}
          <VisibilityToggle isCCDisabled={this.state.hideCC} onClick={this.toggleCCVisibility} />
          <Controls 
            onReset={this.onReset}
            onSelectTextSize={this.onSelectTextSize}
            onSelectBoxSize={this.onSelectBoxSize}
            isViewerBoxSize={isViewerBoxSize}
          />
        </div>
      </div>
    );
  }
}

Overlay.propTypes = {
  playerContext: PropTypes.object,
  configSettings: PropTypes.object,
};

export default withTwitchPlayerContext(withConfigSettings(Overlay));