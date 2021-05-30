import { ApolloProvider } from '@apollo/client/react'
import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'

import MobilePanel from '../components/Mobile/MobilePanel'
import rootReducer from '../redux/reducers'
import { apolloClient } from '../utils'
import { TwitchHOC } from '../TwitchHOC'

import './App.css'

const store = configureStore({ reducer: rootReducer }, applyMiddleware(thunk))

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  const axe = require('react-axe')

  axe(React, ReactDOM, 1000)
}

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <TwitchHOC>
        <MobilePanel />
      </TwitchHOC>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
)
