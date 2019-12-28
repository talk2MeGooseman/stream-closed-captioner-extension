import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ccStyles } from '../shared/caption-styles';
import './MobileClosedCaption.css';

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
// Sub - el_psychic
// Resub - CreativeBuilds

function setFontSizeStyle(size) {
  let fontSize = '';

  switch (size) {
  case 'small':
    fontSize = 'var(--mobile-small-font-size)';
    break;
  case 'medium':
    fontSize = 'var(--mobile-medium-font-size)';
    break;
  case 'large':
    fontSize = 'var(--mobile-large-font-size)';
    break;
  default:
    fontSize = 'var(--mobile-medium-font-size)';
    break;
  }

  return fontSize;
}

function MobileClosedCaption({
  ccState: { interimText, finalTextQueue, translations },
  configSettings,
}) {
  const fontSize = setFontSizeStyle(configSettings.size);

  const textStyles = { ...ccStyles, fontSize };

  const ccTextClasses = classNames({
    'text-capitalize': configSettings.textUppercase,
    'text-mix-case': !configSettings.textUppercase,
  });

  let closedCaptionText = '';
  if (configSettings.viewerLanguage === 'default') {
    closedCaptionText = `${finalTextQueue
      .map(({ text }) => text)
      .join(' ')} ${interimText}`;
  } else {
    closedCaptionText = translations[configSettings.viewerLanguage].textQueue
      .map(({ text }) => text)
      .join(' ');
  }

  return (
    <div className="caption-container">
      <div className={ccTextClasses} style={textStyles}>
        {closedCaptionText}
      </div>
    </div>
  );
}

MobileClosedCaption.propTypes = {
  configSettings: PropTypes.object,
  ccState: PropTypes.object,
};

MobileClosedCaption.defaultProps = {};

const mapStateToProps = (state) => ({
  ccState: state.captionsState,
  configSettings: state.configSettings,
});

export default connect(mapStateToProps)(MobileClosedCaption);
