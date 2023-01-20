import type { PictureModuleContainer } from '../interfaces';
import { registerCommandHandler } from './commands';
import { registerQueryHandler } from './queries';

export function registerHandlers(container: PictureModuleContainer) {
  registerQueryHandler(container);
  registerCommandHandler(container);
}
