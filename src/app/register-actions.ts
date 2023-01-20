import type { Application, NextFunction, Request, RequestHandler, Response } from 'express';
import express from 'express';

import type { CreateAppDependencies } from './interface';
import type { Module } from '../types';
import Logger from '../utils/logger';
import { httpActionErrorHandler } from '../errors/http-action-error.handler';

interface RegisterActionsOptions {
  app: Application;
  modules: Module<any>[];
  dependencies: CreateAppDependencies;
}

export const registerActions = async (options: RegisterActionsOptions) => {
  for await (const module of options.modules) {
    const moduleSettings = module.moduleSettings;
    if (moduleSettings.controllers.http) {
      for (const http of moduleSettings.controllers.http) {
        const path = http.path;

        const router = express.Router();

        for (const action of http.actions) {
          Logger.info(
            { action: 'CREATE_APP_HTTP' },
            `Registering http action: [${action.method.toUpperCase()}] ${path}${action.path}`
          );

          const middleware: RequestHandler[] = [];

          if (action.getPayloadValidator) {
            middleware.push(action.getPayloadValidator());
          }

          if (action.middleware) {
            middleware.push(...action.middleware);
          }

          router[action.method](action.path, middleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
              await action.invoke(req, res);
            } catch (error) {
              next(httpActionErrorHandler(error, action, path));
            }
          });
        }

        options.app.use(path, router);
      }
    }
  }
};
