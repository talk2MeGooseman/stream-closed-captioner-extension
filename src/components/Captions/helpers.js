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

// Punctuation that means a segment is already finished, so we must not append
// a period. Covers sentence terminators (Latin .!?… and CJK 。！？),
// mid-sentence separators (,;: and their CJK forms), and closing quotes or
// brackets. Treating any of these as "already punctuated" avoids artifacts
// like "wait,." , "as follows:." , or a period dangling outside a quote
// ('she said "hi".') that a naive "ends in .!?" check produced.
const TRAILING_PUNCTUATION = /[.!?…。！？,;:、，；："'»”’)\]}」』】》]$/u

// CJK scripts (Han, Hiragana, Katakana, half-width Katakana) read better with a
// full-width period 。 than a Latin '.' when we add a terminator.
const CJK_SCRIPT = /[぀-ヿ㐀-䶿一-鿿ｦ-ﾟ]/u

/**
 * Capitalize the first character of a segment for display.
 *
 * Reads the first code point (so astral / surrogate-pair letters are handled),
 * and skips characters whose uppercase mapping expands to more than one
 * character (e.g. 'ß' -> 'SS', the 'ﬁ' ligature) because applying that would
 * corrupt the text rather than capitalize it. Non-cased scripts are unaffected.
 *
 * @param {string} text - already-trimmed, non-empty segment text
 * @returns {string} the segment with its first character capitalized
 */
function capitalizeFirst(text) {
  const first = String.fromCodePoint(text.codePointAt(0))
  const upper = first.toUpperCase()

  if ([...upper].length !== 1) {
    return text
  }

  return upper + text.slice(first.length)
}

/**
 * Normalize a single caption segment for display.
 *
 * Speech recognition (e.g. the browser Web Speech API the broadcaster runs)
 * emits short, lowercase, unpunctuated phrases. Capitalize the first character
 * and append a sentence terminator when the segment does not already end in
 * punctuation, so that sentence boundaries read clearly once segments are
 * joined together. CJK segments get a full-width period 。 instead of a Latin
 * one.
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

  const capitalized = capitalizeFirst(trimmed)

  if (TRAILING_PUNCTUATION.test(capitalized)) {
    return capitalized
  }

  return CJK_SCRIPT.test(capitalized) ? `${capitalized}。` : `${capitalized}.`
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
 * Join already-assembled caption lines into a single flowing string. Callers
 * that need both the line list and the paragraph form can normalize the queue
 * once via assembleCaptionLines and derive the paragraph from it with this
 * helper, instead of normalizing the queue a second time.
 *
 * @param {Array<{id: string, text: string}>} lines - normalized caption lines
 * @returns {string} the lines' text joined with spaces
 */
export function joinCaptionLines(lines) {
  return lines.map((line) => line.text).join(' ')
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
  return joinCaptionLines(
    assembleCaptionLines(viewerLanguage, finalTextQueue, translations),
  )
}

// Normalize a queue entry into a display line: co-streamer guest entries
// (which carry a name) are prefixed "Name: ", broadcaster entries unchanged.
function toDisplayLine({ id, text, name }) {
  const normalized = normalizeSegment(text)

  if (normalized.length === 0) {
    return { id, text: '' }
  }

  return { id, text: name ? `${name}: ${normalized}` : normalized }
}

/**
 * Assemble the captions as an ordered list of display lines (one per
 * recognized segment / sentence) for a roll-up layout. Each line keeps its
 * stable id so React can key it across renders; empty segments are dropped.
 *
 * Co-streamer guest lines live in finalTextQueue alongside broadcaster lines
 * (marked by their `name`/`guestId` fields) and render name-prefixed. In the
 * default language they interleave chronologically. In a translated view the
 * translation queue has no guest lines (guest text is never translated), so
 * guests' original-language lines are appended after the translated lines
 * when `showCostreamInTranslatedView` allows.
 *
 * @param {string} viewerLanguage - 'default' or a translation language code
 * @param {Array<{id: string, text: string, name?: string}>} finalTextQueue
 * @param {Object} translations - map of languageCode -> { textQueue }
 * @param {{showCostream?: boolean, showCostreamInTranslatedView?: boolean}} options
 * @returns {Array<{id: string, text: string}>} normalized, non-empty lines
 */
export function assembleCaptionLines(
  viewerLanguage,
  finalTextQueue,
  translations,
  options = {},
) {
  const { showCostream = true, showCostreamInTranslatedView = true } = options

  if (viewerLanguage === 'default') {
    return finalTextQueue
      .filter((entry) => showCostream || !entry.guestId)
      .map(toDisplayLine)
      .filter((line) => line.text.length > 0)
  }

  const translatedLines = getCaptionQueue(
    viewerLanguage,
    finalTextQueue,
    translations,
  )
    .map(toDisplayLine)
    .filter((line) => line.text.length > 0)

  if (!showCostream || !showCostreamInTranslatedView) {
    return translatedLines
  }

  const guestLines = finalTextQueue
    .filter((entry) => entry.guestId)
    .map(toDisplayLine)
    .filter((line) => line.text.length > 0)

  return [...translatedLines, ...guestLines]
}

/**
 * Build the per-guest interim lines to render below the main interim text.
 *
 * @param {Object} costreamInterim - map of guestId -> { name, text }
 * @returns {Array<{id: string, text: string}>} name-prefixed interim lines
 */
export function assembleCostreamInterimLines(costreamInterim) {
  return Object.entries(costreamInterim || {})
    .filter(([, { text }]) => (text || '').trim().length > 0)
    .map(([guestId, { name, text }]) => ({
      id: guestId,
      text: `${name}: ${text}`,
    }))
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
