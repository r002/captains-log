// Note: Currently unused as of Mon - 4/26/21.
// Am keeping this file here because I do hope to properly
// implement flashAlert one day this way though.

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
  animation: ${fadeInAndOut} 4s linear forwards;
  background-color: palegoldenrod;
  color: black;
  padding: 5px;
  margin: 0;
  /* transition: visibility 1s linear; */
`

export const FlashAlert = (fa: TFlashAlert) => {
  return (
    <Fade>
      {fa.alert}: {fa.content}
    </Fade>
  )
}
