import { isCelebrateError } from 'celebrate';
import type { ErrorRequestHandler } from 'express';

export function errorHandler(): ErrorRequestHandler {
  // eslint-disable-next-line max-params
  return (err, req, res, next) => {
    if (isCelebrateError(err)) {
      const errors =
        Object.fromEntries(err.details).query ||
        Object.fromEntries(err.details).body ||
        Object.fromEntries(err.details).params;

      res.status(400).json({
        error: errors.details[0].message,
      });
      return;
    }

    const errorStatusCode = err.statusCode ?? 500;

    res.status(errorStatusCode).json({
      error: err.message,
    });
  };
}
