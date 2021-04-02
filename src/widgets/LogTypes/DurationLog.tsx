import { FLogRecord, Duration } from './LogCommon'

const DurationLog = ({ title, hours, minutes }: {title: string, hours: number, minutes: number}) => {
  return (
    <FLogRecord background='purple' type='meta'>
      ⌛ {title} 🕒<br />
      <Duration hours={hours} minutes={minutes} />
    </FLogRecord>
  )
}

export default DurationLog
