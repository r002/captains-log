import styled from 'styled-components'

export const FHorizontal = styled.div`
  display: flex;
  flex-direction: row;
`

// Temp hack. TODO: Refactor this later. 8/6/21
export const FHorizontal2 = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
`

export const FVertical = styled.div`
  display: flex;
  flex-direction: column;
`

export const Board = styled.div`
  position: absolute;
  display: flex;
  left: 43px;
  top: 29px;
`
