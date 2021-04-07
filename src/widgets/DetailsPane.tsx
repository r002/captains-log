import styled from 'styled-components'
import { ILog } from './Shared'

const FDetailsPane = styled.div`
  margin-left: 30px;
  background: pink;
  padding: 20px;
  /* 
  width: 100%;
  color: lightgrey;
  box-sizing: border-box;
  border: solid darkgray 1px;
  line-height: 1.6;
  font-size: 22px; */
`

type TDetailsPane = {
  log: ILog
}

const DetailsPane = ({ log }: TDetailsPane) => {
  const vid = log?.vid ?? 'not_set'
  return (
    <FDetailsPane>
      Details Pane Here!<br /><br />
      <iframe width="560" height="315" src={'https://www.youtube.com/embed/' + vid}
        title="YouTube video player" frameBorder='0'
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
    </FDetailsPane>
  )
}

export default DetailsPane
