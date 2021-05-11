import ReactDOM from 'react-dom'
import styled from 'styled-components'
// import { useState } from 'react'

const uri = 'https://api.github.com/repos/r002/codenewbie/issues?since=2021-05-03&labels=daily%20accomplishment&sort=created&direction=desc'
// const uri = 'https://api.github.com/repos/r002/codenewbie/issues?creator=r002&since=2021-05-03&labels=daily%20accomplishment&sort=created&direction=desc'

type TCard = {
  title: string
  author: string
  number: number
  created: Date
  date: string
}

const cards = new Map<string, TCard[]>()

fetch(uri)
  .then(response => response.json())
  .then(items => {
    for (const item of items) {
      const card = {
        title: item.title,
        author: item.user.login,
        number: item.number,
        created: new Date(item.created_at),
        date: ''
      }
      card.date = card.created.toLocaleDateString()
      if (cards.has(item.user.login)) {
        cards.get(item.user.login)?.push(card)
      } else {
        cards.set(item.user.login, [card])
      }
    }

    // Standardize data
    cards.get('anitabe404')!.push({ title: 'NA', author: 'anitabe404', number: 0, created: new Date(), date: '' })
    cards.get('anitabe404')!.splice(0, 0, { title: '[Placeholder]', author: 'anitabe404', number: 0, created: new Date(), date: '' })

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

const FCard = styled.div`
  margin: 10px;
  padding: 10px;
  background-color: #161b22;
`

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const startDate = new Date()
startDate.setDate(startDate.getDate() + 1) // Set to tomorrow

const Card = (props: TCard) => {
  return (
    <FCard>
      {props.number !== 0
        ? <>
            <a href={'https://github.com/r002/codenewbie/issues/' + props.number}>{props.title}</a><br />
            {props.author} {props.created.toDateString()} (#{props.number})
          </>
        : <>
            {props.title}<br />
            {props.author}
          </>
      }
    </FCard>
  )
}

const StudyGroup = () => {
  // const [cards, setCards] = useState([])
  console.log('>> cards:', cards)

  return (
    <>
      <h2>Study Group 00</h2>
      {
        ['r002', 'anitabe404', 'mccurcio'].map((handle: string, i: number) => {
          const streak = cards.get(handle)!.filter(item => item.number !== 0).length
          return (
            <div key={'member' + i}>
              Member #{i}: <a href={'https://github.com/' + handle}>{handle}</a> | Streak: {streak} consecutive days | Strikes: 0<br />
            </div>
          )
        })
      }
      <br /><br />
      <h2>Study Group 00 | Progress:</h2>
      <FHorizontal>
        <FVertical>
        {
          cards.get('r002')!.map((card: TCard, i: number) => {
            startDate.setDate(startDate.getDate() - 1)
            return (
              <FCard key={'day' + i}>
                {days[startDate.getDay()]}<br />
                {startDate.toLocaleDateString()}
              </FCard>
            )
          })
        }
        </FVertical>
        <FVertical>
        {
          cards.get('r002')!.map((card: TCard, i: number) =>
            <Card key={card.title + i} title={card.title} author={card.author} number={card.number} created={card.created}
              date={card.date} />
          )
        }
        </FVertical>
        <FVertical>
        {
          cards.get('anitabe404')!.map((card: TCard, i: number) =>
            <Card key={card.title + i} title={card.title} author={card.author} number={card.number} created={card.created}
              date={card.date} />
          )
        }
        </FVertical>
      </FHorizontal>
    </>
  )
}
