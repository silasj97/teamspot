import styled from "styled-components";

export const Timeline = styled.div`
  flex-grow: 1;
  height: 100vh;
  background: var(--DarkColor);
  color: var(--TextColor);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  width: calc(100% - 2px);
  height: var(--HeaderHeight);
  background: var(--MediumColor);
  border-bottom: solid var(--DarkColor) 1px;
  border-left: solid var(--DarkColor) 1px;
  border-right: solid var(--DarkColor) 1px;
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

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 96px;
  width: 100%;
`;

export const Or = styled.div`
  padding: 32px;
`;
