import styled, { keyframes, css } from "styled-components";

export const Button = styled.div`
  color: var(--Text);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  min-width: 24px;
  padding: ${props => (props.square ? "8px" : "12px 24px")};
  border-radius: 16px;
  margin: var(--Margin);
  background: ${props =>
    props.emphasize ? "var(--HighlightColor)" : "var(--LightColor)"};
  cursor: pointer;
  &:hover {
    background: var(--HighlightColor);
  }
  &:active {
    background: var(--HighlightColor);
    transform: translateY(1px);
  }
`;

export const Text = styled.div`
  font-size: 18px;
  line-height: 0;
  margin-left: ${props => (props.icon ? "8px" : "0px")};
`;
