import React from 'react'
import { cleanup, fireEvent } from '@testing-library/react'
import LineCountOptions from '../LineCountOptions'
import { renderWithRedux } from '@/setupTests'
import { initialState } from '@/redux/settingsSlice'

afterEach(cleanup)

describe('LineCountOptions', () => {
  describe('not video overlay', () => {
    it('doesnt render', () => {
      const { container } = renderWithRedux(<LineCountOptions />)
      expect(container).toBeEmpty()
    })
  })

  describe('is video overlay', () => {
    beforeEach(() => {
      window.history.pushState({}, 'Test Title', '/test.html?anchor=video_overlay&platform=web')
    })

    it('renders', async () => {
      const { container } = renderWithRedux(<LineCountOptions />)

      expect(container).not.toBeEmpty()
    })

    it('has increase and decrease line count menu items', async () => {
      const { queryByText } = renderWithRedux(<LineCountOptions />)

      expect(queryByText('Increase Line Count')).toBeInTheDocument()
      expect(queryByText('Decrease Line Count')).toBeInTheDocument()
    })

    describe('clicking increasing line count', () => {
      describe('ccBoxSize false', () => {
        it('should increase horizontalLineCount', async () => {
          const { queryByText, store } = renderWithRedux(<LineCountOptions />)

          fireEvent.click(queryByText('Increase Line Count'))

          const {
            configSettings: { horizontalLineCount },
          } = store.getState()
          expect(horizontalLineCount).toEqual(4)
        })

        describe('ccBoxSize true', () => {
          it('should increase boxLineCount', async () => {
            const { queryByText, store } = renderWithRedux(<LineCountOptions />, {
              initialState: { configSettings: { ...initialState, ccBoxSize: true } },
            })

            fireEvent.click(queryByText('Increase Line Count'))

            const { configSettings } = store.getState()
            expect(configSettings.boxLineCount).toEqual(8)
          })
        })
      })
    })

    describe('clicking decrease line count', () => {
      describe('ccBoxSize false', () => {
        it('should decrease horizontalLineCount', async () => {
          const { queryByText, store } = renderWithRedux(<LineCountOptions />)

          fireEvent.click(queryByText('Decrease Line Count'))

          const {
            configSettings: { horizontalLineCount },
          } = store.getState()
          expect(horizontalLineCount).toEqual(2)
        })

        describe('ccBoxSize true', () => {
          it('should decrease boxLineCount', async () => {
            const { queryByText, store } = renderWithRedux(<LineCountOptions />, {
              initialState: { configSettings: { ...initialState, ccBoxSize: true } },
            })

            fireEvent.click(queryByText('Decrease Line Count'))

            const { configSettings } = store.getState()
            expect(configSettings.boxLineCount).toEqual(6)
          })
        })
      })
    })
  })
})
