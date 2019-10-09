import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import {
  MenuItem,
} from "@blueprintjs/core";
import { increaseLineCount, decreaseLineCount } from "../../../redux/config-settings-action-reducer";

function LineCountOptions({ increaseLineCount, decreaseLineCount }) {
  return (
    <React.Fragment>
      <MenuItem text="Line Count" shouldDismissPopover={false} >
        <MenuItem
          icon={<FontAwesomeIcon icon={faPlus} shouldDismissPopover={false} />}
          text="Increase Line Count"
          onClick={increaseLineCount}
        />
        <MenuItem
          icon={<FontAwesomeIcon icon={faMinus} shouldDismissPopover={false} />}
          text="Decrease Line Count"
          onClick={decreaseLineCount}
        />
      </MenuItem>
    </React.Fragment>
  );
}

LineCountOptions.propTypes = {
  increaseLineCount: PropTypes.func.isRequired,
  decreaseLineCount: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  increaseLineCount,
  decreaseLineCount,
};

export default connect(null, mapDispatchToProps)(LineCountOptions);
