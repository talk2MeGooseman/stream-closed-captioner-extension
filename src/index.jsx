import { ApolloProvider } from '@apollo/client/react'
import { configureStore } from '@reduxjs/toolkit'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { TranslationsDrawer } from '@/components/TranslationDrawer'
import Overlay from '@/components/VideoOverlay/Overlay'
import MobilePanel from '@/components/Mobile/MobilePanel'
import rootReducer from '@/redux/reducers'
import { Twitch } from '@/Twitch'
import { apolloClient } from '@/utils'
import { applyVideoPlayerBackdrop } from '@/helpers/video-helpers'
import './views/App.css'

const params = new URLSearchParams(window.location.search)

// Local-dev-only video-player backdrop behind the transparent overlay.
// import.meta.env.DEV is replaced statically at build time, so this branch —
// including the stylesheet chunk — is eliminated from production builds; the
// helper re-checks the mode at runtime as the testable second gate.
if (import.meta.env.DEV && applyVideoPlayerBackdrop()) {
  import('./views/dev-video-player-backdrop.css')
}

const store = configureStore({
  reducer: rootReducer,
})

let content
if (
  params.get('mode') === 'config' ||
  params.get('anchor') === 'video_overlay'
) {
  content = (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <Twitch>
          <TranslationsDrawer />
          <Overlay />
        </Twitch>
      </Provider>
    </ApolloProvider>
  )
} else {
  content = (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <Twitch>
          <TranslationsDrawer />
          <MobilePanel />
        </Twitch>
      </Provider>
    </ApolloProvider>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(content)
