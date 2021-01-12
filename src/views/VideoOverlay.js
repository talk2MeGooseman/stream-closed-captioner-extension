/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import ReactDOM from 'react-dom'
import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
// import logger from "redux-logger";
import Overlay from '../components/VideoOverlay/Overlay'
import { TwitchExtension } from '../TwitchWrapper'
import rootReducer from '../redux/reducers'
import './App.css'

const store = configureStore({
  reducer: rootReducer,
}, applyMiddleware(thunk))

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  const axe = require('react-axe')
  axe(React, ReactDOM, 1000)
}

ReactDOM.render(
  <Provider store={store}>
    <TwitchExtension>
      <Overlay />
    </TwitchExtension>
  </Provider>,
  document.getElementById('root'),
)
