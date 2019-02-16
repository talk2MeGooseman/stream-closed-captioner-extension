import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTwitchPlayerContext } from '../../context/provider/TwitchPlayer'
import { captionStyles, ccStyles } from "./caption-styles";
import Draggable, {DraggableCore} from 'react-draggable';
import { WIDTH_INDEX, MINIMUM_VID_WIDTH } from '../../utils/Constants';
const classNames = require('classnames');

import './ClosedCaption.css'
import { inflateSync } from 'zlib';
import { debug } from 'util';

class ClosedCaption extends PureComponent {

  shouldHideCC() {
    const { interimText, finalText, hide, playerContext: { displayResolution }} = this.props;

    return this.isScreenToSmall(displayResolution) || this.isEmptyCC(interimText + finalText) || hide;
  }

  isScreenToSmall(displayResolution) {
    if (displayResolution === undefined) {
      return false;
    }

    let widthHeight = displayResolution.split('x')
    let width = parseInt(widthHeight[WIDTH_INDEX]);

    return width < MINIMUM_VID_WIDTH;
  }

  isEmptyCC(text) {
    return text.length === 0;
  }

  ccText = () => {
    const { interimText, finalText, settings } = this.props;
    const styles = {
      maxHeight: 'calc(var(--medium-font-size) * var(--line-height) * 3 + var(--caption-pad-bottom) * 2)',
      overflow: 'hidden'
    }

    let containerClasses = classNames({
      "caption-container": true,
      "hide": this.shouldHideCC()
    })

    return (
        <div className={containerClasses} style={styles}>
          <div style={ccStyles} >
            {interimText}
          </div>
          <div style={ccStyles}>
            {finalText}
          </div>
        </div>
    );
  }

  render() {
    return (
      <Draggable grid={[8, 8]} bounds="parent" onStop={this.props.onDragEnd}>
        {this.ccText()}
      </Draggable>
    );
  }

}

ClosedCaption.propTypes = {
  interimText: PropTypes.string,
  finalText: PropTypes.string,
  hide: PropTypes.bool,
  playerContext: PropTypes.object,
  settings: PropTypes.object,
  onDragEnd: PropTypes.func,
}

ClosedCaption.defaultProps = {
  interimText: "",
  finalText: ""
}

export default withTwitchPlayerContext(ClosedCaption);
