import * as S from "./styles";

import React, { useEffect, useState } from "react";

import ProjectAPI from "components/API/ProjectAPI.js";

const milestones = [
  {
    name: "Milestone 1",
    tasks: [
      {
        name: "Task 1"
      },
      {
        name: "Task 2"
      },
      {
        name: "Task 3"
      }
    ]
  },
  {
    name: "Milestone 2",
    tasks: [
      {
        name: "Task 1"
      },
      {
        name: "Task 2"
      },
      {
        name: "Task 3"
      }
    ]
  }
];

const Outline = () => {

  const [milestones, setMilestones] = useState([])

  async function createOutlineList() {
    let components = undefined;
    try {
      components = await ProjectAPI.getComponents();
      setMilestones(components[0].milestones)

    } catch (error) {
      
    }  
  }

  useEffect(() => {
    createOutlineList()
  }, [])

  return (
    <S.Outline>
      <S.Header>
        <S.HeaderText>Outline</S.HeaderText>
      </S.Header>

      <S.Content>
        {milestones.map(milestone => (
          <S.MilestoneContainer>
            <S.Milestone>{milestone.milestone_name}</S.Milestone>
            {milestone.tasks.map(task => (
              <S.Task>{task.task_name}</S.Task>
            ))}
          </S.MilestoneContainer>
        ))}
      </S.Content>
    </S.Outline>
  );
};

export default Outline;
