import React from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import { withTwitchPlayerContext } from "../../context/provider/TwitchPlayer";
import { withConfigSettings } from "../../context/provider/ConfigSettings";
import { withCCState } from "../../context/provider/CCState";
import { ccStyles } from "../shared/caption-styles";

import "./ClosedCaption.css";

const classNames = require("classnames");

// Bits 100 from electrichavoc
// Resub Nyixxs
// Resub Nataliexo93
// Resub lurking_kat

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
  return arr.map(item => (<span>{item}{" "}</span>));
} 

function ClosedCaption({
  hide, size, configSettings,
  ccState: { finalTextQueue, interimText },
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
    hide: shouldHideCC(hide, interimText, finalText),
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
  interimText: PropTypes.string,
  finalText: PropTypes.string,
  hide: PropTypes.bool,
  playerContext: PropTypes.object,
  settings: PropTypes.object,
  onDragEnd: PropTypes.func,
  fontSize: PropTypes.string,
  configSettings: PropTypes.object,
  ccState: PropTypes.object.isRequired,
  numberOfLines: PropTypes.number.isRequired,
  isBoxSize: PropTypes.bool.isRequired,
};

ClosedCaption.defaultProps = {
  interimText: "",
  finalText: "",
  numberOfLines: 3,
  isBoxSize: false,
};

export default withTwitchPlayerContext(withConfigSettings(withCCState(ClosedCaption)));
