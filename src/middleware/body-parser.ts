import type { RequestHandler } from 'express';
import { json } from 'express';

export class BodyParserMiddleware {
  execute(): RequestHandler {
    return (req, res, next): void => {
      json({ limit: '10kb' })(req, res, next);
    };
  }
}
