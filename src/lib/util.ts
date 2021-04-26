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
