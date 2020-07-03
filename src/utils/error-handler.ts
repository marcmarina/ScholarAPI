import { Result, ValidationError } from 'express-validator';
import { mapToJSON } from './utils';

export default class ErrorHandler {
  errors: Map<string, Array<string>>;

  constructor(errors?: Result<ValidationError>) {
    this.errors = new Map();
    if (errors) this.populate(errors);
  }

  private populate(errors) {
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
    return mapToJSON(this.errors);
  }
}

type ObjectFromEntries<Entries extends [keyof any, any][]> = {
  [K in Entries[number][0]]: Extract<Entries[number], [K, any]>[1];
};
