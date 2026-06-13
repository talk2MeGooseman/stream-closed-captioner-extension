import { Menu } from '@blueprintjs/core'

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

const SettingsMenu = () => (
  <Menu>
    <FontSizeOptions />
    <FontFamilyOptions />
    <GrayOutFinalTextOptionButton />
    <UppercaseTextOptionButton />
    <RollUpCaptionsOptionButton />
    <LineCountOptions />
    <ResetButton />
    <BoxSizeButton />
    <AdvancedSettings />
    <DevMockControls />
  </Menu>
)

SettingsMenu.propTypes = {}

export default SettingsMenu
