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

  async function createOutlineList() {
    let apiProjectComponents = undefined;
    try {
      apiProjectComponents = await ProjectAPI.getComponents()
      console.log(apiProjectComponents)
      setProjectComponents(apiProjectComponents)
      setComponents(apiProjectComponents.map(component => component.component_name))
      setMilestones(apiProjectComponents[0].milestones)
      setActiveComponent(apiProjectComponents[0].component_name)
    } catch (error) {
      
    }  
  }

  useEffect(() => {
    createOutlineList()
  }, [])

  useEffect(() => {
    const activeComponentIndex = projectComponents.findIndex(component => component.component_name === activeComponent)
    if (activeComponentIndex >= 0) {
      setMilestones(projectComponents[activeComponentIndex].milestones)
    }
  }, [activeComponent])

  const setActiveComponentFunction = payload => setActiveComponent(payload)

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
      <Outline milestones={milestones} />
      <Timeline milestones={milestones}/>
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
