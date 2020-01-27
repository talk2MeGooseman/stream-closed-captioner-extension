import React from 'react'
import { MenuDivider, Menu, MenuItem } from '@blueprintjs/core'
import { changeLanguage, toggleActivationDrawer } from '@/redux/settingsSlice'
import {
  useShallowEqualSelector,
  useReduxCallbackDispatch,
} from '@/redux/redux-helpers'

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
        key={l}
        icon={icon}
        text={translations[l].name}
        onClick={onClick}
        shouldDismissPopover={false}
      />
    )
  })

  return (
    <Menu>
      <MenuItem disabled text="Translations On" />
      <MenuItem
        data-testid="language-default"
        icon={defaultIcon}
        text="Spoken Language"
        onClick={onSelectDefaultLanguage}
        shouldDismissPopover={false}
      />
      <MenuDivider />
      {optionEls}
      {isBitsEnabled && (
        <>
          <MenuDivider />
          <MenuItem
            text="Add Translation Days"
            onClick={toggleDrawer}
            shouldDismissPopover={false}
          />
        </>
      )}
    </Menu>
  )
}
