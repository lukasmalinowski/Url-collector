import type { Request } from 'express';

interface MockRequestOptions {
  body?: any;
  params?: any;
  query?: any;
  method?: string;
  headers?: any;
}

export const mockRequest = (options: MockRequestOptions = {}): Request => {
  return options as unknown as Request;
};
