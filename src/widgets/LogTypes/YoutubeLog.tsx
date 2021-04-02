import DtInput from '../Inputs/DtInput'
import { sendLogDelete } from '../../services/Internal'
import { FLogRecord } from '../LogTypes/LogCommon'

type TYoutubeLog = {
  bg: string
  id: string
  dt: Date
  vidTitle: string
  vid: string
}

const YoutubeLog = ({ id, dt, vidTitle, vid, bg }: TYoutubeLog) => {
  function handleDelete () {
    sendLogDelete(id)
  }

  if (vidTitle.length > 58) {
    vidTitle = vidTitle.slice(0, 55) + '...'
  }

  return (
    <FLogRecord title={dt.toString()} background={bg}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <DtInput date={dt} logId={id} /> :: <a href={`https://youtu.be/${vid}`}>{vidTitle}</a>
        </div>
        <div>
          {/* <img src={`https://i.ytimg.com/vi/${vid}/default.jpg`}
            style={{ margin: '-10px' }} /> */}
          <span onClick={handleDelete} style={{ cursor: 'pointer' }}>❌</span>
        </div>
      </div>
    </FLogRecord>
  )
}

export default YoutubeLog
