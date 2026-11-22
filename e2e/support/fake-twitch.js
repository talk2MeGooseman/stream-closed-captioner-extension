// Fakes everything the extension talks to, so the production bundle can run in
// a plain browser: the Twitch Extension Helper script, the GraphQL HTTP
// endpoint, and the Absinthe/Phoenix websocket that streams captions.

const BACKEND = 'stream-cc.gooseman.codes'
const HELPER_URL = 'https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js'

export const CHANNEL_ID = '1234'

// Minimal window.Twitch.ext: authorizes immediately and reports the player
// controls as visible (the overlay's show/hide button only renders then).
const helperStub = `
window.Twitch = { ext: {
  onAuthorized(cb) { setTimeout(() => cb({ channelId: '${CHANNEL_ID}', clientId: 'test-client', token: 'test-token', userId: 'U1234' }), 0) },
  onContext(cb) { setTimeout(() => cb({ arePlayerControlsVisible: true, hlsLatencyBroadcaster: 0, isFullScreen: true }, ['arePlayerControlsVisible']), 0) },
  onVisibilityChanged() {},
  configuration: { onChanged(cb) { setTimeout(cb, 0) }, broadcaster: { content: '{}' }, global: { content: '{}' } },
  features: { isBitsEnabled: false, onChanged() {} },
  bits: { onTransactionComplete() {}, getProducts: () => Promise.resolve([]), setUseLoopback() {}, onTransactionCancelled() {} },
  listen() {}, unlisten() {},
  rig: { log() {} },
} }
`

const channelInfo = (overrides = {}) => ({
  data: {
    channelInfo: {
      __typename: 'ChannelInfo',
      uid: CHANNEL_ID,
      // Backend's :costream_captions feature flag for this channel.
      costreamEnabled: false,
      bitsBalance: { __typename: 'BitsBalance', balance: 0 },
      translations: {
        __typename: 'Translations',
        activated: false,
        createdAt: null,
        languages: [],
      },
      ...overrides,
    },
  },
})

/**
 * Install the fakes on a Playwright page. Returns `sendCaption`, which pushes a
 * `newTwitchCaption` event to the page the way the backend would.
 */
export async function fakeTwitch(page, { channelInfoOverrides } = {}) {
  await page.route(HELPER_URL, (route) =>
    route.fulfill({ contentType: 'application/javascript', body: helperStub }),
  )

  await page.route(`https://${BACKEND}/api`, (route) =>
    route.fulfill({
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(channelInfo(channelInfoOverrides)),
    }),
  )

  const subscriptions = []

  await page.routeWebSocket(new RegExp(`${BACKEND}/socket`), (ws) => {
    // Phoenix serializer v2: [join_ref, ref, topic, event, payload]
    ws.onMessage((raw) => {
      const [joinRef, ref, topic, event, payload] = JSON.parse(raw)
      const reply = (response, status = 'ok') =>
        ws.send(JSON.stringify([joinRef, ref, topic, 'phx_reply', { status, response }]))

      if (event === 'heartbeat' || event === 'phx_join') return reply({})

      // Absinthe subscription document: acknowledge with a subscription id.
      if (event === 'doc') {
        const subscriptionId = `__absinthe__:doc:${subscriptions.length + 1}`
        subscriptions.push({ subscriptionId, query: payload.query })
        return reply({ subscriptionId })
      }

      return reply({})
    })

    page._fakeSocket = ws
    page._fakeSubscriptions = subscriptions
  })

  return {
    /** Subscription documents the extension has opened so far. */
    subscriptionQueries: () => subscriptions.map((s) => s.query),

    async sendCaption({ interim = '', final = '' } = {}) {
      await push(page, 'newTwitchCaption', {
        __typename: 'CaptionsPayload',
        interim,
        final,
        translations: null,
      })
    },

    /** A co-streamer guest caption, as the `newCostreamCaption` subscription sends it. */
    async sendCostreamCaption({ guestId = '1', name = 'Guest', interim = '', final = '' } = {}) {
      await push(page, 'newCostreamCaption', {
        __typename: 'CostreamCaption',
        guestId,
        name,
        interim,
        final,
      })
    },
  }
}

// Push one event to the subscription for `field`, once the extension has
// subscribed to it.
async function push(page, field, data) {
  const subscription = await waitForSubscription(page, field)

  page._fakeSocket.send(
    JSON.stringify([
      null,
      null,
      subscription.subscriptionId,
      'subscription:data',
      { subscriptionId: subscription.subscriptionId, result: { data: { [field]: data } } },
    ]),
  )
}

async function waitForSubscription(page, field) {
  const deadline = Date.now() + 10_000

  while (Date.now() < deadline) {
    const found = page._fakeSubscriptions?.find((s) => s.query.includes(field))
    if (found) return found
    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  throw new Error(`The extension never subscribed to ${field}`)
}
