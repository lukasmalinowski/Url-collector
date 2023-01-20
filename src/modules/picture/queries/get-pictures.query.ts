import type { Query, QueryResult } from '@tshio/query-bus';
import type { Picture } from '../entities/picture.entity';

export const GET_PICTURES_QUERY_TYPE = 'picture/GET_PICTURES' as const;
interface GetPicturesQueryPayload {
  addresses: string[];
}

export class GetPicturesQuery implements Query<GetPicturesQueryPayload> {
  public type = GET_PICTURES_QUERY_TYPE;

  constructor(public readonly payload: GetPicturesQueryPayload) {}
}

export class GetPicturesQueryResult implements QueryResult<Picture[]> {
  constructor(public readonly result: Picture[]) {}
}
