import { screen } from '@testing-library/react'
import React from 'react'

import { BoxWidthSlider } from '../BoxWidthSlider'

import { renderWithRedux } from '@/setupTests'

import { CAPTIONS_SIZE } from '@/utils/Constants'


describe('BoxWidthSlider', () => {
  describe('not video overlay', () => {
    it('doesnt render if not in video overlay', () => {
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

    it('renders the slider', () => {
      renderWithRedux(<BoxWidthSlider />)
      expect(screen.queryByText('Captions Text Width')).toBeInTheDocument()
    })

    it('slider has default value for store', () => {
      const { store } = renderWithRedux(<BoxWidthSlider />)

      const { configSettings: defaultSetting } = store.getState()

      expect(defaultSetting.captionsWidth).toEqual(CAPTIONS_SIZE.defaultHorizontalWidth)
    })
  })
})
