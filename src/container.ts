import { asFunction, asValue, createContainer, InjectionMode } from 'awilix';
import http from 'http';

import type { AppContainer, AppContainerRegistry } from './types';
import type { AppConfig } from './config';
import { createApp } from './app';
import { registerModules } from './containers/modules';
import Logger from './utils/logger';
import { registerMiddleware } from './middleware';
import { registerQueryBus } from './containers/query-bus';
import { registerCommandBus } from './containers/command-bus';

export async function createAppContainer(appConfig: AppConfig): Promise<AppContainer> {
  const container = createContainer<AppContainerRegistry>({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({
    appConfig: asValue(appConfig),
  });
  Logger.info({ action: 'CREATE_APP_CONTAINER' }, 'Registered app config');

  // Register app dependencies
  await registerModules(container);
  registerQueryBus(container);
  registerCommandBus(container);
  registerMiddleware(container);

  container.register({
    app: asFunction(createApp).singleton(),
  });
  Logger.info({ action: 'CREATE_APP_CONTAINER' }, 'Registered app');

  const { app } = container.cradle;

  container.register({
    httpServer: asValue(http.createServer(await app)),
  });
  Logger.info({ action: 'CREATE_APP_CONTAINER' }, 'Registered http server');

  return container;
}
