type Status = 'success' | 'error';

export class Result<Payload extends object = {}> {
  private constructor(private readonly status: Status, private readonly payload?: Payload) {}

  toObject() {
    const payloadKey = this.status === 'success' ? 'data' : 'error';
    return {
      status: this.status,
      [payloadKey]: this.payload,
    };
  }

  toJSON() {
    return this.toObject();
  }

  toString() {
    return JSON.stringify(this.toObject());
  }

  static ok<Payload extends object>(payload?: Payload) {
    return new Result('success', payload);
  }

  static error<Payload extends object>(errorObject?: Payload) {
    return new Result('error', errorObject);
  }
}
