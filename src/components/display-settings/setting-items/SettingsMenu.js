import { Menu } from '@blueprintjs/core'
import React from 'react'
import BoxSizeButton from './BoxSizeButton'
import FontSizeOptions from './FontSizeOptions'
import ResetButton from './ResetButton'
import LineCountOptions from './LineCountOptions'

const SettingsMenu = () => (
  <Menu>
    <FontSizeOptions />
    <LineCountOptions />
    <ResetButton />
    <BoxSizeButton />
  </Menu>
)

SettingsMenu.propTypes = {}

export default SettingsMenu
