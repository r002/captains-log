import styled from 'styled-components'
import React, { useEffect, useState, useRef, useContext, MutableRefObject } from 'react'
import { DataContext } from '../../providers/DataContext'

const FActivityInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: lightgrey;
  width: 500px;
`

type TActivityInput = {
  activity: string,
  logId: string
}

const ActivityInput = ({ logId, activity }: TActivityInput) => {
  const [editableActivity, setEditableActivity] = useState(false)
  const [newActivity, setNewActivity] = useState(activity)
  const inputActivity = useRef() as MutableRefObject<HTMLInputElement>
  const dc = useContext(DataContext)

  function handleActivityDoubleClick () {
    setEditableActivity(true)
  }

  function handleChange (e: React.FormEvent<HTMLInputElement>) {
    setNewActivity(e.currentTarget.value)
  }

  function handleActivityKeyDown (e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'Enter':
        dc.updateActivity({ logId, newActivity })
        setEditableActivity(false)
        break
      case 'Escape':
        setEditableActivity(false)
        setNewActivity(activity)
        break
    }
  }

  useEffect(() => {
    if (editableActivity) {
      inputActivity.current.focus()
      inputActivity.current.select()
    }
  }, [editableActivity])

  useEffect(() => {
    setNewActivity(activity)
    setEditableActivity(false) // Reset to readonly mode if entire widget is rerendered
  }, [activity])

  return (
    <>
      {editableActivity
        ? <FActivityInput ref={inputActivity} type="text" value={newActivity}
            onChange={handleChange} onKeyDown={handleActivityKeyDown} style={{ color: 'white' }} />
        : <FActivityInput type="text" value={activity} readOnly={true}
            onDoubleClick={handleActivityDoubleClick} style={{ cursor: 'pointer' }} />
      }
    </>
  )
}

export default ActivityInput
