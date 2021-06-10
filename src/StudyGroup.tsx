import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { UserProgressDb, Tag } from './models/UserProgress'
import CountdownClock from './widgets/CountdownClock'
import { formatTime } from './lib/util'
import changelogUri from './data/changelog.json'
import './providers/AuthContext'
import firebase from 'firebase/app'

const uriAllCards = 'https://api.github.com/repos/r002/codenewbie/issues?since=2021-05-03&milestone=1&sort=created&direction=desc&per_page=100'
// const uriVersion = 'https://api.github.com/repos/r002/captains-log/commits?sha=sprint-grape'

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
  version: string
  message: string
  built: Date
}

const tagMap = new Map<string, Tag>()
tagMap.set('movie trailer', {
  name: 'movie trailer',
  icon: '🎬'
})
tagMap.set('tv show', {
  name: 'tv show',
  icon: '📺'
})
tagMap.set('youtube', {
  name: 'youtube',
  icon: '▶'
})
tagMap.set('reading', {
  name: 'reading',
  icon: '📖'
})
tagMap.set('life', {
  name: 'life',
  icon: '🌳'
})
tagMap.set('travel', {
  name: 'travel',
  icon: '🛸'
})
tagMap.set('podcast notes', {
  name: 'podcast notes',
  icon: '🎙'
})

const fetchAllCards = fetch(uriAllCards)
const fetchVersion = fetch(changelogUri)
Promise.all([fetchAllCards, fetchVersion]).then(responses => {
  const jsonAllCards = responses[0].json()
  const jsonVersion = responses[1].json()
  Promise.all([jsonAllCards, jsonVersion]).then(jsonPayloads => {
    const allCards = jsonPayloads[0]
    const allCommits = jsonPayloads[1]
    const latestCommit = {
      version: allCommits[0].version,
      message: allCommits[0].message,
      built: new Date(allCommits[0].built)
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

      const tags = [] as Tag[]
      for (const label of item.labels) {
        if (tagMap.has(label.name)) {
          tags.push(tagMap.get(label.name)!) // Why is assertion required here? 5/20/21
        }
      }

      const cardInput = {
        title: item.title,
        userHandle: item.user.login,
        number: item.number,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        tags: tags,
        comments: item.comments
      }
      upDb.getUser(cardInput.userHandle)!.setCard(cardInput)
    }

    ReactDOM.render(
      <StudyGroup commit={latestCommit} userProgressDb={upDb} />,
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

const PtrSpan = styled.span`
  cursor: pointer;
`

type TCard = {
  title: string
  userHandle: string
  number: number
  created: Date
  updated: Date
  tags: Tag[]
  comments: number
}
const CardComp: React.FC<TCard> = (props) => {
  const title = props.title.length > 51 ? props.title.substr(0, 48) + '...' : props.title
  return (
    <FCard>
      <a href={'https://github.com/r002/codenewbie/issues/' + props.number}>{title}</a>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <PtrSpan title={'Created: ' + props.created.toString()}>{formatTime(props.created)}</PtrSpan>&nbsp;
          <PtrSpan title={'Last updated: ' + props.updated.toString()}>(#{props.number})</PtrSpan>
          {props.tags.length > 0 && <>&nbsp;</>}
          {props.tags.map((tag: Tag) => <PtrSpan key={tag.name + props.number} title={tag.name}>{tag.icon}</PtrSpan>)}
          {
            Date.now() - props.updated.getTime() < 3600 * 1000 &&
              <span title={'Updated within the past hour!'} style={{ cursor: 'pointer' }}> | 🍿</span>
          }
        </div>
        <div>
          {props.comments !== 0 &&
            <span title={'Comments'} style={{ cursor: 'pointer', color: '#a5b5bb', fontSize: '13px' }}>
              {props.comments}
            </span>
          }
          {/* <span title={'Comments'} style={{ cursor: 'pointer' }}> | <svg className="octicon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
              <path fillRule="evenodd" d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"></path>
            </svg> {props.comments}</span> */}
          </div>
        </div>
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
const startDate = new Date('2021-05-03T04:00:00Z') // First day of our study group! 🥳

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
  border-top: 1px solid #30363d;
  background-color: #161b22;
  height: 60px;
  bottom: 0;
  padding: 9px 15px;
  /* padding-top: 10px;
  padding-bottom: 8px; */
  box-sizing: border-box;
  text-align: right;
  color: #a5b5bb;
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
  userProgressDb: UserProgressDb
}
const StudyGroup: React.FC<TStudyGroup> = (props) => {
  // console.log('>> render Study Group')
  // const [upDb, setUpDb] = useState<UserProgressDb>(props.userProgressDb)
  const [value, setValue] = useState(0)

  function updateDashboard (payload: any) {
    console.log('>> updateDashboard: ' + value)
    if (payload.kind === 'issue') {
      runUpdateIssueFlow(payload)
    } else if (payload.kind === 'issue_comment') {
      runUpdateIssueCommentFlow(payload)
    }
    setValue(oldVal => oldVal + 1) // Force update hack to repaint React GUI. 5/31/21
  }

  // Bug with GitHub? Comment count seems buggy. 6/1/21
  function runUpdateIssueCommentFlow (payload:any) {
    console.log('>> TODO: runUpdateIssueCommentFlow:', payload.action, payload.kind)
    // Currently broken - need to reach out to GitHub for guidance. 6/2/21
    // const dateStr = (new Date(payload.issue.created_at)).toLocaleDateString()
    // if (payload.action === 'created') {
    //   upDb.getUser(payload.issue.user.login)!.getCard(dateStr)!.comments++
    // } else if (payload.action === 'deleted') {
    //   upDb.getUser(payload.issue.user.login)!.getCard(dateStr)!.comments--
    // }
  }

  function runUpdateIssueFlow (payload:any) {
    // const dateStr = (new Date(payload.issue.created_at)).toLocaleDateString()
    // // Note: payload.action should never be 'opened' because card isn't milestoned yet.
    // if (payload.action !== 'opened') {
    //   // TODO: Test later - If this is an update, sanity check that we're updating the correct card. If multiple cards
    //   // have been added for the same date, things will break. The dashboard only expects one
    //   // "Daily Accomplishment" per day. 6/1/21
    //   if (upDb.getUser(payload.issue.user.login)!.getCard(dateStr)!.number !== payload.issue.number) {
    //     console.error(">> Card's 'Number' doesn't match! Multiple cards added for the same day?")
    //     return
    //   }
    // }
    const tags = [] as Tag[]
    for (const label of payload.issue.labels) {
      if (tagMap.has(label.name)) {
        tags.push(tagMap.get(label.name)!)
      }
    }
    const cardInput = {
      title: payload.issue.title,
      userHandle: payload.issue.user.login,
      number: payload.issue.number,
      createdAt: payload.issue.created_at,
      updatedAt: payload.issue.updated_at,
      tags: tags,
      comments: payload.issue.comments // This number doesn't reflect the latest comment just added!
    }
    upDb.getUser(cardInput.userHandle)!.setCard(cardInput)
  }

  // Listen for latest updates from Firestore
  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('ghUpdates').doc('latestUpdate')
      .onSnapshot((doc) => {
        // console.log('Data update received: ', doc.data())
        updateDashboard(doc.data())
      })
    return () => unsubscribe()
  }, [])

  return (
    <FStudyGroup>
      <FTopbarLinks>
        <a href='https://github.com/r002/codenewbie/issues/75'>Roadmap/Specs</a>&nbsp;&nbsp;&nbsp;
        <a href={uriAllCards}>Raw Data</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/r002/codenewbie/issues'>Repo</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/r002/codenewbie/issues/4'>Members</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/r002/codenewbie/discussions/30?sort=new'>History</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/r002/captains-log/blob/sprint-hala/src/data/changelog.json'>Changelog</a>&nbsp;&nbsp;&nbsp;
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
              Streak: {streak} consecutive days |
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
                dateRange.map((day: TDay, i: number) => renderCard(upDb, m, day, i))
              }
            </FVertical>
          )
        }
      </FHorizontal>
      <FFooter>
        🔖 {props.commit.version} | {props.commit.message}<br />
        👷‍♂️ {props.commit.built.toString()}
      </FFooter>
    </FStudyGroup>
  )
}

function renderCard (upDb:UserProgressDb, m:StudyMember, day: TDay, i: number) {
  const rs = []
  const card = upDb.getUser(m.userHandle)!.getCard(day.dateStr)
  if (card) {
    rs.push(<CardComp key={m.userHandle + i} title={card.title} userHandle={card.userHandle}
      number={card.number} created={card.created} updated={card.updated} tags={card.tags} comments={card.comments} />)
  } else if (Date.parse(day.dateStr) > Date.parse(m.startDateStr)) {
    rs.push(<MissedDayCard key={m.userHandle + i} dateStr={day.dateStr} />)
  } else {
    rs.push(<EmptyCard key={m.userHandle + i} />)
  }

  if (day.dayNo === 0 && Date.parse(day.dateStr) > Date.parse(m.startDateStr)) {
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
