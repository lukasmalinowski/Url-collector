import { asClass } from 'awilix';

import type { AppContainer } from '../types';
import { BodyParserMiddleware } from './body-parser';

export * from './body-parser';

export const registerMiddleware = (container: AppContainer): void => {
  container.register({
    bodyParserMiddleware: asClass(BodyParserMiddleware).singleton(),
  });
};
