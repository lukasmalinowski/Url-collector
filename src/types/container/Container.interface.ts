import type { AwilixContainer } from 'awilix';
import type { Application } from 'express';
import type { Server } from 'http';
import type { CommandBus } from '@tshio/command-bus';

import type { AppConfig } from '../../config';
import type { Module } from '../Module';
import type { AppQueryBus } from '../AppQueryBus';
import type { BodyParserMiddleware } from '../../middleware';

export interface AppContainerRegistry {
  appConfig: AppConfig;
  app: Promise<Application>;
  httpServer: Server;
  modules: Module<any>[];
  queryBus: AppQueryBus;
  commandBus: CommandBus<any>;

  // middlewares
  bodyParserMiddleware: BodyParserMiddleware;
}

export type AppContainer = AwilixContainer<AppContainerRegistry>;
