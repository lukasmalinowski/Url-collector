import type { CreatePicturesHandler } from './handlers/commands/create-pictures.handler';
import type { GetPicturesHandler } from './handlers/queries/get-pictures.handler';

export * from './queries';
export * from './commands';

export type PictureQueryHandlers = GetPicturesHandler;
export type PictureCommandHandlers = CreatePicturesHandler;
