import type { AppConfig } from '../../../config';
import type { AppCommandBus } from '../../../types/AppCommandBus';
import type { AppQueryBus } from '../../../types/AppQueryBus';
import type { ProviderNasa } from '../providers/provider-nasa';
import { runQueriesInBatches } from '../../../utils/run-queries-in-batches';
import { CreatePicturesCommand } from '../commands';
import { GetPicturesQuery } from '../queries';

interface PictureServiceDependencies {
  commandBus: AppCommandBus;
  queryBus: AppQueryBus;
  appConfig: AppConfig;
  pictureProvider: ProviderNasa;
}

export class PictureService {
  constructor(private readonly dependencies: PictureServiceDependencies) {}

  /**
   * Get pictures by array of addresses
   * @param {string[]} requestAddresses List of request addresses
   * @returns Promise<string[]> List of image urls
   */
  async getPictures(requestAddresses: string[]): Promise<string[]> {
    const { result: pictures } = await this.dependencies.queryBus.execute(
      new GetPicturesQuery({ addresses: requestAddresses })
    );

    if (pictures) {
      pictures.forEach((p) => {
        const index = requestAddresses.findIndex((address) => address === p.address);
        if (index >= 0) {
          requestAddresses.splice(index, 1);
        }
      });
    }

    const pictureUrls: string[] = [...pictures.map((p) => p.imageUrl)];

    if (requestAddresses.length) {
      const responses = await runQueriesInBatches(requestAddresses, this.dependencies.appConfig.concurrentRequests);

      const fetchedPictures = await Promise.all(
        responses.map(async (response) => {
          const responseJSON = await response.json();

          return {
            address: response.url,
            imageUrl: this.dependencies.pictureProvider.mapResponse(responseJSON).imageUrl,
          };
        })
      );

      const filteredPictures: { imageUrl: string; address: string }[] = fetchedPictures.filter(
        (p): p is { imageUrl: string; address: string } => (p.imageUrl ? true : false)
      );

      if (filteredPictures.length) {
        await this.dependencies.commandBus.execute(
          new CreatePicturesCommand({
            data: filteredPictures.map((picture) => {
              return {
                provider: this.dependencies.pictureProvider.name,
                address: picture.address,
                imageUrl: picture.imageUrl,
              };
            }),
          })
        );
      }

      pictureUrls.push(...filteredPictures.map((p) => p.imageUrl));
    }

    return pictureUrls;
  }
}
