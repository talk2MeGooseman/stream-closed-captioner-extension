import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  useReduxCallbackDispatch,
  useShallowEqualSelector,
} from '@/redux/redux-helpers'

import { toggleRollUpCaptions } from '@/redux/settings-slice'

function RollUpCaptionsOptionButton() {
  const onClick = useReduxCallbackDispatch(toggleRollUpCaptions())
  const active = useShallowEqualSelector(
    (state) => state.configSettings.rollUpCaptions,
  )

  return (
    <>
      <MenuDivider />
      <MenuItem
        active={active}
        icon={<FontAwesomeIcon icon={faAlignLeft} size="lg" />}
        onClick={onClick}
        shouldDismissPopover={false}
        text="Line-By-Line Captions"
      />
    </>
  )
}

RollUpCaptionsOptionButton.propTypes = {}

export default RollUpCaptionsOptionButton
