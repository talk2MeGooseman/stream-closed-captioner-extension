import React from 'react'

import DisplaySettingsMenu, { positionLeft } from '../DisplaySettingsMenu'

import { renderWithRedux } from '@/setupTests'


function setAsVideoOverlay() {
  window.history.pushState(
    {},
    'Test Title',
    '/test.html?anchor=video_overlay&platform=web',
  )
}

describe('displaySettings', () => {
  afterEach(() => {
    window.history.pushState({}, 'Test Title', '/test.html?platform=web')
  })

  describe('positionLeft', () => {
    test('return false if not a video overlay', () => {
      expect(positionLeft(true)).toBe(false)
    })

    test('return false if a video overlay but setting is false', () => {
      setAsVideoOverlay()
      expect(positionLeft(false)).toBe(false)
    })

    test('return true if a video overlay but setting is true', () => {
      setAsVideoOverlay()
      expect(positionLeft(true)).toBe(true)
    })
  })

  describe('not video overlay', () => {
    test('controls are always shown', () => {
      const { queryByTestId } = renderWithRedux(<DisplaySettingsMenu />)

      expect(queryByTestId('display-settings')).toBeInTheDocument()
    })
  })

  describe('is video overlay', () => {
    beforeEach(() => {
      setAsVideoOverlay()
    })

    describe('arePlayerControlsVisible is true', () => {
      test('contols are shown', () => {
        const { queryByTestId } = renderWithRedux(<DisplaySettingsMenu />, {
          initialState: {
            videoPlayerContext: { arePlayerControlsVisible: true },
          },
        })

        expect(queryByTestId('display-settings')).toBeInTheDocument()
      })
    })

    describe('arePlayerControlsVisible is false', () => {
      test('renders enable horizontal text', () => {
        const { queryByTestId } = renderWithRedux(<DisplaySettingsMenu />, {
          initialState: {
            videoPlayerContext: { arePlayerControlsVisible: false },
          },
        })

        expect(queryByTestId('display-settings')).not.toBeInTheDocument()
      })
    })
  })
})
