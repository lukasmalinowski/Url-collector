import fetch, { type Response } from 'cross-fetch';
import _ from 'lodash';

export const runQueriesInBatches = async (queries: string[], limit: number): Promise<Response[]> => {
  const batches = _.chunk(queries, limit);
  const results: Response[][] = [];

  while (batches.length) {
    const batch: string[] = batches.shift()!;
    const requests = batch.map((url) => fetch(url));

    const result = await Promise.all(requests);
    results.push(result);
  }

  return _.flatten(results);
};
