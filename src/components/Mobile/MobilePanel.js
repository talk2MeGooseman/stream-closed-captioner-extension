import React from 'react'
import { MobileClosedCaption } from '@/components/Captions'
import { DisplaySettingsMenu } from '@/components/display-settings-menu'

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
