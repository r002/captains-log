export type TFlashAlert = {
  alert: string,
  content: string,
  debug: {
    logId: string
  }
}

export function sendFlashAlert (fa: TFlashAlert) {
  const customEvent = new CustomEvent('flashAlert', {
    detail: {
      alert: fa.alert,
      content: fa.content,
      debug: fa.debug
    }
  })
  document.body.dispatchEvent(customEvent)
}

type TDateUpdate = {
  logId: string,
  newDate: Date
}

export function sendDateUpdate (du: TDateUpdate) {
  const customEvent = new CustomEvent('globalListener', {
    detail: {
      logId: du.logId,
      newDate: du.newDate,
      action: 'updateDt'
    }
  })
  document.body.dispatchEvent(customEvent)
}

type TActivityUpdate = {
  logId: string,
  newActivity: string
}

export function sendActivityUpdate (au: TActivityUpdate) {
  const customEvent = new CustomEvent('globalListener', {
    detail: {
      logId: au.logId,
      newActivity: au.newActivity,
      action: 'updateActivity'
    }
  })
  document.body.dispatchEvent(customEvent)
}
