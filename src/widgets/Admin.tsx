import { TPassage } from './Shared'
import { AutoId } from '../lib/util'
import { addPassage, getPassages } from '../services/FirestoreApi'
import { FPassage, FLine } from './StoryBoard'
import { useState } from 'react'

const c = `"Get up!" his aunt screeched through the closed door.  "Up and at 'em, boy!"

Harry woke with a start.  He'd been having a pleasant dream.  In his dream, he'd been flying on a dragon.  Far and away from this miserable hellhole called Privet Drive.  It was a dream he felt he'd had many times before.

"Are you up yet?" his Aunt Petunia demanded.  She banged on the door a few times more.

"Almost," Harry replied, his voice hoarse.  He groped around his thin mattress in his cupboard beneath the stairs for his glasses.  Under his threadbare sheets each night, he'd shivered, never being able to keep warm enough.  All his life, he'd wished to escape this miserable existence of poverty and childhood abuse.  But every morning for twelve years now, he'd always woken up in the same cupboard, his hopes and dreams dashed.
`

// const c = `aaa

// bbb

// ccc

// ddd
// `

const Admin = () => {
  const [passage, setPassage] = useState(null as unknown as TPassage)

  function handleClick () {
    console.log('>> handle click!!!!!!!!')
    const p = {
      id: AutoId.newId(),
      storyId: 'aaa',
      content: c,
      created: new Date()
    }
    addPassage(p)
  }

  function handleGetPassages () {
    getPassages('aaa').then(passages => {
      console.log('>> passages', passages)
      setPassage(passages[0])
    })
  }

  let snippet = <></>

  if (passage?.content) {
    snippet =
      <FPassage>
        {passage.content.split('\n\n').map((line, i) => <FLine key={i}>{line}<br /><br /></FLine>)}
      </FPassage>
  }

  return (
    <>
      <button onClick={handleClick}>Add passage</button>
      <br /><br />
      <button onClick={handleGetPassages}>Get passages</button>
      <br /><br/>
      {/* {snippet.split('\n\n').map((line, i) => <div key={i}>{line}<br /><br /></div>)} */}
      {snippet}
    </>
  )
}

export default Admin
