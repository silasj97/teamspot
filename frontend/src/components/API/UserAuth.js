import * as errors from "./errors";
import Authentication from "./Authentication";
import Config from "./APIConfig";

export default class UserAuth {
  static async login(email, password) {
    const res = await fetch(`${Config.base_url}/user/login`, {
      method: "POST",
      headers: Authentication.withoutJWT(),
      body: JSON.stringify({ email, password })
    });

    if (res.status === 401) {
      // API returned unauthorized
      throw new errors.IncorrectLoginError();
    }
    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    Authentication.setToken(json.jwt);
  }

  static async googleLogin(gToken) {
    const res = await fetch(`${Config.base_url}/user/google-auth`, {
      method: "POST",
      headers: await Authentication.withoutJWT(),
      body: JSON.stringify({ gToken })
    });
    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    Authentication.setToken(json.jwt);
  }

  static async register(name, email, password) {
    const res = await fetch(`${Config.base_url}/user/register`, {
      method: "POST",
      headers: Authentication.withoutJWT(),
      body: JSON.stringify({ email, password, name })
    });

    if (res.status === 409) {
      // User already registered
      throw new errors.EmailRegisteredError();
    }
    if (!res.ok) {
      // Other API error
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    Authentication.setToken(json.jwt);
  }

  static async renew() {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/user/renew`, {
      method: "GET",
      headers: Authentication.withJWT()
    });

    if (res.ok) {
      const json = await res.json();
      Authentication.setToken(json.jwt);
    } else {
      this.logout();
    }
  }

  static logout() {
    localStorage.removeItem("userToken");
  }

  static startAutoRenewal() {
    const delay = 10 * 60 * 1000; // 10 minutes
    UserAuth.renew();
    setInterval(() => UserAuth.renew(), delay);
  }
}
