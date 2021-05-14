import ReactDOM from 'react-dom'
import styled, { css } from 'styled-components'
import { UserProgressDb } from './models/UserProgress'
import React from 'react'
import CountdownClock from './widgets/CountdownClock'

const uri = 'https://api.github.com/repos/r002/codenewbie/issues?since=2021-05-03&labels=daily%20accomplishment&sort=created&direction=desc'
// const uri = 'https://api.github.com/repos/r002/codenewbie/issues?creator=r002&since=2021-05-03&labels=daily%20accomplishment&sort=created&direction=desc'

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

fetch(uri)
  .then(response => response.json())
  .then(items => {
    for (const item of items) {
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
        createdAt: item.created_at
      }
      upDb.getUser(cardInput.userHandle)!.addCard(cardInput)
    }

    ReactDOM.render(
      <StudyGroup />,
      document.querySelector('#root')
    )
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
}
const CardComp: React.FC<TCard> = (props) => {
  const title = props.title.length > 67 ? props.title.substr(0, 64) + '...' : props.title
  return (
    <FCard>
      <a href={'https://github.com/r002/codenewbie/issues/' + props.number} title={props.created.toString()}>{title}</a><br />
      {props.userHandle} {props.created.toDateString()} (#{props.number})
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

const StudyGroup = () => {
  // const [cards, setCards] = useState([])
  return (
    <>
      <br />
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
                <FCard key={'day' + i}>
                  {days[day.dayNo]}<br />
                  {day.dateStr.replace('/2021', '/21')}
                </FCard>
              )
            })
          }
        </FVertical>
        {
          studyMembers.map((m: StudyMember, i: number) =>
            <FVertical key={'vertical' + i}>
              <MemberCard key={m.uid} name={m.userFullname} userHandle={m.userHandle} uid={m.uid} />
              {
                dateRange.map((day: TDay, i: number) => {
                  const card = upDb.getUser(m.userHandle)!.getCard(day.dateStr)
                  if (card) {
                    return <CardComp key={m.userHandle + i} title={card.title} userHandle={card.userHandle} number={card.number}
                      created={card.created} />
                  } else if (Date.parse(day.dateStr) > Date.parse(m.startDateStr)) {
                    return <MissedDayCard key={m.userHandle + i} dateStr={day.dateStr} />
                  }
                  return <EmptyCard key={m.userHandle + i} />
                })
              }
            </FVertical>
          )
        }
      </FHorizontal>
    </>
  )
}
