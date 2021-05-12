import { ApolloProvider } from '@apollo/client/react'
import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'

import MobilePanel from '../components/Mobile/MobilePanel'
import rootReducer from '../redux/reducers'
import { withTwitchData } from '../TwitchWrapper'
import { apolloClient } from '../utils'
import './App.css'

const store = configureStore({ reducer: rootReducer }, applyMiddleware(thunk))

const Component = withTwitchData(MobilePanel, store)

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  const axe = require('react-axe')

  axe(React, ReactDOM, 1000)
}

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <Component />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
)
