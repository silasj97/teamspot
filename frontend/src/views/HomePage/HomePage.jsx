import * as S from "./styles";

import React, { useEffect, useState } from "react";

import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Header from "components/Header/Header.jsx";
import headerLinksStyle from "assets/jss/components/headerLinksStyle.jsx";
import NoAuthHeaderLinks from "components/Header/NoAuthHeaderLinks.jsx";
import AuthHeaderLinks from "components/Header/AuthHeaderLinks.jsx";
import TournamentList from "components/Tournament/TournamentList.jsx";

import Authentication from "components/API/Authentication.js";

//Teamspot
import Ribbon from "../../components/Ribbon/Ribbon";
import Sidebar from '../../components/Sidebar/Sidebar'
import Outline from "../../components/Outline/Outline";
import Comments from "../../components/Comments/Comments";
import Timeline from "../../components/Timeline/Timeline";

import ProjectAPI from "components/API/ProjectAPI.js";

const HomePage = ({ classes, login, register, ...rest }) => {
  const [projectComponents, setProjectComponents] = useState([])
  const [milestones, setMilestones] = useState([])
  const [components, setComponents] = useState([])
  const [activeComponent, setActiveComponent] = useState('')
  const [activeComponentId, setActiveComponentId] = useState(null)

  async function getComponents() {
    try {
      const apiProjectComponents = await ProjectAPI.getComponents()
      setProjectComponents(apiProjectComponents)
      console.log(apiProjectComponents)
      setComponents(apiProjectComponents.map(component => component.component_name))
      setMilestones(apiProjectComponents[0].milestones)
      setActiveComponent(apiProjectComponents[0].component_name)
      setActiveComponentId(apiProjectComponents[0].project_component_id)
    } catch (error) {
      
    }  
  }

  useEffect(() => {
    getComponents()
  }, [])

  useEffect(() => {
    const activeComponentIndex = projectComponents.findIndex(component => component.component_name === activeComponent)
    if (activeComponentIndex >= 0) {
      setMilestones(projectComponents[activeComponentIndex].milestones)
      setActiveComponentId(projectComponents[activeComponentIndex].id)
    }
    
  }, [activeComponent])

  const setActiveComponentFunction = payload => setActiveComponent(payload)

  const updateCallback = () => {
    getComponents()
  }

  return (
    <S.HomePage>

      {/* <Ribbon></Ribbon> */}

      <S.HeaderContainer>
        <Header
          color="primary"
          brand="Teamspot"
          rightLinks={
            Authentication.loggedIn() ? (
              <AuthHeaderLinks />
            ) : (
              <NoAuthHeaderLinks loginPage={login} registerPage={register} />
            )
          }
          {...rest}
        />
      </S.HeaderContainer>

      <Sidebar 
        components={components} 
        activeComponent={activeComponent} 
        onClickFunction={setActiveComponentFunction}
      />
      <Outline 
        milestones={milestones}
        activeComponent={activeComponent}
        updateCallback={updateCallback}
      />
      <Timeline
        milestones={milestones}
        activeComponent={activeComponent}
        activeComponentId={activeComponentId}
      />
      <Comments />
    </S.HomePage>
  );
};

// class HomePage extends React.Component {
//   render() {
//     const { classes, login, register, ...rest } = this.props;
//     return (
//       <div>
//         <div>
//           <Outline />
//           <Comments />
//           {/* <Ribbon /> */}
//           {/* <Header
//             color="primary"
//             brand="Teamspot"
//             rightLinks={
//               Authentication.loggedIn() ? (
//                 <AuthHeaderLinks />
//               ) : (
//                 <NoAuthHeaderLinks loginPage={login} registerPage={register} />
//               )
//             }
//             {...rest}
//           /> */}
//         </div>
//         {/* <TournamentList /> */}
//       </div>
//     );
//   }
// }

export default withStyles(headerLinksStyle)(HomePage);
