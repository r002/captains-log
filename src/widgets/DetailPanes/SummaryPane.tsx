import { ILog } from '../Shared'
import { FDetailsPane } from './DetailsCommon'

type TSummaryPane = {
  logs: Array<ILog>
}

const SummaryPane = ({ logs }: TSummaryPane) => {
  // Summarize YoutubeLogs list
  // const summary = logs.reduce((acc: Array<any>, log) => {
  //   console.log(log.type)
  //   if (log.type === 'YoutubeLog') {
  //     return [...acc, log.vidTitle]
  //   }
  //   return acc
  // }, [] as Array<string>)
  const summary = logs.filter(l => l.type === 'YoutubeLog')

  return (
    <FDetailsPane background='lightblue'>
      This is the summary pane displayed for vanilla ActivityLogs that have no details:
      <br /><br />
      {summary.map(l =>
        <div key={l.id}>
          <a href={'https://youtu.be/' + l.vid}>{l.vidTitle}</a>
        </div>)}
    </FDetailsPane>
  )
}

export default SummaryPane
