import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Classes, Drawer,
} from '@blueprintjs/core';
import { actionToggleActivationDrawer } from '../../redux/config-settings-action-reducer';
import { isVideoOverlay } from '../../helpers/video-helpers';
import ActivateTranslationBody from './Drawer/ActivateTranslationBody';
import NagStreamerBody from './Drawer/NagStreamerBody';

function BitsDrawer({
  configSettings: { isDrawerOpen, activationInfo },
  productsCatalog,
  toggleActivationDrawer,
}) {
  if (!activationInfo || !productsCatalog.products.length) {
    return null;
  }

  const drawerWidth = isVideoOverlay() ? Drawer.SIZE_STANDARD : Drawer.SIZE_LARGE;

  let drawerBody = <ActivateTranslationBody />;

  if (activationInfo.balance >= 100 || activationInfo.activated) {
    drawerBody = <NagStreamerBody />;
  }

  return (
    <Drawer
      position="left"
      title="Turn on Translations!"
      canOutsideClickClose={true}
      isOpen={isDrawerOpen}
      onClose={toggleActivationDrawer}
      size={drawerWidth}>
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          {drawerBody}
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER} />
    </Drawer>
  );
}

BitsDrawer.propTypes = {
  configSettings: PropTypes.object.isRequired,
  productsCatalog: PropTypes.shape({
    products: PropTypes.array,
  }),
  toggleActivationDrawer: PropTypes.func,
};

const mapStateToProps = state => ({
  configSettings: state.configSettings,
  productsCatalog: state.productsCatalog,
});

const mapDispatchToProps = dispatch => ({
  toggleActivationDrawer: () => dispatch(actionToggleActivationDrawer()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BitsDrawer);
