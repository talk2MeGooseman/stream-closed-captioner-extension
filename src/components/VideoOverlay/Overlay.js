import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "typeface-montserrat";
import "typeface-raleway";
import "typeface-roboto";

import ClosedCaption from "./ClosedCaption";
import Controls from "../shared/Controls";

const classNames = require("classnames");

class Overlay extends React.PureComponent {
  render() {
    const { videoPlayerContext, configSettings } = this.props;

    const containerClass = classNames({
      "standard-position": !videoPlayerContext.arePlayerControlsVisible && !configSettings.isDragged,
      "raise-video-controls": videoPlayerContext.arePlayerControlsVisible || configSettings.isDragged,
    });

    return (
      <div id="app-container" className={containerClass}>
        <div className="drag-boundary">
          <ClosedCaption key={configSettings.ccKey} />
          <Controls />
        </div>
      </div>
    );
  }
}

Overlay.propTypes = {
  videoPlayerContext: PropTypes.object,
  configSettings: PropTypes.object,
};

const mapStateToProps = state => ({
  configSettings: state.configSettings,
  videoPlayerContext: state.videoPlayerContext,
});

export default connect(mapStateToProps)(Overlay);
