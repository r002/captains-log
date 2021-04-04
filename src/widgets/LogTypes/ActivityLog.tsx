import ActivityInput from '../Inputs/ActivityInput'
import DtInput from '../Inputs/DtInput'
import { FLogRecord, TBaseLog } from '../LogTypes/LogCommon'
import { DataContext } from '../../providers/DataContext'
import { useContext } from 'react'

type TActivityLog = TBaseLog & {
  activity: string
}

const ActivityLog = ({ id, dt, activity, bg, selected }: TActivityLog) => {
  const dc = useContext(DataContext)

  function handleDeleteAction () {
    dc.deleteLog(id)
  }

  return (
    <FLogRecord title={dt.toString()} background={bg} selected={selected}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ background: 'transparent' }}>
          <DtInput date={dt} logId={id} /> :: <ActivityInput activity={activity} logId={id} />
        </div>
        <div style={{ background: 'transparent' }}>
          <span onClick={handleDeleteAction} style={{ cursor: 'pointer' }}>❌</span>
        </div>
      </div>
    </FLogRecord>
  )
}

export default ActivityLog
