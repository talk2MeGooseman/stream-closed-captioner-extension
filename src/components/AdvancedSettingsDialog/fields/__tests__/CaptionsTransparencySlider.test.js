import { screen } from '@testing-library/react'
import React from 'react'

import { CaptionsTransparencySlider } from '../CaptionsTransparencySlider'

import { renderWithRedux } from '@/setupTests'

import { CAPTIONS_TRANSPARENCY } from '@/utils/Constants'


describe('CaptionsTransparencySlider', () => {
  describe('not video overlay', () => {
    it('doesnt renderWithRedux if not in video overlay', () => {
      renderWithRedux(<CaptionsTransparencySlider />)
      expect(
        screen.queryByText('Transparency of Closed Captions Background'),
      ).not.toBeInTheDocument()
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

    it('should be rendered', () => {
      renderWithRedux(<CaptionsTransparencySlider />)
      expect(
        screen.queryByText('Transparency of Closed Captions Background'),
      ).toBeInTheDocument()
    })

    it('slider has default value for store', () => {
      const { store } = renderWithRedux(<CaptionsTransparencySlider />)

      const { configSettings: defaultSetting } = store.getState()

      expect(defaultSetting.captionsTransparency).toEqual(
        CAPTIONS_TRANSPARENCY.default,
      )
    })
  })
})
