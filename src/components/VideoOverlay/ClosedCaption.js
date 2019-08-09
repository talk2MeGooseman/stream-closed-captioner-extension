import React from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import { connect } from "react-redux";
import { ccStyles } from "../shared/caption-styles";

import "./ClosedCaption.css";

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
  size, configSettings,
  ccState: { interimText, finalTextQueue },
  onDragEnd, numberOfLines, isBoxSize,
}) {
  const finalText = finalTextQueue.join(" ");

  const fontSize = setFontSizeStyle(size);
  const textStyles = { ...ccStyles, fontSize };

  if (isBoxSize) {
    // eslint-disable-next-line no-param-reassign
    numberOfLines = 7;
  }

  const styles = {
    maxHeight: `calc(${fontSize} * var(--line-height) * ${numberOfLines} + var(--caption-pad-bottom))`,
    overflow: "hidden",
  };

  const containerClasses = classNames({
    "caption-container": true,
    "box-size": isBoxSize,
    hide: shouldHideCC(configSettings.hideCC, interimText, finalText),
  });

  const ccTextClasses = classNames({
    "text-capitalize": configSettings.textUppercase,
    "text-mix-case": !configSettings.textUppercase,
  });

  return (
    <Draggable grid={[8, 8]} bounds="parent" onStop={onDragEnd}>
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
  onDragEnd: PropTypes.func,
  fontSize: PropTypes.string,
  numberOfLines: PropTypes.number.isRequired,
  isBoxSize: PropTypes.bool.isRequired,
};

ClosedCaption.defaultProps = {
  numberOfLines: 3,
  isBoxSize: false,
};

const mapStateToProps = (state, ownProps) => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
  ...ownProps,
});

export default connect(mapStateToProps)(ClosedCaption);
