import styled from 'styled-components'

const LimeGreen = styled.span`
color: limegreen;
`

const Yellow = styled.span`
color: yellow;
`

// Awaiting TC39 to approve 'Temporal'! 🥴
export const FormattedDt = (d: Date) => {
  return (
    <><LimeGreen>{d.toString().slice(0, 15)} </LimeGreen>
      <Yellow>{d.toString().slice(16, 24)} ET</Yellow></>
      // <Yellow>{d.toString().slice(16, 21)} ET</Yellow> // Omit seconds
  )
}

export interface ILog {
  id: string
  dt: Date
  activity: string
}
