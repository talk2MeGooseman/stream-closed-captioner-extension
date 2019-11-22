import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import { connect } from 'react-redux';
import { ccStyles } from '../shared/caption-styles';

import './ClosedCaption.css';
import { setIsDragged } from '@/redux/settingsSlice';

const classNames = require('classnames');

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
  let fontSize = '';

  switch (size) {
  case 'small':
    fontSize = 'var(--small-font-size)';
    break;
  case 'medium':
    fontSize = 'var(--medium-font-size)';
    break;
  case 'large':
    fontSize = 'var(--large-font-size)';
    break;
  default:
    fontSize = 'var(--medium-font-size)';
    break;
  }

  return fontSize;
}

function ClosedCaption({
  configSettings,
  ccState: { interimText, finalTextQueue, translations },
  setIsDragged,
}) {
  const finalText = finalTextQueue.join(' ');

  const fontSize = setFontSizeStyle(configSettings.size);
  const textStyles = { ...ccStyles, fontSize };

  let numberOfLines = configSettings.horizontalLineCount;
  if (configSettings.ccBoxSize) {
    // eslint-disable-next-line no-param-reassign
    numberOfLines = configSettings.boxLineCount;
  }

  const styles = {
    maxHeight: `calc(${fontSize} * var(--line-height) * ${numberOfLines} + var(--caption-pad-bottom))`,
    overflow: 'hidden',
  };

  const containerClasses = classNames({
    'caption-container': true,
    'box-size': configSettings.ccBoxSize,
    hide: shouldHideCC(configSettings.hideCC, interimText, finalText),
  });

  const ccTextClasses = classNames({
    'text-capitalize': configSettings.textUppercase,
    'text-mix-case': !configSettings.textUppercase,
  });

  let closedCaptionText = '';
  if (configSettings.language === 'default') {
    closedCaptionText = `${finalTextQueue.map(({ text }) => text).join(' ')} ${interimText}`;
  } else {
    closedCaptionText = translations[configSettings.language].textQueue.map(({ text }) => text).join(' ');
  }

  return (
    <Draggable grid={[8, 8]} bounds="parent" onStop={setIsDragged}>
      <div className={containerClasses} style={styles}>
        <div className={ccTextClasses} style={textStyles} >
          {closedCaptionText}
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
  setIsDragged: PropTypes.func,
};

ClosedCaption.defaultProps = {
  numberOfLines: 3,
};

const mapStateToProps = (state) => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
});

const mapDispatchToProps = (dispatch) => ({
  setIsDragged: () => dispatch(setIsDragged()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClosedCaption);
