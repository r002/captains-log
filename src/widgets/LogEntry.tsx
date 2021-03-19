import styled from 'styled-components'

const Box = styled.div`
  padding: 20px;
  width: 900px;
  background: black;
  color: lightgrey;
  font-size: 16px;
  box-sizing: border-box;
  border: solid darkgray 1px;
  line-height: 1.6;
`
const DateText = styled.span`
  color: limegreen;
`

export const LogEntry = () => {
  const dt = new Date()

  return (
    <Box>
      RS <DateText>{dt.toString()}</DateText>:<br />
      $ Put text box here...
    </Box>
  )
}

const FLogRecord = styled.div`
  padding: 10px;
  width: 600px;
  background: lightgrey;
  box-sizing: border-box;
  border: solid darkgray 1px;
`

export const LogRecord = () => {
  return (
    <FLogRecord>
      Stardate: ccc
    </FLogRecord>
  )
}
