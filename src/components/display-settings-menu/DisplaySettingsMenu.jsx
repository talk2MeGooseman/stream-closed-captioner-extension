import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { useState } from 'react'

import { AdvancedSettingsDialog } from '../AdvancedSettingsDialog'

import { SettingsMenu } from './settings'

import { LanguageButton } from '@/components/language-button'

import VisibilityToggle from '@/components/VideoOverlay/VisibilityToggle'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

import './settings-menu.css'

export const positionLeft = (switchSettingsPosition) =>
  isVideoOverlay() && switchSettingsPosition

const Controls = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const arePlayerControlsVisible = useShallowEqualSelector(
    (state) => state.videoPlayerContext.arePlayerControlsVisible,
  )

  const switchSettingsPosition = useShallowEqualSelector(
    (state) => state.configSettings.switchSettingsPosition,
  )

  if (isVideoOverlay() && !arePlayerControlsVisible) {
    return null
  }

  const controlClass = classnames({
    'bg-black-transparent': true,
    'controls-container': isVideoOverlay(),
    'mobile-controls-button': !isVideoOverlay(),
    'position-left': positionLeft(switchSettingsPosition),
    'position-right': !positionLeft(switchSettingsPosition),
  })

  return (
    <>
      <nav className={controlClass} data-testid="display-settings">
        <LanguageButton />
        <VisibilityToggle />
        <div className="settings-menu-wrapper" style={{ position: 'relative' }}>
          <button
            className="settings-icon"
            type="button"
            title="Settings"
            aria-label="Open settings menu"
            aria-expanded={isMenuOpen}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsMenuOpen(!isMenuOpen)
            }}
          >
            <FontAwesomeIcon icon={faCog} size="2x" />
          </button>
          {isMenuOpen && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              className="settings-menu-container"
              onClick={(e) => e.stopPropagation()}
            >
              <SettingsMenu />
            </div>
          )}
        </div>
      </nav>
      <AdvancedSettingsDialog />
    </>
  )
}

export default Controls
