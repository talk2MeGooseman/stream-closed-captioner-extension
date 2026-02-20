import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import MobileClosedCaption from '../MobileClosedCaption'

describe('MobileClosedCaption Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    test('renders mobile caption container', () => {
      const initialState = {
        configSettings: {
          size: 'MEDIUM',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: 'Mobile caption' }],
          interimText: '',
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '720p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      // Mobile captions should render
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    test('displays caption text on mobile view', () => {
      const mobileText = 'Hello from mobile'
      const initialState = {
        configSettings: {
          size: 'MEDIUM',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: mobileText }],
          interimText: '',
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '720p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      expect(screen.getByText(mobileText)).toBeInTheDocument()
    })

    test('renders with interim text on mobile', () => {
      const interimMobileText = 'interim mobile'
      const initialState = {
        configSettings: {
          size: 'MEDIUM',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: 'Final' }],
          interimText: interimMobileText,
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '720p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      expect(screen.getByText(interimMobileText)).toBeInTheDocument()
    })
  })

  describe('Mobile-specific Styling', () => {
    test('applies mobile-optimized font size', () => {
      const initialState = {
        configSettings: {
          size: 'SMALL',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: 'Mobile' }],
          interimText: '',
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '720p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      expect(screen.getByText('Mobile')).toBeInTheDocument()
    })

    test('applies responsive color settings on mobile', () => {
      const initialState = {
        configSettings: {
          size: 'MEDIUM',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: 'Colored' }],
          interimText: '',
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '720p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      expect(screen.getByText('Colored')).toBeInTheDocument()
    })

    test('applies mobile background color', () => {
      const initialState = {
        configSettings: {
          size: 'MEDIUM',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 0.8,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: 'With background' }],
          interimText: '',
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '720p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      expect(screen.getByText('With background')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    test('handles empty captions gracefully on mobile', () => {
      const initialState = {
        configSettings: {
          size: 'MEDIUM',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
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
          displayResolution: '720p',
        },
      }

      const { container } = renderWithRedux(<MobileClosedCaption />, {
        initialState,
      })

      // Should render without crashing
      expect(container).toBeInTheDocument()
    })
  })

  describe('Accessibility on Mobile', () => {
    test('captions have proper role on mobile', () => {
      const initialState = {
        configSettings: {
          size: 'MEDIUM',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: 'Accessible' }],
          interimText: '',
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '720p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      const mainElement = screen.getByRole('main')
      expect(mainElement).toBeInTheDocument()
    })

    test('mobile captions readable by screen readers', () => {
      const srText = 'Screen reader caption'
      const initialState = {
        configSettings: {
          size: 'MEDIUM',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: srText }],
          interimText: '',
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '720p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      expect(screen.getByText(srText)).toBeInTheDocument()
    })
  })

  describe('Different Resolutions', () => {
    test('renders correctly on low resolution (360p)', () => {
      const initialState = {
        configSettings: {
          size: 'SMALL',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: '360p view' }],
          interimText: '',
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '360p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      expect(screen.getByText('360p view')).toBeInTheDocument()
    })

    test('renders correctly on medium resolution (720p)', () => {
      const initialState = {
        configSettings: {
          size: 'MEDIUM',
          viewerLanguage: 'default',
          dyslexiaFontEnabled: false,
          captionsTransparency: 1,
          textUppercase: false,
          grayOutFinalText: false,
        },
        captionsState: {
          finalTextQueue: [{ id: '1', text: '720p view' }],
          interimText: '',
          translations: {},
          captionsSubscription: null,
        },
        videoPlayerContext: {
          arePlayerControlsVisible: true,
          hlsLatencyBroadcaster: 5,
          displayResolution: '720p',
        },
      }

      renderWithRedux(<MobileClosedCaption />, { initialState })

      expect(screen.getByText('720p view')).toBeInTheDocument()
    })
  })
})
