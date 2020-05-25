import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom"
import "./App.css"

// Pages
import HomePage from "./views/HomePage/HomePage"

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={HomePage} />
        </Switch>
      </Router>
    </div>
  )
}

export default withRouter(App)
