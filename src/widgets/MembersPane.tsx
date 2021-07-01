import React from 'react'
import { StudyMember } from '../services/GithubApi'

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
              Max Streak: {member.streakMax} |
              Current Streak: {member.streakCurrent} |
              Total Days: {member.recordCount}
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
