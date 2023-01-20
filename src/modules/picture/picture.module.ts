import { type AwilixContainer, createContainer, InjectionMode, asClass } from 'awilix';

import type { AppContainer } from '../../types';
import type { PictureModuleContainerRegistry } from './interfaces';
import type { ModuleSettings } from '../../types/Module';
import { Module } from '../../types/Module';
import { registerActions } from './actions';
import { PictureInMemoryRepository } from './repositories/picture-inmemory.repository';
import { registerHandlers } from './handlers';
import { registerCommandHandler } from './handlers/commands';
import { PictureService } from './services/picture.service';
import { ProviderNasa } from './providers/provider-nasa';

export class PictureModule extends Module<PictureModuleContainerRegistry> {
  public readonly name = Symbol(PictureModule.name);
  protected settings: ModuleSettings;
  protected moduleContainer: AwilixContainer<PictureModuleContainerRegistry>;

  register(appContainer: AppContainer): void {
    this.moduleContainer = createContainer<PictureModuleContainerRegistry>(
      {
        injectionMode: InjectionMode.PROXY,
      },
      appContainer
    );

    this.moduleContainer.register({
      pictureRepository: asClass(PictureInMemoryRepository).singleton(),
      pictureService: asClass(PictureService).singleton(),
      pictureProvider: asClass(ProviderNasa).singleton(),
    });

    registerActions(this.moduleContainer);
    registerHandlers(this.moduleContainer);
    registerCommandHandler(this.moduleContainer);

    this.moduleSettings = {
      controllers: {
        http: [
          {
            path: '/pictures',
            actions: [this.moduleContainer.cradle.getPicturesUrlsAction],
          },
        ],
      },
      handlers: {
        queries: [this.moduleContainer.cradle.getPicturesQueryHandler],
        commands: [this.moduleContainer.cradle.createPicturesCommandHandler],
      },
    };
  }
}
