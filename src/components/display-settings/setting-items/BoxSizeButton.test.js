import React from 'react';
import { render, cleanup } from '@testing-library/react';
import BoxSizeButton from './BoxSizeButton';

afterEach(cleanup);

describe('BoxSizeButton', () => {
  test('renders message', () => {
    const { getByText } = render(
      <BoxSizeButton
        firstName="Alejandro"
        lastName="Roman"
      />,
    );

    expect(getByText('Hi Alejandro Roman')).toBeInTheDocument();
  });
});
