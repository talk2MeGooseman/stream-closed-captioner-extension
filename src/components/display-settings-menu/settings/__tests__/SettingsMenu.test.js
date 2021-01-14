import React from 'react'

import SettingMenu from '../SettingMenu'

import { renderWithRedux } from '@/setupTests'


describe('settingMenu', () => {
  describe('not video overlay', () => {
    test('render expected menu items', () => {
      const { queryByText } = renderWithRedux(<SettingMenu />)

      expect(queryByText('Reset Position')).not.toBeInTheDocument()
      expect(queryByText('Decrease Line Count')).not.toBeInTheDocument()
      expect(queryByText('Increase Line Count')).not.toBeInTheDocument()
      expect(queryByText('Enable Square Text Box')).not.toBeInTheDocument()
      expect(queryByText('Advanced Settings')).not.toBeInTheDocument()
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

    test('renders reset button', () => {
      const { queryByText } = renderWithRedux(<SettingMenu />)

      expect(queryByText('Reset Position')).toBeInTheDocument()
      expect(queryByText('Enable Square Text Box')).toBeInTheDocument()
      expect(queryByText('Small Text')).toBeInTheDocument()
      expect(queryByText('Medium Text')).toBeInTheDocument()
      expect(queryByText('Large Text')).toBeInTheDocument()
      expect(queryByText('Advanced Settings')).toBeInTheDocument()
    })
  })
})
