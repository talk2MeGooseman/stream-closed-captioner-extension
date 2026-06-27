import { describe, test, expect } from 'vitest'
import { TEXT_SIZES } from '@/utils/Constants'
import {
  getMobileFontSizeStyle,
  getFontSizeStyle,
  normalizeSegment,
  getCaptionQueue,
  assembleCaptionText,
  assembleCaptionLines,
  isCaptionsHidden,
} from '../helpers'

describe('Captions Helper Functions', () => {
  describe('getFontSizeStyle', () => {
    test('returns small font size CSS variable for SMALL size', () => {
      const fontSize = getFontSizeStyle(TEXT_SIZES.SMALL)

      expect(fontSize).toBe('--small-font-size')
    })

    test('returns medium font size CSS variable for MEDIUM size', () => {
      const fontSize = getFontSizeStyle(TEXT_SIZES.MEDIUM)

      expect(fontSize).toBe('--medium-font-size')
    })

    test('returns large font size CSS variable for LARGE size', () => {
      const fontSize = getFontSizeStyle(TEXT_SIZES.LARGE)

      expect(fontSize).toBe('--large-font-size')
    })

    test('returns medium as default for unknown size', () => {
      const fontSize = getFontSizeStyle('UNKNOWN_SIZE')

      expect(fontSize).toBe('--medium-font-size')
    })

    test('returns medium as default for null', () => {
      const fontSize = getFontSizeStyle(null)

      expect(fontSize).toBe('--medium-font-size')
    })

    test('returns medium as default for undefined', () => {
      const fontSize = getFontSizeStyle(undefined)

      expect(fontSize).toBe('--medium-font-size')
    })

    test('handles all TEXT_SIZES constants', () => {
      Object.values(TEXT_SIZES).forEach((size) => {
        const fontSize = getFontSizeStyle(size)
        expect(fontSize).toMatch(/^--\w+-font-size$/)
      })
    })
  })

  describe('getMobileFontSizeStyle', () => {
    test('returns mobile small font size CSS variable for SMALL size', () => {
      const fontSize = getMobileFontSizeStyle(TEXT_SIZES.SMALL)

      expect(fontSize).toBe('--mobile-small-font-size')
    })

    test('returns mobile medium font size CSS variable for MEDIUM size', () => {
      const fontSize = getMobileFontSizeStyle(TEXT_SIZES.MEDIUM)

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('returns mobile large font size CSS variable for LARGE size', () => {
      const fontSize = getMobileFontSizeStyle(TEXT_SIZES.LARGE)

      expect(fontSize).toBe('--mobile-large-font-size')
    })

    test('returns mobile medium as default for unknown size', () => {
      const fontSize = getMobileFontSizeStyle('UNKNOWN_SIZE')

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('returns mobile medium as default for null', () => {
      const fontSize = getMobileFontSizeStyle(null)

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('returns mobile medium as default for undefined', () => {
      const fontSize = getMobileFontSizeStyle(undefined)

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('handles all TEXT_SIZES constants for mobile', () => {
      Object.values(TEXT_SIZES).forEach((size) => {
        const fontSize = getMobileFontSizeStyle(size)
        expect(fontSize).toMatch(/^--mobile-\w+-font-size$/)
      })
    })
  })

  describe('Font Size Consistency', () => {
    test('desktop and mobile small sizes are consistent', () => {
      const desktop = getFontSizeStyle(TEXT_SIZES.SMALL)
      const mobile = getMobileFontSizeStyle(TEXT_SIZES.SMALL)

      expect(desktop).toContain('small')
      expect(mobile).toContain('mobile')
      expect(mobile).toContain('small')
    })

    test('desktop and mobile medium sizes are consistent', () => {
      const desktop = getFontSizeStyle(TEXT_SIZES.MEDIUM)
      const mobile = getMobileFontSizeStyle(TEXT_SIZES.MEDIUM)

      expect(desktop).toContain('medium')
      expect(mobile).toContain('mobile')
      expect(mobile).toContain('medium')
    })

    test('desktop and mobile large sizes are consistent', () => {
      const desktop = getFontSizeStyle(TEXT_SIZES.LARGE)
      const mobile = getMobileFontSizeStyle(TEXT_SIZES.LARGE)

      expect(desktop).toContain('large')
      expect(mobile).toContain('mobile')
      expect(mobile).toContain('large')
    })
  })

  describe('normalizeSegment', () => {
    test('capitalizes the first letter and appends a period', () => {
      expect(normalizeSegment('hello world')).toBe('Hello world.')
    })

    test('leaves an existing terminal period in place', () => {
      expect(normalizeSegment('Already done.')).toBe('Already done.')
    })

    test('does not double-punctuate other terminators', () => {
      expect(normalizeSegment('really?')).toBe('Really?')
      expect(normalizeSegment('wow!')).toBe('Wow!')
      expect(normalizeSegment('to be continued…')).toBe('To be continued…')
    })

    test('recognizes terminal punctuation before a closing quote', () => {
      expect(normalizeSegment('she said "hi."')).toBe('She said "hi."')
    })

    test('recognizes CJK terminal punctuation', () => {
      expect(normalizeSegment('こんにちは。')).toBe('こんにちは。')
    })

    test('trims surrounding whitespace before normalizing', () => {
      expect(normalizeSegment('  spaced out  ')).toBe('Spaced out.')
    })

    test('returns an empty string for empty or whitespace-only input', () => {
      expect(normalizeSegment('')).toBe('')
      expect(normalizeSegment('   ')).toBe('')
    })

    test('returns an empty string for non-string input', () => {
      expect(normalizeSegment(undefined)).toBe('')
      expect(normalizeSegment(null)).toBe('')
      expect(normalizeSegment(42)).toBe('')
    })

    test('leaves an already-capitalized segment capitalized', () => {
      expect(normalizeSegment('Welcome to the stream everyone!')).toBe(
        'Welcome to the stream everyone!',
      )
    })

    test('does not append a period after a trailing separator', () => {
      expect(normalizeSegment('wait,')).toBe('Wait,')
      expect(normalizeSegment('as follows:')).toBe('As follows:')
    })

    test('does not dangle a period after a closing quote or bracket', () => {
      expect(normalizeSegment('she said "hi"')).toBe('She said "hi"')
      expect(normalizeSegment('done.))')).toBe('Done.))')
    })

    test('does not corrupt letters whose uppercase expands to multiple characters', () => {
      expect(normalizeSegment('ßomething')).toBe('ßomething.')
      expect(normalizeSegment('ﬁle name')).toBe('ﬁle name.')
    })

    test('capitalizes an astral (surrogate-pair) first letter without splitting it', () => {
      expect(normalizeSegment('𞤢bc')).toBe('𞤀bc.')
    })

    test('appends a full-width period to unpunctuated CJK segments', () => {
      expect(normalizeSegment('こんにちは')).toBe('こんにちは。')
    })

    test('appends a Latin period to unpunctuated non-CJK scripts', () => {
      expect(normalizeSegment('مرحبا')).toBe('مرحبا.')
    })
  })

  describe('getCaptionQueue', () => {
    const finalTextQueue = [{ id: '1', text: 'hello' }]
    const translations = {
      es: { name: 'Spanish', textQueue: [{ id: '1', text: 'hola' }] },
    }

    test('returns the final text queue for the default language', () => {
      expect(getCaptionQueue('default', finalTextQueue, translations)).toBe(
        finalTextQueue,
      )
    })

    test('returns the translation queue for a translated language', () => {
      expect(getCaptionQueue('es', finalTextQueue, translations)).toEqual([
        { id: '1', text: 'hola' },
      ])
    })

    test('returns an empty list when the language has no translations', () => {
      expect(getCaptionQueue('fr', finalTextQueue, translations)).toEqual([])
      expect(getCaptionQueue('fr', finalTextQueue, {})).toEqual([])
    })
  })

  describe('assembleCaptionText', () => {
    test('normalizes and joins the default queue into sentences', () => {
      const finalTextQueue = [
        { id: '1', text: 'hello world' },
        { id: '2', text: 'how are you' },
      ]

      expect(assembleCaptionText('default', finalTextQueue, {})).toBe(
        'Hello world. How are you.',
      )
    })

    test('assembles the translation queue for the active language', () => {
      const translations = {
        es: {
          name: 'Spanish',
          textQueue: [
            { id: '1', text: 'hola mundo' },
            { id: '2', text: 'que tal' },
          ],
        },
      }

      expect(assembleCaptionText('es', [], translations)).toBe(
        'Hola mundo. Que tal.',
      )
    })

    test('drops empty segments instead of leaving stray separators', () => {
      const finalTextQueue = [
        { id: '1', text: 'hello' },
        { id: '2', text: '   ' },
        { id: '3', text: 'world' },
      ]

      expect(assembleCaptionText('default', finalTextQueue, {})).toBe(
        'Hello. World.',
      )
    })

    test('returns an empty string for an empty queue', () => {
      expect(assembleCaptionText('default', [], {})).toBe('')
      expect(assembleCaptionText('fr', [], {})).toBe('')
    })
  })

  describe('assembleCaptionLines', () => {
    test('returns one normalized line per segment, keeping ids', () => {
      const finalTextQueue = [
        { id: 'a', text: 'hello world' },
        { id: 'b', text: 'how are you' },
      ]

      expect(assembleCaptionLines('default', finalTextQueue, {})).toEqual([
        { id: 'a', text: 'Hello world.' },
        { id: 'b', text: 'How are you.' },
      ])
    })

    test('returns lines from the translation queue for the active language', () => {
      const translations = {
        es: {
          name: 'Spanish',
          textQueue: [{ id: '1', text: 'hola mundo' }],
        },
      }

      expect(assembleCaptionLines('es', [], translations)).toEqual([
        { id: '1', text: 'Hola mundo.' },
      ])
    })

    test('drops empty segments', () => {
      const finalTextQueue = [
        { id: 'a', text: 'hello' },
        { id: 'b', text: '   ' },
        { id: 'c', text: 'world' },
      ]

      expect(assembleCaptionLines('default', finalTextQueue, {})).toEqual([
        { id: 'a', text: 'Hello.' },
        { id: 'c', text: 'World.' },
      ])
    })

    test('returns an empty list for an empty queue', () => {
      expect(assembleCaptionLines('default', [], {})).toEqual([])
    })
  })

  describe('isCaptionsHidden', () => {
    test('hides when the viewer has toggled captions off', () => {
      expect(isCaptionsHidden(true, 'Hello.', 'still typing')).toBe(true)
    })

    test('hides when there is no final and no interim text', () => {
      expect(isCaptionsHidden(false, '', '')).toBe(true)
    })

    test('shows when there is final caption text', () => {
      expect(isCaptionsHidden(false, 'Hello.', '')).toBe(false)
    })

    test('shows when there is interim text but no final text', () => {
      expect(isCaptionsHidden(false, '', 'typing')).toBe(false)
    })

    test('treats whitespace-only text as empty', () => {
      expect(isCaptionsHidden(false, '   ', '   ')).toBe(true)
    })

    test('tolerates undefined interim text', () => {
      expect(isCaptionsHidden(false, 'Hello.', undefined)).toBe(false)
      expect(isCaptionsHidden(false, '', undefined)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    test('handles number input in getFontSizeStyle', () => {
      const fontSize = getFontSizeStyle(123)

      expect(fontSize).toBeDefined()
      expect(fontSize).toBe('--medium-font-size')
    })

    test('handles number input in getMobileFontSizeStyle', () => {
      const fontSize = getMobileFontSizeStyle(456)

      expect(fontSize).toBeDefined()
      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('handles empty string input', () => {
      const fontSize = getFontSizeStyle('')

      expect(fontSize).toBe('--medium-font-size')
    })

    test('handles empty string input for mobile', () => {
      const fontSize = getMobileFontSizeStyle('')

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('handles object input gracefully', () => {
      const fontSize = getFontSizeStyle({})

      expect(fontSize).toBe('--medium-font-size')
    })

    test('handles array input gracefully', () => {
      const fontSize = getFontSizeStyle([])

      expect(fontSize).toBe('--medium-font-size')
    })
  })
})
