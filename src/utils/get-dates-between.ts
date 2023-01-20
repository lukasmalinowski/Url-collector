import { format } from 'date-fns';

export const getDatesBetween = (from: string, to: string): string[] => {
  const startDate = new Date(new Date(from).getTime());
  const endDate = new Date(to);

  const dates: string[] = [];

  while (startDate <= endDate) {
    dates.push(format(startDate, 'yyyy-MM-dd'));
    startDate.setDate(startDate.getDate() + 1);
  }

  return dates;
};
