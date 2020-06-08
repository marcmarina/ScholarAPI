class ErrorHandler {
  constructor(errors) {
    this.errors = new Map();
    if (errors) this.populate(errors);
  }

  populate(errors) {
    errors.array().forEach(value => {
      if (this.errors.has(value.param)) {
        this.errors.get(value.param).push(value.msg);
      } else {
        this.errors.set(value.param, [value.msg]);
      }
    });
  }

  addError(key, message) {
    if (this.errors.has(key)) {
      this.errors.get(key).push(message);
    } else {
      this.errors.set(key, [message]);
    }
  }

  getErrors() {
    return Object.fromEntries(this.errors);
  }
}

module.exports = ErrorHandler;
