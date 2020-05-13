import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import HomePage from "views/HomePage";

it("renders without crashing", () => {
  const wrapper = shallow(<App />);
});
