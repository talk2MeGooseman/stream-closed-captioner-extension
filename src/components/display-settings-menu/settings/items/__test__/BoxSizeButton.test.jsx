import React from 'react'

import BoxSizeButton from '../BoxSizeButton'

import { renderWithRedux } from '@/setupTests'


describe('boxSizeButton', () => {
  describe('not video overlay', () => {
    test('doesnt render if not in video', () => {
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

    test('renders enable square text', () => {
      const { queryByText } = renderWithRedux(
        <BoxSizeButton />,
      )

      expect(queryByText('Enable Square Text Box')).toBeInTheDocument()
    })

    test('renders enable horizontal text', () => {
      const { queryByText } = renderWithRedux(
        <BoxSizeButton />,
        { initialState: { configSettings: { ccBoxSize: true } } },
      )

      expect(queryByText('Enable Horizontal Text Box')).toBeInTheDocument()
    })
  })
})
