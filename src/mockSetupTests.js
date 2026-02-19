import { vi } from 'vitest'
import ReactDOM from 'react-dom'

// Mock fetch globally for tests
global.fetch = vi.fn()

// Polyfill findDOMNode for Blueprint.js v3 compatibility (removed in React 19)
// TODO: Remove this polyfill when Blueprint.js is upgraded to v5+
if (typeof ReactDOM.findDOMNode !== 'function') {
  ReactDOM.findDOMNode = function findDOMNodePolyfill(componentOrElement) {
    if (componentOrElement == null) return null
    if (componentOrElement instanceof HTMLElement) return componentOrElement
    if (componentOrElement.nodeType === 1) return componentOrElement
    // For class component instances, traverse the React fiber tree
    const fiber = componentOrElement._reactInternals || componentOrElement._reactInternalFiber
    if (fiber) {
      let node = fiber
      while (node) {
        if (node.stateNode instanceof HTMLElement) return node.stateNode
        node = node.child
      }
    }
    return null
  }
}
