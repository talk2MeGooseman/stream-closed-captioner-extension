import { ApolloProvider } from '@apollo/client/react'
import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'

// import logger from "redux-logger";

import { TranslationsDrawer } from '@/components/TranslationDrawer'
import Overlay from '@/components/VideoOverlay/Overlay'
import rootReducer from '@/redux/reducers'
import { Twitch } from '@/Twitch'
import { apolloClient } from '@/utils'
import './views/App.css'

const params = new URLSearchParams(window.location.search)

const store = configureStore(
  {
    reducer: rootReducer,
  },
  applyMiddleware(thunk),
)

if (params.get('mode') === 'config') {
  ReactDOM.render(
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <Twitch>
          <TranslationsDrawer />
          <Overlay />
        </Twitch>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  )
} else if (params.get('anchor') === 'panel') {
  ReactDOM.render(
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <Twitch>
          <TranslationsDrawer />
          <MobilePanel />
        </Twitch>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  )
} else if (params.get('anchor') === 'video_overlay') {
  ReactDOM.render(
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <Twitch>
          <TranslationsDrawer />
          <Overlay />
        </Twitch>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  )
} else {
  ReactDOM.render(
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <Twitch>
          <TranslationsDrawer />
          <MobilePanel />
        </Twitch>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  )
}
