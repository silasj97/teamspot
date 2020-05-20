import * as errors from "./errors";
import Authentication from "./Authentication";
import Config from "./APIConfig";


export default class ProjectAPI {
  static async getComponents() {
    const res = await fetch(`${Config.base_url}/project`, {
      method: "GET",
      headers: Authentication.withoutJWT()
    });

    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    return json.components;
  }

  static async createTask(props) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(
      `${Config.base_url}/tasks/create`,
      {
        method: "POST",
        headers: Authentication.withJWT(),
        body: JSON.stringify(props)
      }
    );
    if (res.ok) {
      const json = await res.json();
      return json.generationSuccess;
    } else {
      throw new errors.UnexpectedError();
    }
  }
}
