import type { AwilixContainer } from 'awilix';
import type { QueryHandler } from '@tshio/query-bus';
import type { CommandHandler } from '@tshio/command-bus';

import type { AppContainer } from './container';
import type { HttpAction } from '../core';

export interface ModuleSettings {
  controllers: {
    http?: {
      path: `/${string}`;
      actions: HttpAction[];
    }[];
  };
  handlers?: {
    queries?: QueryHandler<any, any>[];
    commands?: CommandHandler<any>[];
  };
}

export abstract class Module<ModuleContainerRegistry extends object> {
  public readonly name: Symbol;
  protected abstract settings: ModuleSettings;
  protected abstract moduleContainer: AwilixContainer<ModuleContainerRegistry>;

  public get moduleSettings(): ModuleSettings {
    return this.settings;
  }

  protected set moduleSettings(value: ModuleSettings) {
    this.settings = value;
  }

  abstract register(appContainer: AppContainer): Promise<void> | void;

  postRegistration?(): Promise<void> | void;
}
