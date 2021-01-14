import React from 'react'

import TranslationsDrawer from '../TranslationsDrawer'

import { renderWithRedux } from '@/setupTests'


describe('translationsDrawer', () => {
  describe('render nothing', () => {
    test('if no activation info', () => {
      const { queryByText } = renderWithRedux(
        <TranslationsDrawer />, {
          initialState: {
            productsCatalog: {
              products: [1],
            },
          },
        },
      )

      expect(queryByText('Turn on Translations!')).not.toBeInTheDocument()
    })

    test('if no products', () => {
      const { queryByText } = renderWithRedux(
        <TranslationsDrawer />, {
          initialState: {
            productsCatalog: {
              products: [],
            },
            translationInfo: {
              activationInfo: {
                balance: 500,
              },
            },
          },
        },
      )

      expect(queryByText('Turn on Translations!')).not.toBeInTheDocument()
    })

    test('if non-bits enabled viewer', () => {
      const { queryByText } = renderWithRedux(
        <TranslationsDrawer />, {
          initialState: {
            configSettings: {
              isBitsEnabled: false,
              isDrawerOpen: true,
            },
            productsCatalog: {
              products: [{
                cost: {
                  amount: 1,
                },
                sku: '1',
              }],
            },
            translationInfo: {
              activationInfo: {
                balance: 500,
                languages: [],
              },
            },
          },
        },
      )

      expect(queryByText('Turn on Translations!')).not.toBeInTheDocument()
    })
  })

  describe('renders drawer', () => {
    test('with ActivateTranslationBody', () => {
      const { queryByTestId } = renderWithRedux(
        <TranslationsDrawer />, {
          initialState: {
            configSettings: {
              isBitsEnabled: true,
              isDrawerOpen: true,
              language: 'en-US',
            },
            productsCatalog: {
              products: [{
                cost: {
                  amount: 1,
                },
                displayName: 'hey',
                sku: '1',
              }],
            },
            translationInfo: {
              activationInfo: {
                balance: 0,
                languages: [],
              },
            },
          },
        },
      )

      expect(queryByTestId('activate-translation')).toBeInTheDocument()
    })

    test('with NagStreamerBody', () => {
      const { queryByTestId } = renderWithRedux(
        <TranslationsDrawer />, {
          initialState: {
            configSettings: {
              isBitsEnabled: true,
              isDrawerOpen: true,
              language: 'en-US',
            },
            productsCatalog: {
              products: [{
                cost: {
                  amount: 1,
                },
                displayName: 'hey',
                sku: '1',
              }],
            },
            translationInfo: {
              activationInfo: {
                balance: 500,
                languages: [],
              },
            },
          },
        },
      )

      expect(queryByTestId('nag-streamer')).toBeInTheDocument()
    })
  })
})
