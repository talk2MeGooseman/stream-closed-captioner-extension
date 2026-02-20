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
  UppercaseTextOptionButton,
} from './items'

const SettingsMenu = () => (
  <Menu>
    <FontSizeOptions />
    <FontFamilyOptions />
    <GrayOutFinalTextOptionButton />
    <UppercaseTextOptionButton />
    <LineCountOptions />
    <ResetButton />
    <BoxSizeButton />
    <AdvancedSettings />
    <DevMockControls />
  </Menu>
)

SettingsMenu.propTypes = {}

export default SettingsMenu
