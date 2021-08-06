// https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript

type TDuration = {
  readonly days: string | number,
  readonly hours: string | number,
  readonly minutes: string | number,
  readonly seconds: string | number
}

export function msToTime (ms: number): TDuration {
  const seconds: number = Math.floor((ms / 1000) % 60)
  const minutes: number = Math.floor((ms / (1000 * 60)) % 60)
  const hours: number = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const days: number = Math.floor((ms / (1000 * 60 * 60 * 24)) % 365)

  // const h: string = (hours < 10) ? `0${hours}` : hours.toString()
  // const m: string = (minutes < 10) ? `0${minutes}` : minutes.toString()
  // const s: string = (seconds < 10) ? `0${seconds}` : seconds.toString()

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

export function formatTime (d: Date): string {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  }
  return new Intl.DateTimeFormat('en-US', options as any).format(d)
}

// https://stackoverflow.com/questions/53301344/generate-unique-id-like-firebase-firestore
// https://github.com/firebase/firebase-js-sdk/blob/6abd6484730971e2390b2b9acbb61800852fb350/packages/firestore/src/util/misc.ts#L36
export class AutoId {
  static newId (): string {
    // Alphanumeric characters
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let autoId = ''
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    // assert(autoId.length === 20, 'Invalid auto ID: ' + autoId)
    return autoId
  }
}

// Eg. "August 2021"
export function printMonthYear (d: Date): string {
  const options = {
    year: 'numeric',
    month: 'long'
  }
  return new Intl.DateTimeFormat('en-US', options as any).format(d)
}

export function getNextMonth (d: Date): Date {
  const nd = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()) // Step forward one month
  // console.log('>> getNextMonth:', d.toDateString(), nd.toDateString())
  return nd
}

export function getPrevMonth (d: Date): Date {
  const nd = new Date(d.getFullYear(), d.getMonth() - 1, 1) // Step backward one month; start on first day
  // console.log('>> getPrevMonth:', d.toDateString(), nd.toDateString())
  return nd
}

export function getPeriod (d: Date): string {
  return `${d.getFullYear()}-` + `${d.getMonth() + 1}`.padStart(2, '0')
}

export function getMonthLastDay (d: Date): Date {
  const nd = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return nd
}

export type TDay = {
  dayNo: number
  dateStr: string
}

// Return past eight days, ending on endDate
export function getDateRangeOneWeek (endDate: Date): TDay[] {
  const dateRange = [] as TDay[]
  const startDate = new Date()
  startDate.setTime(endDate.getTime() - 86400 * 1000 * 8) // Eight days

  const today = new Date()
  let dateCursor: Date
  if (today.getMonth() === endDate.getMonth()) {
    dateCursor = new Date(endDate.getFullYear(), endDate.getMonth(), today.getDate()) // Start on today
  } else {
    dateCursor = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0) // Start on the last day of the month
  }

  while (dateCursor.getTime() >= startDate.getTime()) {
    dateRange.push({
      dayNo: dateCursor.getDay(),
      dateStr: dateCursor.toLocaleDateString()
    })
    dateCursor.setTime(dateCursor.getTime() - 86400 * 1000) // Step one day backwards until we get to the start date
  }
  return dateRange
}

export function getDateRangeOneMonth (endDate: Date): TDay[] {
  const today = new Date()
  let dateCursor: Date
  if (today.getMonth() === endDate.getMonth()) {
    dateCursor = new Date(endDate.getFullYear(), endDate.getMonth(), today.getDate()) // Start on today
  } else {
    dateCursor = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0) // Start on the last day of the month
  }

  const dateRange = [] as TDay[]
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1) // Stop on the first day of the month at midnight ET
  // Eg. Tue Jun 01 2021 00:00:00 GMT-0400 (Eastern Daylight Time)
  while (dateCursor.getTime() >= startDate.getTime()) {
    dateRange.push({
      dayNo: dateCursor.getDay(),
      dateStr: dateCursor.toLocaleDateString()
    })
    dateCursor.setTime(dateCursor.getTime() - 86400 * 1000) // Step one day backwards until we get to the start date
  }
  return dateRange
}

// Returns "YYYY-MM-DD" => Eg. "2021-07-15"
export function getYearMonthDay (d: Date): string {
  return `${d.getFullYear()}-` + `${d.getMonth() + 1}`.padStart(2, '0') + '-' + `${d.getDate()}`.padStart(2, '0')
}

// Returns "YYYY-MM" => Eg. "2021-07"
export function getYearMonth (d: Date): string {
  return `${d.getFullYear()}-` + `${d.getMonth() + 1}`.padStart(2, '0')
}
