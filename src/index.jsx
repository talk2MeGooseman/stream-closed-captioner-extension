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
import './views/App.css'

const params = new URLSearchParams(window.location.search)

const store = configureStore({
  reducer: rootReducer,
})

let content
if (params.get('mode') === 'config' || params.get('anchor') === 'video_overlay') {
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
