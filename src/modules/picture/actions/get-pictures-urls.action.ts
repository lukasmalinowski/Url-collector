import type { Request, Response } from 'express';
import Queue from 'async-await-queue';
import _ from 'lodash';
import crypto from 'crypto';
import { celebrate, Joi, Segments } from 'celebrate';
import { differenceInDays, format } from 'date-fns';

import type { HttpAction } from '../../../core/http/Action';
import type { AppQueryBus } from '../../../types/AppQueryBus';
import type { PictureService } from '../services/picture.service';
import type { ProviderNasa } from '../providers/provider-nasa';
import { HttpMethod } from '../../../core/http/Action';
import { GetPicturesQuery } from '../queries';
import { getPicturesUrlsPayloadValidator } from './validators/get-pictures-urls-payload-validator';

const queue = new Queue(1);

export interface GetPicturesUrlsActionDependencies {
  pictureService: PictureService;
  queryBus: AppQueryBus;
  pictureProvider: ProviderNasa;
}

export class GetPicturesUrlsAction implements HttpAction {
  public method = HttpMethod.GET;
  public path = '/' as const;

  constructor(private readonly dependencies: GetPicturesUrlsActionDependencies) {}

  getPayloadValidator = () => getPicturesUrlsPayloadValidator();

  // getPayloadValidator() {
  //   return celebrate(
  //     {
  //       [Segments.QUERY]: Joi.object().keys({
  //         from: Joi.string().required(),
  //         to: Joi.string().required(),
  //       }),
  //     },
  //     { abortEarly: true }
  //   );
  // }

  async invoke({ query }: Request, res: Response) {
    const { from, to } = query;

    const requestAddresses = this.dependencies.pictureProvider.getUrls({ from: from as string, to: to as string });

    const { result: pictures } = await this.dependencies.queryBus.execute(
      new GetPicturesQuery({ addresses: requestAddresses })
    );

    // have all pictures in database, return immediately to user
    if (requestAddresses.length === pictures.length) {
      res.status(200).json({
        urls: pictures.map((p) => p.imageUrl),
      });
      return;
    }

    const hash = crypto.randomUUID();
    const me = Symbol(hash);
    await queue.wait(me);

    const urls = await this.dependencies.pictureService.getPictures(requestAddresses);

    queue.end(me);

    res.status(200).json({ urls });
  }
}
