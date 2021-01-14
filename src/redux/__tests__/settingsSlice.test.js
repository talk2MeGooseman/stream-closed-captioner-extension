import settings, { updateBroadcasterSettings, initialState } from '../settings-slice'

import { CAPTIONS_SIZE } from '@/utils/Constants'

describe('settingsSlice', () => {
  test('should handle initial state', () => {
    expect(settings(undefined, {})).toStrictEqual(initialState)
  })

  describe('updateBroadcasterSettings', () => {
    test('width is properly set when broadcaster chooses box size', () => {
      expect(
        settings({}, {
          payload: {
            ccBoxSize: true,
          },
          type: updateBroadcasterSettings.type,
        })
      ).toStrictEqual(
        {
          captionsWidth: CAPTIONS_SIZE.defaultBoxWidth,
          ccBoxSize: true,
        }
      )
    })
  })
})
