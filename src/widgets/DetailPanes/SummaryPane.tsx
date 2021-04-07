import { ILog } from '../Shared'
import { FDetailsPane } from './DetailsCommon'

type TSummaryPane = {
  log: ILog
}

const SummaryPane = ({ log }: TSummaryPane) => {
  const logId = log.id
  return (
    <FDetailsPane>
      This is the summary pane displayed for vanilla ActivityLogs that have no details
      <br /><br />
      {logId}
    </FDetailsPane>
  )
}

export default SummaryPane
