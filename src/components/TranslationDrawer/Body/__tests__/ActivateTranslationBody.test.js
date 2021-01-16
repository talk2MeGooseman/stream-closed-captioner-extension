/* eslint-disable no-empty-function */
import { fireEvent } from '@testing-library/react'
import React from 'react'

import ActivateTranslationBody from '../ActivateTranslationBody'

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

describe('activateTranslationBody', () => {
  beforeEach(() => {
    global.document.createRange = () => ({
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
      setEnd: () => {},
      setStart: () => {},
    })
  })

  test('it renders', () => {
    const { queryByTestId } = renderWithRedux(<ActivateTranslationBody />, {
      initialState: defaultState,
    })

    expect(queryByTestId('activate-translation')).toBeInTheDocument()
  })

  describe('displays languages available for translations', () => {
    test('excludes current language from list', () => {
      const { queryByText } = renderWithRedux(<ActivateTranslationBody />, {
        initialState: defaultState,
      })

      expect(queryByText('English')).not.toBeInTheDocument()
      expect(queryByText('Spanish')).toBeInTheDocument()
      expect(queryByText('German')).toBeInTheDocument()
    })
  })

  test('display product options in the dropdown', () => {
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
