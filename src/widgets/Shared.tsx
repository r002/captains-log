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
  created : Date
  type : string
  rawInput : string
  command? : string
  vidTitle? : string
  vid? : string
}

export type TPassage = {
  id: string
  storyId: string
  content: string
  created: Date
  branch: string
}

export type TVote = {
  passageId: string,
  decision: string
  // created: Date
}

// export type TVotingRecord = {
//   parentId: string,
//   votes: TVote[]
// }
