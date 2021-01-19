import { MenuItem } from '@blueprintjs/core'
import React from 'react'

import { useReduxCallbackDispatch } from '@/redux/redux-helpers'

import { changeLanguage } from '@/redux/settings-slice'

export const LanguageOption = ({ selectedLanguage, option }) => {
  const onClick = useReduxCallbackDispatch(changeLanguage(option.locale))
  const icon = option.locale === selectedLanguage ? 'tick' : 'none'

  return (
    <MenuItem
      data-testid={`language-${option.locale}`}
      icon={icon}
      key={option.locale}
      onClick={onClick}
      shouldDismissPopover={false}
      text={option.name} />
  )
}
