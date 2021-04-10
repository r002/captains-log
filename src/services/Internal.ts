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
