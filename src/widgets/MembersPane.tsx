import React from 'react'
import { StudyMember, Streak } from '../services/GithubApi'

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
                Start: {(new Date(member.startDateStr)).toDateString()} |
                Streak Max: <FStreak {...member.streakMax} /> |
                Total Days: {member.recordCount}/{member.daysJoined}
              </dt>
              <dd>
                Streak Current: <FStreak {...member.streakCurrent} /> days |
                Lastest Submission: { member.streakCurrent.endDate !== '' ? member.streakCurrent.endDate : 'N/A'}
              </dd>
            </div>
          if (member.active) {
            rs.push(content)
          } else {
            rs.push(<s key={'member' + i}>{content}</s>)
          }
          return (rs)
        })
      }
    </dl>
  )
}

export default MembersPane
