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
let captions
let updateCCText
let updateCostreamText

beforeAll(async () => {
  vi.resetModules()
  ;({
    default: captions,
    updateCCText,
    updateCostreamText,
  } = await import('../captions-slice'))
})

const initialState = {
  finalTextQueue: [],
  interimText: '',
  costreamInterim: {},
  translations: {},
  captionsSubscription: null,
}

describe('updateCostreamText', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('tracks per-guest interim text', () => {
    const state = captions(
      initialState,
      updateCostreamText({
        guestId: '1',
        name: 'Alice',
        interim: 'hello wor',
        final: '',
      }),
    )

    expect(state.costreamInterim).toStrictEqual({
      1: { name: 'Alice', text: 'hello wor' },
    })
    expect(state.finalTextQueue).toStrictEqual([])
    // Host interim untouched
    expect(state.interimText).toBe('')
  })

  test('clears a guest interim when their final arrives', () => {
    let state = captions(
      initialState,
      updateCostreamText({
        guestId: '1',
        name: 'Alice',
        interim: 'hello wor',
        final: '',
      }),
    )

    state = captions(
      state,
      updateCostreamText({
        guestId: '1',
        name: 'Alice',
        interim: '',
        final: 'hello world',
      }),
    )

    expect(state.costreamInterim).toStrictEqual({})
    expect(state.finalTextQueue).toHaveLength(1)
    expect(state.finalTextQueue[0]).toMatchObject({
      guestId: '1',
      name: 'Alice',
      text: 'hello world',
    })
  })

  test('keeps separate interims for concurrent guests', () => {
    let state = captions(
      initialState,
      updateCostreamText({
        guestId: '1',
        name: 'Alice',
        interim: 'one',
        final: '',
      }),
    )
    state = captions(
      state,
      updateCostreamText({
        guestId: '2',
        name: 'Bob',
        interim: 'two',
        final: '',
      }),
    )

    expect(state.costreamInterim).toStrictEqual({
      1: { name: 'Alice', text: 'one' },
      2: { name: 'Bob', text: 'two' },
    })
  })

  test('dedupes repeated finals per guest', () => {
    const payload = {
      guestId: '1',
      name: 'Alice',
      interim: '',
      final: 'same thing',
    }

    let state = captions(initialState, updateCostreamText(payload))
    state = captions(state, updateCostreamText(payload))

    expect(state.finalTextQueue).toHaveLength(1)
  })

  test('a guest line in between does not defeat host dedupe (and vice versa)', () => {
    let state = captions(
      initialState,
      updateCCText({ interim: '', final: 'host says hi' }),
    )
    state = captions(
      state,
      updateCostreamText({
        guestId: '1',
        name: 'Alice',
        interim: '',
        final: 'guest line',
      }),
    )
    // Same host final again (e.g. duplicate frame) — must not re-append
    state = captions(
      state,
      updateCCText({ interim: '', final: 'host says hi' }),
    )

    const texts = state.finalTextQueue.map(({ text }) => text)
    expect(texts).toStrictEqual(['host says hi', 'guest line'])
  })

  test('host and guest finals interleave chronologically', () => {
    let state = captions(
      initialState,
      updateCCText({ interim: '', final: 'first host' }),
    )
    state = captions(
      state,
      updateCostreamText({
        guestId: '1',
        name: 'Alice',
        interim: '',
        final: 'then guest',
      }),
    )
    state = captions(state, updateCCText({ interim: '', final: 'host again' }))

    expect(state.finalTextQueue.map(({ text }) => text)).toStrictEqual([
      'first host',
      'then guest',
      'host again',
    ])
  })

  test('caps the shared queue at TEXT_QUEUE_SIZE', () => {
    let state = initialState

    for (let i = 0; i < TEXT_QUEUE_SIZE + 5; i++) {
      state = captions(
        state,
        updateCostreamText({
          guestId: '1',
          name: 'Alice',
          interim: '',
          final: `line ${i}`,
        }),
      )
    }

    expect(state.finalTextQueue).toHaveLength(TEXT_QUEUE_SIZE)
    expect(state.finalTextQueue[0].text).toBe('line 5')
  })
})
