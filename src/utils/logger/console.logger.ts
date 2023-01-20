import type { AppLogger, LogMetadata, LogObject, Stringified } from './logger.interface';

export class ConsoleLogger implements AppLogger {
  info(metadata: LogMetadata, ...args: Stringified[]) {
    this.log('INFO', metadata, ...args);
  }

  warn(metadata: LogMetadata, ...args: Stringified[]) {
    this.log('WARN', metadata, ...args);
  }

  error(metadata: LogMetadata, ...args: Stringified[]) {
    this.log('ERROR', metadata, ...args);
  }

  debug(metadata: LogMetadata, ...args: Stringified[]) {
    this.log('DEBUG', metadata, ...args);
  }

  private log(type: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', metadata: LogMetadata, ...args: Stringified[]) {
    if (process.env.NODE_ENV === 'test' && ['INFO'].includes(type)) {
      return;
    }
    const message = args.map((arg) => arg.toString()).join(' ');
    const logObject: LogObject = {
      type,
      timestamp: new Date().toISOString(),
      message,
      ...metadata,
    };

    console.log(JSON.stringify(logObject));
  }
}

export default new ConsoleLogger();
