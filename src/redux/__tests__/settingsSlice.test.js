import React from 'react'
import { cleanup } from '@testing-library/react'
import settings, { updateBroadcasterSettings, initialState } from '../settingsSlice'
import { CAPTIONS_SIZE } from '@/utils/Constants'

describe('settingsSlice', () => {
  it('should handle initial state', () => {
    expect(settings(undefined, {})).toEqual(initialState)
  })

  describe('updateBroadcasterSettings', () => {
    it('width is properly set when broadcaster chooses box size', () => {
      expect(
        settings({}, {
          type: updateBroadcasterSettings.type,
          payload: {
            ccBoxSize: true,
          }
        })
      ).toEqual(
        {
          ccBoxSize: true,
          captionsWidth: CAPTIONS_SIZE.defaultBoxWidth,
        }
      )
    })
  })
})