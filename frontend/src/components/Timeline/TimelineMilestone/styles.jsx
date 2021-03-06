import styled from "styled-components";

export const TimelineMilestone = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  margin-bottom: 16px;
  
  border-radius: 8px;
  flex-wrap: wrap;
  user-select: none;
  background: var(--ButtonColor);
`

export const Header = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: ${props => props.active ? '8px' : '0px'};
  background: ${props => props.active ? 'var(--ButtonColor)' : 'var(--HighlightColor)'};
  padding: 16px;
  border-radius: 8px 8px 0px 0px;
`

export const Name = styled.div`
  display: flex;
  font-size: var(--LargeSize);
`

export const Complete = styled.input`

`

export const Content = styled.div`
  width: 100%;
  padding: 16px;
  padding-top: 0;
`

export const Spacer = styled.div`
  display: flex;
  flex-grow: 1;
`

export const Deadline = styled.div`
  display: flex;
  font-size: var(--SmallSize);
`

export const Description = styled.div`
  display: flex;
  margin: 8px 0px;
  margin-top: 16px;
  font-size: var(--SmallSize);
  user-select: auto !important;
`

export const EmojiButtons = styled.div`
  display: flex;
  flex-basis: 1;
  width: 100%;
`

export const Tasks = styled.div`
  width: 100%;
`

export const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`