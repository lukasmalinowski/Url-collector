export interface mapResponseResult {
  imageUrl: string | null;
}

export abstract class Provider {
  abstract mapResponse(response: { [key: string]: string }): mapResponseResult;
}
