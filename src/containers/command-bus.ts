import type { CommandHandler } from '@tshio/command-bus';
import { asValue } from 'awilix';
import { CommandBus } from '@tshio/command-bus';

import type { AppContainer } from '../types';
import Logger from '../utils/logger';

export function registerCommandBus(container: AppContainer) {
  const modules = [...container.cradle.modules];

  const commandHandlers = modules.reduce((acc, module) => {
    if (module.moduleSettings.handlers?.commands) {
      Logger.info(
        { action: 'REGISTER_COMMAND_BUS' },
        `Registered commands bus handler for module: ${module.name.toString()}`,
        '; command types:',
        module.moduleSettings.handlers.commands.map((handler) => handler.commandType.toString())
      );
      return [...acc, ...module.moduleSettings.handlers.commands];
    }

    return acc;
  }, [] as CommandHandler<any>[]);

  const commandBus = new CommandBus(commandHandlers);

  container.register({
    commandBus: asValue(commandBus),
  });
}
