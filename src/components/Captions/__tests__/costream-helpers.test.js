import { assembleCaptionLines, assembleCostreamInterimLines } from '../helpers'

const queue = [
  { id: 'a', text: 'hello from the host' },
  { id: 'b', guestId: '1', name: 'Alice', text: 'hi from alice' },
  { id: 'c', text: 'host again' },
]

const translations = {
  es: {
    name: 'Spanish',
    textQueue: [{ id: 't1', text: 'hola del anfitrión' }],
  },
}

describe('assembleCaptionLines with co-streamers', () => {
  test('default language interleaves guest lines name-prefixed', () => {
    const lines = assembleCaptionLines('default', queue, {}, {})

    expect(lines.map(({ text }) => text)).toStrictEqual([
      'Hello from the host.',
      'Alice: Hi from alice.',
      'Host again.',
    ])
  })

  test('guest lines are hidden when showCostream is false', () => {
    const lines = assembleCaptionLines(
      'default',
      queue,
      {},
      {
        showCostream: false,
      },
    )

    expect(lines.map(({ text }) => text)).toStrictEqual([
      'Hello from the host.',
      'Host again.',
    ])
  })

  test('defaults to showing guests when no options are passed (old call sites)', () => {
    const lines = assembleCaptionLines('default', queue, {})

    expect(lines).toHaveLength(3)
  })

  test('translated view appends guest originals after translated lines', () => {
    const lines = assembleCaptionLines('es', queue, translations, {
      showCostream: true,
      showCostreamInTranslatedView: true,
    })

    expect(lines.map(({ text }) => text)).toStrictEqual([
      'Hola del anfitrión.',
      'Alice: Hi from alice.',
    ])
  })

  test('translated view hides guests when the sub-toggle is off', () => {
    const lines = assembleCaptionLines('es', queue, translations, {
      showCostream: true,
      showCostreamInTranslatedView: false,
    })

    expect(lines.map(({ text }) => text)).toStrictEqual(['Hola del anfitrión.'])
  })
})

describe('assembleCostreamInterimLines', () => {
  test('builds name-prefixed interim lines and drops empty ones', () => {
    const lines = assembleCostreamInterimLines({
      1: { name: 'Alice', text: 'still talk' },
      2: { name: 'Bob', text: '   ' },
    })

    expect(lines).toStrictEqual([{ id: '1', text: 'Alice: still talk' }])
  })

  test('handles a missing map', () => {
    expect(assembleCostreamInterimLines(undefined)).toStrictEqual([])
  })
})
