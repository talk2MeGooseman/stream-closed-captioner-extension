/* eslint-disable import/no-extraneous-dependencies */
import { expect, afterEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'

import rootReducer from '@/redux/reducers'

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})

const renderWithRedux = (
  ui,
  { initialState, store = configureStore({ reducer: rootReducer, preloadedState: initialState }) } = {},
) => ({
  ...render(<Provider store={store}>{ui}</Provider>),
  store,
})

export { renderWithRedux, render }
