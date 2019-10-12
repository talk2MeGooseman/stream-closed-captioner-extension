import React from "react";
import { MenuDivider, Menu, MenuItem } from "@blueprintjs/core";
import {
  actionChangeSelectedLanguage,
  actionToggleActivationDrawer,
} from "../../../redux/config-settings-action-reducer";
import { useShallowEqualSelector, useCallbackDispatch } from "../../../redux/redux-helpers";

export default function LanguageOptions() {
  const selectedLanguage = useShallowEqualSelector(state => state.configSettings.selectedLanguage);
  const languages = useShallowEqualSelector(state => Object.keys(state.ccState.translations || {}));
  const translations = useShallowEqualSelector(state => state.ccState.translations);
  const onSelectDefaultLanguage = useCallbackDispatch(actionChangeSelectedLanguage("default"));
  const toggleActivationDrawer = useCallbackDispatch(actionToggleActivationDrawer());

  const defaultIcon = selectedLanguage === "default" ? "tick" : "none";

  const optionEls = languages.map((l) => {
    const icon = l === selectedLanguage ? "tick" : "none";
    const onClick = useCallbackDispatch(actionChangeSelectedLanguage(l));

    return (
      <MenuItem
        key={l}
        shouldDismissPopover={false}
        icon={icon}
        text={translations[l].name}
        onClick={onClick}
      />
    );
  });

  return (
    <Menu>
      <MenuItem disabled text="Translations On" />
      <MenuItem
        shouldDismissPopover={false}
        icon={defaultIcon}
        text="Spoken Language"
        onClick={onSelectDefaultLanguage}
      />
      <MenuDivider />
      {optionEls}
      <MenuDivider />
      <MenuItem
        shouldDismissPopover={true}
        text="Add Translation Days"
        onClick={toggleActivationDrawer}
      />
    </Menu>
  );
}