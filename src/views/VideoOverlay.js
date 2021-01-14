import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'

// import logger from "redux-logger";
import Overlay from '../components/VideoOverlay/Overlay'
import rootReducer from '../redux/reducers'
import { TwitchExtension } from '../TwitchWrapper'
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
