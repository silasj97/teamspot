import * as S from "./styles"

import Reward from 'react-rewards'

import React, { useRef, useState } from "react"

import EmojiButton from '../EmojiButton/EmojiButton'

const TimelineMilestone = ({ name, description, deadline }) => {

  const ref = useRef()

  const [collapsed, setCollapsed ] = useState(true)

  return (
    <S.TimelineMilestone onClick={() => setCollapsed(!collapsed)} active={collapsed}>
      <S.Header active={collapsed}>
        <S.Name>{name}</S.Name>
        <S.Spacer />
        <S.Deadline>{new Date(deadline).toLocaleDateString("en-US")}</S.Deadline>
      </S.Header>

      <S.Break />

      {
        collapsed ? null : <S.Description>{description}</S.Description>
      }

      <S.Break />

      <S.EmojiButtons>
        <EmojiButton emoji={'👏'} reactions={4} />
        <EmojiButton emoji={'🎉'} reactions={4} />
        <EmojiButton emoji={'👍'} reactions={4} />
        <EmojiButton emoji={'❤️'} reactions={4} />
        <EmojiButton emoji={'😍'} reactions={4} />
      </S.EmojiButtons>

    </S.TimelineMilestone>
  )
}

export default TimelineMilestone
