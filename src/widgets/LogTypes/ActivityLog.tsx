import { ILog } from '../Shared'
import ActivityInput from '../Inputs/ActivityInput'
import DtInput from '../Inputs/DtInput'
import { sendLogDelete } from '../../services/Internal'
import { FLogRecord } from './LogCommon'

type TActivityLog = ILog & {
  bg: string
}

const ActivityLog = ({ id, dt, activity, bg }: TActivityLog) => {
  function handleDeleteAction () {
    sendLogDelete(id)
  }

  return (
    <FLogRecord title={dt.toString()} background={bg}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ background: 'transparent' }}>
          <DtInput date={dt} logId={id} /> :: <ActivityInput activity={activity} logId={id} />
        </div>
        <div style={{ background: 'transparent' }}>
          {/* <span data-action='editLog' id={id} onClick={handleEditAction} style={{ cursor: 'pointer' }}>📝</span>&nbsp; */}
          <span onClick={handleDeleteAction} style={{ cursor: 'pointer' }}>❌</span>
        </div>
      </div>
    </FLogRecord>
  )
}

export default ActivityLog
