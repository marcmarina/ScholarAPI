export default class CustomError extends Error {
  errors;
  statusCode: number;
  constructor(errors, statusCode?: number) {
    super();
    this.errors = errors;
    this.statusCode = statusCode;
  }
  getErrors() {
    return this.errors;
  }
}
