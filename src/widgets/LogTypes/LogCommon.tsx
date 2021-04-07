import styled, { css } from 'styled-components'

export type TBaseLog = {
  id: string
  dt: Date
  bg: string
  selected: boolean
}

type TFlog = {
  readonly background? : string
  readonly type? : string
  height? : string
  selected? : boolean
}

export const FLogRecord = styled.div<TFlog>`
  padding: 10px;
  margin: 0;
  width: 850px;
  /* background: darkblue; */
  color: white;
  box-sizing: border-box;
  border: solid darkgray 1px;
  display: flex;
  justify-content: space-between;

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

  ${props => props.selected && css`
    border: solid orangered 5px;
  `}

  ${props => props.height && css`
    height: ${props.height};
  `}

  ${props => props.background && css`
    background: ${props.background};
  `}

  ${props => props.type === 'meta' && css`
    height: 70px;
    text-align: center;
    display: block;
  `}
`

// export const LogBase = () => {
//   return (
//     <FLogRecord>

//     </FLogRecord>
//   )
// }

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
