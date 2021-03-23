import styled, { css } from 'styled-components'
import { FormattedDt, ILog } from './Shared'
import { UserContext } from '../providers/AuthContext'
import { useContext } from 'react'

interface IFlog {
  readonly background?: string
}

const FLogRecord = styled.div<IFlog>`
  padding: 10px;
  width: 900px;
  background: darkblue;
  color: white;
  box-sizing: border-box;
  border: solid darkgray 1px;

  ${props => props.background && css`
    background: ${props.background};
  `}
`

const LogRecord = ({ dt, activity, saved }: {dt: Date, activity: string, saved: boolean}) => {
  const bg = saved ? 'darkblue' : '#00468b'
  return (
    <FLogRecord title={dt.toString()} background={bg}>
      {FormattedDt(dt)} :: {activity}
    </FLogRecord>
  )
}

export const LogViewer = ({ logs }: {logs: Array<ILog>}) => {
  const { user } = useContext(UserContext)

  return (
    <>
      {logs.map((l: ILog, i: number) => <LogRecord key={'log' + i} {...l} saved={!!user} />)}
    </>
  )
}
