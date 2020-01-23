import { Menu } from '@blueprintjs/core'
import React from 'react'
import BoxSizeButton from './BoxSizeButton'
import FontSizeOptions from './FontSizeOptions'
import ResetButton from './ResetButton'
import LineCountOptions from './LineCountOptions'
import GrayOutFinalTextOptionButton from './GrayOutFinalTextOptionButton'
import UppercaseTextOptionButton from './UppercaseTextOptionButton'
import FontFamilyOptions from './FontFamilyOptions'

const SettingsMenu = () => (
  <Menu>
    <FontSizeOptions />
    <FontFamilyOptions />
    <GrayOutFinalTextOptionButton />
    <UppercaseTextOptionButton />
    <LineCountOptions />
    <ResetButton />
    <BoxSizeButton />
  </Menu>
)

SettingsMenu.propTypes = {}

export default SettingsMenu