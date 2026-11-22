import { Menu } from '@blueprintjs/core'

import {
  AdvancedSettings,
  BoxSizeButton,
  CostreamCaptionsOptionButton,
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
    <CostreamCaptionsOptionButton />
    <LineCountOptions />
    <ResetButton />
    <BoxSizeButton />
    <AdvancedSettings />
    <DevMockControls />
  </Menu>
)

SettingsMenu.propTypes = {}

export default SettingsMenu
