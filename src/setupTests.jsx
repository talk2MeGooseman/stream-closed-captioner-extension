/* eslint-disable import/no-extraneous-dependencies */
import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from '@/redux/reducers'

const renderWithRedux = (
  ui,
  { initialState, store = createStore(rootReducer, initialState) } = {},
) => ({
  ...render(<Provider store={store}>{ui}</Provider>),
  store,
})

export { renderWithRedux, render }
