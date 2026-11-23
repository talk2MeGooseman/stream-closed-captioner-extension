import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { useCallback, useState } from 'react'

import { AdvancedSettingsDialog } from '../AdvancedSettingsDialog'
import DevMockControlsDialog from '../DevMockControlsDialog'

import { SettingsMenu } from './settings'

import { LanguageButton } from '@/components/language-button'

import VisibilityToggle from '@/components/VideoOverlay/VisibilityToggle'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

import './settings-menu.css'

export const positionLeft = (switchSettingsPosition) =>
  isVideoOverlay() && switchSettingsPosition

const isDevelopment = import.meta.env.MODE === 'development'

const Controls = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDevMockControlsOpen, setIsDevMockControlsOpen] = useState(false)

  // Dialogs opened from the menu close it first: the menu sits above
  // Blueprint's overlay layer, so leaving it open would cover the dialog.
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const openDevMockControls = useCallback(() => {
    setIsMenuOpen(false)
    setIsDevMockControlsOpen(true)
  }, [])
  const closeDevMockControls = useCallback(
    () => setIsDevMockControlsOpen(false),
    [],
  )

  const arePlayerControlsVisible = useShallowEqualSelector(
    (state) => state.videoPlayerContext.arePlayerControlsVisible,
  )

  const switchSettingsPosition = useShallowEqualSelector(
    (state) => state.configSettings.switchSettingsPosition,
  )

  // Rendered outside the controls so an open dialog survives Twitch hiding
  // the player controls (which unmounts the nav below).
  const dialogs = (
    <>
      <AdvancedSettingsDialog />
      {isDevelopment && (
        <DevMockControlsDialog
          isOpen={isDevMockControlsOpen}
          onClose={closeDevMockControls}
        />
      )}
    </>
  )

  if (isVideoOverlay() && !arePlayerControlsVisible) {
    return dialogs
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
              <SettingsMenu
                onCloseMenu={closeMenu}
                onOpenDevMockControls={openDevMockControls}
              />
            </div>
          )}
        </div>
      </nav>
      {dialogs}
    </>
  )
}

export default Controls
