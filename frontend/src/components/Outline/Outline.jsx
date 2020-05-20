import * as S from "./styles";

import React, { useEffect, useState } from "react";

const Outline = ({ milestones }) => {
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
