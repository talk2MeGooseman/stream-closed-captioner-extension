import { MenuDivider, Menu, MenuItem } from '@blueprintjs/core'
import React from 'react'

import {
  useShallowEqualSelector,
  useReduxCallbackDispatch,
} from '@/redux/redux-helpers'

import { changeLanguage, toggleActivationDrawer } from '@/redux/settings-slice'


export default function LanguageOptions() {
  const isBitsEnabled = useShallowEqualSelector(
    (state) => state.configSettings.isBitsEnabled,
  )
  const selectedLanguage = useShallowEqualSelector(
    (state) => state.configSettings.viewerLanguage,
  )
  const languages = useShallowEqualSelector(
    (state) => Object.keys(state.captionsState.translations || {}),
  )
  const translations = useShallowEqualSelector(
    (state) => state.captionsState.translations,
  )
  const onSelectDefaultLanguage = useReduxCallbackDispatch(changeLanguage('default'))
  const toggleDrawer = useReduxCallbackDispatch(toggleActivationDrawer())

  const defaultIcon = selectedLanguage === 'default' ? 'tick' : 'none'

  const optionEls = languages.map((l) => {
    const icon = l === selectedLanguage ? 'tick' : 'none'
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onClick = useReduxCallbackDispatch(changeLanguage(l))

    return (
      <MenuItem
        data-testid={`language-${l}`}
        icon={icon}
        key={l}
        onClick={onClick}
        shouldDismissPopover={false}
        text={translations[l].name}
      />
    )
  })

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
      {optionEls}
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
