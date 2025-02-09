import { fireEvent } from '@testing-library/react'
import React from 'react'

import ResetButton from '../ResetButton'

import { renderWithRedux } from '@/setupTests'


describe('resetButton', () => {
  describe('not video overlay', () => {
    test('doesnt render if not in video', () => {
      const { container } = renderWithRedux(
        <ResetButton />,
      )

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('is video overlay', () => {
    beforeEach(() => {
      window.history.pushState({}, 'Test Title', '/test.html?anchor=video_overlay&platform=web')
    })

    test('renders reset button', () => {
      const { queryByText } = renderWithRedux(
        <ResetButton />,
      )

      expect(queryByText('Reset Position')).toBeInTheDocument()
    })

    test('triggers reset on click', () => {
      const { queryByText, store } = renderWithRedux(
        <ResetButton />,
      )

      const { configSettings: { ccKey } } = store.getState()

      fireEvent.click(queryByText('Reset Position'))
      const { configSettings: { ccKey: newKey } } = store.getState()

      expect(newKey).not.toStrictEqual(ccKey)
    })
  })
})
