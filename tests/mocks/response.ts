import type { Response } from 'express';

interface ResponseContext {
  status?: number;
  body?: unknown;
  redirectedTo?: string;
}

class MockResponse {
  private readonly context: ResponseContext = {};

  public status(status: number): MockResponse {
    this.context.status = status;
    return this;
  }

  public json(result: unknown): void {
    this.context.body = result;
  }

  public redirect(status: number, url: string): void {
    this.context.status = status;
    this.context.redirectedTo = url;
  }

  getContext(): ResponseContext {
    return this.context;
  }
}

export const mockResponse = () => {
  return new MockResponse() as unknown as Response & { getContext: () => ResponseContext };
};
