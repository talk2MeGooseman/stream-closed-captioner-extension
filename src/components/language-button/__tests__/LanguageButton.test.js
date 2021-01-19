import React from 'react'

import LanguageButton from '../LanguageButton'

import { renderWithRedux } from '@/setupTests'

describe('languageButton', () => {
  describe('translations are enabled', () => {
    describe('bits enabled user', () => {
      test('renders button', () => {
        const { container } = renderWithRedux(<LanguageButton />, {
          initialState: {
            captionsState: {
              finalTextQueue: [],
              interimText: 'Something',
              translations: { en: '' },
            },
            configSettings: {
              isBitsEnabled: true,
            },
        },
        })

        expect(container.querySelector('svg')).toHaveClass('fa-language')
      })
    })

    describe('non-bits enabled user', () => {
      test('renders button', () => {
        const { container } = renderWithRedux(<LanguageButton />, {
          initialState: {
            captionsState: {
              finalTextQueue: [],
              interimText: 'Something',
              translations: { en: '' }
            },
            configSettings: { isBitsEnabled: false },
          },
        })

        expect(container.querySelector('svg')).toHaveClass('fa-language')
      })
    })
  })

  describe('translations are disabled', () => {
    describe('bits enabled user', () => {
      test('renders button', () => {
        const { container } = renderWithRedux(<LanguageButton />, {
          initialState: {
            captionsState: {
              finalTextQueue: [],
              interimText: 'Something',
              translations: { en: '' }
            },
            configSettings: { isBitsEnabled: true },
          },
        })

        expect(container.querySelector('svg')).toHaveClass('fa-language')
      })
    })

    describe('non-bits enabled user', () => {
      test('renders nothing', () => {
        const { container } = renderWithRedux(<LanguageButton />)

        expect(container).toBeEmptyDOMElement()
      })
    })
  })
})
