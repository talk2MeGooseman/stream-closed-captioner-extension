import { Tooltip } from '@blueprintjs/core'

import {
  useReduxCallbackDispatch,
  useShallowEqualSelector,
} from '../../redux/redux-helpers'

import { TranslationDialogButton } from './translation-dialog-button'

import {
  hasCaptionsSelector,
  hasCaptionsTranslationsSelector,
  isBitsEnabledSelector,
} from '@/redux/selectors'

import { toggleActivationDrawer } from '@/redux/settings-slice'

export default function LanguageButton() {
  const isBitsEnabled = useShallowEqualSelector(isBitsEnabledSelector)
  const hasTranslations = useShallowEqualSelector(
    hasCaptionsTranslationsSelector,
  )

  const hasCaptions = useShallowEqualSelector(hasCaptionsSelector)

  const toggleDrawer = useReduxCallbackDispatch(toggleActivationDrawer())

  const notTranslatable = !isBitsEnabled && !hasTranslations

  if (notTranslatable || !hasCaptions) {
    return null
  }
  // Display activate dialog/text
  return (
    <Tooltip content="Translations">
      <TranslationDialogButton
        hasTranslations={hasTranslations}
        onClick={toggleDrawer}
      />
    </Tooltip>
  )
}
