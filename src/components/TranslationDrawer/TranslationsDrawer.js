import {
  Classes, Drawer,
} from '@blueprintjs/core'
import React from 'react'

import { NagStreamerBody, ActivateTranslationBody } from './Body'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useShallowEqualSelector, useReduxCallbackDispatch } from '@/redux/redux-helpers'

import { toggleActivationDrawer } from '@/redux/settings-slice'

import { TRANSLATION_COST } from '@/utils/Constants'

// eslint-disable-next-line complexity
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
      canOutsideClickClose
      isOpen={isDrawerOpen}
      onClose={onToggleActivationDrawer}
      position="left"
      size={drawerWidth}
      title="Turn on Translations!">
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
