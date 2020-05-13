import React from "react";
import { shallow } from "enzyme";
import NoAuthHeaderLinks from "./NoAuthHeaderLinks";

it("renders without crashing", () => {
  const wrapper = shallow(<NoAuthHeaderLinks />);
});

it("toggles the login and register screens", () => {
  const context = {};
  const wrapper = shallow(<NoAuthHeaderLinks />, { context }).dive({ context });

  for (const modal of ["loginModal", "registerModal"]) {
    expect(wrapper.state(modal)).toBe(false);
    wrapper.instance().handleClickOpen(modal);
    expect(wrapper.state(modal)).toBe(true);
    wrapper.instance().handleClose(modal);
    expect(wrapper.state(modal)).toBe(false);
  }
});
