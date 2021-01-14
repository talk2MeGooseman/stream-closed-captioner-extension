import classNames from 'classnames'
import React from 'react'

import { ClosedCaption } from '@/components/Captions'

import { DisplaySettingsMenu } from '@/components/display-settings-menu'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

function Overlay() {
  const { isDragged, ccKey } = useShallowEqualSelector((state) => (state.configSettings))
  const { arePlayerControlsVisible } = useShallowEqualSelector(
    (state) => state.videoPlayerContext,
  )

  const containerClass = classNames({
    'raise-video-controls':
      arePlayerControlsVisible || isDragged,
    'standard-position':
      !arePlayerControlsVisible && !isDragged,
  })

  return (
    <div className={containerClass} id="app-container">
      <div className="drag-boundary">
        <ClosedCaption key={ccKey} />
        <DisplaySettingsMenu />
      </div>
    </div>
  )
}

export default Overlay
