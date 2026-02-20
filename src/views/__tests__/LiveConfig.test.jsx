import { describe, test, expect, beforeEach, afterEach } from 'vitest'

describe('LiveConfig View', () => {
  let rootElement

  beforeEach(() => {
    // Create a mock DOM element for root
    rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)
  })

  afterEach(() => {
    if (rootElement) {
      document.body.removeChild(rootElement)
    }
  })

  test('should have root element available for React', () => {
    const root = document.getElementById('root')
    expect(root).toBeTruthy()
    expect(root.id).toBe('root')
  })

  test('root element should be in document body', () => {
    const root = document.getElementById('root')
    expect(document.body.contains(root)).toBe(true)
  })
})
