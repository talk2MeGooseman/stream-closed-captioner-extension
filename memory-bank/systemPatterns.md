# System Patterns

## Architecture
- React frontend with component folders under src/components.
- Redux state slices under src/redux.
- Views under src/views for entry-level screens.

## Conventions
- Index files export public APIs from folders.
- Tests colocated in __tests__ folders.

## Caption Data Model
- `captionsState.finalTextQueue` is a single chronological feed shared by the
  broadcaster and co-streamer guests. Broadcaster entries are `{ id, text }`;
  guest entries add `{ guestId, name }` and render name-prefixed. Dedupe of
  repeated finals is per speaker (`lastEntryFor`), never against the raw last
  entry — interleaved speakers must not defeat repeat suppression.
- Guest interim text lives in `captionsState.costreamInterim`
  (guestId → { name, text }), separate from the broadcaster's `interimText`.
- Guest captions arrive on the dedicated `newCostreamCaption` subscription.
  Never move guest text onto `newTwitchCaption` — released bundles hardcode
  that query and would render guests' words unattributed as the broadcaster's.
- Viewer preferences that must survive reloads (currently the co-streamer
  visibility toggles) persist via `src/utils/viewer-prefs.js` (localStorage,
  best-effort); all other settings-slice state is intentionally in-memory.
