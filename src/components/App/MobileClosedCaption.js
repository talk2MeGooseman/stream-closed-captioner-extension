import React from 'react';
import PropTypes from 'prop-types';
import { withTwitchPlayerContext } from '../../context/provider/TwitchPlayer'
import { withConfigSettings } from '../../context/provider/ConfigSettings'
import { captionStyles, ccStyles } from "./caption-styles";
import { WIDTH_INDEX, MINIMUM_VID_WIDTH } from '../../utils/Constants';
import './MobileClosedCaption.css'
const classNames = require('classnames');

// Bits - phrakberg
// Resub - phrakberg
// Donation -pikaia_xy
// Bits - DecoyDix
// Bits - ElectricHavoc
// Sub - jax05_
// Resub - roberttables
// Resub - rw_grim
// Bits - omcritzy

function setFontSizeStyle(size) {
  let fontSize = "";

  switch (size) {
  case "small":
    fontSize = "var(--small-font-size)";
    break;
  case "medium":
    fontSize = "var(--medium-font-size)";
    break;
  case "large":
    fontSize = "var(--large-font-size)";
    break;
  default:
    fontSize = "var(--medium-font-size)";
    break;
  }

  return fontSize;
}

function MobileClosedCaption({ interimText, finalText, configSettings, size }) {
  const fontSize = setFontSizeStyle(size);

  const textStyles = { ...ccStyles, fontSize };

  const ccTextClasses = classNames({
    "text-capitalize": configSettings.textUppercase,
    "text-mix-case": !configSettings.textUppercase,
  });

  return (
    <div className="caption-container">
      <div className={ccTextClasses} style={textStyles} >
        {interimText}
      </div>
      <div className={ccTextClasses} style={textStyles}>
        {finalText}
      </div>
    </div>
  );
}

MobileClosedCaption.propTypes = {
  interimText: PropTypes.string,
  finalText: PropTypes.string,
  hide: PropTypes.bool,
  playerContext: PropTypes.object,
  settings: PropTypes.object,
  onDragEnd: PropTypes.func,
  size: PropTypes.string,
  configSettings: PropTypes.object,
};

MobileClosedCaption.defaultProps = {
  interimText: "",
  finalText: "",
};

export default withTwitchPlayerContext(withConfigSettings(MobileClosedCaption));
