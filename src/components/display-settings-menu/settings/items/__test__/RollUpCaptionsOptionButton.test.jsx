import { fireEvent } from '@testing-library/react'

import RollUpCaptionsOptionButton from '../RollUpCaptionsOptionButton'

import { renderWithRedux } from '@/setupTests'

describe('rollUpCaptionsOptionButton', () => {
  test('renders the toggle item', () => {
    const { queryByText } = renderWithRedux(<RollUpCaptionsOptionButton />)

    expect(queryByText('Line-By-Line Captions')).toBeInTheDocument()
  })

  test('toggles the roll-up layout flag on click', () => {
    const { queryByText, store } = renderWithRedux(
      <RollUpCaptionsOptionButton />,
    )

    const { configSettings: defaultSetting } = store.getState()

    expect(defaultSetting.rollUpCaptions).toStrictEqual(true)
    fireEvent.click(queryByText('Line-By-Line Captions'))
    const { configSettings: newConfigs } = store.getState()

    expect(newConfigs.rollUpCaptions).toStrictEqual(false)
  })
})
