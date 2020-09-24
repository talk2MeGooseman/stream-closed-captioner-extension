import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import AdvancedSettings from '../AdvancedSettings'

describe('AdvancedSettings', () => {
  describe('not video overlay', () => {
    it('doesnt render if not in video', () => {
      const { container } = renderWithRedux(<AdvancedSettings />)

      expect(container).toBeEmptyDOMElement()
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

    it('renders enable square text', () => {
      renderWithRedux(<AdvancedSettings />)
      expect(screen.queryAllByText('Advanced Settings')).toBeTruthy()
    })
  })
})
