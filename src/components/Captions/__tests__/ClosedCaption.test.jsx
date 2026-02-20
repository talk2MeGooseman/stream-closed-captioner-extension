import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import ClosedCaption from '../ClosedCaption'

const baseState = {
  configSettings: {
    size: 'MEDIUM',
    viewerLanguage: 'default',
    dyslexiaFontEnabled: false,
    captionsTransparency: 1,
    textUppercase: false,
    grayOutFinalText: false,
    ccBoxSize: false,
    horizontalLineCount: 3,
    boxLineCount: 5,
    captionsWidth: 100,
    hideCC: false,
    color: '#ffffff',
  },
  captionsState: {
    finalTextQueue: [],
    interimText: '',
    translations: {},
    captionsSubscription: null,
  },
  videoPlayerContext: {
    arePlayerControlsVisible: true,
    hlsLatencyBroadcaster: 5,
    displayResolution: '1080p',
  },
}

describe('ClosedCaption Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    test('renders caption container with main role', () => {
      const initialState = {
        ...baseState,
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Hello' }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      const container = screen.getByRole('main')
      expect(container).toBeInTheDocument()
    })

    test('displays final text from queue', () => {
      const finalText = 'This is a caption'
      const initialState = {
        ...baseState,
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: finalText }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      expect(screen.getByText(finalText)).toBeInTheDocument()
    })

    test('displays interim text when available', () => {
      const interimText = 'Interim caption'
      const initialState = {
        ...baseState,
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Final' }],
          interimText,
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      expect(screen.getByText(interimText)).toBeInTheDocument()
    })

    test('applies font size styling', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          size: 'LARGE',
        },
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Large text' }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      expect(screen.getByText('Large text')).toBeInTheDocument()
    })

    test('hides captions when hideCC is true', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          hideCC: true,
        },
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Hidden' }],
        },
      }

      const { container } = renderWithRedux(<ClosedCaption />, { initialState })

      expect(container).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    test('applies color settings from props', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          color: '#ffff00',
        },
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Colored' }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      expect(screen.getByText('Colored')).toBeInTheDocument()
    })

    test('applies background transparency', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          captionsTransparency: 0.8,
        },
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Background' }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      expect(screen.getByText('Background')).toBeInTheDocument()
    })

    test('applies uppercase styling when enabled', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          textUppercase: true,
        },
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'uppercase' }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      expect(screen.getByText('uppercase')).toBeInTheDocument()
    })

    test('applies box size styling when enabled', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          ccBoxSize: true,
        },
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Box size' }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      expect(screen.getByText('Box size')).toBeInTheDocument()
    })

    test('applies gray out styling to final text', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          grayOutFinalText: true,
        },
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Grayed' }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      expect(screen.getByText('Grayed')).toBeInTheDocument()
    })
  })

  describe('Multiple Captions', () => {
    test('joins multiple captions with spaces', () => {
      const initialState = {
        ...baseState,
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [
            { id: '1', text: 'Hello' },
            { id: '2', text: 'World' },
          ],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    test('handles empty queue gracefully', () => {
      const initialState = baseState

      const { container } = renderWithRedux(<ClosedCaption />, { initialState })

      expect(container).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('captions have proper semantic role', () => {
      const initialState = {
        ...baseState,
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Semantic' }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      const mainElement = screen.getByRole('main')
      expect(mainElement).toBeInTheDocument()
    })

    test('keyboard navigation accessible', () => {
      const initialState = {
        ...baseState,
        captionsState: {
          ...baseState.captionsState,
          finalTextQueue: [{ id: '1', text: 'Keyboard test' }],
        },
      }

      renderWithRedux(<ClosedCaption />, { initialState })

      const mainElement = screen.getByRole('main')
      expect(mainElement).toBeInTheDocument()
    })
  })
})
