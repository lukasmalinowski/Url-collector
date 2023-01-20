import AppError from '../errors/app-error';

export class AppConfig {
  /**
   * Api url
   */
  get apiUrl(): string {
    return this.getValue('API_URL', 'https://api.nasa.gov/planetary/apod');
  }

  /**
   * Api key
   */
  get apiKey(): string {
    return this.getValue('API_KEY', 'UJqxWf6Hx6j0BDvjJyA446nZyLwT4U64puHOtT4k');
  }

  /**
   * Amount of max concurrent requests
   */
  get concurrentRequests(): number {
    return this.getValue('CONCURRENT_REQUESTS', 5);
  }

  /**
   * App environment
   */
  get port(): number {
    return Number(this.getValue('PORT', 8000));
  }

  /**
   * Helper function to get value from environment variables
   * @param {string} key environment variable key
   * @param {any} defaultValue default value
   * @return {string} value
   * @throws {AppError} if value is not defined
   */
  private getValue<T>(key: string, defaultValue?: T): T | any {
    const value = process.env[key];
    if (value === undefined && defaultValue === undefined) {
      throw new AppError(`Missing environment variable: ${key}`, 500);
    }
    return value ?? defaultValue;
  }
}
