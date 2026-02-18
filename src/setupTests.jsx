/* eslint-disable import/no-extraneous-dependencies */
import { expect, afterEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import '@testing-library/jest-dom'

import rootReducer from '@/redux/reducers'

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})

const renderWithRedux = (
  ui,
  { initialState, store = createStore(rootReducer, initialState) } = {},
) => ({
  ...render(<Provider store={store}>{ui}</Provider>),
  store,
})

export { renderWithRedux, render }
