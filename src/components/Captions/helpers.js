/* eslint-disable indent */
import { TEXT_SIZES } from '@/utils/Constants'

export function getMobileFontSizeStyle(size) {
  let fontSize

  switch (size) {
    case TEXT_SIZES.SMALL:
      fontSize = '--mobile-small-font-size'
      break
    case TEXT_SIZES.MEDIUM:
      fontSize = '--mobile-medium-font-size'
      break
    case TEXT_SIZES.LARGE:
      fontSize = '--mobile-large-font-size'
      break
    default:
      fontSize = '--mobile-medium-font-size'
      break
  }

  return fontSize
}

export function getFontSizeStyle(size) {
  let fontSize

  switch (size) {
    case TEXT_SIZES.SMALL:
      fontSize = '--small-font-size'
      break
    case TEXT_SIZES.MEDIUM:
      fontSize = '--medium-font-size'
      break
    case TEXT_SIZES.LARGE:
      fontSize = '--large-font-size'
      break
    default:
      fontSize = '--medium-font-size'
      break
  }

  return fontSize
}

// Terminal punctuation across the scripts we display, optionally followed by a
// closing quote or bracket. Covers Latin (.!?…) and common CJK (。！？)
// terminators so an already-punctuated segment is left untouched.
const TERMINAL_PUNCTUATION = /[.!?…。！？]["'»”’)\]]?$/u

/**
 * Normalize a single caption segment for display.
 *
 * Speech recognition (e.g. the browser Web Speech API the broadcaster runs)
 * emits short, lowercase, unpunctuated phrases. Capitalize the first character
 * and append a period when the segment does not already end in terminal
 * punctuation, so that sentence boundaries read clearly once segments are
 * joined together. Non-cased scripts are unaffected by the capitalization.
 *
 * @param {string} text - Raw caption segment text
 * @returns {string} Normalized segment, or '' when there is nothing to show
 */
export function normalizeSegment(text) {
  if (typeof text !== 'string') {
    return ''
  }

  const trimmed = text.trim()

  if (trimmed.length === 0) {
    return ''
  }

  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)

  return TERMINAL_PUNCTUATION.test(capitalized)
    ? capitalized
    : `${capitalized}.`
}
