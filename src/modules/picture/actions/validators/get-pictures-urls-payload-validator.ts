import { celebrate, Joi, Segments } from 'celebrate';
import { differenceInDays, format } from 'date-fns';

import { validateAsISODate } from './validate-as-iso-date';

export interface GetPicturesUrlsPayload {
  from: string;
  to: string;
}

export const getPicturesUrlsPayloadValidator = () => {
  return celebrate(
    {
      [Segments.QUERY]: Joi.object()
        .keys({
          from: Joi.string().custom(validateAsISODate()).required(),
          to: Joi.string()
            .custom(validateAsISODate({ maxDate: new Date() }))
            .required(),
        })
        .custom((obj: GetPicturesUrlsPayload, helper: any) => {
          const fromDate = new Date(obj.from);
          const toDate = new Date(obj.to);

          if (differenceInDays(toDate, fromDate) < 0) {
            return helper.message("Date 'from' must be before date 'to'");
          }

          return {
            from: format(fromDate, 'yyyy-MM-dd'),
            to: format(toDate, 'yyyy-MM-dd'),
          };
        }),
    },
    { abortEarly: false }
  );
};
