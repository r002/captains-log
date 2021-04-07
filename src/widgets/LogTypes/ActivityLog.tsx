import ActivityInput from '../Inputs/ActivityInput'
import DtInput from '../Inputs/DtInput'
import { FLogRecord, TBaseLog } from '../LogTypes/LogCommon'
import { DataContext } from '../../providers/DataContext'
import React, { useContext } from 'react'

type TActivityLog = TBaseLog & {
  activity: string
}

const ActivityLog = ({ id, dt, activity, bg, selected }: TActivityLog) => {
  const dc = useContext(DataContext)

  function handleDelete () {
    dc.deleteLog(id)
  }

  function handleClick () {
    dc.selectLog(id)
  }

  return (
    <FLogRecord title={dt.toString()} background={bg} selected={selected}
      onClick={handleClick}>
      <div style={{ background: 'transparent' }}>
        <DtInput date={dt} logId={id} /> :: <ActivityInput activity={activity} logId={id} />
      </div>
      <div style={{ background: 'transparent' }}>
        <span onClick={handleDelete} style={{ cursor: 'pointer' }}>❌</span>
      </div>
    </FLogRecord>
  )
}

export default ActivityLog
