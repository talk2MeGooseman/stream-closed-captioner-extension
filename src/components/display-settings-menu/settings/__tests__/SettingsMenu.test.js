import React from 'react'
import { cleanup } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import SettingMenu from '../SettingMenu'

afterEach(cleanup)

describe('SettingMenu', () => {
  describe('not video overlay', () => {
    it('render expected menu items', () => {
      const { queryByText } = renderWithRedux(
        <SettingMenu />,
      )

      expect(queryByText('Reset Position')).not.toBeInTheDocument()
      expect(queryByText('Decrease Line Count')).not.toBeInTheDocument()
      expect(queryByText('Increase Line Count')).not.toBeInTheDocument()
      expect(queryByText('Enable Square Text Box')).not.toBeInTheDocument()
      expect(queryByText('Small Text')).toBeInTheDocument()
      expect(queryByText('Medium Text')).toBeInTheDocument()
      expect(queryByText('Large Text')).toBeInTheDocument()
      expect(queryByText('Advanced Settings')).toBeInTheDocument()
    })
  })

  describe('is video overlay', () => {
    beforeEach(() => {
      window.history.pushState({}, 'Test Title', '/test.html?anchor=video_overlay&platform=web')
    })

    it('renders reset button', () => {
      const { queryByText } = renderWithRedux(
        <SettingMenu />,
      )

      expect(queryByText('Reset Position')).toBeInTheDocument()
      expect(queryByText('Enable Square Text Box')).toBeInTheDocument()
      expect(queryByText('Small Text')).toBeInTheDocument()
      expect(queryByText('Medium Text')).toBeInTheDocument()
      expect(queryByText('Large Text')).toBeInTheDocument()
      expect(queryByText('Advanced Settings')).toBeInTheDocument()
    })
  })
})
