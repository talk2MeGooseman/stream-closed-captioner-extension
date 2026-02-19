import { ApolloProvider } from '@apollo/client/react'
import { configureStore } from '@reduxjs/toolkit'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { TranslationsDrawer } from '@/components/TranslationDrawer'
import Overlay from '@/components/VideoOverlay/Overlay'
import rootReducer from '@/redux/reducers'
import { Twitch } from '@/Twitch'
import { apolloClient } from '@/utils'
import './App.css'

const store = configureStore({
  reducer: rootReducer,
})

const root = createRoot(document.getElementById('root'))
root.render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <Twitch>
        <TranslationsDrawer />
        <Overlay />
      </Twitch>
    </Provider>
  </ApolloProvider>,
)
