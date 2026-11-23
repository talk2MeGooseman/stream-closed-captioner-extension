import { Menu } from '@blueprintjs/core'
import PropTypes from 'prop-types'

import {
  AdvancedSettings,
  BoxSizeButton,
  DevMockControls,
  FontFamilyOptions,
  FontSizeOptions,
  GrayOutFinalTextOptionButton,
  LineCountOptions,
  ResetButton,
  RollUpCaptionsOptionButton,
  UppercaseTextOptionButton,
} from './items'

const SettingsMenu = ({ onCloseMenu, onOpenDevMockControls }) => (
  <Menu>
    <FontSizeOptions />
    <FontFamilyOptions />
    <GrayOutFinalTextOptionButton />
    <UppercaseTextOptionButton />
    <RollUpCaptionsOptionButton />
    <LineCountOptions />
    <ResetButton />
    <BoxSizeButton />
    <AdvancedSettings onOpen={onCloseMenu} />
    <DevMockControls onOpen={onOpenDevMockControls} />
  </Menu>
)

SettingsMenu.propTypes = {
  onCloseMenu: PropTypes.func,
  onOpenDevMockControls: PropTypes.func,
}

export default SettingsMenu
