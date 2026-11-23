import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faFlask } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

/**
 * Dev-only menu item that opens the GraphQL mock controls dialog.
 * The dialog itself is rendered by the settings controls (outside this menu)
 * so the menu can close and not sit on top of it.
 */
function DevMockControls({ onOpen }) {
  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null
  }

  return (
    <>
      <MenuDivider />
      <MenuItem
        active={false}
        icon={<FontAwesomeIcon icon={faFlask} size="lg" />}
        onClick={onOpen}
        shouldDismissPopover={false}
        text="Mock Controls (Dev)"
      />
    </>
  )
}

DevMockControls.propTypes = {
  onOpen: PropTypes.func,
}

export default DevMockControls
