import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { withTwitchData } from './components/shared/TwitchWrapper';
import MobilePanel from './components/Mobile/MobilePanel';
import streamCCApp from './redux/reducers';
import './App.css';

const store = createStore(streamCCApp, applyMiddleware(thunk));
const Component = withTwitchData(MobilePanel, store);

ReactDOM.render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('root'),
);
