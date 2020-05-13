import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import fetch from "jest-fetch-mock";

configure({ adapter: new Adapter() });
global.fetch = fetch;
global.StorageMock = class {
  constructor() {
    this.store = Object.create(null);
  }

  getItem(key) {
    return this.store[key];
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  clear() {
    this.store = Object.create(null);
  }

  removeItem(key) {
    delete this.store[key];
  }
};
