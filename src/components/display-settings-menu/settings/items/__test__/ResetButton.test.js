import React from 'react'
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import ResetButton from '../ResetButton'

afterEach(cleanup)

describe('ResetButton', () => {
  describe('not video overlay', () => {
    it('doesnt render if not in video', () => {
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

    it('renders reset button', () => {
      const { queryByText } = renderWithRedux(
        <ResetButton />,
      )

      expect(queryByText('Reset Position')).toBeInTheDocument()
    })

    it('triggers reset on click', () => {
      const { queryByText, store } = renderWithRedux(
        <ResetButton />,
      )

      const { configSettings: { ccKey } } = store.getState()
      fireEvent.click(queryByText('Reset Position'))
      const { configSettings: { ccKey: newKey } } = store.getState()
      expect(newKey).not.toEqual(ccKey)
    })
  })
})
