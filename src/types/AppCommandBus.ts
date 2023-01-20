import type { CommandBus } from '@tshio/command-bus';

import type { PictureCommandHandlers } from '../modules/picture';

export type AppCommandBus = CommandBus<[PictureCommandHandlers]>;
