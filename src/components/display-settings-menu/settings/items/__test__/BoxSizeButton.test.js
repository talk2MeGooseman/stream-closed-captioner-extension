import React from 'react'
import { cleanup } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import BoxSizeButton from '../BoxSizeButton'

afterEach(cleanup)

describe('BoxSizeButton', () => {
  describe('not video overlay', () => {
    it('doesnt render if not in video', () => {
      const { container } = renderWithRedux(
        <BoxSizeButton />,
      )

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('is video overlay', () => {
    beforeEach(() => {
      window.history.pushState({}, 'Test Title', '/test.html?anchor=video_overlay&platform=web')
    })

    it('renders enable square text', () => {
      const { queryByText } = renderWithRedux(
        <BoxSizeButton />,
      )

      expect(queryByText('Enable Square Text Box')).toBeInTheDocument()
    })

    it('renders enable horizontal text', () => {
      const { queryByText } = renderWithRedux(
        <BoxSizeButton />,
        { initialState: { configSettings: { ccBoxSize: true } } },
      )

      expect(queryByText('Enable Horizontal Text Box')).toBeInTheDocument()
    })
  })
})