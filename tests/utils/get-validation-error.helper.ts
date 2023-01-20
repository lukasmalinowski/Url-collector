import { type Segments, type CelebrateError } from 'celebrate';
import { type Response, type Request, type RequestHandler } from 'express';

export const getValidationError = async (validator: RequestHandler, req: Request, segment: Segments) => {
  const next = jest.fn<any, [CelebrateError]>();

  await validator(req, {} as Response, next as any);

  if (!next.mock.calls[0][0]) {
    return [];
  }

  return next.mock.calls[0][0].details.get(segment)?.details ?? [];
};
