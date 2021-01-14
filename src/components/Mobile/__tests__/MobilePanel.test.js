import { cleanup } from '@testing-library/react'
import React from 'react'

import MobilePanel from '../MobilePanel'

import { renderWithRedux } from '@/setupTests'


afterEach(cleanup)

describe('TranslationsDrawer', () => {
  it('renders content', () => {
    const { container } = renderWithRedux(<MobilePanel />)

    expect(container).not.toBeEmptyDOMElement()
  })
})
