import type { HttpAction } from '../core';
import AppError from './app-error';
import Logger from '../utils/logger';

export const httpActionErrorHandler = (error: unknown, action: HttpAction, path: string): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  Logger.error(
    {
      action: 'HTTP_CONTROLLER',
      http: {
        method: action.method,
        url: `${path}${action.path}`,
      },
    },
    error as Error
  );
  return new AppError('Internal server error', 500);
};
