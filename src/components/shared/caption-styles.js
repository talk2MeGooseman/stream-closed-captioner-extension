import styled, { css } from 'styled-components'

export const CaptionsContainer = styled.div`
  padding: 0px 0px;
  background: rgba(0, 0, 0, 0.7);
  width: 85%;
  display: flex;
  flex-direction: column-reverse;
  line-height: var(--line-height);
  padding-bottom: var(--caption-pad-bottom);
  cursor: move;
  overflow: hidden;
  max-height: ${(props) => (`calc(var(${props.fontSize || '--medium-font-size'}) * var(--line-height) * ${props.numberOfLines || 3} + var(--caption-pad-bottom))`)};
  visibility: var(${(props) => (props.isHidden ? 'hidden' : 'visible')});
  ${(props) => props.boxSize && css`
    width: 30%;
    align-self: flex-end;
  `}
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
