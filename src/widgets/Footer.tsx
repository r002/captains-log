import changelogUri from '../data/changelog.json'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const FFooter = styled.div`
  text-align: right;
  position: absolute;
  color: black;
  bottom: 0;
  right: 0;
  margin-bottom: 12px;
  margin-right: 20px;
  z-index: 99;
  font-size: 14px;
  line-height: 150%;
`

type Commit = {
  version: string
  message: string
  built: Date
}

export const Footer: React.VFC = () => {
  const [commit, setCommit] = useState<Commit>()

  useEffect(() => {
    fetch(changelogUri).then(rs => rs.json().then(payload => {
      setCommit({
        version: payload[0].version,
        message: payload[0].message,
        built: payload[0].built
      })
    }))
  }, [])

  return (
    <FFooter>
      🔖 {commit?.version} | {commit?.message}<br />
      👷‍♂️ {commit?.built ? commit.built.toString() : 'NA'}
    </FFooter>
  )
}
