import React from 'react'
import { cleanup } from '@testing-library/react'
import SettingsMenuItems from '../SettingsMenuItems'
import { renderWithRedux } from '@/setupTests'

afterEach(cleanup)

describe('SettingsMenuItems', () => {
  describe('not video overlay', () => {
    it('render expected menu items', () => {
      const { queryByText } = renderWithRedux(<SettingsMenuItems />)

      expect(queryByText('Reset Position')).not.toBeInTheDocument()
      expect(queryByText('Decrease Line Count')).not.toBeInTheDocument()
      expect(queryByText('Increase Line Count')).not.toBeInTheDocument()
      expect(queryByText('Enable Square Text Box')).not.toBeInTheDocument()
      expect(queryByText('Small Text')).toBeInTheDocument()
      expect(queryByText('Medium Text')).toBeInTheDocument()
      expect(queryByText('Large Text')).toBeInTheDocument()
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

    it('renders reset button', () => {
      const { queryByText } = renderWithRedux(<SettingsMenuItems />)

      expect(queryByText('Reset Position')).toBeInTheDocument()
      expect(queryByText('Enable Square Text Box')).toBeInTheDocument()
      expect(queryByText('Small Text')).toBeInTheDocument()
      expect(queryByText('Medium Text')).toBeInTheDocument()
      expect(queryByText('Large Text')).toBeInTheDocument()
    })
  })
})
