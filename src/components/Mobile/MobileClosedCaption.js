import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ccStyles } from "../shared/caption-styles";
import "./MobileClosedCaption.css";

const classNames = require("classnames");

// Bits - phrakberg
// Resub - phrakberg
// Donation -pikaia_xy
// Bits - DecoyDix
// Bits - ElectricHavoc
// Sub - jax05_
// Resub - roberttables
// Resub - rw_grim
// Bits - omcritzy
// Sub - el_psychic
// Resub - CreativeBuilds

function setFontSizeStyle(size) {
  let fontSize = "";

  switch (size) {
  case "small":
    fontSize = "var(--mobile-small-font-size)";
    break;
  case "medium":
    fontSize = "var(--mobile-medium-font-size)";
    break;
  case "large":
    fontSize = "var(--mobile-large-font-size)";
    break;
  default:
    fontSize = "var(--mobile-medium-font-size)";
    break;
  }

  return fontSize;
}

function MobileClosedCaption({ ccState: { interimText, finalTextQueue }, configSettings, size }) {
  const fontSize = setFontSizeStyle(size);

  const textStyles = { ...ccStyles, fontSize };

  const ccTextClasses = classNames({
    "text-capitalize": configSettings.textUppercase,
    "text-mix-case": !configSettings.textUppercase,
  });

  return (
    <div className="caption-container">
      <div className={ccTextClasses} style={textStyles} >
        {finalTextQueue.map(({ text }) => text).join(" ")} {interimText}
      </div>
    </div>
  );
}

MobileClosedCaption.propTypes = {
  hide: PropTypes.bool,
  settings: PropTypes.object,
  onDragEnd: PropTypes.func,
  size: PropTypes.string,
  configSettings: PropTypes.object,
  ccState: PropTypes.object,
};

MobileClosedCaption.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
  ...ownProps,
});

export default connect(mapStateToProps)(MobileClosedCaption);
