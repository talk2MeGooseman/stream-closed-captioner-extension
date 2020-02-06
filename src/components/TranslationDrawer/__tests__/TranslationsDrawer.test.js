import React from 'react'
import { cleanup } from '@testing-library/react'
import TranslationsDrawer from '../TranslationsDrawer'
import { renderWithRedux } from '@/setupTests'

afterEach(cleanup)

beforeEach(() => {
  window.Twitch = {
    ext: {
      bits: {
        showBitsBalance: () => {},
      },
    },
  }
})

describe('TranslationsDrawer', () => {
  describe('render nothing', () => {
    it('if no activation info', () => {
      const { queryByText } = renderWithRedux(<TranslationsDrawer />, {
        initialState: {
          productsCatalog: {
            products: [1],
          },
        },
      })

      expect(queryByText('Turn on Translations!')).not.toBeInTheDocument()
    })

    it('if no products', () => {
      const { queryByText } = renderWithRedux(<TranslationsDrawer />, {
        initialState: {
          translationInfo: {
            activationInfo: {
              balance: 500,
            },
          },
          productsCatalog: {
            products: [],
          },
        },
      })

      expect(queryByText('Turn on Translations!')).not.toBeInTheDocument()
    })

    it('if non-bits enabled viewer', () => {
      const { queryByText } = renderWithRedux(<TranslationsDrawer />, {
        initialState: {
          configSettings: {
            isBitsEnabled: false,
            isDrawerOpen: true,
          },
          translationInfo: {
            activationInfo: {
              languages: [],
              balance: 500,
            },
          },
          productsCatalog: {
            products: [
              {
                sku: '1',
                cost: {
                  amount: 1,
                },
              },
            ],
          },
        },
      })
      expect(queryByText('Turn on Translations!')).not.toBeInTheDocument()
    })
  })

  describe('renders drawer', () => {
    it('with ActivateTranslationBody', () => {
      const { queryByTestId } = renderWithRedux(<TranslationsDrawer />, {
        initialState: {
          configSettings: {
            isBitsEnabled: true,
            isDrawerOpen: true,
          },
          translationInfo: {
            activationInfo: {
              languages: [],
              balance: 0,
            },
          },
          productsCatalog: {
            products: [
              {
                sku: '1',
                displayName: 'hey',
                cost: {
                  amount: 1,
                },
              },
            ],
          },
        },
      })
      expect(queryByTestId('activate-translation')).toBeInTheDocument()
    })

    it('with NagStreamerBody', () => {
      const { queryByTestId } = renderWithRedux(<TranslationsDrawer />, {
        initialState: {
          configSettings: {
            isBitsEnabled: true,
            isDrawerOpen: true,
          },
          translationInfo: {
            activationInfo: {
              languages: [],
              balance: 500,
            },
          },
          productsCatalog: {
            products: [
              {
                sku: '1',
                displayName: 'hey',
                cost: {
                  amount: 1,
                },
              },
            ],
          },
        },
      })
      expect(queryByTestId('nag-streamer')).toBeInTheDocument()
    })
  })
})
