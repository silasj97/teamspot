import React from "react";
import { shallow } from "enzyme";
import Header from "./Header";

it("renders without crashing", () => {
  const wrapper = shallow(<Header />);
});

it("toggles the login and register screens", () => {
  const context = {};
  const wrapper = shallow(<Header />, { context }).dive({ context });

  expect(wrapper.state("mobileOpen")).toBe(false);
  wrapper.instance().handleDrawerToggle();
  expect(wrapper.state("mobileOpen")).toBe(true);
  wrapper.instance().handleDrawerToggle();
  expect(wrapper.state("mobileOpen")).toBe(false);
});
