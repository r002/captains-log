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
    <>
      {
        props.members.map((member: StudyMember, i: number) => {
          const handle = member.userHandle
          const rs = []
          const content =
            <div key={'member' + i}>
              Member #{i}: <a href={'https://github.com/' + handle}>{handle}</a> |
              Start: {(new Date(member.startDateStr)).toDateString()} |
              Streaks (Max/Current): <FStreak {...member.streakMax} />/<FStreak {...member.streakCurrent} /> |
              Total Days: {member.recordCount}/{member.daysJoined}
              <br />
            </div>
          if (member.active) {
            rs.push(content)
          } else {
            rs.push(<s key={'member' + i}>{content}</s>)
          }
          return (rs)
        })
      }
    </>
  )
}

export default MembersPane
