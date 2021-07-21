import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { UserProgressDb, Tag } from './models/UserProgress'
import { StudyMember } from './models/StudyMember'
import CountdownClock from './widgets/CountdownClock'
import MembersPane from './widgets/MembersPane'
import * as util from './lib/util'
import changelogUri from './data/changelog.json'
import './providers/AuthContext'
import firebase from 'firebase/app'
import { getUpDb, tagMap, uriAllCards } from './services/GithubApi'

// Display cards for a specific date if passed in; else, display the current month's cards
const m = window.location.href.match(/^.*d=(\d{4}-\d{2})$/) // d is expected to be YYYY-MM; eg. "2021-06"
const initialDate = m?.[1] ? new Date(Date.parse(m?.[1] + '-01T04:00:00Z')) : new Date() // Currently assume ET - 7/6/21

type Commit = {
  version: string
  message: string
  built: Date
}

const fetchVersion = fetch(changelogUri)
Promise.all([fetchVersion, getUpDb(initialDate)]).then(responses => {
  const jsonVersion = responses[0].json()
  const initialUpDb = responses[1]
  Promise.all([jsonVersion]).then(jsonPayloads => {
    const allCommits = jsonPayloads[0]
    const latestCommit = {
      version: allCommits[0].version,
      message: allCommits[0].message,
      built: new Date(allCommits[0].built)
    }

    ReactDOM.render(
      <StudyGroup commit={latestCommit} userProgressDb={initialUpDb} initialDate={initialDate} />,
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
  repo: string
}
const CardComp: React.FC<TCard> = (props) => {
  const title = props.title.length > 51 ? props.title.substr(0, 48) + '...' : props.title
  return (
    <FCard>
      <a href={props.repo + '/issues/' + props.number} target='_top'>{title}</a>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <PtrSpan title={'Created: ' + props.created.toString()}>{util.formatTime(props.created)}</PtrSpan>&nbsp;
          <PtrSpan title={'Last updated: ' + props.updated.toString()}>(#{props.number})</PtrSpan>
          {props.tags.length > 0 && <>&nbsp;</>}
          {props.tags.map((tag: Tag) => <PtrSpan key={tag.name + props.number} title={tag.name}>{tag.icon}</PtrSpan>)}
          {
            Date.now() - props.updated.getTime() < 3600 * 1000 &&
              <span title={'Updated within the past hour!'} style={{ cursor: 'pointer' }}> | 🍿</span>
          }
        </div>
        <div style ={{ marginTop: '5px', marginBottom: '-6px', marginRight: '-2px' }}>
          {props.comments !== 0 &&
            <span title={'Comments'} style={{ cursor: 'pointer', fontSize: '14px' }}>
              <svg className="octicon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                <path fillRule="evenodd" d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"></path>
              </svg>
              <span className="commentNo">{props.comments}</span>
            </span>
          }
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
    <FCard style={{ display: 'flex', minWidth: '300px' }}>
      <div style={{
        backgroundImage: `url(https://avatars.githubusercontent.com/u/${props.uid}?s=62&v=4)`,
        width: '62px',
        height: '62px',
        margin: '-10px 10px -10px -10px'
      }} />
      <div>
        {props.name}<br />
        <a href={'https://github.com/' + props.userHandle} target='_top'>{props.userHandle}</a>
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
  margin: 0 0 60px 0;
  padding: 0;
`

const FMonthTitle = styled.span`
  font-size: 18px;
  color: white;
  background: #161b22;
  border: 1px #30363d solid;
  padding: 3px 3px 5px 3px;
  margin: 10px;
`

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type TStudyGroup = {
  commit: Commit
  userProgressDb: UserProgressDb
  initialDate: Date
}

let globalInitialLoad = true // Hack. 7/8/21
let globalUpDb: UserProgressDb

const StudyGroup: React.FC<TStudyGroup> = (props) => {
  const [upDb, setUpDb] = useState<UserProgressDb>(props.userProgressDb)
  const [value, setValue] = useState(new Date())
  const [curDate, setCurDate] = useState(props.initialDate)
  const [members, setMembers] = useState<Array<StudyMember>>([])
  // console.log('>> curDate - initial load:', curDate)

  // Set local instance to global instance
  globalUpDb = upDb

  // Load cards
  useEffect(() => {
    if (curDate !== props.initialDate) {
      console.log('>> Changing date periods', curDate)
      Promise.resolve(getUpDb(curDate)).then(rs => setUpDb(rs))
    }
    history.pushState({}, '', '/studydash/?d=' + curDate.toISOString().slice(0, 7))
    window.parent.postMessage(window.location.href, '*')
  }, [curDate])

  // This should NOT run on initial load. 7/8/21
  function updateDashboard (payload: any) {
    if (globalInitialLoad) {
      console.log('>> Initial load detected. Skipping dashboard refresh')
      globalInitialLoad = false // Flip the one-time flag. Hack. 7/8/21
    } else {
      console.log('>> updateDashboard:', payload.dt.toDate().toISOString(), payload.issue.number, payload.issue.title, payload.kind)
      if (payload.kind === 'issue') {
        runUpdateIssueFlow(payload)
      } else if (payload.kind === 'issue_comment') {
        runUpdateIssueCommentFlow(payload)
      }
      setValue(new Date()) // Force update hack to repaint React GUI. 5/31/21
    }
  }

  function runUpdateIssueCommentFlow (payload:any) {
    // For now, until GitHub fixes the `comments number payload` bug, just
    // query the GitHub REST API to refresh the entire GUI to get all up-to-date comment counts. 7/8/21
    console.log('\t>> Run: UpdateIssueCommentFlow:', payload.action, payload.kind, payload.issue.number, payload.issue.user.login)
    if (payload.action === 'created') {
      globalUpDb.getUser(payload.issue.user.login)?.incrementComments(payload.issue.number)
    } else if (payload.action === 'deleted') {
      globalUpDb.getUser(payload.issue.user.login)?.decrementComments(payload.issue.number)
    }

    // Experimental; remove this later. Keeping here for future reference. 7/8/21
    // // getNumberOfCommentsPerCard(payload.issue.number)
    // // This is a total hack; we wait 61 seconds for the GitHub-side to propogate the change before fetching from them again. 7/8/21
    // const d = new Date()
    // console.log('>>>>>> Begin timer to query GitHub:', d)
    // setTimeout(() => {
    //   console.log('>>>>>> Now querying GitHub - 61 secs later...', d)
    //   Promise.resolve(getUpDb(curDate)).then(rs => setUpDb(rs))
    // }, 61000)
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

  // Listen for latest member stats updates from Firestore
  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('studyMembers')
      .onSnapshot((querySnapshot) => {
        const members = [] as Array<StudyMember>
        querySnapshot.forEach((doc) => {
          const m = doc.data()
          members.push({
            userFullname: m.Fullname,
            userHandle: m.Handle,
            startDateStr: m.StartDate,
            uid: m.Uid,
            repo: m.Repo,
            active: m.Active,
            streakCurrent: {
              days: m.StreakCurrent.Days,
              startDate: m.StreakCurrent.StartDate,
              endDate: m.StreakCurrent.EndDate
            },
            streakMax: {
              days: m.StreakMax.Days,
              startDate: m.StreakMax.StartDate,
              endDate: m.StreakMax.EndDate
            },
            recordCount: m.RecordCount,
            daysJoined: m.DaysJoined,
            lastCard: {
              date: m.LastCard.Date,
              number: m.LastCard.Number
            },
            record: new Map(Object.entries(m.Record))
          })
        })
        // console.log('\t>> member[0].record', members[0].record)
        setMembers(members.sort((a, b) => Date.parse(a.startDateStr) - Date.parse(b.startDateStr)))
        console.log('>> member stats update received:', (new Date()).toISOString())
      })
    return () => unsubscribe()
  }, [])

  // Listen for latest card updates from Firestore
  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('ghUpdates').doc('latestUpdate')
      .onSnapshot((doc) => {
        // console.log('>> doc.data():', doc.data())
        updateDashboard(doc.data())
      })
    return () => unsubscribe()
  }, [])

  function navPrevMonth () {
    setCurDate(util.getPrevMonth(curDate))
  }

  function navNextMonth () {
    setCurDate(util.getNextMonth(curDate))
  }

  const startDate = new Date('2021-05-03T04:00:00Z')
  const dateRange = util.getDateRange(curDate)

  return (
    <FStudyGroup>
      <FTopbarLinks>
        <a href='https://github.com/studydash/cards/issues/75' target='_top'>Roadmap/Specs</a>&nbsp;&nbsp;&nbsp;
        <a href={uriAllCards} target='_top'>Raw Data</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/studydash/cards/issues' target='_top'>Repo</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/studydash/cards/issues/4' target='_top'>Members</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/studydash/cards/discussions/30?sort=new' target='_top'>Screenshots</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/r002/captains-log/blob/sprint-imbe/src/data/changelog.json' target='_top'>Changelog</a>&nbsp;&nbsp;&nbsp;
        <a href='https://community.codenewbie.org/r002/5-codenewbie-study-group-cohort-looking-for-study-mates-4lpj' target='_top'>CodeNewbie</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/studydash/cards/discussions/178?sort=new' target='_top'>Tasks</a>&nbsp;&nbsp;&nbsp;
        <a href='https://github.com/studydash/cards/issues/new/choose' target='_top'>New Card</a>
      </FTopbarLinks>
      <div style={{ textAlign: 'center' }}>
        <CountdownClock color='white' />
      </div>
      <h2>Study Group 00 | {value.toISOString()}</h2>
      <MembersPane members={members} />
      <br />

      <div style={{ textAlign: 'center' }}>
        <button onClick={navPrevMonth} disabled={startDate.getTime() > curDate.getTime() }>
          ◀ {util.printMonthYear(util.getPrevMonth(curDate))}
        </button>
        <FMonthTitle>&nbsp;&nbsp;{util.printMonthYear(curDate)}&nbsp;&nbsp;</FMonthTitle>
        <button onClick={navNextMonth} disabled={util.getNextMonth(curDate).getTime() > Date.now() }>
          {util.printMonthYear(util.getNextMonth(curDate))} ▶
        </button>
      </div>
      <br />

      <FHorizontal>
        <FVertical>
          <FCard empty={true}>
            .<br />
            .
          </FCard>
          {
            dateRange.map((day: util.TDay, i: number) =>
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
          }
        </FVertical>
        {
          members.map((m: StudyMember, i: number) =>
            m.active && Date.parse(m.startDateStr) <= util.getMonthLastDay(curDate).getTime()
              ? <FVertical key={'vertical' + i}>
                  <MemberCard key={m.uid} name={m.userFullname} userHandle={m.userHandle} uid={m.uid} />
                  {
                    dateRange.map((day: util.TDay, i: number) => renderCard(upDb, m, day, i))
                  }
                </FVertical>
              : <span key={'vertical' + i}></span>
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

function renderCard (upDb:UserProgressDb, m:StudyMember, day: util.TDay, i: number) {
  const rs = []
  const card = upDb.getUser(m.userHandle)!.getCardByDate(day.dateStr)
  if (card) {
    rs.push(<CardComp key={m.userHandle + i} title={card.title} userHandle={card.userHandle} repo={m.repo}
      number={card.number} created={card.created} updated={card.updated} tags={card.tags} comments={card.comments} />)
  } else if (Date.parse(day.dateStr) >= Date.parse(m.startDateStr)) {
    rs.push(<MissedDayCard key={m.userHandle + i} dateStr={day.dateStr} />)
  } else {
    rs.push(<EmptyCard key={m.userHandle + i} />)
  }

  if (day.dayNo === 0 && Date.parse(day.dateStr) >= Date.parse(m.startDateStr)) {
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
