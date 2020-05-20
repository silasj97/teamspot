import styled from "styled-components";

export const Sidebar = styled.div`
  width: 72px;
  height: 100vh;
  background: var(--DarkColor);
  color: var(--TextColor);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  width: 100%;
  height: var(--HeaderHeight);
  background: var(--MediumColor);
  border-right: solid var(--DarkColor) 1px;
`;

export const HeaderText = styled.h1`
  font-size: var(--HeaderSize);
  font-weight: var(--HeaderWeight);
  padding: 16px;
`;



export const Component = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  border-radius: 100%;
  margin: 8px;
  font-weight: var(--HeaderWeight);
  background: ${props => props.active ? 'var(--HighlightColor)' : 'var(--LightColor)'};
  cursor: pointer;
`