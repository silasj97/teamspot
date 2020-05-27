import * as S from "./styles"

import ProjectAPI from "components/API/ProjectAPI.js"

import React, { useRef, useState } from "react"

import TimelineTask from './TimelineTask/TimelineTask'
import EmojiButton from '../EmojiButton/EmojiButton'

const TimelineMilestone = ({ 
  name, 
  description, 
  deadline, 
  id, 
  updateCallback, 
  tasks,
  complete
}) => {
  const ref = useRef()

  console.log(complete)

  const [collapsed, setCollapsed ] = useState(true)

  async function submit() {
    let props = {
      id 
    }
    console.log(id)
    try {
      await ProjectAPI.markMilestoneComplete(props)
    } 
    catch(e) { }

    updateCallback()
  }

  const handleCompleteClick = e => {
    e.stopPropagation()
    submit()
  }

  return (
    <S.TimelineMilestone onClick={() => setCollapsed(!collapsed)} >
      <S.Header active={collapsed}>
        <S.Name>{name}</S.Name>
        <S.Complete type='checkbox' onClick={handleCompleteClick} checked={complete === 1 ? true : false} />
        <S.Spacer />
        <S.Deadline>{new Date(deadline).toLocaleDateString("en-US")}</S.Deadline>
      </S.Header>

      <S.Content>
        <S.Break />

        {
          collapsed ? null : <S.Description>{description}</S.Description>
        }

        <S.Break />

        <S.EmojiButtons>
          <EmojiButton emoji={'👏'} reactions={4} />
          <EmojiButton emoji={'🎉'} reactions={4} />
          <EmojiButton emoji={'🔥'} reactions={4} />
          <EmojiButton emoji={'🤟'} reactions={4} />
          <EmojiButton emoji={'❤️'} reactions={4} />
          <EmojiButton emoji={'😍'} reactions={4} />
          <EmojiButton emoji={'👀'} reactions={4} />
          <EmojiButton emoji={'💵'} reactions={4} />
        </S.EmojiButtons>

        <S.Tasks>
        {
          tasks && !collapsed ? tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).map(task => 
            <TimelineTask
              name={task.task_name}
              deadline={task.deadline}
              description={task.description}
              id={task.task_id}
              updateCallback={updateCallback}
              complete={task.complete}
            /> 
          ) : null
        }
        </S.Tasks>
      </S.Content>

      

    </S.TimelineMilestone>
  )
}

export default TimelineMilestone
