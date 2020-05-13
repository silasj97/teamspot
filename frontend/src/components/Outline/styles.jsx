import styled from "styled-components";

export const Outline = styled.div`
  width: 272px;
  height: 100vh;
  background: var(--LightColor);
  color: var(--TextColor);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  width: 100%;
  height: var(--HeaderHeight);
  background: var(--MediumColor);
  border-bottom: solid var(--DarkColor) 1px;
`;

export const HeaderText = styled.h1`
  font-size: var(--HeaderSize);
  font-weight: var(--HeaderWeight);
  padding: 16px;
`;

export const Content = styled.div`
  padding-top: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
`;

export const MilestoneContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export const Milestone = styled.h3`
  font-size: var(--LargeSize);
  margin: 0;
  display: flex;
  flex-basis: 100%;
  font-weight: 400;
`;

export const Task = styled.h5`
  font-size: var(--SmallSize);
  display: flex;
  flex-basis: 100%;
  margin: 0;
  font-weight: 400;
  margin-top: 8px;
`;
