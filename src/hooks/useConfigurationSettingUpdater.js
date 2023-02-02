import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { updateBroadcasterSettings } from '@/redux/settings-slice'

export function useConfigurationSettingUpdater(twitch, setReady) {
  const dispatch = useDispatch()

  const onUpdateBroadcasterSettings = useCallback(
    (settings) => dispatch(updateBroadcasterSettings(settings)),
    [dispatch],
  )

  return useCallback(() => {
    let config = twitch?.configuration?.broadcaster?.content ?? ''

    try {
      config = JSON.parse(config)
    } catch (e) {
      config = {}
    }

    onUpdateBroadcasterSettings({
      ...config,
      isBitsEnabled: twitch.features.isBitsEnabled,
    })

    setReady(true)
  }, [onUpdateBroadcasterSettings, setReady, twitch])
}
