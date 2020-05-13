export class IncorrectLoginError extends Error {
  constructor() {
    super("Incorrect Username or Password");
    this.name = "IncorrectLoginError";
  }
}

export class EmailRegisteredError extends Error {
  constructor() {
    super("Email already registered");
    this.name = "EmailRegisteredError";
  }
}

export class UnexpectedError extends Error {
  constructor() {
    super("Unexpected error: Please try again");
    this.name = "UnexpectedError";
  }
}
