import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import {
  MenuDivider,
  Menu,
  MenuItem,
  Tooltip,
  Popover,
  Button,
  Classes,
  Intent,
  H5,
  Drawer,
} from "@blueprintjs/core";
import { actionChangeSelectedLanguage, actionToggleActivationDrawer } from "../../../redux/config-settings-action-reducer";
import { useBits } from "../../../redux/products-catalog-action-reducers";

function LanguageOptions({
  ccState: { translations },
  configSettings,
  changeSelectedLanguage,
  toggleActivationDrawer,
  onUseBits,
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
      <Tooltip content={"Translations"}>
        {button}
      </Tooltip>
      {drawer(configSettings, toggleActivationDrawer, onUseBits)}
    </React.Fragment>
  );
}

function drawer({ isDrawerOpen }, toggleActivationDrawer, onUseBits) {
  return (
    <Drawer
      position="left"
      title="Turn on Translations!"
      canOutsideClickClose={true}
      isOpen={isDrawerOpen}
      onClose={toggleActivationDrawer}
      size={Drawer.SIZE_LARGE}>
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <p>Super awesome copy here about activation translations for the day</p>
          <p>List languages that are currently translated, maybe store the languages that can be translated in the store to be pulled from?</p>
          <Button icon="refresh" onClick={() => onUseBits("translation100")}>Turn on now!</Button>
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER} />
    </Drawer>
  );
}

function displayLanguageOptions(langs, configSettings, translations, changeSelectedLanguage) {
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
      <MenuItem
        shouldDismissPopover={false}
        icon={defaultIcon}
        text="Spoken Language"
        onClick={() => changeSelectedLanguage("default")}
      />
      <MenuDivider />
      {optionEls}
    </Menu>
  );
}

LanguageOptions.propTypes = {
  ccState: PropTypes.object.isRequired,
  configSettings: PropTypes.object.isRequired,
  changeSelectedLanguage: PropTypes.func,
  toggleActivationDrawer: PropTypes.func,
  onUseBits: PropTypes.func,
};

const mapStateToProps = state => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
});

const mapDispatchToProps = dispatch => ({
  changeSelectedLanguage: language => dispatch(actionChangeSelectedLanguage(language)),
  toggleActivationDrawer: () => dispatch(actionToggleActivationDrawer()),
  onUseBits: sku => dispatch(useBits(sku)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageOptions);
