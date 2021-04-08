import { AutoId } from '../lib/util'
import { ILog } from '../widgets/Shared'
import CONFIG from '../config'

/**
 * Responsible for parsing the user input and returning the corresponding log
 * @param input
 * @returns
 */
export async function parseInput (input: string): Promise<ILog> {
  const re = /^(?<command>.*?)\s(?<url>[^\s]*)$/.exec(input.trim())
  const command = re?.groups?.command ?? 'Invalid command!'

  switch (command) {
    case 'watch': {
      const url = re?.groups?.url ?? 'Invalid url!'
      const vid = /.*\?v=(?<vid>.*)/.exec(url)?.groups?.vid ?? /.*\/(?<vid>.*)/.exec(url)?.groups?.vid ?? 'No vid'

      console.log('>>>>>>> command/url:', command, vid, url)
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${vid}&key=${CONFIG.apiKey}&part=snippet`)
      const data = await response.json()
      // console.log('>>>> data:', data)
      const vidTitle = data.items[0].snippet.title
      // console.log('>>>> vidTitle:', vidTitle)
      const newLog = {
        id: AutoId.newId(),
        dt: new Date(),
        created: new Date(),
        type: 'YoutubeLog',
        rawInput: input,
        activity: vidTitle, // `${command} ${vidTitle}`,
        vidTitle: vidTitle,
        command: command,
        vid: vid
      }
      console.log('>>>> newLog:', newLog)
      return newLog
    }
    default:
      return {
        id: AutoId.newId(),
        dt: new Date(),
        created: new Date(),
        type: 'ActivityLog',
        rawInput: input,
        activity: input
      }
  }
}
