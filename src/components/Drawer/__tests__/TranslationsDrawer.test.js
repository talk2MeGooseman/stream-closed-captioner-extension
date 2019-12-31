import React from 'react';
import { cleanup } from '@testing-library/react';
import TranslationsDrawer from '../TranslationsDrawer';
import { renderWithRedux } from '@/setupTests';

afterEach(cleanup);

describe('TranslationsDrawer', () => {
  it('return nothing if no activation or product info', () => {
    const { container } = renderWithRedux(
      <TranslationsDrawer />,
    );

    expect(container).toBeEmpty();
  });
});
