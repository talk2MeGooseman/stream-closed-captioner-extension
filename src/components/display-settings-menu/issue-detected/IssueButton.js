import { Tooltip, Dialog, Classes, Button } from '@blueprintjs/core'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useCallback } from 'react'

import { Pulse } from '../../shared/caption-styles'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

const IssueButton = () => {
  const hasCaptions = useShallowEqualSelector(
    (state) =>
      state.captionsState.finalTextQueue.length > 0 ||
      state.captionsState.interimText.length > 0,
  )
  const [displayDialog, setDisplayDialog] = useState(false)

  const openDialog = useCallback(() => {
    setDisplayDialog(true)
  }, [setDisplayDialog])

  const closeDialog = useCallback(() => {
    setDisplayDialog(false)
  }, [setDisplayDialog])

  if (hasCaptions) {
    return null
  }

  return (
    <>
      <Tooltip content="Captions Issue Detected">
        <Pulse color="#ff0000">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            onClick={openDialog}
            size="2x"
          />
        </Pulse>
      </Tooltip>
      <Dialog
        isOpen={displayDialog}
        onClose={closeDialog}
        title="Captions issue detected"
      >
        <div className={Classes.DIALOG_BODY}>
          <p>Closed Captions from the broadcaster are not detected.</p>
          <p>
            Short Troubleshooting Steps:
            <ol>
              <li>
                Refresh the page. Sometimes there is an issue with Twitch
                properly sending captions when first entering a channel.
              </li>
              <li>
                Ask the broadcaster if they have captions on. If they don&apos;t
                they can visit https://stream-cc.gooseman.codes/dashboard on
                Chrome and turn ON captions
              </li>
            </ol>
          </p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={closeDialog}>Close</Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default IssueButton
