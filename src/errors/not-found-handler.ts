import type { RequestHandler } from 'express';
import AppError from './app-error';

export function notFoundErrorHandler(): RequestHandler {
  return (req, res, next) => {
    const err = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(err);
  };
}
