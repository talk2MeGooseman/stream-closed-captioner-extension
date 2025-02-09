import { screen } from '@testing-library/react'
import React from 'react'

import { BoxWidthSlider } from '../BoxWidthSlider'

import { renderWithRedux } from '@/setupTests'

import { CAPTIONS_SIZE } from '@/utils/Constants'


describe('boxWidthSlider', () => {
  describe('not video overlay', () => {
    test('doesnt render if not in video overlay', () => {
      renderWithRedux(<BoxWidthSlider />)

      expect(screen.queryByText('Box Captions Width')).not.toBeInTheDocument()
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

    test('renders the slider', () => {
      renderWithRedux(<BoxWidthSlider />)
      expect(screen.queryByText('Captions Text Width')).toBeInTheDocument()
    })

    test('slider has default value for store', () => {
      const { store } = renderWithRedux(<BoxWidthSlider />)

      const { configSettings: defaultSetting } = store.getState()

      expect(defaultSetting.captionsWidth).toStrictEqual(CAPTIONS_SIZE.defaultHorizontalWidth)
    })
  })
})
