import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faMinus } from "@fortawesome/free-solid-svg-icons";
import { MenuDivider, MenuItem } from "@blueprintjs/core";
import { isVideoOverlay } from "../../../helpers/video-helpers";
import { actionToggleBoxSize } from "../../../redux/config-settings-action-reducer";

function BoxSizeButton({ toggleBoxSize, configSettings: { ccBoxSize } }) {
  if (!isVideoOverlay()) {
    return null;
  }

  let text = "Enable Square Text Box";
  let icon = faExpand;

  if (ccBoxSize) {
    text = "Enable Horizontal Text Box";
    icon = faMinus;
  }

  return (<React.Fragment>
    <MenuDivider />
    <MenuItem onClick={toggleBoxSize} icon={<FontAwesomeIcon icon={icon} size="lg" />} text={text} />
  </React.Fragment>);
}

BoxSizeButton.propTypes = {
  toggleBoxSize: PropTypes.func,
  configSettings: PropTypes.object,
};

const mapStateToProps = state => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
});

const mapDispatchToProps = dispatch => ({
  toggleBoxSize: () => dispatch(actionToggleBoxSize()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BoxSizeButton);
