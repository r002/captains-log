import ReactDOM from 'react-dom'
import styled, { css } from 'styled-components'
import { UserProgressDb } from './models/UserProgress'
import React from 'react'

const uri = 'https://api.github.com/repos/r002/codenewbie/issues?since=2021-05-03&labels=daily%20accomplishment&sort=created&direction=desc'
// const uri = 'https://api.github.com/repos/r002/codenewbie/issues?creator=r002&since=2021-05-03&labels=daily%20accomplishment&sort=created&direction=desc'

const upDb = new UserProgressDb()

fetch(uri)
  .then(response => response.json())
  .then(items => {
    for (const item of items) {
      // Ad-hoc code to adjust dates of Anita's cards - 5/11/21
      // This is a total hack. Write a proper `updateCard(...)` method later
      if (item.number === 16) {
        item.created_at = '2021-05-08T04:38:08Z'
      } else if (item.number === 19) {
        item.created_at = '2021-05-09T04:38:08Z'
      } else if (item.number === 22) {
        item.created_at = '2021-05-10T04:38:08Z'
      }

      const cardInput = {
        title: item.title,
        userHandle: item.user.login,
        number: item.number,
        createdAt: item.created_at
      }
      upDb.addCard(cardInput)
    }

    // // Ad-hoc code to adjust dates of Anita's cards - 5/11/21
    // upDb.updateCard('anitabe404', '5/9/2021', '5/8/2021')
    // upDb.updateCard('anitabe404', '5/10/2021', '5/9/2021')
    // upDb.updateCard('anitabe404', '5/11/2021', '5/10/2021')

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
      <a href={'https://github.com/r002/codenewbie/issues/' + props.number}>{title}</a><br />
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

const MissedDayCard: React.VFC = () => {
  return (
    <FCard missedDay={true}>
      No contribution today!<br />
      😢😦🙁
    </FCard>
  )
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dateCursor = new Date() // Start on today
const startDate = new Date('2021-05-03') // First day of our strudy group! 🥳

// Generate the date range we're interested in
type TDay = {
  dayNo: number
  dateStr: string
}
const dateRange = [] as TDay[]
while (dateCursor.getDate() > startDate.getDate()) {
  dateRange.push({
    dayNo: dateCursor.getDay(),
    dateStr: dateCursor.toLocaleDateString()
  })
  dateCursor.setDate(dateCursor.getDate() - 1) // Iterate backwards until we get to the start date
}
// console.log('>> dateRange:', dateRange)

const StudyGroup = () => {
  // const [cards, setCards] = useState([])
  return (
    <>
      <h2>Study Group 00</h2>
      {
        ['r002', 'anitabe404', 'mccurcio'].map((handle: string, i: number) => {
          const streak = upDb.getCurrentStreak(handle)
          return (
            <div key={'member' + i}>
              Member #{i}: <a href={'https://github.com/' + handle}>{handle}</a> | Current Streak: {streak} consecutive days | Strikes: 0<br />
            </div>
          )
        })
      }
      <br /><br />
      <h2>Study Group 00 | Progress:</h2>
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
                  {day.dateStr}
                </FCard>
              )
            })
          }
        </FVertical>
        <FVertical>
          <MemberCard name='Robert Lin' userHandle='r002' uid='45280066' />
          {
            dateRange.map((day: TDay, i: number) => {
              const card = upDb.getCard('r002', day.dateStr)
              if (card) {
                return <CardComp key={card.title + i} title={card.title} userHandle={card.userHandle} number={card.number}
                  created={card.created} />
              }
              return <MissedDayCard key={'r002' + i} />
            })
          }
        </FVertical>
        <FVertical>
          <MemberCard name='Anita Beauchamp' userHandle='anitabe404' uid='9167395' />
          {
            dateRange.map((day: TDay, i: number) => {
              const card = upDb.getCard('anitabe404', day.dateStr)
              if (card) {
                return <CardComp key={card.title + i} title={card.title} userHandle={card.userHandle} number={card.number}
                  created={card.created} />
              } else if (Date.parse(day.dateStr) > Date.parse('2021-05-04')) {
                return <MissedDayCard key={'anitabe404' + i} />
              }
              return <EmptyCard key={'anitabe404' + i} />
            })
          }
        </FVertical>
        <FVertical>
          <MemberCard name='Matthew Curcio' userHandle='mccurcio' uid='1915749' />
          {
            dateRange.map((day: TDay, i: number) => {
              const card = upDb.getCard('mccurcio', day.dateStr)
              if (card) {
                return <CardComp key={card.title + i} title={card.title} userHandle={card.userHandle} number={card.number}
                  created={card.created} />
              } else if (Date.parse(day.dateStr) > Date.parse('2021-05-10')) {
                return <MissedDayCard key={'mccurcio' + i} />
              }
              return <EmptyCard key={'mccurcio' + i} />
            })
          }
        </FVertical>
      </FHorizontal>
    </>
  )
}
