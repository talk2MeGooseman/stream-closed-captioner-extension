/* eslint-disable no-shadow */
import React from 'react'
import {
  Classes, Drawer,
} from '@blueprintjs/core'
import { toggleActivationDrawer } from '@/redux/settings-slice'
import { isVideoOverlay } from '@/helpers/video-helpers'
import { useShallowEqualSelector, useReduxCallbackDispatch } from '@/redux/redux-helpers'
import { TRANSLATION_COST } from '@/utils/Constants'
import { NagStreamerBody, ActivateTranslationBody } from './Body'

function TranslationsDrawer() {
  const { isDrawerOpen, isBitsEnabled } = useShallowEqualSelector((state) => state.configSettings)
  const { activationInfo } = useShallowEqualSelector((state) => state.translationInfo)
  const { products } = useShallowEqualSelector((state) => state.productsCatalog)
  const onToggleActivationDrawer = useReduxCallbackDispatch(toggleActivationDrawer())

  if (!activationInfo || products.length === 0 || !isBitsEnabled) {
    return null
  }

  const drawerWidth = isVideoOverlay() ? Drawer.SIZE_STANDARD : Drawer.SIZE_LARGE

  let drawerBody = <ActivateTranslationBody />

  if (activationInfo.balance >= TRANSLATION_COST || activationInfo.activated) {
    drawerBody = <NagStreamerBody />
  }

  return (
    <Drawer
      position="left"
      title="Turn on Translations!"
      canOutsideClickClose={true}
      isOpen={isDrawerOpen}
      onClose={onToggleActivationDrawer}
      size={drawerWidth}>
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          {drawerBody}
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER} />
    </Drawer>
  )
}

export default TranslationsDrawer
