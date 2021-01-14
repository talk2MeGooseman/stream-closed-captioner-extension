import { cleanup, fireEvent } from '@testing-library/react'
import React from 'react'

import ActivateTranslationBody from '../ActivateTranslationBody'

import { renderWithRedux } from '@/setupTests'


afterEach(cleanup)

const defaultState = {
  translationInfo: {
    activationInfo: {
      languages: {
        en: 'English',
        es: 'Spanish',
        de: 'German',
      },
      balance: 0,
    },
  },
  productsCatalog: {
    products: [
      {
        sku: '1',
        displayName: '1 Bit',
        cost: {
          amount: 1,
        },
      },
      {
        sku: '2',
        displayName: '2 Bit',
        cost: {
          amount: 2,
        },
      },
    ],
  },
}

describe('ActivateTranslationBody', () => {
  beforeEach(() => {
    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    })
  })

  it('it renders', () => {
    const { queryByTestId } = renderWithRedux(<ActivateTranslationBody />, {
      initialState: defaultState,
    })

    expect(queryByTestId('activate-translation')).toBeInTheDocument()
  })

  describe('Displays languages available for translations', () => {
    it('excludes current language from list', () => {
      const { queryByText } = renderWithRedux(<ActivateTranslationBody />, {
        initialState: defaultState,
      })

      expect(queryByText('English')).not.toBeInTheDocument()
      expect(queryByText('Spanish')).toBeInTheDocument()
      expect(queryByText('German')).toBeInTheDocument()
    })
  })

  it('display product options in the dropdown', () => {
    const { queryByText } = renderWithRedux(<ActivateTranslationBody />, {
      initialState: defaultState,
    })

    const dropDown = queryByText('1 Bit')

    expect(dropDown).toBeInTheDocument()
    expect(queryByText('2 Bit')).not.toBeInTheDocument()

    fireEvent.click(dropDown)

    expect(queryByText('2 Bit')).toBeInTheDocument()
  })
})
