import { Menu } from '@blueprintjs/core'

import {
  AdvancedSettings,
  BoxSizeButton,
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
  </Menu>
)

SettingsMenu.propTypes = {}

export default SettingsMenu
