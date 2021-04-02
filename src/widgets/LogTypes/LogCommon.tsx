import styled, { css } from 'styled-components'

interface IFlog {
  readonly background? : string
  readonly type? : string
  height? : string
}

export const FLogRecord = styled.div<IFlog>`
  padding: 10px;
  margin: 0;
  width: 850px;
  /* background: darkblue; */
  color: white;
  box-sizing: border-box;
  border: solid darkgray 1px;
  a:link {
    color: orange;
    background-color: transparent;
    text-decoration: none;
  }
  a:visited {
    color: orange;
    background-color: transparent;
    text-decoration: none;
  }
  a:hover {
    color: turquoise;
    background-color: transparent;
    text-decoration: none;
  }

  ${props => props.height && css`
    height: ${props.height};
  `}

  ${props => props.background && css`
    background: ${props.background};
  `}

  ${props => props.type === 'meta' && css`
    height: 70px;
    text-align: center;
  `}
`

const FDuration = styled.div`
  font-size: 20px;
`

const Grey = styled.span`
color: grey;
`

export const Duration = ({ hours, minutes }: {hours: number, minutes: number}) => {
  return (
    <FDuration>{hours} <Grey>hr</Grey> {minutes} <Grey>min</Grey></FDuration>
  )
}
