import type { QueryHandler } from '@tshio/query-bus';
import { type GetPicturesQuery, GetPicturesQueryResult, GET_PICTURES_QUERY_TYPE } from '../../queries';

import type { PictureInMemoryRepository } from '../../repositories/picture-inmemory.repository';

interface GetPicturesHandlerDependencies {
  pictureRepository: PictureInMemoryRepository;
}

export class GetPicturesHandler implements QueryHandler<GetPicturesQuery, GetPicturesQueryResult> {
  public queryType: string = GET_PICTURES_QUERY_TYPE;

  constructor(private readonly dependencies: GetPicturesHandlerDependencies) {}

  async execute(query: GetPicturesQuery): Promise<GetPicturesQueryResult> {
    const { addresses } = query.payload;
    const pictures = await this.dependencies.pictureRepository.findMany({ addresses });

    return new GetPicturesQueryResult(pictures);
  }
}
