import styled from 'styled-components'

export const LimeGreen = styled.span`
  color: limegreen;
`

export const Yellow = styled.span`
  color: yellow;
`

// Awaiting TC39 to approve 'Temporal'! 🥴
export const FormattedDt = ({ date, includeSeconds }: {date: Date, includeSeconds: boolean}) => {
  return (
    <>
      <LimeGreen>{date.toString().slice(0, 15)} </LimeGreen>
    {includeSeconds
      ? <Yellow>{date.toString().slice(16, 24)} ET</Yellow>
      : <Yellow>{date.toString().slice(16, 21)} ET</Yellow> // Omit seconds
    }</>
  )
}

export type ILog = {
  id: string
  dt: Date
  activity: string
  type? : string
  created? : Date
  rawInput? : string
  command? : string
  vidTitle? : string
  url? : string
}
