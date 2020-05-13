import * as S from "./styles";

import React from "react";

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
  return (
    <S.Outline>
      <S.Header>
        <S.HeaderText>Outline</S.HeaderText>
      </S.Header>

      <S.Content>
        {milestones.map(milestone => (
          <S.MilestoneContainer>
            <S.Milestone>{milestone.name}</S.Milestone>
            {milestone.tasks.map(task => (
              <S.Task>{task.name}</S.Task>
            ))}
          </S.MilestoneContainer>
        ))}
      </S.Content>
    </S.Outline>
  );
};

export default Outline;
