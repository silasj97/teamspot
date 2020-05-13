import decode from "jwt-decode";

export default class Authentication {
  static withoutJWT() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
  }

  static withJWT() {
    return {
      Authorization: `Bearer ${this.getToken()}`,
      ...this.withoutJWT()
    };
  }

  static setToken(userToken) {
    localStorage.setItem("userToken", userToken);
  }

  static getToken() {
    return localStorage.getItem("userToken");
  }

  // returns true if token is not expired
  static isTokenExpired() {
    const token = this.getToken();
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  static loggedIn() {
    return Boolean(this.getToken()) && !this.isTokenExpired();
  }

  static getUID() {
    if (!this.loggedIn()) {
      return null;
    }
    const token = this.getToken();
    try {
      const decoded = decode(token);
      return decoded.id;
    } catch (err) {
      return null;
    }
  }
}
