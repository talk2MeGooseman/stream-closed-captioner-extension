import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faFlask } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

import DevMockControlsDialog from '@/components/DevMockControlsDialog'

/**
 * Dev-only menu item to open the GraphQL mock controls dialog
 * Only visible in development mode
 */
function DevMockControls() {
  const [isOpen, setIsOpen] = useState(false)

  // Only show in development
  const isDevelopment = import.meta.env.MODE === 'development'

  if (!isDevelopment) {
    return null
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <MenuDivider />
      <MenuItem
        active={false}
        icon={<FontAwesomeIcon icon={faFlask} size="lg" />}
        onClick={handleOpen}
        shouldDismissPopover={false}
        text="Mock Controls (Dev)"
      />
      <DevMockControlsDialog isOpen={isOpen} onClose={handleClose} />
    </>
  )
}

DevMockControls.propTypes = {}

export default DevMockControls
