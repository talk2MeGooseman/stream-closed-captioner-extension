import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import {
  MenuDivider, Menu, MenuItem, Tooltip, Popover,
} from "@blueprintjs/core";
import {
  actionChangeSelectedLanguage,
  actionToggleActivationDrawer,
} from "../../../redux/config-settings-action-reducer";

function LanguageOptions({
  ccState: { translations },
  configSettings,
  changeSelectedLanguage,
  toggleActivationDrawer,
}) {
  const langs = Object.keys(translations || {});

  if (!configSettings.isBitsEnabled) {
    return null;
  }

  const hasTranslations = langs.length !== 0;

  let button = null;
  if (hasTranslations) {
    const menuOptions = displayLanguageOptions(
      langs,
      configSettings,
      translations,
      changeSelectedLanguage,
      toggleActivationDrawer,
    );

    button = (
      <Popover position="left-bottom" content={menuOptions}>
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

function displayLanguageOptions(
  langs,
  configSettings,
  translations,
  changeSelectedLanguage,
  toggleActivationDrawer,
) {
  const optionEls = langs.map((l) => {
    let icon = "none";
    if (l === configSettings.selectedLanguage) {
      icon = "tick";
    }
    return (
      <MenuItem
        key={l}
        shouldDismissPopover={false}
        icon={icon}
        text={translations[l].name}
        onClick={() => changeSelectedLanguage(l)}
      />
    );
  });

  let defaultIcon = "none";

  if (configSettings.selectedLanguage === "default") {
    defaultIcon = "tick";
  }

  return (
    <Menu>
      <MenuItem disabled text="Translations On" />
      <MenuItem
        shouldDismissPopover={false}
        icon={defaultIcon}
        text="Spoken Language"
        onClick={() => changeSelectedLanguage("default")}
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

LanguageOptions.propTypes = {
  ccState: PropTypes.object.isRequired,
  configSettings: PropTypes.object.isRequired,
  changeSelectedLanguage: PropTypes.func,
  toggleActivationDrawer: PropTypes.func,
};

const mapStateToProps = state => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
});

const mapDispatchToProps = dispatch => ({
  changeSelectedLanguage: language => dispatch(actionChangeSelectedLanguage(language)),
  toggleActivationDrawer: () => dispatch(actionToggleActivationDrawer()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageOptions);
