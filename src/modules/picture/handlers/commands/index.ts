import { asClass } from 'awilix';

import type { PictureModuleContainer } from '../../interfaces';
import { CreatePicturesHandler } from './create-pictures.handler';

export function registerCommandHandler(container: PictureModuleContainer): void {
  container.register({
    createPicturesCommandHandler: asClass(CreatePicturesHandler).singleton(),
  });
}
