import DtInput from '../Inputs/DtInput'
import { FLogRecord, TBaseLog } from '../LogTypes/LogCommon'
import { DataContext } from '../../providers/DataContext'
import { useContext } from 'react'

type TYoutubeLog = TBaseLog & {
  vidTitle: string
  vid: string
}

const YoutubeLog = ({ id, dt, bg, selected, vidTitle, vid }: TYoutubeLog) => {
  const dc = useContext(DataContext)

  function handleDelete () {
    dc.deleteLog(id)
  }

  if (vidTitle.length > 58) {
    vidTitle = vidTitle.slice(0, 55) + '...'
  }

  return (
    <FLogRecord title={dt.toString()} background={bg} selected={selected}>
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
