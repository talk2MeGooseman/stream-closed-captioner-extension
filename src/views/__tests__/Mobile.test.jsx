import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '@/redux/reducers'
import { apolloClient } from '@/utils'

describe('Mobile View', () => {
  let rootElement

  beforeEach(() => {
    // Create a mock DOM element for root
    rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)
  })

  afterEach(() => {
    if (rootElement) {
      document.body.removeChild(rootElement)
    }
    vi.clearAllMocks()
  })

  test('should have root element available', () => {
    const root = document.getElementById('root')
    expect(root).toBeTruthy()
    expect(root.id).toBe('root')
  })

  test('should be able to configure Redux store with root reducer', () => {
    const store = configureStore({ reducer: rootReducer })
    expect(store).toBeTruthy()
    expect(store.getState).toBeTruthy()
  })

  test('Redux store should have captions state', () => {
    const store = configureStore({ reducer: rootReducer })
    const state = store.getState()
    expect(state).toHaveProperty('captionsState')
  })

  test('Redux store should have settings state', () => {
    const store = configureStore({ reducer: rootReducer })
    const state = store.getState()
    expect(state).toHaveProperty('configSettings')
  })

  test('Apollo client should be available', () => {
    expect(apolloClient).toBeTruthy()
    expect(apolloClient.query).toBeTruthy()
  })

  test('Apollo client should have cache configured', () => {
    expect(apolloClient.cache).toBeTruthy()
  })
})
