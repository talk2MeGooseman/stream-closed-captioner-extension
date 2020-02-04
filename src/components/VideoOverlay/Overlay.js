import React from 'react'
import { ClosedCaption } from '@/components/Captions'
import { DisplaySettingsMenu } from '@/components/display-settings-menu'
import { useShallowEqualSelector } from '@/redux/redux-helpers'

const classNames = require('classnames')

function Overlay() {
  const { isDragged, ccKey } = useShallowEqualSelector((state) => state.configSettings)
  const { arePlayerControlsVisible } = useShallowEqualSelector((state) => state.videoPlayerContext)

  const containerClass = classNames({
    'standard-position': !arePlayerControlsVisible && !isDragged,
    'raise-video-controls': arePlayerControlsVisible || isDragged,
  })

  return (
    <div id="app-container" className={containerClass}>
      <div className="drag-boundary">
        <ClosedCaption key={ccKey} />
        <DisplaySettingsMenu />
      </div>
    </div>
  )
}

export default Overlay
