import React from 'react';

import 'typeface-montserrat';
import 'typeface-raleway';
import 'typeface-roboto';

import MobileClosedCaption from './MobileClosedCaption';
import Controls from '../shared/Controls';

const classNames = require('classnames');

function MobilePanel() {
  const containerClass = classNames({});

  return (
    <div id="mobile-container" className={containerClass}>
      <div className="">
        <MobileClosedCaption />
        <Controls />
      </div>
    </div>
  );
}

export default MobilePanel;
