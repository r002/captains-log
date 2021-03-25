// https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript

type TDuration = {
  readonly hours: string | number,
  readonly minutes: string | number,
  readonly seconds: string | number
}

export function msToTime (ms: number): TDuration {
  const seconds: number = Math.floor((ms / 1000) % 60)
  const minutes: number = Math.floor((ms / (1000 * 60)) % 60)
  const hours: number = Math.floor((ms / (1000 * 60 * 60)) % 24)

  // const h: string = (hours < 10) ? `0${hours}` : hours.toString()
  // const m: string = (minutes < 10) ? `0${minutes}` : minutes.toString()
  // const s: string = (seconds < 10) ? `0${seconds}` : seconds.toString()

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}
