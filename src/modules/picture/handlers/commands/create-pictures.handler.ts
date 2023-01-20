import type { CommandHandler } from '@tshio/command-bus';

import type { PictureInMemoryRepository } from '../../repositories/picture-inmemory.repository';
import { type CreatePicturesCommand, CREATE_PICTURES_COMMAND_TYPE } from '../../commands/create-pictures.command';

interface CreatePicturesHandlerDependencies {
  pictureRepository: PictureInMemoryRepository;
}

export class CreatePicturesHandler implements CommandHandler<CreatePicturesCommand> {
  public commandType = CREATE_PICTURES_COMMAND_TYPE;

  constructor(private readonly dependencies: CreatePicturesHandlerDependencies) {}

  async execute(query: CreatePicturesCommand): Promise<void> {
    const { data } = query.payload;

    await this.dependencies.pictureRepository.createMany(data);
  }
}
