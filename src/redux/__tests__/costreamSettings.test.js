let settings
let toggleCostreamCaptions
let toggleCostreamInTranslatedView
let initialState

describe('costream viewer settings', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    vi.resetModules()
    ;({
      default: settings,
      toggleCostreamCaptions,
      toggleCostreamInTranslatedView,
      initialState,
    } = await import('../settings-slice'))
  })

  test('guest captions are shown by default', () => {
    expect(initialState.showCostreamCaptions).toBe(true)
    expect(initialState.showCostreamInTranslatedView).toBe(true)
  })

  test('toggleCostreamCaptions flips and persists the choice', async () => {
    const state = settings(initialState, toggleCostreamCaptions())

    expect(state.showCostreamCaptions).toBe(false)

    // A fresh module load (new page load) reads the persisted preference.
    vi.resetModules()
    const reloaded = await import('../settings-slice')
    expect(reloaded.initialState.showCostreamCaptions).toBe(false)
  })

  test('toggleCostreamInTranslatedView flips and persists the choice', async () => {
    const state = settings(initialState, toggleCostreamInTranslatedView())

    expect(state.showCostreamInTranslatedView).toBe(false)

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
