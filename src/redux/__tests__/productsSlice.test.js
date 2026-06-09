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
let products
let setChannelId
let setProducts
let setSelectedProduct
let sendUseBits
let completeUseBits
let useBits
let completeBitsTransaction
let toggleActivationDrawer

beforeAll(async () => {
  vi.resetModules()
  utils = await import('@/utils')
  ;({
    default: products,
    setChannelId,
    setProducts,
    setSelectedProduct,
    sendUseBits,
    completeUseBits,
    useBits,
    completeBitsTransaction,
  } = await import('../products-slice'))
  ;({ toggleActivationDrawer } = await import('../settings-slice'))
})

const initialState = {
  channelId: null,
  processing: false,
  products: [],
  sent_sku: null,
  transaction: null,
}

const catalog = [
  { sku: 'expensive', cost: { amount: 500 } },
  { sku: 'cheap', cost: { amount: 100 } },
  { sku: 'middle', cost: { amount: 250 } },
]

describe('productsSlice', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should handle initial state', () => {
    expect(products(undefined, {})).toStrictEqual(initialState)
  })

  test('setChannelId stores the channel id', () => {
    const state = products(initialState, setChannelId('1234'))

    expect(state.channelId).toBe('1234')
  })

  test('setProducts sorts by cost and selects the cheapest product', () => {
    const state = products(initialState, setProducts(catalog))

    expect(state.products.map((p) => p.sku)).toStrictEqual([
      'cheap',
      'middle',
      'expensive',
    ])
    expect(state.selectedProduct.sku).toBe('cheap')
  })

  test('setSelectedProduct stores the selection', () => {
    const state = products(initialState, setSelectedProduct(catalog[0]))

    expect(state.selectedProduct.sku).toBe('expensive')
  })

  test('sendUseBits marks the transaction as processing', () => {
    const state = products(initialState, sendUseBits('cheap'))

    expect(state.sent_sku).toBe('cheap')
    expect(state.processing).toBe(true)
  })

  test('completeUseBits stores the transaction and clears processing', () => {
    const processingState = {
      ...initialState,
      processing: true,
      sent_sku: 'cheap',
    }
    const transaction = { transactionReceipt: 'receipt-1' }

    const state = products(processingState, completeUseBits(transaction))

    expect(state.processing).toBe(false)
    expect(state.sent_sku).toBeNull()
    expect(state.transaction).toBe(transaction)
  })

  describe('useBits', () => {
    test('dispatches sendUseBits and calls the Twitch bits API', () => {
      const twitchUseBits = vi.fn()
      vi.stubGlobal('Twitch', { ext: { bits: { useBits: twitchUseBits } } })

      const dispatch = vi.fn()
      useBits('cheap')(dispatch)

      expect(dispatch).toHaveBeenCalledWith(sendUseBits('cheap'))
      expect(twitchUseBits).toHaveBeenCalledWith('cheap')

      vi.unstubAllGlobals()
    })
  })

  describe('completeBitsTransaction', () => {
    const transaction = { transactionReceipt: 'receipt-1' }
    const getState = () => ({ productsCatalog: { channelId: '1234' } })

    afterEach(() => {
      localStorage.removeItem('transactionToken')
    })

    test('stores the receipt and processes the transaction', async () => {
      utils.apolloClient.mutate.mockResolvedValue({})

      const dispatch = vi.fn()
      await completeBitsTransaction(transaction)(dispatch, getState)

      expect(dispatch).toHaveBeenCalledWith(completeUseBits(transaction))
      expect(localStorage.getItem('transactionToken')).toBe('receipt-1')
      expect(utils.apolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({ variables: { channelId: '1234' } }),
      )
      // On success the activation drawer toggles and the translation
      // status refresh thunk is dispatched
      expect(dispatch).toHaveBeenCalledWith(toggleActivationDrawer())
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function))
    })

    test('swallows mutation errors without follow-up dispatches', async () => {
      utils.apolloClient.mutate.mockRejectedValue(new Error('network down'))

      const dispatch = vi.fn()
      await completeBitsTransaction(transaction)(dispatch, getState)

      expect(dispatch).toHaveBeenCalledWith(completeUseBits(transaction))
      expect(dispatch).not.toHaveBeenCalledWith(toggleActivationDrawer())
    })
  })
})
