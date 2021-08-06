import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import '../providers/AuthContext'
import firebase from 'firebase/app'
import { StudyMember } from '../models/StudyMember'
import { UserProgressDb, Tag } from '../models/UserProgress'
import { getUpDb } from '../services/GithubApi'
import * as util from '../lib/util'
import * as l from '../widgets/Layout'
// import { SceneViz } from './SceneViz'

const FCard = styled.div`
  width: 205px;
  height: 28px;

  display: flex;
  align-items: center;

  font-family: 'Chakra Petch', sans-serif;
  font-style: normal;
  font-weight: 400;
  /* line-height: 29px; */
  color: #FFFFFF;
  margin-right: 11px;
  margin-bottom: 11px;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const FEmpty = styled(FCard)`
  width: 34px;
  height: 28px;
  background: none;
  box-shadow: none;
`

const FDay = styled(FCard)`
  width: 34px;
  height: 28px;
  justify-content: center;

  font-family: 'Chakra Petch', sans-serif;
  font-style: normal;
  font-weight: 300;
  line-height: 11.7px;
  color: #FFFFFF;
  
  font-size: 9px;
  background: #632242;
`

const FMemberCard = styled(FCard)`
  background: #632242;
  font-size: 15px;
  padding-left: 7px;
  padding-top: 3px;
`

const FEntryCard = styled(FCard)`
  background: #274867;
  font-size: 12px;
  padding-left: 7px;
`

const FMissedCard = styled(FCard)`
  background: #632242;
  font-size: 12px;
  padding-left: 7px;
`

const FPendingCard = styled(FCard)`
  background: #597252;
  font-size: 12px;
  padding-left: 7px;
`

const MissedCard: React.VFC = () => {
  return (
    <FMissedCard>
      No card today! 😢😦🙁
  </FMissedCard>
  )
}

const PendingCard: React.VFC = () => {
  return (
    <FPendingCard>
      Today's card pending! 😀😁😄
  </FPendingCard>
  )
}

const F15Link = styled.span`
  font-size: 15px;
`

type TMemberCard = {
  name: string
  userHandle: string
  uid: string
}
const MemberCard: React.FC<TMemberCard> = (props) => {
  return (
    <FMemberCard>
      <a href={'https://github.com/' + props.userHandle} target='_top'><F15Link>{props.userHandle}</F15Link></a>
    </FMemberCard>
  )
}

type TEntryCard = {
  title: string
  userHandle: string
  number: number
  created: Date
  updated: Date
  tags: Tag[]
  comments: number
  repo: string
}

const EntryCard: React.FC<TEntryCard> = (props) => {
  const title = props.title.length > 33 ? props.title.substr(0, 30) + '...' : props.title
  return (
    <FEntryCard>
      <a href={props.repo + '/issues/' + props.number} target='_top'>{title}</a>
  </FEntryCard>
  )
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const MemberBoard: React.VFC = () => {
  const [members, setMembers] = useState<Array<StudyMember>>([])
  const [curDate] = useState(new Date())
  const [upDb, setUpDb] = useState<UserProgressDb>(new UserProgressDb())

  // Load cards
  useEffect(() => {
    console.log('>> Changing date periods', curDate)
    Promise.resolve(getUpDb(curDate)).then(rs => setUpDb(rs))
    history.pushState({}, '', '/studydash/?d=' + util.getYearMonth(curDate))
    window.parent.postMessage(window.location.href, '*')
  }, [curDate])

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

  const dateRange = util.getDateRangeOneWeek(curDate)
  // console.log('>> dateRange', dateRange)
  return (
    <l.FHorizontal>
      <l.FVertical>
        <FEmpty>
          <br />
        </FEmpty>
        {
          dateRange.map((day: util.TDay, i: number) =>
            <FDay key={'dayCard' + i}>
              {days[day.dayNo].substring(0, 3)}<br />
              {day.dateStr.replace('/2021', '')}
            </FDay>
          )
        }
      </l.FVertical>

      {
        members.map((m: StudyMember, i: number) =>
          m.active && Date.parse(m.startDateStr) <= util.getMonthLastDay(curDate).getTime()
            ? <l.FVertical key={'vertical' + i}>
                <MemberCard key={m.uid} name={m.userFullname} userHandle={m.userHandle} uid={m.uid} />
                {
                  dateRange.map((day: util.TDay, i: number) => renderCard(upDb, m, day, i))
                }
              </l.FVertical>
            : <span key={'vertical' + i}></span>
        )
      }
      {/* <SceneViz densityIndex={7} /> */}
    </l.FHorizontal>
  )
}

function renderCard (upDb:UserProgressDb, m:StudyMember, day: util.TDay, i: number) {
  const today = new Date()
  const rs = []
  const card = upDb.getUser(m.userHandle)?.getCardByDate(day.dateStr) ?? null
  if (card) {
    rs.push(<EntryCard key={m.userHandle + i} title={card.title} userHandle={card.userHandle} repo={m.repo}
      number={card.number} created={card.created} updated={card.updated} tags={card.tags} comments={card.comments} />)
  } else if (today.toLocaleDateString() === day.dateStr) {
    rs.push(<PendingCard key={m.userHandle + i} />)
  } else if (Date.parse(day.dateStr) >= Date.parse(m.startDateStr)) {
    rs.push(<MissedCard key={m.userHandle + i} />)
  } else {
    console.log('>> render empty card!')
    // rs.push(<EmptyCard key={m.userHandle + i} />) // No longer needed? 7/31/21
  }

  return (
    <div key={'container' + m.userHandle + i}>
      {rs}
    </div>
  )
}
