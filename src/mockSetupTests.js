import { vi } from 'vitest'
import ReactDOM from 'react-dom'

// Polyfill findDOMNode for react-draggable v4.5.0 compatibility (removed in React 19)
// NOTE: Blueprint v5 is fully compatible with React 19 and does NOT require this polyfill
// TODO: Remove this polyfill when react-draggable is upgraded to React 19-compatible version
if (typeof ReactDOM.findDOMNode !== 'function') {
  ReactDOM.findDOMNode = function findDOMNodePolyfill(componentOrElement) {
    if (componentOrElement == null) return null
    if (componentOrElement instanceof HTMLElement) return componentOrElement
    if (componentOrElement.nodeType === 1) return componentOrElement
    // For class component instances, traverse the React fiber tree
    const fiber =
      componentOrElement._reactInternals ||
      componentOrElement._reactInternalFiber
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

// Mock fetch globally for tests
global.fetch = vi.fn()
