import { MenuDivider, Menu, MenuItem } from '@blueprintjs/core'
import React from 'react'

import { LanguageOption } from './language-option'

import {
  useShallowEqualSelector,
  useReduxCallbackDispatch,
} from '@/redux/redux-helpers'

import { changeLanguage, toggleActivationDrawer } from '@/redux/settings-slice'

import { useLanguageList } from '@/shared/hooks'

export function LanguageOptions() {
  const isBitsEnabled = useShallowEqualSelector(
    (state) => state.configSettings.isBitsEnabled,
  )
  const selectedLanguage = useShallowEqualSelector(
    (state) => state.configSettings.viewerLanguage,
  )

  const onSelectDefaultLanguage = useReduxCallbackDispatch(
    changeLanguage('default'),
  )
  const toggleDrawer = useReduxCallbackDispatch(toggleActivationDrawer())
  const languageList = useLanguageList()

  const defaultIcon = selectedLanguage === 'default' ? 'tick' : 'none'

  return (
    <Menu>
      <MenuItem disabled text="Translations On" />
      <MenuItem
        data-testid="language-default"
        icon={defaultIcon}
        onClick={onSelectDefaultLanguage}
        shouldDismissPopover={false}
        text="Spoken Language"
      />
      <MenuDivider />
      {languageList.map((language) => (
        <LanguageOption
          key={language.key}
          option={language}
          selectedLanguage={selectedLanguage}
        />
      ))}
      {isBitsEnabled && (
        <>
          <MenuDivider />
          <MenuItem
            onClick={toggleDrawer}
            shouldDismissPopover={false}
            text="Add Translation Days"
          />
        </>
      )}
    </Menu>
  )
}
