import { asClass } from 'awilix';

import type { PictureModuleContainer } from '../../interfaces';
import { GetPicturesHandler } from './get-pictures.handler';

export function registerQueryHandler(container: PictureModuleContainer): void {
  container.register({
    getPicturesQueryHandler: asClass(GetPicturesHandler).singleton(),
  });
}
