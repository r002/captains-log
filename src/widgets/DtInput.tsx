import styled from 'styled-components'
import { LimeGreen, Yellow } from './Shared'
import React, { useEffect, useState, useRef, MutableRefObject } from 'react'
import { sendFlashAlert, sendDateUpdate } from '../services/Internal'

const FDtInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: lightgrey;
  width: 202px;
  margin: 0;
  padding: 0;
`

type TDtInput = {
  date: Date,
  logId: string
}

const DtInput = ({ date, logId }: TDtInput) => {
  const [editableDt, setEditableDt] = useState(false)
  const [newDate, setNewDate] = useState(date.toString().slice(0, 21) + ' ET')
  const inputDt = useRef() as MutableRefObject<HTMLInputElement>

  function handleDtDoubleClick () {
    setEditableDt(true)
  }

  function handleChange (e: React.FormEvent<HTMLInputElement>) {
    setNewDate(e.currentTarget.value)
  }

  function handleKeyDown (e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'Enter': {
        // Try to parse newDate. If it's invalid, send FlashAlert and return early
        console.log('------trying to parse:', newDate.slice(0, -3))
        const newDateFromUser = new Date(newDate.slice(0, -3)) // Chop off the ' ET'
        if (isNaN(newDateFromUser.getTime())) {
          console.log('------newDateFromUser is malformed:', newDate.slice(0, -3))
          sendFlashAlert({
            alert: 'Error! Your datetime is malformed',
            content: newDate, // This is a malformed date string
            debug: {
              logId: logId
            }
          })
          return
        }

        sendDateUpdate({
          logId: logId,
          newDate: newDateFromUser // This is a legit, well-formed Date obj
        })

        // Convert the string into a date object
        console.log('newDateFromUser:', newDateFromUser)

        setEditableDt(false)
        break
      }
      case 'Escape':
        setEditableDt(false)
        setNewDate(date.toString().slice(0, 21) + ' ET')
        break
    }
  }

  useEffect(() => {
    if (editableDt) {
      inputDt.current.focus()
      inputDt.current.select()
    }
  }, [editableDt])

  useEffect(() => {
    setNewDate(date.toString().slice(0, 21) + ' ET')
    setEditableDt(false) // Reset to readonly mode if entire widget is rerendered
  }, [date])

  return (
    <>
      {editableDt
        ? <FDtInput type="text" value={newDate} onChange={handleChange}
            onKeyDown={handleKeyDown} ref={inputDt} style={{ color: 'white' }} />
        : <span onDoubleClick={handleDtDoubleClick} style={{ cursor: 'pointer' }}>
            <LimeGreen>{date.toString().slice(0, 15)} </LimeGreen>
            <Yellow>{date.toString().slice(16, 21)} ET</Yellow>
          </span>
      }
    </>
  )
}

export default DtInput
