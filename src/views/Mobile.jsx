import { ApolloProvider } from '@apollo/client/react'
import { configureStore } from '@reduxjs/toolkit'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { TranslationsDrawer } from '@/components/TranslationDrawer'
import MobilePanel from '../components/Mobile/MobilePanel'
import rootReducer from '../redux/reducers'
import { apolloClient } from '../utils'
import { Twitch } from '../Twitch'

import './App.css'

const store = configureStore({ reducer: rootReducer })

const root = createRoot(document.getElementById('root'))
root.render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <Twitch>
        <TranslationsDrawer />
        <MobilePanel />
      </Twitch>
    </Provider>
  </ApolloProvider>,
)
