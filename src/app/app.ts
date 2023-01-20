import type { Application } from 'express';
import express from 'express';
import helmet from 'helmet';

import type { CreateAppDependencies } from './interface';
import { errorHandler } from '../errors';
import { notFoundErrorHandler } from '../errors/not-found-handler';
import { registerActions } from './register-actions';

export async function createApp(dependencies: CreateAppDependencies): Promise<Application> {
  const app = express();

  app.use(helmet());

  app.use(dependencies.bodyParserMiddleware.execute());

  await registerActions({
    app,
    dependencies,
    modules: dependencies.modules,
  });

  app.all('*', notFoundErrorHandler());

  app.use(errorHandler());

  return app;
}
