import { ILog } from '../Shared'
import { FDetailsPane } from './DetailsCommon'

type TYoutubePane = {
  log: ILog
}

const YoutubePane = ({ log }: TYoutubePane) => {
  const vid = log?.vid ?? 'not_set'
  return (
    <FDetailsPane>
      Youtube Details Pane Here!<br /><br />
      <iframe width="560" height="315" src={'https://www.youtube.com/embed/' + vid}
        title="YouTube video player" frameBorder='0'
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
    </FDetailsPane>
  )
}

export default YoutubePane
