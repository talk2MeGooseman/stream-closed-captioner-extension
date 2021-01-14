import React from 'react'

import LanguageButton from '../LanguageButton'

import { renderWithRedux } from '@/setupTests'

describe('LanguageButton', () => {
  describe('translations are enabled', () => {
    describe('bits enabled user', () => {
      it('renders button', () => {
        const { container } = renderWithRedux(<LanguageButton />, {
          initialState: {
            configSettings: {
              isBitsEnabled: true,
            },
            captionsState: {
              finalTextQueue: [],
              interimText: 'Something',
              translations: { en: '' },
            },
          },
        })

        expect(container.querySelector('svg')).toHaveClass('fa-language')
      })
    })

    describe('non-bits enabled user', () => {
      it('renders button', () => {
        const { container } = renderWithRedux(<LanguageButton />, {
          initialState: {
            configSettings: { isBitsEnabled: false },
            captionsState: {
              finalTextQueue: [],
              interimText: 'Something',
              translations: { en: '' }
            },
          },
        })

        expect(container.querySelector('svg')).toHaveClass('fa-language')
      })
    })
  })

  describe('translations are disabled', () => {
    describe('bits enabled user', () => {
      it('renders button', () => {
        const { container } = renderWithRedux(<LanguageButton />, {
          initialState: {
            configSettings: { isBitsEnabled: true },
            captionsState: {
              finalTextQueue: [],
              interimText: 'Something',
              translations: { en: '' }
            },
          },
        })

        expect(container.querySelector('svg')).toHaveClass('fa-language')
      })
    })

    describe('non-bits enabled user', () => {
      it('renders nothing', () => {
        const { container } = renderWithRedux(<LanguageButton />)

        expect(container).toBeEmptyDOMElement()
      })
    })
  })
})
