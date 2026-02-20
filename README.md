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

To build your finalized React JS files, simply run `yarn build` to build the various webpacked files.

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

