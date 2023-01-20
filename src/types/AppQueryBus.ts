import type { QueryBus } from '@tshio/query-bus';

import type { PictureQueryHandlers } from '../modules/picture';

export type AppQueryBus = QueryBus<[PictureQueryHandlers]>;
