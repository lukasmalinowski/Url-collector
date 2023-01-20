import { asClass } from 'awilix';

import type { PictureModuleContainer } from '../interfaces';
import { GetPicturesUrlsAction } from './get-pictures-urls.action';

export function registerActions(container: PictureModuleContainer) {
  container.register({
    getPicturesUrlsAction: asClass(GetPicturesUrlsAction).singleton(),
  });
}
