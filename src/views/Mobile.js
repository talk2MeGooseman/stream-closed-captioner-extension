import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'

import MobilePanel from '../components/Mobile/MobilePanel'
import rootReducer from '../redux/reducers'
import { TwitchExtension } from '../TwitchWrapper'
import './App.css'

const store = configureStore({ reducer: rootReducer }, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <TwitchExtension>
      <MobilePanel />
    </TwitchExtension>
  </Provider>,
  document.getElementById('root'),
)
