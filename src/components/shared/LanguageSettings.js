import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Popover } from "@blueprintjs/core";
import LanguageOptions from "./MenuItems/LanguageOptions";
import { useShallowEqualSelector, useCallbackDispatch } from "../../redux/redux-helpers";
import { actionToggleActivationDrawer } from "../../redux/config-settings-action-reducer";

export function LanguageSettings() {
  const isBitsEnabled = useShallowEqualSelector(state => state.configSettings.isBitsEnabled);
  const hasTranslations = useShallowEqualSelector(
    state => Object.keys(state.ccState.translations || {}).length,
  );
  const toggleActivationDrawer = useCallbackDispatch(actionToggleActivationDrawer());

  if (!isBitsEnabled) {
    return null;
  }

  let button = null;
  if (hasTranslations) {
    button = (
      <Popover position="left-bottom" content={<LanguageOptions />}>
        <FontAwesomeIcon size="2x" icon={faLanguage} />
      </Popover>
    );
  } else {
    button = <FontAwesomeIcon size="2x" icon={faLanguage} onClick={toggleActivationDrawer} />;
  }
  // Display activate dialog/text
  return (
    <React.Fragment>
      <Tooltip content={"Translations"}>{button}</Tooltip>
    </React.Fragment>
  );
}

export default LanguageSettings;
