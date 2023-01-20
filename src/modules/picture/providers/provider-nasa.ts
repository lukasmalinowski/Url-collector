import type { AppConfig } from '../../../config';
import { getDatesBetween } from '../../../utils/get-dates-between';
import { PictureProvider } from '../entities/picture.entity';
import { Provider } from '../interfaces';

interface NasaResponse {
  [key: string]: string;
  copyring: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

interface PictureServiceDependencies {
  appConfig: AppConfig;
}

export class ProviderNasa extends Provider {
  public name = PictureProvider.NASA;

  constructor(private readonly dependencies: PictureServiceDependencies) {
    super();
  }

  mapResponse(response: NasaResponse) {
    return {
      imageUrl: response.media_type === 'image' ? response.url : null,
    };
  }

  getUrls(options: { from: string; to: string }) {
    const datesBetween = getDatesBetween(options.from, options.to);

    return datesBetween.map((date) => {
      const link = new URL(this.dependencies.appConfig.apiUrl);
      link.searchParams.set('api_key', this.dependencies.appConfig.apiKey);
      link.searchParams.set('date', date);

      return link.toString();
    });
  }
}
