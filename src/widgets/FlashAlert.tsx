import styled, { keyframes } from 'styled-components'
import { TFlashAlert } from '../services/Internal'

const fadeInAndOut = keyframes`
    0% {
        opacity: 0;
    }

    5% {
        opacity: 1;
    }

    80% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
`

const Fade = styled.div`
  display: inline-block;
  animation: ${fadeInAndOut} 5s linear forwards;
  background-color: palegoldenrod;
  color: black;
  padding: 5px;
  margin: -5px;
  /* transition: visibility 1s linear; */
`

export const FlashAlert = (fa: TFlashAlert) => {
  return (
    <Fade>
      {fa.alert}: {fa.content}
    </Fade>
  )
}
