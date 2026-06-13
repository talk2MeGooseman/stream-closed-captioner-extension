vi.mock('@/utils', () => ({
  apolloClient: {
    subscribe: vi.fn(),
    query: vi.fn(),
    mutate: vi.fn(),
  },
  connectPhoenixSocket: vi.fn(),
  isPhoenixSocketConnected: vi.fn(),
  disconnectPhoenixSocket: vi.fn(),
}))

// The setup file loads the root reducer (and the real @/utils) before this
// test runs, so re-import the slice after resetting the module registry to
// make it pick up the mocked @/utils.
let utils
let translation
let requestingTranslationStatus
let doneRequestingTranslationStatus
let requestTranslationStatus

beforeAll(async () => {
  vi.resetModules()
  utils = await import('@/utils')
  ;({
    default: translation,
    requestingTranslationStatus,
    doneRequestingTranslationStatus,
    requestTranslationStatus,
  } = await import('../translation-slice'))
})

const initialState = {
  activationInfo: null,
  loading: false,
}

describe('translationSlice', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should handle initial state', () => {
    expect(translation(undefined, {})).toStrictEqual(initialState)
  })

  test('requestingTranslationStatus sets loading', () => {
    const state = translation(initialState, requestingTranslationStatus())

    expect(state.loading).toBe(true)
  })

  test('doneRequestingTranslationStatus stores the result and clears loading', () => {
    const activationInfo = { activated: true, balance: 100 }
    const state = translation(
      { ...initialState, loading: true },
      doneRequestingTranslationStatus(activationInfo),
    )

    expect(state.loading).toBe(false)
    expect(state.activationInfo).toBe(activationInfo)
  })

  describe('requestTranslationStatus', () => {
    test('queries channel info and dispatches the converted result', async () => {
      utils.apolloClient.query.mockResolvedValue({
        data: {
          channelInfo: {
            bitsBalance: { balance: 300 },
            translations: {
              activated: true,
              createdAt: '2026-01-01',
              languages: ['es', 'fr'],
            },
          },
        },
      })

      const dispatch = vi.fn()
      await requestTranslationStatus('1234')(dispatch)

      expect(dispatch).toHaveBeenCalledWith(requestingTranslationStatus())
      expect(utils.apolloClient.query).toHaveBeenCalledWith(
        expect.objectContaining({ variables: { id: '1234' } }),
      )
      expect(dispatch).toHaveBeenCalledWith(
        doneRequestingTranslationStatus({
          activated: true,
          balance: 300,
          created_at: '2026-01-01',
          languages: ['es', 'fr'],
        }),
      )
    })
  })
})
