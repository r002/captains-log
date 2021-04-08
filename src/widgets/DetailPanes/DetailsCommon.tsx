import styled, { css } from 'styled-components'

export type TFDetailsPane = {
  readonly background? : string
}

export const FDetailsPane = styled.div<TFDetailsPane>`
  margin-left: 30px;
  background: pink;
  padding: 20px;

  ${props => props.background && css`
    background: ${props.background};
  `}

  /* 
  width: 100%;
  color: lightgrey;
  box-sizing: border-box;
  border: solid darkgray 1px;
  line-height: 1.6;
  font-size: 22px; */
`
