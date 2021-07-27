import { useState, useEffect } from 'react'

export const useTwitchVisibility = () => {
  const [isVisible, setIsVisible] = useState(false)

  const twitchContext = window.Twitch?.ext

  useEffect(() => {
    if (twitchContext) {
      twitchContext.onVisibilityChanged((visibility, _context) => {
        console.log(`Twitch visibility changed to ${visibility}`)
        setIsVisible(visibility)
      })
    }
  }, [twitchContext])

  return isVisible
}
