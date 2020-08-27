import React from 'react'
import { cleanup } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import MobilePanel from '../MobilePanel'

afterEach(cleanup)

describe('TranslationsDrawer', () => {
  it('renders content', () => {
    const { container } = renderWithRedux(<MobilePanel />)

    expect(container).not.toBeEmptyDOMElement()
  })
})
