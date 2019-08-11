import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import {
  MenuDivider, MenuItem,
} from "@blueprintjs/core";
import { actionChangeSelectedLanguage } from "../../../redux/config-settings-action-reducer";

function LanguageOptions({ ccState: { translations }, configSettings, changeSelectedLanguage }) {
  const langs = Object.keys(translations);

  if (langs.length === 0) {
    return null;
  }

  const optionEls = langs.map((l) => {
    let icon = "none";

    if (l === configSettings.selectedLanguage) {
      icon = "tick";
    }

    return <MenuItem
      key={l}
      shouldDismissPopover={false}
      icon={icon}
      text={translations[l].name}
      onClick={() => changeSelectedLanguage(l) }
    />;
  });

  let defaultIcon = "none";
  if (configSettings.selectedLanguage === "default") {
    defaultIcon = "tick";
  }

  return (
    <React.Fragment>
      <MenuItem text="Display Language" icon="translate">
        <MenuItem shouldDismissPopover={false} icon={defaultIcon} text="Spoken Language" onClick={() => changeSelectedLanguage("default") } />
        <MenuDivider />
        {optionEls }
      </MenuItem>
      <MenuDivider />
    </React.Fragment>
  );
}

LanguageOptions.propTypes = {
  ccState: PropTypes.object.isRequired,
  configSettings: PropTypes.object.isRequired,
  changeSelectedLanguage: PropTypes.func,
};

const mapStateToProps = state => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
});

const mapDispatchToProps = dispatch => ({
  changeSelectedLanguage: (language) => dispatch(actionChangeSelectedLanguage(language)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageOptions);
