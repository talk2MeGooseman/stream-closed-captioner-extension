import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import {
  MenuItem,
} from "@blueprintjs/core";
import { actionChangeTextSize } from "../../../redux/config-settings-action-reducer";

function FontSizeOptions({ onChangeTextSize }) {
  return (
    <React.Fragment>
      <MenuItem
        icon={<FontAwesomeIcon icon={faFont} />}
        text="Small Text"
        onClick={() => {
          onChangeTextSize("small");
        }}
      />
      <MenuItem
        icon={<FontAwesomeIcon icon={faFont} />}
        text="Medium Text"
        onClick={() => {
          onChangeTextSize("medium");
        }}
      />
      <MenuItem
        icon={<FontAwesomeIcon icon={faFont} />}
        text="Large Text"
        onClick={() => {
          onChangeTextSize("large");
        }}
      />
    </React.Fragment>
  );
}

FontSizeOptions.propTypes = {
  onChangeTextSize: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onChangeTextSize: size => dispatch(actionChangeTextSize(size)),
});

export default connect(null, mapDispatchToProps)(FontSizeOptions);
