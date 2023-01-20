import type { AwilixContainer } from 'awilix';

import type { AppContainerRegistry } from '../../../types';
import type { GetPicturesUrlsAction } from '../actions/get-pictures-urls.action';
import type { CreatePicturesHandler } from '../handlers/commands/create-pictures.handler';
import type { GetPicturesHandler } from '../handlers/queries/get-pictures.handler';
import type { Provider } from '../interfaces';
import type { PictureInMemoryRepository } from '../repositories/picture-inmemory.repository';
import type { PictureService } from '../services/picture.service';

export interface PictureModuleContainerRegistry extends AppContainerRegistry {
  pictureRepository: PictureInMemoryRepository;
  pictureService: PictureService;
  pictureProvider: Provider;
  createPicturesCommandHandler: CreatePicturesHandler;
  getPicturesQueryHandler: GetPicturesHandler;
  getPicturesUrlsAction: GetPicturesUrlsAction;
}

export type PictureModuleContainer = AwilixContainer<PictureModuleContainerRegistry>;
