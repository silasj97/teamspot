import * as S from "./styles";

import React from "react";

import Button from "../Button/Button";

const Timeline = () => {
  return (
    <S.Timeline>
      <S.Header>
        <S.HeaderText>Timeline</S.HeaderText>
      </S.Header>

      <S.Content>
        <S.ButtonContainer>
          <Button
            text="New Milestone"
            onClickFunction={() => alert("Button Press")}
          />
          <S.Or>or</S.Or>
          <Button
            text="New Task"
            onClickFunction={() => alert("Button Press")}
          />
        </S.ButtonContainer>
      </S.Content>
    </S.Timeline>
  );
};

export default Timeline;
