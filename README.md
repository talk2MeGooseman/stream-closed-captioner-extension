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
   build with a short-lived socket token and the channel id in the URL fragment;
   the page connects straight to that broadcaster's live captions.
4. To switch channels without revisiting the admin page, open **Mock Controls
   (Dev)** → **Live Channel (Dev)**, paste a channel id, and click *Connect*.
   *Disconnect live session* returns you to the mock harness.

### How it works

- `src/utils/localDevSession.js` reads the token + channel id from the URL
  fragment, persists them, switches Apollo to the real server, and opens the
  socket. The fragment is cleared from the address bar after it's read.
- `useTwitchAuth` synthesizes a Twitch-style auth object from that session when
  there's no Twitch host, so the normal caption subscription flow runs unchanged.
- Everything is gated on `import.meta.env.MODE === 'development'`, so it stays
  inert in production builds — the same approach as the existing mock harness.

