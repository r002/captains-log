import React from 'react'
import styled from 'styled-components'

const FAttribution = styled.div`
  position: absolute;
  color: black;
  background-color: #a2a1b1;
  top: 0;
  right: 0;
  margin-top: 29px;
  margin-right: 43px;
  z-index: 99;
  font-size: 14px; 
  line-height: 150%;
  width: fit-content;
  height: 28px;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
`

const F14Link = styled.span`
  font-size: 14px;
`

export const Attribution: React.VFC = () => {
  return (
    <FAttribution>
      CSS Background Art by <a href='https://codepen.io/lukeandrewreid'><F14Link>Luke Reid</F14Link></a>
    </FAttribution>
  )
}
