import type { AppConfig } from '../config';
import type { BodyParserMiddleware } from '../middleware';
import type { Module } from '../types';
import type { AppQueryBus } from '../types/AppQueryBus';

export interface CreateAppDependencies {
  appConfig: AppConfig;
  modules: Module<any>[];
  bodyParserMiddleware: BodyParserMiddleware;
  queryBus: AppQueryBus;
}
