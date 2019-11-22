import React from 'react';
import { MenuDivider, Menu, MenuItem } from '@blueprintjs/core';
import {
  changeLanguage,
  toggleActivationDrawer,
} from '@/redux/settingsSlice';
import { useShallowEqualSelector, useCallbackDispatch } from '@/redux/redux-helpers';

export default function LanguageOptions() {
  const language = useShallowEqualSelector(
    (state) => state.configSettings.language,
  );
  const languages = useShallowEqualSelector(
    (state) => Object.keys(state.ccState.translations || {}),
  );
  const translations = useShallowEqualSelector(
    (state) => state.ccState.translations,
  );
  const onSelectDefaultLanguage = useCallbackDispatch(changeLanguage('default'));
  const toggleDrawer = useCallbackDispatch(toggleActivationDrawer());

  const defaultIcon = language === 'default' ? 'tick' : 'none';

  const optionEls = languages.map((l) => {
    const icon = l === language ? 'tick' : 'none';
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onClick = useCallbackDispatch(changeLanguage(l));

    return (
      <MenuItem
        key={l}
        icon={icon}
        text={translations[l].name}
        onClick={onClick}
        shouldDismissPopover={false}
      />
    );
  });

  return (
    <Menu>
      <MenuItem disabled text="Translations On" />
      <MenuItem
        icon={defaultIcon}
        text="Spoken Language"
        onClick={onSelectDefaultLanguage}
        shouldDismissPopover={false}
      />
      <MenuDivider />
      {optionEls}
      <MenuDivider />
      <MenuItem
        text="Add Translation Days"
        onClick={toggleDrawer}
        shouldDismissPopover={false}
      />
    </Menu>
  );
}
