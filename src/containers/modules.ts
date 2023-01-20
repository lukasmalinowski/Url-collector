import { asValue } from 'awilix';

import type { AppContainer, Module } from '../types';
import { defaultModules } from '../modules';
import Logger from '../utils/logger';

export async function registerModules(container: AppContainer) {
  const registeredDefaultModules: Module<any>[] = [];

  for (const module of defaultModules) {
    await module.register(container);
    registeredDefaultModules.push(module);
    Logger.info({ action: 'REGISTER_MODULES' }, `Registered module: ${module.name.toString()}`);
  }

  container.register({
    modules: asValue(registeredDefaultModules),
  });
}
