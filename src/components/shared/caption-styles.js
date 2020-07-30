import styled, { css } from 'styled-components'

export const CaptionsContainer = styled.div`
  display: flex;
  padding: 0px 0px;
  background: rgba(0, 0, 0, 0.7);
  flex-direction: column-reverse;
  visibility: ${(props) => (props.isHidden ? 'hidden' : 'visible')};
  ${(props) => props.mobilePanel && css`
    width: 100vw;
    height: 100vh;
    padding-bottom: 0.25em;
  `}
  ${(props) => !props.mobilePanel && css`
    cursor: move;
    width: 85%;
    line-height: var(--line-height);
    padding-bottom: var(--caption-pad-bottom);
    max-height: ${(props) => (`calc(var(${props.fontSize || '--medium-font-size'}) * var(--line-height) * ${props.numberOfLines || 3} + var(--caption-pad-bottom))`)};
  `}
  ${(props) => props.boxSize && css`
    width: ${props.boxWidth}%;
    align-self: flex-end;
  `} overflow: hidden;
`
export const Captions = styled.main`
  font-family: ${(props) => (props.fontFamily || 'Roboto')}, Arial, Helvetica, sans-serif;
  font-size: var(${(props) => (props.fontSize || '--medium-font-size')});
  color: #ffffff;
  padding: 0px 8px;
  ${(props) => props.uppercase && css`
    text-transform: uppercase;
  `}
`

export const CaptionText = styled.span`
  ${(props) => props.grayOutText && css`
    color: #D2D7D3;
  `}
  ${(props) => props.interim && css`
    margin-left: 5px;
  `}
`

export const Pulse = styled.div`
  animation: pulse 2s infinite;
  @keyframes pulse {
    0% {
      color: #ffffff;
    }
    50% {
      color: ${({ color }) => color};
    }
    100% {
      color: #ffffff;
    }
  }
`
