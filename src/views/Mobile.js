/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import ReactDOM from 'react-dom'
import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { TwitchExtension } from '../TwitchWrapper'
import MobilePanel from '../components/Mobile/MobilePanel'
import rootReducer from '../redux/reducers'
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
