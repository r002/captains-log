import { createContext } from 'react'
// import { ILog } from '../widgets/Shared'

export const DataContext = createContext({
  // logs: [] as Array<ILog>,
  deleteLog: (logId: string) => {
    // Default. Never appears if overridden in /App.tsx.
    console.log("Default deleteLog has been called! If overriden, I'll never appear!", logId)
  }
})
