import type { Command } from '@tshio/command-bus';

import type { PictureProvider } from '../entities/picture.entity';

export const CREATE_PICTURES_COMMAND_TYPE = 'picture/CREATE_PICTURES';

export interface CreatePicturesCommandPayload {
  data: {
    provider: PictureProvider;
    address: string;
    imageUrl: string;
  }[];
}

export class CreatePicturesCommand implements Command<CreatePicturesCommandPayload> {
  public type = CREATE_PICTURES_COMMAND_TYPE;

  constructor(public readonly payload: CreatePicturesCommandPayload) {}
}
