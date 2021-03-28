import styled from 'styled-components'
import React, { useEffect, useState, useRef, MutableRefObject } from 'react'

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

  function handleActivityDoubleClick () {
    setEditableActivity(true)
  }

  function handleChange (e: React.FormEvent<HTMLInputElement>) {
    setNewActivity(e.currentTarget.value)
  }

  function handleActivityKeyDown (e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'Enter': {
        const customEvent = new CustomEvent('globalListener', {
          detail: {
            logId: e.currentTarget.dataset.logid,
            newActivity: newActivity,
            action: 'updateActivity'
          }
        })
        document.body.dispatchEvent(customEvent)
        setEditableActivity(!editableActivity)
        break
      }
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
  }, [activity])

  return (
    <>
      {editableActivity
        ? <FActivityInput data-logid={logId} ref={inputActivity} type="text" value={newActivity} onChange={handleChange}
            onKeyDown={handleActivityKeyDown} style={{ color: 'white' }} />
        : <FActivityInput type="text" value={activity} readOnly={true} onDoubleClick={handleActivityDoubleClick} style={{ cursor: 'pointer' }} />
      }
    </>
  )
}

export default ActivityInput
