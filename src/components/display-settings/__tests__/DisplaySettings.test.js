import React from 'react'
import { cleanup } from '@testing-library/react'
import DisplaySettings from '../DisplaySettings'
import { renderWithRedux } from '@/setupTests'

afterEach(cleanup)

describe('DisplaySettings', () => {
  describe('not video overlay', () => {
    it('controls are always shown', () => {
      const { queryByTestId } = renderWithRedux(<DisplaySettings />)

      expect(queryByTestId('display-settings')).toBeInTheDocument()
    })
  })

  describe('is video overlay', () => {
    beforeEach(() => {
      window.history.pushState(
        {},
        'Test Title',
        '/test.html?anchor=video_overlay&platform=web',
      )
    })

    describe('arePlayerControlsVisible is true', () => {
      it('contols are shown', () => {
        const { queryByTestId } = renderWithRedux(<DisplaySettings />, {
          initialState: {
            videoPlayerContext: { arePlayerControlsVisible: true },
          },
        })

        expect(queryByTestId('display-settings')).toBeInTheDocument()
      })
    })

    describe('arePlayerControlsVisible is false', () => {
      it('renders enable horizontal text', () => {
        const { queryByTestId } = renderWithRedux(<DisplaySettings />, {
          initialState: {
            videoPlayerContext: { arePlayerControlsVisible: false },
          },
        })

        expect(queryByTestId('display-settings')).not.toBeInTheDocument()
      })
    })
  })
})