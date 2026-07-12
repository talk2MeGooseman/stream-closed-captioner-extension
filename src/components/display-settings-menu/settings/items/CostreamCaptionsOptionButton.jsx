import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  useReduxCallbackDispatch,
  useShallowEqualSelector,
} from '@/redux/redux-helpers'

import {
  toggleCostreamCaptionsAndPersist,
  toggleCostreamInTranslatedViewAndPersist,
} from '@/redux/settings-slice'

/**
 * Viewer toggles for co-streamer guest captions. The master toggle shows or
 * hides all guest captions. The translated-view sub-toggle only matters when
 * the viewer is watching a translation language — guest captions are never
 * translated, so the viewer chooses between seeing guests' original-language
 * text or hiding guests while translated.
 */
function CostreamCaptionsOptionButton() {
  const onToggle = useReduxCallbackDispatch(toggleCostreamCaptionsAndPersist())
  const onToggleTranslatedView = useReduxCallbackDispatch(
    toggleCostreamInTranslatedViewAndPersist(),
  )
  const showCostream = useShallowEqualSelector(
    (state) => state.configSettings.showCostreamCaptions,
  )
  const showInTranslatedView = useShallowEqualSelector(
    (state) => state.configSettings.showCostreamInTranslatedView,
  )
  const viewerLanguage = useShallowEqualSelector(
    (state) => state.configSettings.viewerLanguage,
  )

  return (
    <>
      <MenuDivider />
      <MenuItem
        active={showCostream}
        icon={<FontAwesomeIcon icon={faUserFriends} size="lg" />}
        onClick={onToggle}
        shouldDismissPopover={false}
        text="Co-Streamer Captions"
      />
      {showCostream && viewerLanguage !== 'default' && (
        <MenuItem
          active={showInTranslatedView}
          icon={<FontAwesomeIcon icon={faUserFriends} size="lg" />}
          onClick={onToggleTranslatedView}
          shouldDismissPopover={false}
          text="Co-Streamers While Translated"
        />
      )}
    </>
  )
}

CostreamCaptionsOptionButton.propTypes = {}

export default CostreamCaptionsOptionButton
