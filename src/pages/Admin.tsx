import { TPassage } from '../widgets/Shared'
import { AutoId } from '../lib/util'
import { addPassage, getPassagesByStory } from '../services/FirestoreApi'
import { FPassage, FLine } from './StoryBoard'
import { UserContext } from '../providers/AuthContext'
import { useState, useContext } from 'react'

// const c = `"Get up!" his aunt screeched through the closed door.  "Up and at 'em, boy!"

// Harry woke with a start.  He'd been having a pleasant dream.  In his dream, he'd been flying on a dragon.  Far and away from this miserable hellhole called Privet Drive.  It was a dream he felt he'd had many times before.

// "Are you up yet?" his Aunt Petunia demanded.  She banged on the door a few times more.

// "Almost," Harry replied, his voice hoarse.  He groped around his thin mattress in his cupboard beneath the stairs for his glasses.  Under his threadbare sheets each night, he'd shivered, never being able to keep warm enough.  All his life, he'd wished to escape this miserable existence of poverty and childhood abuse.  But every morning for twelve years now, he'd always woken up in the same cupboard, his hopes and dreams dashed.`

// const c = `Another Candidate

// qqq

// www

// eee`

const c = `Nearly ten years had passed since the Dursleys had woken up to find their nephew on the front step, but Privet Drive had hardly changed at all.  The sun rose on the same tidy front gardens and lit up the brass number four on the Dursleys' front door; it crept into their living room, which was almost exactly the same as it had been on the night when Mr. Dursley had seen that fateful news report about the owls.  Only the photographs on the mantelpiece really showed how much time had passed.  Ten years ago, there had been lots of pictures of what looked like a large pink beach ball wearing different-colored bonnets—but Dudley Dursley was no longer a baby, and now the photographs showed a large blonde boy riding his first bicycle, on a carousel at the fair, playing a computer game with his father, being hugged and kissed by his mother.  The room held no sign at all that another boy lived in the house, too.

Yet Harry Potter was still there, asleep at the moment, but not for long.  His Aunt Petunia was awake and it was her shrill voice that made the first noise of the day.`

const Admin = () => {
  const { user } = useContext(UserContext)
  const [passages, setPassages] = useState(null as unknown as TPassage[])

  function handleClick () {
    // console.log('>> handle click!!!!!!!!')
    const p = {
      id: AutoId.newId(),
      storyId: 'aaa',
      content: c,
      created: new Date(),
      branch: 'cannon'
    }
    addPassage(p)
  }

  function handleGetPassages () {
    getPassagesByStory('aaa').then(passages => {
      console.log('>> passages', passages)
      setPassages(passages)
    })
  }

  if (user && !passages) {
    getPassagesByStory('aaa').then(passages => {
      console.log('>> passages', passages)
      setPassages(passages)
    })
  }

  const body = []
  if (passages) {
    for (const passage of passages) {
      const lines = passage.content.split('\n\n')
      body.push(
        <FPassage key={passage.id}>
          {lines.map((line, i) => <FLine key={i}>{line} {i !== lines.length - 1 ? <p /> : ''}</FLine>)}
        </FPassage>
      )
    }
  }

  return (
    <>
      <button onClick={handleClick}>Add passage</button>
      <br /><br />
      <button onClick={handleGetPassages}>Get passages</button>
      <br /><br/>
      {/* {snippet.split('\n\n').map((line, i) => <div key={i}>{line}<br /><br /></div>)} */}
      {body}
    </>
  )
}

export default Admin
