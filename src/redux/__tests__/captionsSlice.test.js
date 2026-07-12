import { configureStore } from '@reduxjs/toolkit'

import { TEXT_QUEUE_SIZE } from '@/utils/Constants'

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
let captions
let updateCCText
let setCaptionsSubscription
let stopCaptionsSubscription
let subscribeToCaptions

beforeAll(async () => {
  vi.resetModules()
  utils = await import('@/utils')
  ;({
    default: captions,
    updateCCText,
    setCaptionsSubscription,
    stopCaptionsSubscription,
    subscribeToCaptions,
  } = await import('../captions-slice'))
})

const initialState = {
  finalTextQueue: [],
  interimText: '',
  costreamInterim: {},
  translations: {},
  captionsSubscription: null,
}

describe('captionsSlice', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should handle initial state', () => {
    expect(captions(undefined, {})).toStrictEqual(initialState)
  })

  describe('updateCCText', () => {
    test('sets the interim text', () => {
      const state = captions(
        initialState,
        updateCCText({ interim: 'hello wor', final: '' }),
      )

      expect(state.interimText).toBe('hello wor')
    })

    test('appends new final text to the queue with a unique id', () => {
      const state = captions(
        initialState,
        updateCCText({ interim: '', final: 'hello world' }),
      )

      expect(state.finalTextQueue).toHaveLength(1)
      expect(state.finalTextQueue[0].text).toBe('hello world')
      expect(state.finalTextQueue[0].id).toBeTruthy()
    })

    test('does not append a duplicate of the last final text', () => {
      let state = captions(
        initialState,
        updateCCText({ interim: '', final: 'hello world' }),
      )
      state = captions(
        state,
        updateCCText({ interim: '', final: 'hello world' }),
      )

      expect(state.finalTextQueue).toHaveLength(1)
    })

    test('caps the final text queue at TEXT_QUEUE_SIZE', () => {
      let state = initialState

      for (let i = 0; i <= TEXT_QUEUE_SIZE + 5; i += 1) {
        state = captions(
          state,
          updateCCText({ interim: '', final: `text ${i}` }),
        )
      }

      expect(state.finalTextQueue).toHaveLength(TEXT_QUEUE_SIZE)
      // Oldest entries were shifted off the front of the queue
      expect(state.finalTextQueue[0].text).toBe('text 6')
      expect(state.finalTextQueue[TEXT_QUEUE_SIZE - 1].text).toBe(
        `text ${TEXT_QUEUE_SIZE + 5}`,
      )
    })

    test('adds translations for each language in the payload', () => {
      const state = captions(
        initialState,
        updateCCText({
          interim: '',
          final: 'hello',
          translations: {
            es: { name: 'Spanish', text: 'hola' },
            fr: { name: 'French', text: 'bonjour' },
          },
        }),
      )

      expect(state.translations.es.name).toBe('Spanish')
      expect(state.translations.es.textQueue).toHaveLength(1)
      expect(state.translations.es.textQueue[0].text).toBe('hola')
      expect(state.translations.fr.textQueue[0].text).toBe('bonjour')
    })

    test('does not append a duplicate of the last translation text', () => {
      let state = captions(
        initialState,
        updateCCText({
          interim: '',
          final: 'hello',
          translations: { es: { name: 'Spanish', text: 'hola' } },
        }),
      )
      state = captions(
        state,
        updateCCText({
          interim: '',
          final: 'hello again',
          translations: { es: { name: 'Spanish', text: 'hola' } },
        }),
      )

      expect(state.translations.es.textQueue).toHaveLength(1)
    })

    test('caps each translation queue at TEXT_QUEUE_SIZE', () => {
      let state = initialState

      for (let i = 0; i <= TEXT_QUEUE_SIZE + 5; i += 1) {
        state = captions(
          state,
          updateCCText({
            interim: '',
            final: `text ${i}`,
            translations: { es: { name: 'Spanish', text: `texto ${i}` } },
          }),
        )
      }

      expect(state.translations.es.textQueue).toHaveLength(TEXT_QUEUE_SIZE)
      expect(state.translations.es.textQueue[0].text).toBe('texto 6')
    })
  })

  describe('setCaptionsSubscription', () => {
    test('stores the subscription', () => {
      const subscription = { unsubscribe: () => {} }
      const state = captions(
        initialState,
        setCaptionsSubscription({ subscription }),
      )

      expect(state.captionsSubscription).toBe(subscription)
    })
  })

  describe('stopCaptionsSubscription', () => {
    const populatedState = {
      ...initialState,
      finalTextQueue: [{ id: '1', text: 'hello' }],
      translations: { es: { name: 'Spanish', textQueue: [] } },
    }

    test('disconnects the socket and clears captions when connected', () => {
      utils.isPhoenixSocketConnected.mockReturnValue(true)

      const state = captions(populatedState, stopCaptionsSubscription())

      expect(utils.disconnectPhoenixSocket).toHaveBeenCalled()
      expect(state.finalTextQueue).toStrictEqual([])
      expect(state.translations).toStrictEqual({})
    })

    test('leaves state untouched when the socket is not connected', () => {
      utils.isPhoenixSocketConnected.mockReturnValue(false)

      const state = captions(populatedState, stopCaptionsSubscription())

      expect(utils.disconnectPhoenixSocket).not.toHaveBeenCalled()
      expect(state.finalTextQueue).toHaveLength(1)
      expect(state.translations.es).toBeTruthy()
    })
  })

  describe('subscribeToCaptions', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    test('connects the socket and dispatches captions delayed by HLS latency', () => {
      let observer
      utils.apolloClient.subscribe.mockReturnValue({
        subscribe: (subscriber) => {
          observer = subscriber
          return { unsubscribe: vi.fn() }
        },
      })

      const store = configureStore({
        reducer: { videoPlayerContext: () => ({ hlsLatencyBroadcaster: 2 }) },
      })
      const dispatch = vi.fn()

      subscribeToCaptions('channel-123')(dispatch, store.getState)

      expect(utils.connectPhoenixSocket).toHaveBeenCalled()
      expect(utils.apolloClient.subscribe).toHaveBeenCalledWith(
        expect.objectContaining({ variables: { channelId: 'channel-123' } }),
      )

      observer.next({
        data: { newTwitchCaption: { interim: 'hi', final: '' } },
      })

      expect(dispatch).not.toHaveBeenCalled()

      vi.advanceTimersByTime(2000)

      expect(dispatch).toHaveBeenCalledWith(
        updateCCText({ interim: 'hi', final: '' }),
      )
    })
  })
})
