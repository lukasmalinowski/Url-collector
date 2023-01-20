import type { QueryHandler } from '@tshio/query-bus';
import { asValue } from 'awilix';
import { QueryBus } from '@tshio/query-bus';

import type { AppContainer } from '../types';
import Logger from '../utils/logger';

export function registerQueryBus(container: AppContainer) {
  const modules = [...container.cradle.modules];

  const queryHandlers = modules.reduce((acc, module) => {
    if (module.moduleSettings.handlers?.queries) {
      Logger.info(
        { action: 'REGISTER_QUERY_BUS' },
        `Registered query bus handler for module: ${module.name.toString()}`,
        '; query types:',
        module.moduleSettings.handlers.queries.map((handler) => handler.queryType.toString())
      );
      return [...acc, ...module.moduleSettings.handlers.queries];
    }

    return acc;
  }, [] as QueryHandler<any, any>[]);

  const queryBus = new QueryBus(queryHandlers);

  container.register({
    queryBus: asValue(queryBus),
  });
}
