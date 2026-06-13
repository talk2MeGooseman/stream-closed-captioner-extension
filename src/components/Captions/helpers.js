/* eslint-disable indent */
import { TEXT_SIZES } from '@/utils/Constants'
import { pathOr } from 'ramda'

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

/**
 * Select the caption segment queue to display for the active viewer language.
 * Falls back to an empty list when the language has no translations yet.
 *
 * @param {string} viewerLanguage - 'default' or a translation language code
 * @param {Array<{id: string, text: string}>} finalTextQueue - source captions
 * @param {Object} translations - map of languageCode -> { textQueue }
 * @returns {Array<{id: string, text: string}>} segments for the language
 */
export function getCaptionQueue(viewerLanguage, finalTextQueue, translations) {
  if (viewerLanguage === 'default') {
    return finalTextQueue
  }

  return pathOr([], [viewerLanguage, 'textQueue'], translations)
}

/**
 * Assemble the caption text shown for the active viewer language: select the
 * right queue, normalize each segment so sentence boundaries are clear, drop
 * empty segments, and join them into a single string.
 *
 * @param {string} viewerLanguage - 'default' or a translation language code
 * @param {Array<{id: string, text: string}>} finalTextQueue - source captions
 * @param {Object} translations - map of languageCode -> { textQueue }
 * @returns {string} the assembled caption text ('' when there is nothing)
 */
export function assembleCaptionText(
  viewerLanguage,
  finalTextQueue,
  translations,
) {
  return getCaptionQueue(viewerLanguage, finalTextQueue, translations)
    .map(({ text }) => normalizeSegment(text))
    .filter(Boolean)
    .join(' ')
}

/**
 * Decide whether the caption box should be hidden. The box hides when the
 * viewer has toggled captions off, or when there is nothing to display. Pass
 * only the interim text that actually renders for the active language so an
 * off-screen interim string can't keep an empty box visible.
 *
 * @param {boolean} hideCC - viewer's manual hide toggle
 * @param {string} captionText - assembled final caption text
 * @param {string} interimText - interim text that will render, if any
 * @returns {boolean} true when the box should be hidden
 */
export function isCaptionsHidden(hideCC, captionText, interimText) {
  if (hideCC) {
    return true
  }

  const hasFinal = captionText.trim().length > 0
  const hasInterim = (interimText || '').trim().length > 0

  return !hasFinal && !hasInterim
}
