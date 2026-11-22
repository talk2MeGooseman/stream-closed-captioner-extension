# React Twitch Extension for Stream Closed Captoiner

This React app that displays Closed Captions for viewers on Twitch. It depends on Closed Captions being publish from the companion website https://stream-cc.gooseman.codes

## Requirements

There is only one requirement to use this example.

* Node.JS LTS or greater.

You may also find that using `yarn` is easier than `npm`, so we do recommend installing that as well by running:
```
npm i -g yarn
```
in an elevated command line interface.

## First time Usage

To use this, simply clone the repository into the folder of your choice.

Next, do the following:

1. Change directories into the cloned folder.
2. Run `yarn install` to install all prerequisite packages needed to run the template.
3. Run `yarn cert` to generate the needed certificates. This allows the server to be run over HTTPS vs. HTTP.
4. Run `yarn start` to run the sample.

## Usage

To build your finalized React JS files, simply run `yarn build` to produce the production bundles with Vite.

## End-to-end tests

Playwright smoke tests run the **production build** in Chromium with the Twitch
Extension Helper and the Phoenix backend faked, so they need no network access
and no Twitch account (`e2e/support/fake-twitch.js` fakes the helper script, the
GraphQL endpoint, and the Absinthe websocket that streams captions). They cover
the overlay and mobile views: loading without console errors, captions staying
hidden until the viewer turns them on, and interim/final captions rendering.

```
yarn build
yarn playwright install chromium   # first time only
yarn test:e2e
```

Set `PLAYWRIGHT_CHROMIUM_PATH` to use a Chromium you already have. CI runs the
suite on every pull request and uploads the Playwright report when it fails.
To cover a new flow, push events from the test with the helper returned by
`fakeTwitch(page)` (see `e2e/overlay.spec.js`).

## Releasing to Twitch

Twitch hosts the extension's files on its CDN, so every release is a ZIP of the
production build uploaded to the [Extensions Manager](https://dev.twitch.tv/console/extensions)
in the Twitch developer console. These rules come from Twitch's
[guidelines and policies](https://dev.twitch.tv/docs/extensions/guidelines-and-policies),
[life cycle](https://dev.twitch.tv/docs/extensions/life-cycle) and
[submission best practices](https://dev.twitch.tv/docs/extensions/submission-best-practices)
pages; re-check them if Twitch rejects a submission, since they change.

### 1. Get a build

Every push to `main` runs the **pre-release** workflow, which lints, tests,
builds, checks the bundle, and publishes the **Development Build** release with
two files:

- `release.zip`: the version assets to upload to Twitch.
- `source.zip`: the readable source for Twitch's reviewers.

Its release notes list every pull request merged since the latest full (not
pre-release) release, with Dependabot bumps grouped at the bottom (grouping is
set in `.github/release.yml`). Use them as the starting point for the Twitch
change log and the next release's notes. Label a PR `dependencies` to move it
into that group. When you cut a full release (for example `v1.7.0`), the next
Development Build starts counting from it.

To build locally instead, run `yarn build && yarn check:bundle`, then zip the
**contents** of `dist/` so `index.html` sits at the root of the ZIP (not inside a
`dist/` folder).

`yarn check:bundle` (also run in CI) fails on anything Twitch would reject: inline
scripts, `eval()`, `<iframe>`, scripts loaded from outside the bundle (only the
Twitch Extension Helper is allowed), inlined base64 fonts, remote fonts other than
Google Fonts, and file types that aren't assets.

### 2. Create the new version

1. In the Extensions Manager, open the extension and create a new version
   (bump the version number).
2. **Asset Hosting** tab: upload `release.zip`, then make sure each path field
   points at a file in the ZIP. Keep the extension type and the values your
   previous version used; the entry files are:

   | Entry file | Typical use |
   | --- | --- |
   | `video_overlay.html` | Video overlay / fullscreen view |
   | `mobile.html` | Mobile view |
   | `index.html` | Default viewer page |
   | `config.html` | Config path |
   | `live_config.html` | Live config path |

3. **Capabilities** tab: the **Allowlist for URL Fetching Domains** must cover the
   backend (`stream-cc.gooseman.codes`, HTTPS and WSS). Twitch only allows
   connections to domains on this list, and each entry must be specific. Add a
   domain here before shipping code that talks to a new host.
4. **Version Details**: fill in the required name, summary, description, images,
   and the EULA and privacy policy URLs. Update screenshots if the UI changed.

### 3. Hosted Test

Move the version to **Hosted Test** and install it on your own channel to check
the overlay, mobile view, panel and config pages against the hosted CSP. Anything
that only fails here (blocked scripts, fonts, or connections) shows up in the
browser console.

Co-streamer guest captions only appear for channels that have the
`costream_captions` feature flag turned on in the backend, and only while a guest
is speaking. Turn the flag on for your test channel first.

### 4. Submit for review

Choose **Submit for Review** and provide:

- **Extension Review Channel URL**: a channel the reviewers can watch. It doesn't
  need to be live for panel-only or fully self-configurable extensions. This
  extension needs the backend running and captions being sent, so give your
  availability (9 AM to 5 PM PT) in the walkthrough.
- **Walkthrough Guide and Change Log**: required in practice. Include:
  - What the extension does and how viewers use it (captions, translation with
    Bits, the viewer settings menu, co-streamer captions).
  - Source code: the shipped JavaScript is minified, so say it's React + Vite,
    link to this repository, and attach `source.zip` from the same release (or use
    the source submission form Twitch links from the submission best-practices
    page).
  - A change log for only this version.
  - How a reviewer can see guest captions (flag on for the review channel,
    the guest link flow in the Stream CC web app).

Twitch reviews each version before it can be released, and review time varies.
If it is rejected, fix what the reviewer lists and submit a **new** version.

### 5. Release

After approval, move the version to **Released** and make it active. Release the
backend changes first: a new extension version can query fields the old backend
doesn't have (for example `channelInfo.costreamEnabled` for co-streamer captions).
Older released extension versions keep working, since they only use the original
`newTwitchCaption` subscription.

## Development with GraphQL Mocks

In development mode, the extension includes a GraphQL mock harness that allows you to test the UI locally without connecting to real backend endpoints.

### Accessing Mock Controls

1. Start the development server: `yarn start`
2. Open the extension UI (video overlay, config, or live config)
3. Click the settings menu (gear icon)
4. Select "Mock Controls (Dev)" at the bottom of the menu

### Mock Controls Features

The mock controls dialog provides:

- **Enable/Disable Mocks**: Toggle between mock responses and real API calls
- **Server Connection Toggle**: Switch between mock responses and real server connection (page will reload when enabling real server)
- **Auto-Emit Interval**: Configure how often mock caption events are automatically generated (in milliseconds, 0 to disable)
- **Manual Caption Trigger**: Manually trigger caption events with custom interim and final text

### Switching to Real Server in Development

If you need to test against the real backend while in development mode:

1. Open the Mock Controls dialog
2. Ensure "Mocks Enabled" is ON
3. Toggle "Server Connection" to "Using Real Server"
4. The page will automatically reload and connect to `wss://stream-cc.gooseman.codes`

This is useful when you want to test real data flows or verify backend integration without switching to a production build.

### What Gets Mocked

The following GraphQL operations have mock implementations:

- `getChannelInfo` - Returns mock channel data with bits balance and translation settings
- `processBitsTransaction` - Returns a successful mock transaction response
- `OnCommentAdded` - Streams mock caption events with interim and final text

### Production Builds

Mock functionality is **completely disabled** in production builds. The production bundle uses the real GraphQL endpoints configured in `src/utils/apollo.js`.

## Local Testing Against Live Captions (maintainer only)

You can run this front end locally and connect it to **any broadcaster currently
captioning** on the live site, to confirm that extension changes didn't break
caption rendering against real data. This is gated to the site owner: the channel
list and connection token come from an admin-only page on the backend (restricted
to the owner account), and the whole feature is dev-mode-gated so it stays inert
in production builds.

### One-time backend setup

On the deployment you want to test against, set the env var
`LOCAL_EXT_TESTING_ORIGINS` to your local origin so the websocket accepts the
connection (comma-separated for multiple), e.g.:

```
LOCAL_EXT_TESTING_ORIGINS=http://localhost:8080
```

Leave it unset everywhere else — without it, local origins are rejected.

### Connecting

1. Start the dev server: `yarn start` (serves on `http://localhost:8080`).
2. While logged in as the owner, open **Admin → Local Extension Testing** on the
   site. It lists every channel currently publishing captions.
3. Click **Overlay →** (or **Mobile →**) next to a channel. This opens your local
   build with a short-lived socket token **minted for that channel**, the channel
   id, and the backend's origin in the URL fragment; the page connects straight
   to that broadcaster's live captions on whichever deploy minted the link.
4. To switch channels without revisiting the admin page, open **Mock Controls
   (Dev)** → **Live Channel (Dev)**, paste a channel id, and click *Connect*.
   *Disconnect live session* returns you to the mock harness. (Note: switching
   this way reuses the stored token, so channel-scoped queries like translation
   status still reflect the token's original channel — captions follow the new
   channel.)

Tokens expire after ~2 hours; an expired session is discarded automatically on
the next load (the build falls back to the mock harness), so just open a fresh
link from the admin page.

### How it works

- `src/utils/localDevSession.js` reads the token, channel id, and backend origin
  from the URL fragment, persists them under dedicated `scc_dev_*` localStorage
  keys (never the primary `token` key the Twitch host uses), switches Apollo to
  the real server, and opens the socket against the seeded backend. The fragment
  is cleared from the address bar after it's read.
- `useTwitchAuth` synthesizes a Twitch-style auth object from that session
  *before* deferring to the Twitch host — the CDN helper script defines
  `window.Twitch.ext` even outside a Twitch iframe, so the dev session must take
  precedence. `useTwitchContext` seeds a matching player context
  (controls visible, zero HLS latency) since `onContext` never fires locally.
- Everything is gated on `import.meta.env.MODE === 'development'`, so it stays
  inert in production builds — the same approach as the existing mock harness.

