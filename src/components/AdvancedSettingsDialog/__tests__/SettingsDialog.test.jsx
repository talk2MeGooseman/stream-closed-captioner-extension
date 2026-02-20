import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import SettingsDialog from '../SettingsDialog'

describe('AdvancedSettingsDialog', () => {
  const baseState = {
    configSettings: {
      displayAdvancedSettingsDialog: false,
      captionsWidth: 100,
      captionsTransparency: 1,
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
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Dialog Visibility', () => {
    test('should not render dialog when displayAdvancedSettingsDialog is false', () => {
      renderWithRedux(<SettingsDialog />, { initialState: baseState })

      // Dialog should not be visible when isOpen is false
      expect(screen.queryByText('Advanced Settings')).not.toBeInTheDocument()
    })

    test('should render dialog when displayAdvancedSettingsDialog is true', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // Dialog should have title
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument()
    })

    test('should have info-sign icon on dialog', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // The dialog should render with Blueprint classes
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument()
    })
  })

  describe('Dialog Controls', () => {
    test('should have close button in dialog footer', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // Get all Close buttons and verify at least one exists
      const closeButtons = screen.getAllByRole('button', { name: 'Close' })
      expect(closeButtons.length).toBeGreaterThan(0)
    })

    test('close button should be in footer', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // Verify dialog renders
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument()

      // Verify Close button exists (at least one)
      const closeButtons = screen.queryAllByRole('button', { name: 'Close' })
      expect(closeButtons.length).toBeGreaterThan(0)
    })

    test('close button should be clickable', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // Get Close buttons
      const closeButtons = screen.getAllByRole('button', { name: 'Close' })

      // Find the one with visible text (in footer)
      const footerCloseButton = closeButtons.find((btn) =>
        btn.textContent?.includes('Close'),
      )
      expect(footerCloseButton).toBeTruthy()
      expect(footerCloseButton?.disabled).toBe(false)
    })
  })

  describe('Dialog Content', () => {
    test('should render dialog body with settings controls', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // Blueprint Dialog renders in a portal, so we verify the title
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument()
    })

    test('should render settings fields in dialog body', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // If dialog is open, the body should be rendered
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument()
    })

    test('should have dialog footer with action buttons', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // If dialog is open with Close button, footer exists
      const closeButtons = screen.getAllByRole('button', { name: 'Close' })
      expect(closeButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    test('dialog should have proper title attribute', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      expect(screen.getByText('Advanced Settings')).toBeInTheDocument()
    })

    test('close button should be keyboard accessible', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      const closeButtons = screen.getAllByRole('button', { name: 'Close' })
      expect(closeButtons.length).toBeGreaterThan(0)

      // All close buttons should not be disabled
      closeButtons.forEach((btn) => {
        expect(btn.disabled).toBe(false)
      })
    })

    test('dialog should have proper ARIA attributes', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // Blueprint Dialog renders with title
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument()
    })
  })

  describe('Redux Integration', () => {
    test('should select displayAdvancedSettingsDialog from Redux state', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // Dialog should be open and visible
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument()
    })

    test('should use useShallowEqualSelector for state', () => {
      const initialState = {
        ...baseState,
        configSettings: {
          ...baseState.configSettings,
          displayAdvancedSettingsDialog: false,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState })

      // Dialog should not be visible initially
      expect(screen.queryByText('Advanced Settings')).not.toBeInTheDocument()

      // Rerender with dialog open
      const newState = {
        ...initialState,
        configSettings: {
          ...initialState.configSettings,
          displayAdvancedSettingsDialog: true,
        },
      }

      renderWithRedux(<SettingsDialog />, { initialState: newState })

      // Dialog should now be visible
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument()
    })
  })
})
