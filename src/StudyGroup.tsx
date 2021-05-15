import ReactDOM from 'react-dom'
import styled, { css } from 'styled-components'
import { UserProgressDb } from './models/UserProgress'
import React from 'react'
import CountdownClock from './widgets/CountdownClock'

const uriAllCards = 'https://api.github.com/repos/r002/codenewbie/issues?since=2021-05-03&labels=daily%20accomplishment&sort=created&direction=desc'
const uriVersion = 'https://api.github.com/repos/r002/captains-log/commits?sha=sprint-grape'

type StudyMember = {
  userFullname: string
  userHandle: string
  startDateStr: string
  uid: string
}

const studyMembers: StudyMember[] = [
  {
    userFullname: 'Robert Lin',
    userHandle: 'r002',
    startDateStr: '2021-05-03T04:00:00Z',
    uid: '45280066'
  },
  {
    userFullname: 'Anita Beauchamp',
    userHandle: 'anitabe404',
    startDateStr: '2021-05-04T04:00:00Z',
    uid: '9167395'
  },
  {
    userFullname: 'Matthew Curcio',
    userHandle: 'mccurcio',
    startDateStr: '2021-05-10T04:00:00Z',
    uid: '1915749'
  }
]
const upDb = new UserProgressDb()
for (const member of studyMembers) {
  upDb.addUser(member)
}

type Commit = {
  message: string
  date: Date
}

const fetchAllCards = fetch(uriAllCards)
const fetchVersion = fetch(uriVersion)
Promise.all([fetchAllCards, fetchVersion]).then(responses => {
  const jsonAllCards = responses[0].json()
  const jsonVersion = responses[1].json()
  Promise.all([jsonAllCards, jsonVersion]).then(jsonPayloads => {
    const allCards = jsonPayloads[0]
    const allCommits = jsonPayloads[1]
    const latestCommit = {
      message: allCommits[0].commit.message,
      date: new Date(allCommits[0].commit.committer.date)
    }

    for (const item of allCards) {
      // Ad-hoc code to adjust dates of Anita's cards - 5/11/21
      // This is a total hack. Write a proper `updateCard(...)` method later
      if (item.number === 16) {
        item.created_at = '2021-05-08T04:00:00Z'
      } else if (item.number === 19) {
        item.created_at = '2021-05-09T04:00:00Z'
      } else if (item.number === 22) {
        item.created_at = '2021-05-10T04:00:00Z'
      }

      const cardInput = {
        title: item.title,
        userHandle: item.user.login,
        number: item.number,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }
      upDb.getUser(cardInput.userHandle)!.addCard(cardInput)
    }

    ReactDOM.render(
      <StudyGroup commit={latestCommit} />,
      document.querySelector('#root')
    )
  })
})

const FHorizontal = styled.div`
  display: flex;
  flex-direction: row;
`

const FVertical = styled.div`
  display: flex;
  flex-direction: column;
`

type TFCard = {
  readonly empty? : boolean
  readonly missedDay? : boolean
  readonly today? : boolean
}
const FCard = styled.div<TFCard>`
  margin: 4px;
  padding: 10px;
  background-color: #161b22;
  border-color: #30363d;
  border-width: 1px;
  border-style: solid;

  ${props => props.empty && css`
    color: #0d1117;
    background-color: #0d1117;
    border-color: #0d1117;
  `}

  ${props => props.missedDay && css`
    background-color: #300101;
  `}

  ${props => props.today && css`
    background-color: #01210a;
  `}
`

type TCard = {
  title: string
  userHandle: string
  number: number
  created: Date
  updated: Date
}
const CardComp: React.FC<TCard> = (props) => {
  const title = props.title.length > 67 ? props.title.substr(0, 64) + '...' : props.title
  return (
    <FCard>
      <a href={'https://github.com/r002/codenewbie/issues/' + props.number}>{title}</a><br />
      <span title={'Created: ' + props.created.toString()} style={{ cursor: 'pointer' }}>{props.created.toDateString()}</span>&nbsp;
      <span title={'Last updated: ' + props.updated.toString()} style={{ cursor: 'pointer' }}>(#{props.number})</span>
      {
        Date.now() - props.updated.getTime() < 3600 * 1000 &&
          <span title={'Last updated: ' + props.updated.toString()} style={{ cursor: 'pointer' }}> | 🍿</span>
      }
    </FCard>
  )
}

type TMemberCard = {
  name: string
  userHandle: string
  uid: string
}
const MemberCard: React.FC<TMemberCard> = (props) => {
  return (
    <FCard style={{ display: 'flex' }}>
      <div style={{
        backgroundImage: `url(https://avatars.githubusercontent.com/u/${props.uid}?s=62&v=4)`,
        width: '62px',
        height: '62px',
        margin: '-10px 10px -10px -10px'
      }} />
      <div>
        {props.name}<br />
        <a href={'https://github.com/' + props.userHandle}>{props.userHandle}</a>
      </div>
    </FCard>
  )
}

const EmptyCard: React.VFC = () => {
  return (
    <FCard empty={true}>
      .<br />
      .
    </FCard>
  )
}

const MissedDayCard: React.FC<{dateStr: string}> = (props) => {
  const today = new Date()
  if (today.toLocaleDateString() === props.dateStr) {
    return (
      <FCard today={true}>
        Today's contribution pending!<br />
        😀😁😄
      </FCard>
    )
  }
  return (
    <FCard missedDay={true}>
      No contribution today!<br />
      😢😦🙁
    </FCard>
  )
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dateCursor = new Date() // Start on today
const startDate = new Date('2021-05-03T04:00:00Z') // First day of our strudy group! 🥳

// Generate the date range we're interested in
type TDay = {
  dayNo: number
  dateStr: string
}
const dateRange = [] as TDay[]
while (dateCursor.getTime() >= startDate.getTime()) {
  dateRange.push({
    dayNo: dateCursor.getDay(),
    dateStr: dateCursor.toLocaleDateString()
  })
  dateCursor.setTime(dateCursor.getTime() - 86400 * 1000) // Step one day backwards until we get to the start date
}
// console.log('$$ dateRange:', dateRange)

const FLine = styled.div`
  width: 100%;
  border: 0;
  background-color: #30363d;
  height: 3px;
  margin-top: 8px;
  margin-bottom: 4px;
`

const FTopbar = styled.div`
  width: 100%;
  border: 0;
  background-color: #161b22;
  height: 60px;
  margin-top: 0;
  margin-bottom: 18px;
  padding: 19px 20px 25px 20px;
  box-sizing: border-box;
`

const FTopbarLinks = styled(FTopbar)`
  a {
    font-size: 18px;
  }
  a:link {
    color: #f0f6fc;
    text-decoration: none;
  }

  a:visited {
    color: #f0f6fc;
    text-decoration: none;
  }

  a:hover {
    color: #a5b5bb;
    text-decoration: none;
  }

  a:active {
    color: red;
  }
`

const FFooter = styled.div`
  position: fixed;
  width: 100%;
  border: 0;
  background-color: #161b22;
  height: 60px;
  bottom: 0;
  padding: 9px 15px;
  /* padding-top: 10px;
  padding-bottom: 8px; */
  box-sizing: border-box;
  text-align: right;
  color: #f0f6fc;
  font-size: 12px;
`

const FStudyGroup = styled.div`
  height: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
`

type TStudyGroup = {
  commit: Commit
}
const StudyGroup: React.FC<TStudyGroup> = (props) => {
  // console.log('>> render Study Group')
  return (
    <FStudyGroup>
      <FTopbarLinks>
        <a href='https://github.com/r002/codenewbie/discussions/30'>Specs</a>&nbsp;&nbsp;&nbsp;
        <a href='https://api.github.com/repos/r002/codenewbie/issues?since=2021-05-03&labels=daily%20accomplishment&sort=created&direction=desc'>Raw Data</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/r002/codenewbie/projects/1?fullscreen=true'>Project Board</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/r002/codenewbie/issues'>All Cards</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/r002/codenewbie/issues/4'>Members</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/r002/captains-log/blob/sprint-grape/changelog.md'>Changelog</a>&nbsp;&nbsp;&nbsp;
        <a href='https://community.codenewbie.org/r002/5-codenewbie-study-group-cohort-looking-for-study-mates-4lpj'>CodeNewbie</a>
      </FTopbarLinks>
      <div style={{ textAlign: 'center' }}>
        <CountdownClock color='white' />
      </div>
      <h2>Study Group 00:</h2>
      {
        studyMembers.map((member: StudyMember, i: number) => {
          const handle = member.userHandle
          const streak = upDb.getUser(handle)?.CurrentStreak
          const missedDays = upDb.getUser(handle)?.MissedDays
          return (
            <div key={'member' + i}>
              Member #{i}: <a href={'https://github.com/' + handle}>{handle}</a> |
              Current Streak: {streak} consecutive days |
              Missed Days: {missedDays}<br />
            </div>
          )
        })
      }
      <br />
      <h2>Progress:</h2>
      <FHorizontal>
        <FVertical>
          <FCard empty={true}>
            .<br />
            .
          </FCard>
          {
            dateRange.map((day: TDay, i: number) => {
              dateCursor.setDate(dateCursor.getDate() - 1)
              return (
                <div key={'dayDiv' + i}>
                  <FCard key={'dayCard' + i}>
                    {days[day.dayNo]}<br />
                    {day.dateStr.replace('/2021', '/21')}
                  </FCard>
                  {day.dayNo === 0 &&
                    <FLine key={'dayHr' + i} />
                  }
                </div>
              )
            })
          }
        </FVertical>
        {
          studyMembers.map((m: StudyMember, i: number) =>
            <FVertical key={'vertical' + i}>
              <MemberCard key={m.uid} name={m.userFullname} userHandle={m.userHandle} uid={m.uid} />
              {
                dateRange.map((day: TDay, i: number) => renderCard(m, day, i))
              }
            </FVertical>
          )
        }
      </FHorizontal>
      <FFooter>
        {props.commit.message}<br />
        👷‍♂️ {props.commit.date.toString()}
      </FFooter>
    </FStudyGroup>
  )
}

function renderCard (m:StudyMember, day: TDay, i: number) {
  const rs = []
  const card = upDb.getUser(m.userHandle)!.getCard(day.dateStr)
  if (card) {
    rs.push(<CardComp key={m.userHandle + i} title={card.title} userHandle={card.userHandle}
      number={card.number} created={card.created} updated={card.updated} />)
  } else if (Date.parse(day.dateStr) > Date.parse(m.startDateStr)) {
    rs.push(<MissedDayCard key={m.userHandle + i} dateStr={day.dateStr} />)
  } else {
    rs.push(<EmptyCard key={m.userHandle + i} />)
  }

  if (day.dayNo === 0 && card) {
    rs.push(
      <FLine key={'hr' + m.userHandle + i} />
    )
  }

  return (
    <div key={'container' + m.userHandle + i}>
      {rs}
    </div>
  )
}
