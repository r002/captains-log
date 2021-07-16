import React from 'react'
import { StudyMember, Streak, RenderRecord } from '../services/GithubApi'
import styled from 'styled-components'

const FColor = styled.span`
  color: orange;
`

const FGreen = styled.span`
  color: #5ff708;
`

const FOrange = styled.span`
  color: #ec7240;
`

const FStreak: React.FC<Streak> = (streak) => {
  return (
    streak.days !== 0
      ? <span title={streak.startDate + ' to ' + streak.endDate + ' | ' + streak.days + ' days'}
          style={{ cursor: 'pointer' }}>
          {streak.days}
        </span>
      : <span>{streak.days}</span>
  )
}

type TMembersPane = {
  members: Array<StudyMember>
}
const MembersPane: React.FC<TMembersPane> = (props) => {
  return (
    <dl>
      {
        props.members.map((member: StudyMember, i: number) => {
          const handle = member.userHandle
          const rs = []
          const content =
            <div key={'member' + i} style={{ paddingLeft: '20px' }}>
              <dt>
                🧙‍♂️
                Member #{i}: <a href={'https://github.com/' + handle}>{handle}</a> |
                Start: <FColor>{(new Date(member.startDateStr)).toDateString()}</FColor> |
                Max Streak: <FOrange><FStreak {...member.streakMax} /></FOrange> |
                Record: <FGreen>{member.recordCount}</FGreen>/<FOrange>{member.daysJoined}</FOrange> |
                Current Streak: <FColor><FStreak {...member.streakCurrent} /> days</FColor> |
                Latest Card: <FGreen>#{member.latestCardNo}</FGreen> <FOrange>({member.streakCurrent.endDate})</FOrange>
              </dt>
              <dd>
                {RenderRecord(member.record, member.startDateStr)}
              </dd>
            </div>
          if (member.active) {
            rs.push(content)
          }
          // else {
          //   rs.push(<s key={'member' + i}>{content}</s>)
          // }
          return (rs)
        })
      }
    </dl>
  )
}

export default MembersPane
