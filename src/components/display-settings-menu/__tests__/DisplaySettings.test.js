import { cleanup } from '@testing-library/react'
import React from 'react'

import DisplaySettingsMenu, { positionLeft } from '../DisplaySettingsMenu'

import { renderWithRedux } from '@/setupTests'


afterEach(cleanup)

function setAsVideoOverlay() {
  window.history.pushState(
    {},
    'Test Title',
    '/test.html?anchor=video_overlay&platform=web',
  )
}

describe('DisplaySettings', () => {
  afterEach(() => {
    window.history.pushState({}, 'Test Title', '/test.html?platform=web')
  })

  describe('positionLeft', () => {
    it('return false if not a video overlay', () => {
      expect(positionLeft(true)).toBeFalsy()
    })

    it('return false if a video overlay but setting is false', () => {
      setAsVideoOverlay()
      expect(positionLeft(false)).toBeFalsy()
    })

    it('return true if a video overlay but setting is true', () => {
      setAsVideoOverlay()
      expect(positionLeft(true)).toBeTruthy()
    })
  })

  describe('not video overlay', () => {
    it('controls are always shown', () => {
      const { queryByTestId } = renderWithRedux(<DisplaySettingsMenu />)

      expect(queryByTestId('display-settings')).toBeInTheDocument()
    })
  })

  describe('is video overlay', () => {
    beforeEach(() => {
      setAsVideoOverlay()
    })

    describe('arePlayerControlsVisible is true', () => {
      it('contols are shown', () => {
        const { queryByTestId } = renderWithRedux(<DisplaySettingsMenu />, {
          initialState: {
            videoPlayerContext: { arePlayerControlsVisible: true },
          },
        })

        expect(queryByTestId('display-settings')).toBeInTheDocument()
      })
    })

    describe('arePlayerControlsVisible is false', () => {
      it('renders enable horizontal text', () => {
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
