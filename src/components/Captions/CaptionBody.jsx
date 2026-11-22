import PropTypes from 'prop-types'

import { CaptionText } from '../shared/caption-styles'

/**
 * Shared caption rendering for both the desktop and mobile caption views. The
 * final captions render either as one block per recognized segment (roll-up
 * layout) or as a single flowing paragraph, followed by the interim text when
 * there is any. Both views feed `interimText` that is already empty unless it
 * should render, so the interim block needs no further language check here.
 *
 * Not wrapped in memo(): the parents rebuild `captionLines` every render, so a
 * shallow prop compare would always miss. The leaf CaptionText spans are
 * already memoized, so unchanged lines skip DOM work without it.
 */
function CaptionBody({
  rollUpCaptions,
  captionLines,
  captionText,
  grayOutFinalText,
  interimText,
  costreamInterimLines = [],
}) {
  return (
    <>
      {rollUpCaptions ? (
        captionLines.map((line) => (
          <CaptionText key={line.id} $block $grayOutText={grayOutFinalText}>
            {line.text}
          </CaptionText>
        ))
      ) : (
        <CaptionText $grayOutText={grayOutFinalText}>{captionText}</CaptionText>
      )}
      {interimText && (
        <CaptionText $block={rollUpCaptions} $interim>
          {interimText}
        </CaptionText>
      )}
      {costreamInterimLines.map((line) => (
        <CaptionText key={line.id} $block={rollUpCaptions} $interim>
          {line.text}
        </CaptionText>
      ))}
    </>
  )
}

CaptionBody.propTypes = {
  rollUpCaptions: PropTypes.bool,
  captionLines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
  captionText: PropTypes.string.isRequired,
  grayOutFinalText: PropTypes.bool,
  interimText: PropTypes.string,
  costreamInterimLines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ),
}

export default CaptionBody
