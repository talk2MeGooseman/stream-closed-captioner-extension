import React from 'react'
import MobileClosedCaption from './MobileClosedCaption'
import { DisplaySettingsMenu } from '../display-settings-menu'

function MobilePanel() {
  return (
    <div id="mobile-container">
      <div>
        <MobileClosedCaption />
        <DisplaySettingsMenu />
      </div>
    </div>
  )
}

export default MobilePanel
