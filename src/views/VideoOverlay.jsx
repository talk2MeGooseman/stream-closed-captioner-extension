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
import './App.css'

const store = configureStore(
  {
    reducer: rootReducer,
  },
  applyMiddleware(thunk),
)

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  // eslint-disable-next-line no-undef
  const axe = require('react-axe')

  axe(React, ReactDOM, 1000)
}

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
