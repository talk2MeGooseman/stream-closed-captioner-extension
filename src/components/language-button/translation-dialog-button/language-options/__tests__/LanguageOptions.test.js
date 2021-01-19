import { fireEvent, screen } from '@testing-library/react'
import React from 'react'

import { LanguageOptions } from '../LanguageOptions'

import { renderWithRedux } from '@/setupTests'

const translationInfo = {
  activationInfo: {
    languages: {
      de: "Germ"
    }
  }
}

describe('languageOptions ', () => {
  test('fires onClick when selecting new language', () => {
    const { queryByTestId, store } = renderWithRedux(
      <LanguageOptions />,
      { initialState: { translationInfo } },
    )

    fireEvent.click(queryByTestId('language-de'))
    const { configSettings: { viewerLanguage } } = store.getState()

    expect(viewerLanguage).toStrictEqual('de')
  })

  describe('indicates selected language', () => {
    test('default language by default', () => {
      const { queryByTestId } = renderWithRedux(
        <LanguageOptions />,
      )
      const tickEl = document.querySelector('span[icon="tick"]')

      expect(queryByTestId('language-default')).toContainElement(tickEl)
    })

    test('checks viewer selected language', () => {
      renderWithRedux(<LanguageOptions />, {
        initialState: {
          configSettings: { language: 'en', viewerLanguage: 'de' },
          translationInfo,
        },
      })
      const deEl = screen.getByTestId('language-de')
      const tickEl = deEl.querySelector('span[icon="tick"]')

      expect(deEl).toContainElement(tickEl)
    })
  })

  describe('translations are enabled', () => {
    describe('bits enabled user', () => {
      test('renders button', () => {
        const { queryByText } = renderWithRedux(
          <LanguageOptions />,
          { initialState: { configSettings: { isBitsEnabled: true } } },
        )

        expect(queryByText('Add Translation Days')).toBeInTheDocument()
      })
    })

    describe('non-bits enabled user', () => {
      test('renders button', () => {
        const { queryByText } = renderWithRedux(
          <LanguageOptions />,
          { initialState: { configSettings: { isBitsEnabled: false } } },
        )

        expect(queryByText('Add Translation Days')).not.toBeInTheDocument()
      })
    })
  })
})
