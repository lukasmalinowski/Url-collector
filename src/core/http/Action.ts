import type { RequestHandler, Request, Response } from 'express';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  ALL = 'all',
  OPTIONS = 'options',
  HEAD = 'head',
}
export type HttpPath = `/${string}`;

export abstract class HttpAction {
  public readonly method: HttpMethod;
  public readonly path: HttpPath;
  public readonly middleware?: RequestHandler[];

  abstract getPayloadValidator?(): RequestHandler;
  abstract invoke(req: Request, res: Response): Promise<void> | void;
}
