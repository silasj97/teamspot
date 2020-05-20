import * as S from "./styles"

import React, { useEffect, useState } from "react"

const Sidebar = ({activeComponent, components, onClickFunction}) => {
  return (
    <S.Sidebar>
      <S.Header>
        <S.HeaderText>T</S.HeaderText>
      </S.Header>
      {
        components.map(component => 
          <S.Component active={activeComponent === component} onClick={() => onClickFunction(component)}>
            {component.charAt(0).toUpperCase()}
          
          </S.Component>
        )
      }
      <S.Component>+</S.Component>
    </S.Sidebar>
  )
}

export default Sidebar
