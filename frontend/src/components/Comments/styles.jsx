import styled from "styled-components";

export const Comments = styled.div`
  width: 546px;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
`;
