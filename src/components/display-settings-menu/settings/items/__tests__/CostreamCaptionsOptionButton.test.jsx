import CostreamCaptionsOptionButton from '../CostreamCaptionsOptionButton'

import { renderWithRedux } from '@/setupTests'
import { doneRequestingTranslationStatus } from '@/redux/translation-slice'

describe('CostreamCaptionsOptionButton', () => {
  test('renders nothing for channels outside the costream rollout', () => {
    const { queryByText } = renderWithRedux(<CostreamCaptionsOptionButton />)

    expect(queryByText('Co-Streamer Captions')).not.toBeInTheDocument()
  })

  test('renders nothing when channel info says costream is disabled', () => {
    const { queryByText, store } = renderWithRedux(
      <CostreamCaptionsOptionButton />,
    )
    store.dispatch(doneRequestingTranslationStatus({ costreamEnabled: false }))

    expect(queryByText('Co-Streamer Captions')).not.toBeInTheDocument()
  })

  test('renders the toggle once channel info says costream is enabled', async () => {
    const { findByText, store } = renderWithRedux(
      <CostreamCaptionsOptionButton />,
    )
    store.dispatch(doneRequestingTranslationStatus({ costreamEnabled: true }))

    expect(await findByText('Co-Streamer Captions')).toBeInTheDocument()
  })
})
