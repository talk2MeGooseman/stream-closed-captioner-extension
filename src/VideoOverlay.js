/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
// import logger from "redux-logger";
import Overlay from './components/VideoOverlay/Overlay';
import { withTwitchData } from './components/shared/TwitchWrapper';
import rootReducer from './redux/reducers';
import './App.css';

const store = configureStore({
  reducer: rootReducer,
}, applyMiddleware(thunk));
const Component = withTwitchData(Overlay, store);

ReactDOM.render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('root'),
);
