import { screen } from '@testing-library/react'
import React from 'react'

import LineCountOptions from '../LineCountOptions'

import { renderWithRedux } from '@/setupTests'


describe('lineCountOptions', () => {
  describe('not video overlay', () => {
    test('doesnt render', () => {
      const { container } = renderWithRedux(<LineCountOptions />)

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

    test('renders', () => {
      const { container } = renderWithRedux(<LineCountOptions />)

      expect(container).not.toBeEmptyDOMElement()
    })

    test('has increase and decrease line count menu items', () => {
      renderWithRedux(<LineCountOptions />)

      expect(screen.queryByText('Increase Line Count')).toBeVisible()
      expect(screen.queryByText('Decrease Line Count')).toBeVisible()
    })
  })
})
