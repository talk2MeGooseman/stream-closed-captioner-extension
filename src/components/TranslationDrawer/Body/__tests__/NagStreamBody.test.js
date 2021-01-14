import { fireEvent } from '@testing-library/react'
import { T } from 'ramda'
import React from 'react'

import NagStreamerBody from '../NagStreamerBody'

import { renderWithRedux } from '@/setupTests'

const defaultState = {
  productsCatalog: {
    products: [
      {
        cost: {
          amount: 1,
        },
        displayName: '1 Bit',
        sku: '1',
      },
      {
        cost: {
          amount: 2,
        },
        displayName: '2 Bit',
        sku: '2',
      },
    ],
  },
  translationInfo: {
    activationInfo: {
      balance: 0,
      languages: {
        de: 'German',
        en: 'English',
        es: 'Spanish',
      },
    },
  },
}

describe('nagStreamerBody', () => {
  beforeEach(() => {
    global.document.createRange = () => ({
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
      setEnd: T,
      setStart: T,
    })
  })

  test('it renders', () => {
    const { queryByTestId } = renderWithRedux(<NagStreamerBody />, {
      initialState: defaultState,
    })

    expect(queryByTestId('nag-streamer')).toBeInTheDocument()
  })

  describe('displays languages available for translations', () => {
    test('excludes current language from list', () => {
      const { queryByText } = renderWithRedux(<NagStreamerBody />, {
        initialState: defaultState,
      })

      expect(queryByText('English')).not.toBeInTheDocument()
      expect(queryByText('Spanish')).toBeInTheDocument()
      expect(queryByText('German')).toBeInTheDocument()
    })
  })

  test('display product options in the dropdown', () => {
    const { queryByText } = renderWithRedux(<NagStreamerBody />, {
      initialState: defaultState,
    })

    const dropDown = queryByText('1 Bit')

    expect(dropDown).toBeInTheDocument()
    expect(queryByText('2 Bit')).not.toBeInTheDocument()

    fireEvent.click(dropDown)

    expect(queryByText('2 Bit')).toBeInTheDocument()
  })
})
