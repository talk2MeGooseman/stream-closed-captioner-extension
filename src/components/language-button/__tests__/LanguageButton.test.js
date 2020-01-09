import React from 'react';
import { cleanup } from '@testing-library/react';
import LanguageButton from '../LanguageButton';
import { renderWithRedux } from '@/setupTests';

afterEach(cleanup);

describe('LanguageSettings ', () => {
  describe('translations are enabled', () => {
    describe('bits enabled user', () => {
      it('renders button', () => {
        const { container } = renderWithRedux(
          <LanguageButton />,
          { initialState: { configSettings: { isBitsEnabled: true }, captionsState: { translations: { en: '' } } } },
        );

        expect(container.querySelector('svg')).toHaveClass('fa-language');
      });
    });

    describe('non-bits enabled user', () => {
      it('renders button', () => {
        const { container } = renderWithRedux(
          <LanguageButton />,
          { initialState: { configSettings: { isBitsEnabled: false }, captionsState: { translations: { en: '' } } } },
        );

        expect(container.querySelector('svg')).toHaveClass('fa-language');
      });
    });
  });

  describe('translations are disabled', () => {
    describe('bits enabled user', () => {
      it('renders button', () => {
        const { container } = renderWithRedux(
          <LanguageButton />,
          { initialState: { configSettings: { isBitsEnabled: true } } },
        );

        expect(container.querySelector('svg')).toHaveClass('fa-language');
      });
    });

    describe('non-bits enabled user', () => {
      it('renders nothing', () => {
        const { container } = renderWithRedux(
          <LanguageButton />,
        );

        expect(container).toBeEmpty();
      });
    });
  });
});
