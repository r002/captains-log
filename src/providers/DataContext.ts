import { createContext } from 'react'

export type TActivityUpdate = {
  logId: string,
  newActivity: string
}

export type TDateUpdate = {
  logId: string,
  newDate: Date
}

/**
 * Default. These never trigger if overridden in /App.tsx.
 */
export const DataContext = createContext({
  updateDate: ({ logId, newDate }: TDateUpdate) => {
    console.log("Default 'updateDate' fxn called!", logId, newDate)
  },
  updateActivity: ({ logId, newActivity }: TActivityUpdate) => {
    console.log("Default 'updateActivity' fxn called!", logId, newActivity)
  },
  deleteLog: (logId: string) => {
    console.log("Default 'deleteLog' fxn called!", logId)
  }
})
