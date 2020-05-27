import styled from "styled-components";
import SkyLight from 'react-skylight'

export const Modal = styled(SkyLight)`
  height: auto;
`

export const Timeline = styled.div`
  flex-grow: 1;
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
  background: var(--LightColor);
  border-bottom: solid var(--DarkColor) 1px;
`;

export const HeaderText = styled.h1`
  font-size: var(--HeaderSize);
  font-weight: var(--HeaderWeight);
  padding: 16px;
`;

export const Content = styled.div`
  padding: 16px;
  padding-top: 0px;
  height: calc(100vh - 80px);
  overflow-y: scroll;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;

  width: 100%;
  height: 48px;
  padding: 16px 0px;
`;

export const Or = styled.div`
  padding: 32px;
`;

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`

export const TextInput = styled.input`
  display: flex;
  padding: 8px 8px;
  margin: 8px 0px;
  border-radius: 8px;
  width: calc(100% - 16px);
  height: 24px;
  border: none;
`

export const RadioInput = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0px;
  margin: 4px 0px;
  border-radius: 8px;
  width: calc(100% - 16px);
  height: 18px;
`

export const SelectInput = styled.select`
  display: flex;
  padding: 8px 8px;
  margin: 8px 0px;
  border-radius: 8px;
  width: 100%;
  height: 48px;
  border: none;
  line-height: 0;
`

export const ButtonInput = styled.div`
  width: 100%;
  margin-top: 8px;
`

export const TimelineMilestones = styled.div`
 
`