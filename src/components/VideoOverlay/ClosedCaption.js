import React from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import { connect } from "react-redux";
import { ccStyles } from "../shared/caption-styles";

import "./ClosedCaption.css";
import { actionSetIsDragged } from "../../redux/config-settings-action-reducer";

const classNames = require("classnames");

// Bits 100 from electrichavoc
// Resub Nyixxs
// Resub Nataliexo93
// Resub lurking_kat
// Bits  302 corbob
// Bits 11 taylorishere
// Bits 301 adam13531
// Bits 200 rhyolight
// Bits 400 booperinos
// Bits 1 ninjabunny9000
// Sub DannyKampsGamez

function isEmptyCC(text) {
  return text.length === 0;
}

function shouldHideCC(shouldHide, interimText, finalText) {
  return shouldHide || isEmptyCC(interimText + finalText);
}

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

function renderTextFromArray(arr) {
  return arr.map(item => (<span key={item.id}>{item.text}{" "}</span>));
}

function ClosedCaption({
  configSettings,
  ccState: { interimText, finalTextQueue },
  setIsDragged, numberOfLines,
}) {
  const finalText = finalTextQueue.join(" ");

  const fontSize = setFontSizeStyle(configSettings.size);
  const textStyles = { ...ccStyles, fontSize };

  if (configSettings.ccBoxSize) {
    // eslint-disable-next-line no-param-reassign
    numberOfLines = 7;
  }

  const styles = {
    maxHeight: `calc(${fontSize} * var(--line-height) * ${numberOfLines} + var(--caption-pad-bottom))`,
    overflow: "hidden",
  };

  const containerClasses = classNames({
    "caption-container": true,
    "box-size": configSettings.ccBoxSize,
    hide: shouldHideCC(configSettings.hideCC, interimText, finalText),
  });

  const ccTextClasses = classNames({
    "text-capitalize": configSettings.textUppercase,
    "text-mix-case": !configSettings.textUppercase,
  });

  return (
    <Draggable grid={[8, 8]} bounds="parent" onStop={setIsDragged}>
      <div className={containerClasses} style={styles}>
        <div className={ccTextClasses} style={textStyles} >
          {renderTextFromArray(finalTextQueue)}
          <span>{interimText}</span>
        </div>
      </div>
    </Draggable>
  );
}

ClosedCaption.propTypes = {
  configSettings: PropTypes.object,
  ccState: PropTypes.object.isRequired,
  hide: PropTypes.bool,
  settings: PropTypes.object,
  numberOfLines: PropTypes.number.isRequired,
};

ClosedCaption.defaultProps = {
  numberOfLines: 3,
};

const mapStateToProps = state => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
});

const mapDispatchToProps = dispatch => ({
  setIsDragged: () => dispatch(actionSetIsDragged()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClosedCaption);
