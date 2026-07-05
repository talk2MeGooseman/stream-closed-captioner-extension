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
import {
  getLocalDevSession,
  setLocalDevChannel,
  clearLocalDevSession,
  hasLocalDevToken,
} from '@/utils/localDevSession'

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
  const [liveChannelInput, setLiveChannelInput] = useState('')
  const [connectedChannel, setConnectedChannel] = useState('')
  const [hasDevToken, setHasDevToken] = useState(false)

  // Sync config state when dialog opens
  const handleOpening = useCallback(() => {
    setConfig(getMockConfig())
    setConnectedChannel(getLocalDevSession()?.channelId || '')
    setHasDevToken(hasLocalDevToken())
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

  const handleLiveChannelChange = useCallback((e) => {
    setLiveChannelInput(e.target.value)
  }, [])

  // Switch the local build to a different live channel (reuses the stored
  // token) and reload so the websocket reconnects with the new subscription.
  // The real-server flag is re-applied by loadLocalDevSession() after reload,
  // so there's no need to set it here (it would be discarded by the reload).
  const handleConnectLiveChannel = useCallback(() => {
    const channelId = liveChannelInput.trim()

    // Without a seeded token, reloading can't connect — so don't bother.
    if (!channelId || !hasLocalDevToken()) {
      return
    }

    setLocalDevChannel(channelId)
    window.location.reload()
  }, [liveChannelInput])

  const handleClearLiveSession = useCallback(() => {
    clearLocalDevSession()
    window.location.reload()
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
        <p className="bp5-text-muted">
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
          <p className="bp5-text-muted bp5-text-small">
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
          <p className="bp5-text-muted bp5-text-small">
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
              className="bp5-text-muted bp5-text-small"
              style={{ marginTop: '8px' }}
            >
              Manual triggers are disabled when using the real server
            </p>
          )}
        </FormGroup>

        <FormGroup
          helperText="Connect to a real, currently-live broadcaster's captions. Open a link from the admin 'Local Extension Testing' page, or paste a channel id below to switch (reuses the stored token)."
          label="Live Channel (Dev)"
          labelFor="live-channel-input"
        >
          <p className="bp5-text-muted bp5-text-small">
            {connectedChannel
              ? `Connected to channel ${connectedChannel}`
              : 'No live session active'}
          </p>
          {!hasDevToken && (
            <p className="bp5-text-muted bp5-text-small">
              No socket token loaded — open a link from the admin &quot;Local
              Extension Testing&quot; page first to seed one.
            </p>
          )}
          <InputGroup
            disabled={!hasDevToken}
            fill
            id="live-channel-input"
            onChange={handleLiveChannelChange}
            placeholder="Twitch channel/user id"
            style={{ marginTop: '8px' }}
            value={liveChannelInput}
          />
          <Button
            disabled={!hasDevToken || !liveChannelInput.trim()}
            fill
            intent="primary"
            onClick={handleConnectLiveChannel}
            style={{ marginTop: '8px' }}
            text="Connect to live channel"
          />
          {connectedChannel && (
            <Button
              fill
              intent="danger"
              minimal
              onClick={handleClearLiveSession}
              style={{ marginTop: '8px' }}
              text="Disconnect live session"
            />
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
