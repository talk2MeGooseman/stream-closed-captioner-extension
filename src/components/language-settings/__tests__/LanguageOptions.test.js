import React from 'react';
import { cleanup } from '@testing-library/react';
import LanguageOptions from '../LanguageOptions';
import { renderWithRedux } from '@/setupTests';

afterEach(cleanup);

describe('LanguageOptions ', () => {
  describe('Indicates selected language', () => {
    it('default language by default', () => {
      const { queryByTestId } = renderWithRedux(
        <LanguageOptions />,
      );
      const tickEl = document.querySelector('span[icon="tick"]');
      expect(queryByTestId('default-language')).toContainElement(tickEl);
    });

    it('checks viewer selected language', () => {
      const { queryByTestId } = renderWithRedux(
        <LanguageOptions />,
        { initialState: { configSettings: { viewerLanguage: 'de' }, captionsState: { translations: { de: { name: 'Germ' } } } } },
      );
      const deEl = queryByTestId('language-de');
      const tickEl = deEl.querySelector('span[icon="tick"]');

      expect(deEl).toContainElement(tickEl);
    });
  });

  describe('translations are enabled', () => {
    describe('bits enabled user', () => {
      it('renders button', () => {
        const { queryByText } = renderWithRedux(
          <LanguageOptions />,
          { initialState: { configSettings: { isBitsEnabled: true } } },
        );

        expect(queryByText('Add Translation Days')).toBeInTheDocument();
      });
    });

    describe('non-bits enabled user', () => {
      it('renders button', () => {
        const { queryByText } = renderWithRedux(
          <LanguageOptions />,
          { initialState: { configSettings: { isBitsEnabled: false } } },
        );

        expect(queryByText('Add Translation Days')).not.toBeInTheDocument();
      });
    });
  });
});
