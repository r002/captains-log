import styled from 'styled-components'

export const FLine = styled.div`
  font-family: Georgia, serif;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 1.8;
`

export const FPassage = styled.div`
  background: lightgrey;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: black;
  padding: 20px;
  font-family: Georgia, serif;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 1.8;
  margin-left: 150px;
  margin-right: 150px;
`

const Container = styled.div`
  margin-left: 150px;
  margin-right: 150px;
  text-align: center;
`

const FEditor = styled.textarea`
  background: white;
  color: black;
  padding: 20px;
  font-family: Georgia, serif;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 1.8;
  width: 100%;
  height: 500px;
  box-sizing: border-box;
`

const StoryBoard = () => {
  return (
    <>
      <FPassage>
        Nearly ten years had passed since the Dursleys had woken up to find their nephew on the front step, but Privet Drive had hardly changed at all.  The sun rose on the same tidy front gardens and lit up the brass number four on the Dursleys' front door; it crept into their living room, which was almost exactly the same as it had been on the night when Mr. Dursley had seen that fateful news report about the owls.  Only the photographs on the mantelpiece really showed how much time had passed.  Ten years ago, there had been lots of pictures of what looked like a large pink beach ball wearing different-colored bonnets—but Dudley Dursley was no longer a baby, and now the photographs showed a large blonde boy riding his first bicycle, on a carousel at the fair, playing a computer game with his father, being hugged and kissed by his mother.  The room held no sign at all that another boy lived in the house, too.
        <br /><br />
        Yet Harry Potter was still there, asleep at the moment, but not for long.  His Aunt Petunia was awake and it was her shrill voice that made the first noise of the day.
        {/* <br /><br />
        "Up!  Get up!  Now!"
        <br /><br />
        Harry woke with a start.  His aunt rapped on the door again.
        <br /><br />
        "Up!" she screeched.  Harry heard her walking toward the kitchen and then the sound of the frying pan being put on the stove.  He rolled onto his back and tried to remember the dream he had been having.  It had been a good one.   */}
      </FPassage>
      <br /><br />
      <Container>
        <FEditor defaultValue='Editor goes here' />
      </Container>
      <br /><br />
      <Container>
        Upvote | Downvote | See Another Candidate | Comments
      </Container>
    </>
  )
}

export default StoryBoard
