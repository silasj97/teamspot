import * as S from "./styles"

import Reward from 'react-rewards'

import React, { useRef, useState } from "react"

const EmojiButton = ({ emoji, reactions }) => {

  const ref = useRef()

  return (
    <S.EmojiButton>
      <Reward
        ref={ref}
        type='emoji'
        config={
          {
            type: "emoji",
            fakingRequest: false,
            angle: 90,
            decay: 0.91,
            spread: 100,
            startVelocity: 75,
            elementCount: 64,
            elementSize: 20,
            lifetime: 200,
            zIndex: 10,
            springAnimation: true,
            emoji: [emoji]
          }
        }
      >
        <S.Emoji onClick={(e) => { 
          if (ref.current) { ref.current.rewardMe() }
          e.stopPropagation()
        }}>{emoji + reactions}</S.Emoji>
      </Reward>

    </S.EmojiButton>
  )
}

export default EmojiButton
