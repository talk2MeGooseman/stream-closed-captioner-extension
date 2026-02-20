import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  NumericInput,
  Switch,
} from '@blueprintjs/core'
import { useCallback, useState } from 'react'

import {
  getMockConfig,
  updateMockConfig,
  triggerSubscriptionEvent,
} from '@/utils/graphql-mocks'

/**
 * Dev-only dialog for controlling GraphQL mock behavior
 * Allows developers to:
 * - Enable/disable mocking
 * - Manually trigger subscription events
 * - Adjust auto-emit interval for subscriptions
 */
function DevMockControlsDialog({ isOpen, onClose }) {
  const [config, setConfig] = useState(getMockConfig())
  const [interimText, setInterimText] = useState('')
  const [finalText, setFinalText] = useState('')

  // Sync config state when dialog opens
  const handleOpening = useCallback(() => {
    setConfig(getMockConfig())
  }, [])

  // Update mock configuration
  const handleToggleMocks = useCallback((e) => {
    const enabled = e.target.checked
    updateMockConfig({ enabled })
    setConfig((prev) => ({ ...prev, enabled }))
  }, [])

  const handleToggleRealServer = useCallback((e) => {
    const useRealServer = e.target.checked
    updateMockConfig({ useRealServer })
    setConfig((prev) => ({ ...prev, useRealServer }))

    // Show alert about page refresh for WebSocket connection
    if (useRealServer) {
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }, [])

  const handleIntervalChange = useCallback((value) => {
    const mockSubscriptionInterval = value
    updateMockConfig({ mockSubscriptionInterval })
    setConfig((prev) => ({ ...prev, mockSubscriptionInterval }))
  }, [])

  // Manually trigger a caption subscription event
  const handleTriggerCaption = useCallback(() => {
    triggerSubscriptionEvent({
      interim: interimText,
      final: finalText,
      translations: {
        es: `[ES] ${finalText}`,
        fr: `[FR] ${finalText}`,
      },
    })

    // Clear inputs after triggering
    setInterimText('')
    setFinalText('')
  }, [interimText, finalText])

  const handleInterimChange = useCallback((e) => {
    setInterimText(e.target.value)
  }, [])

  const handleFinalChange = useCallback((e) => {
    setFinalText(e.target.value)
  }, [])

  return (
    <Dialog
      icon="flask"
      isOpen={isOpen}
      onClose={onClose}
      onOpening={handleOpening}
      title="GraphQL Mock Controls (Development)"
    >
      <div className={Classes.DIALOG_BODY}>
        <p className="bp3-text-muted">
          Control mock GraphQL responses for local testing. These controls are
          only available in development mode.
        </p>

        <FormGroup label="Mock Status" labelFor="mock-enabled-switch">
          <Switch
            checked={config.enabled}
            id="mock-enabled-switch"
            label={config.enabled ? 'Mocks Enabled' : 'Mocks Disabled'}
            large
            onChange={handleToggleMocks}
          />
          <p className="bp3-text-muted bp3-text-small">
            {config.enabled
              ? 'GraphQL operations are using mock responses'
              : 'GraphQL operations are using real endpoints'}
          </p>
        </FormGroup>

        <FormGroup
          helperText="Connect to the real backend server instead of using mocks (page will reload)"
          label="Server Connection"
          labelFor="real-server-switch"
        >
          <Switch
            checked={config.useRealServer || false}
            disabled={!config.enabled}
            id="real-server-switch"
            label={
              config.useRealServer
                ? 'Using Real Server'
                : 'Using Mock Responses'
            }
            large
            onChange={handleToggleRealServer}
          />
          <p className="bp3-text-muted bp3-text-small">
            {config.useRealServer
              ? 'Connected to wss://stream-cc.gooseman.codes'
              : 'Using local mock responses for testing'}
          </p>
        </FormGroup>

        <FormGroup
          helperText="Time in milliseconds between automatic caption events (0 to disable)"
          label="Auto-Emit Interval"
          labelFor="interval-input"
        >
          <NumericInput
            buttonPosition="none"
            disabled={config.useRealServer}
            fill
            id="interval-input"
            min={0}
            onValueChange={handleIntervalChange}
            stepSize={1000}
            value={config.mockSubscriptionInterval}
          />
        </FormGroup>

        <FormGroup
          helperText="Manually trigger a caption subscription event with custom text"
          label="Manual Caption Trigger"
        >
          <InputGroup
            disabled={config.useRealServer}
            fill
            onChange={handleInterimChange}
            placeholder="Interim text (optional)"
            value={interimText}
          />
          <InputGroup
            disabled={config.useRealServer}
            fill
            onChange={handleFinalChange}
            placeholder="Final text"
            style={{ marginTop: '8px' }}
            value={finalText}
          />
          <Button
            disabled={!finalText || config.useRealServer}
            fill
            intent="primary"
            onClick={handleTriggerCaption}
            style={{ marginTop: '8px' }}
            text="Trigger Caption Event"
          />
          {config.useRealServer && (
            <p
              className="bp3-text-muted bp3-text-small"
              style={{ marginTop: '8px' }}
            >
              Manual triggers are disabled when using the real server
            </p>
          )}
        </FormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Dialog>
  )
}

DevMockControlsDialog.propTypes = {}

export default DevMockControlsDialog
