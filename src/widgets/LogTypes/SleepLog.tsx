import { FLogRecord, Duration } from './LogCommon'

const SleepLog = ({ title, hours, minutes }: {title: string, hours: number, minutes: number}) => {
  return (
    <FLogRecord background='#292929' type='meta'>
      😴 {title} 🌙<br />
      <Duration hours={hours} minutes={minutes} />
    </FLogRecord>
  )
}

export default SleepLog
