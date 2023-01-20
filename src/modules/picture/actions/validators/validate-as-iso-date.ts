import { parseISO, isValid, isAfter, format } from 'date-fns';

export interface ValidateAsISODatePayload {
  maxDate?: Date;
}

export const validateAsISODate = (options?: ValidateAsISODatePayload) => {
  return (value: string, helper: any) => {
    const ISODate = new Date(value).toISOString();
    const date = parseISO(ISODate);

    if (!isValid(date)) {
      return helper.error('any.invalid');
    }

    if (options?.maxDate && isAfter(date, options?.maxDate)) {
      return helper.message(`Date 'from' must be before ${format(options.maxDate, 'yyyy-MM-dd')}`);
    }

    return date.toString();
  };
};
