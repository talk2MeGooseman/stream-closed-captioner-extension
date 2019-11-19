/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { withTwitchData } from './components/shared/TwitchWrapper';
import MobilePanel from './components/Mobile/MobilePanel';
import rootReducer from './redux/reducers';
import './App.css';

const store = configureStore({ reducer: rootReducer }, applyMiddleware(thunk));
const Component = withTwitchData(MobilePanel, store);

ReactDOM.render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('root'),
);
