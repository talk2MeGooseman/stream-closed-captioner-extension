import React from 'react'
import { renderWithRedux } from '@/setupTests'
import { screen } from '@testing-library/react'
import { BOX_SIZE } from '@/utils/Constants'
import { BoxWidthSlider } from '../BoxWidthSlider'

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
      expect(screen.queryByText('Box Captions Width')).toBeInTheDocument()
    })

    it('slider has default value for store', () => {
      const { store } = renderWithRedux(<BoxWidthSlider />)

      const { configSettings: defaultSetting } = store.getState()
      expect(defaultSetting.boxWidth).toEqual(BOX_SIZE.defaultWidth)
    })
  })
})
