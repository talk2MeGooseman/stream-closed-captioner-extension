import React from 'react'
import { cleanup } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import LineCountOptions from '../LineCountOptions'

afterEach(cleanup)

describe('LineCountOptions', () => {
  describe('not video overlay', () => {
    it('doesnt render', () => {
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

    it('renders', async () => {
      const { container } = renderWithRedux(<LineCountOptions />)

      expect(container).not.toBeEmptyDOMElement()
    })

    it('has increase and decrease line count menu items', async () => {
      const { queryByText } = renderWithRedux(<LineCountOptions />)

      expect(queryByText('Increase Line Count')).toBeInTheDocument()
      expect(queryByText('Decrease Line Count')).toBeInTheDocument()
    })
  })
})
