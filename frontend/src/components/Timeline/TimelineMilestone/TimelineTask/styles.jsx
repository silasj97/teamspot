import styled from "styled-components";

export const TimelineTask = styled.div`
  display: flex;
  width: calc(100% - 32px);
  max-width: calc(100% - 32px);
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  flex-wrap: wrap;
  background: var(--LightColor);
  /* border: ; */
  box-shadow: ${props => props.active ? 'none' : 'inset 0 0 0 1px var(--HighlightColor)'};
  
  /* background: var(--LightColor); */
  user-select: none;
`

export const Header = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: ${props => props.active ? '8px' : '0px'};
`

export const Name = styled.div`
  display: flex;
  font-size: var(--LargeSize);
`

export const Complete = styled.input`

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
  font-size: var(--SmallSize);
  user-select: auto !important;
`

export const EmojiButtons = styled.div`
  display: flex;
  flex-basis: 1;
  width: 100%;
`

export const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`