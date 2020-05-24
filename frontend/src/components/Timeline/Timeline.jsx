import * as S from "./styles"

import React, { useRef, useState } from "react"

import ProjectAPI from "components/API/ProjectAPI.js"

import Button from "../Button/Button"

const Timeline = ({ milestones, updateCallback, activeComponent, activeComponentId }) => {
  const [type, setType] = useState('Milestone')

  const simpleDialog = useRef()

  const openDialog = (modalType) => {
    if (simpleDialog.current) {
      setType(modalType)
      simpleDialog.current.show()
    }
  }

  const modalStyles = {
    background: 'var(--LightColor)',
    color: '#ffffff',
    width: '200px',
    marginLeft: '-200px',
    height: 'auto',
    borderRadius: '16px',
    padding: '16px'
  }

  const [name, setName] = useState('')
  const [milestoneId, setMilestoneId] = useState(1)
  const [priority, setPriority] = useState(1)
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')

  const milestoneSelect = useRef()

  async function submit() {
    let props

    if (type === 'Task') {
      props = {
        task_name: name,
        milestone_id: milestoneSelect.current.value,
        priority,
        description,
        deadline
      }
    }
    else {
      props = {
        milestone_name: name,
        project_component_id: activeComponentId,
        priority,
        description,
        deadline
      }
    }
    
    try {
      type === 'Milestone' ?  await ProjectAPI.createMilestone(props) : await ProjectAPI.createTask(props)
    } catch(e) {
      console.error(e)
    }
    window.location.reload()
  }

  const renderModal = () => {
    return (
      <S.Modal
        hideOnOverlayClicked 
        ref={simpleDialog}
        title={'New ' + type} 
        dialogStyles={modalStyles}
      >
        <S.Inputs>
          {
            type === 'Task' ?
            <S.SelectInput ref={milestoneSelect}>
            {
              milestones.map(milestone => <option value={milestone.id}>{milestone.milestone_name}</option>)
            }
            </S.SelectInput>
            : null
          }
      
          <S.TextInput type='text' placeholder={type + ' Name'} onChange={e => setName(e.target.value)}></S.TextInput>
          <S.TextInput type='number' placeholder='Priority' onChange={e => setPriority(e.target.value)}></S.TextInput>
          <S.TextInput type='text' placeholder='Description' onChange={e => setDescription(e.target.value)}></S.TextInput>
          <S.TextInput type='date' onChange={e => setDeadline(e.target.value)}></S.TextInput>
          <Button text='Submit' onClickFunction={() => submit()}/>
        </S.Inputs>

      </S.Modal>
    )
  }

  return (
    <S.Timeline>
      <S.Header>
        <S.HeaderText>Timeline</S.HeaderText>
      </S.Header>

      {
        renderModal()
      }

      <S.Content>
        <S.ButtonContainer>
          <Button
            text="New Milestone"
            onClickFunction={() => openDialog('Milestone')}
          />
          <S.Or>or</S.Or>
          <Button
            text="New Task"
            onClickFunction={() => openDialog('Task')}
          />
        </S.ButtonContainer>
      </S.Content>
    </S.Timeline>
  )
}

export default Timeline
