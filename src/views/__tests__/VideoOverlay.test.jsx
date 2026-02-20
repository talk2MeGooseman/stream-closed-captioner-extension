import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '@/redux/reducers'
import { apolloClient } from '@/utils'

describe('VideoOverlay View', () => {
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

  test('should be able to configure Redux store for overlay', () => {
    const store = configureStore({ reducer: rootReducer })
    expect(store).toBeTruthy()
    expect(store.dispatch).toBeTruthy()
  })

  test('Redux store should have video player context state', () => {
    const store = configureStore({ reducer: rootReducer })
    const state = store.getState()
    expect(state).toHaveProperty('videoPlayerContext')
  })

  test('Redux store should have captions state for overlay', () => {
    const store = configureStore({ reducer: rootReducer })
    const state = store.getState()
    expect(state).toHaveProperty('captionsState')
  })

  test('Redux store should have translation state', () => {
    const store = configureStore({ reducer: rootReducer })
    const state = store.getState()
    expect(state).toHaveProperty('translationInfo')
  })

  test('Apollo client should be configured for overlay', () => {
    expect(apolloClient).toBeTruthy()
    expect(apolloClient.link).toBeTruthy()
  })

  test('Apollo cache should exist', () => {
    expect(apolloClient.cache).toBeTruthy()
  })
})
