export interface Stringified {
  toString(): string;
}

export interface LogMetadata {
  action?: string;
  http?: {
    method?: string;
    url?: string;
  };
}

export interface LogObject extends LogMetadata {
  type: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  timestamp: string;
  message: string;
}

export abstract class AppLogger {
  abstract info(metadata: LogMetadata, ...args: Stringified[]): void;

  abstract warn(metadata: LogMetadata, ...args: Stringified[]): void;

  abstract error(metadata: LogMetadata, ...args: Stringified[]): void;

  abstract debug(metadata: LogMetadata, ...args: Stringified[]): void;
}
