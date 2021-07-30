import './assets/css/landscape.css'
import './assets/css/board.css'
import './assets/css/links+glyphs.css'

import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import './providers/AuthContext'
import firebase from 'firebase/app'
import { StudyMember } from './models/StudyMember'
import * as util from './lib/util'
import * as l from './widgets/Layout'

const Board = styled.div`
  position: absolute;
  display: flex;
  left: 43px;
  top: 29px;
`

// const Card = styled.div`
//   width: 205px;
//   height: 28px;
// `

const FMemberCard = styled.div`
  width: 205px;
  height: 28px;
  background: #632242;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  font-family: 'Chakra Petch', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 29px;
  color: #FFFFFF;

  margin-right: 11px;
  padding: 1px;
  padding-left: 7px;
  box-sizing: border-box;
`

type TMemberCard = {
  name: string
  userHandle: string
  uid: string
}
const MemberCard: React.FC<TMemberCard> = (props) => {
  return (
    <FMemberCard>
      {props.userHandle}
    </FMemberCard>
  )
}

const MemberBoard: React.VFC = () => {
  const [members, setMembers] = useState<Array<StudyMember>>([])
  const [curDate] = useState(new Date())

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

  // const dateRange = util.getDateRange(curDate)
  return (
    <l.FHorizontal>
      {
        members.map((m: StudyMember, i: number) =>
          m.active && Date.parse(m.startDateStr) <= util.getMonthLastDay(curDate).getTime()
            ? <l.FVertical key={'vertical' + i}>
                <MemberCard key={m.uid} name={m.userFullname} userHandle={m.userHandle} uid={m.uid} />
                {
                  // dateRange.map((day: util.TDay, i: number) => <>{day} | {i}</>)
                }
              </l.FVertical>
            : <span key={'vertical' + i}></span>
        )
      }
    </l.FHorizontal>
  )
}

ReactDOM.render(
  <Board>
    <MemberBoard />
  </Board>,
  document.querySelector('#root')
)

// https://webpack.js.org/api/hot-module-replacement/
if (module.hot) {
  module.hot.accept(
    // errorHandler // Function to handle errors when evaluating the new version
  )

  module.hot.dispose(() => {
    console.clear() // Clear the console on every hot reload
    // Clean up and pass data to the updated module...
  })
}
