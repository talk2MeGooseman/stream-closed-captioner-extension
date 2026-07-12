import { configureStore } from '@reduxjs/toolkit'

let settings
let toggleCostreamCaptions
let toggleCostreamInTranslatedView
let toggleCostreamCaptionsAndPersist
let toggleCostreamInTranslatedViewAndPersist
let initialState

function buildStore() {
  return configureStore({ reducer: { configSettings: settings } })
}

describe('costream viewer settings', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    vi.resetModules()
    ;({
      default: settings,
      toggleCostreamCaptions,
      toggleCostreamInTranslatedView,
      toggleCostreamCaptionsAndPersist,
      toggleCostreamInTranslatedViewAndPersist,
      initialState,
    } = await import('../settings-slice'))
  })

  test('guest captions are shown by default', () => {
    expect(initialState.showCostreamCaptions).toBe(true)
    expect(initialState.showCostreamInTranslatedView).toBe(true)
  })

  test('the reducers are pure toggles (no persistence)', () => {
    const state = settings(initialState, toggleCostreamCaptions())
    expect(state.showCostreamCaptions).toBe(false)

    const translated = settings(initialState, toggleCostreamInTranslatedView())
    expect(translated.showCostreamInTranslatedView).toBe(false)

    expect(window.localStorage.getItem('viewerPrefs')).toBeNull()
  })

  test('the persist thunk flips and persists across a reload', async () => {
    const store = buildStore()
    store.dispatch(toggleCostreamCaptionsAndPersist())

    expect(store.getState().configSettings.showCostreamCaptions).toBe(false)

    // A fresh module load (new page load) reads the persisted preference.
    vi.resetModules()
    const reloaded = await import('../settings-slice')
    expect(reloaded.initialState.showCostreamCaptions).toBe(false)
  })

  test('the translated-view thunk flips and persists across a reload', async () => {
    const store = buildStore()
    store.dispatch(toggleCostreamInTranslatedViewAndPersist())

    expect(store.getState().configSettings.showCostreamInTranslatedView).toBe(
      false,
    )

    vi.resetModules()
    const reloaded = await import('../settings-slice')
    expect(reloaded.initialState.showCostreamInTranslatedView).toBe(false)
  })

  test('survives an unreadable localStorage payload', async () => {
    window.localStorage.setItem('viewerPrefs', 'not json')

    vi.resetModules()
    const reloaded = await import('../settings-slice')
    expect(reloaded.initialState.showCostreamCaptions).toBe(true)
  })
})
