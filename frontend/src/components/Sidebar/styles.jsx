import styled from "styled-components";

export const Logo = styled.img`
  width: 36px;
  height: 36px;
  margin: 12px;
  margin-top: 24px;
`

export const Sidebar = styled.div`
  width: 72px;
  height: 100vh;
  background: var(--DarkColor);
  color: var(--TextColor);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* background: var(--MediumColor);
  border-right: solid var(--DarkColor) 1px; */
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
  width: 48px;
  height: 48px;
  margin: 12px;
  font-weight: 600;
  background: ${props => props.active ? 'var(--HighlightColor)' : 'var(--LightColor)'};
  border-radius: ${props => props.active ? '16px' : '100%'};

  cursor: pointer;
  transition: .4s;
  &:hover {
    background: var(--HighlightColor);
    border-radius: 16px;
  }
`