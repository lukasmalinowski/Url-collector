import { PictureProvider } from '../../entities/picture.entity';
import { PictureService } from '../picture.service';
import * as runQueryHelper from '../../../../utils/run-queries-in-batches';
import { CREATE_PICTURES_COMMAND_TYPE } from '../../commands';

const getFixtures = () => ({
  query: {
    from: '2022-01-01',
    to: '2022-01-03',
  },
  imageUrls: ['imageUrl1', 'imageUrl2', 'imageUrl3'],
  datesBetween: ['2022-01-01', '2022-01-02', '2022-01-03'],
  addresses: [
    'http://example.com/?api_key=apiKey&date=2022-01-01',
    'http://example.com/?api_key=apiKey&date=2022-01-02',
    'http://example.com/?api_key=apiKey&date=2022-01-03',
  ],
  pictures: [
    {
      address: 'http://example.com/?api_key=apiKey&date=2022-01-01',
      imageUrl: 'imageUrl1',
      provider: PictureProvider.NASA,
    },
    {
      address: 'http://example.com/?api_key=apiKey&date=2022-01-02',
      imageUrl: 'imageUrl2',
      provider: PictureProvider.NASA,
    },
    {
      address: 'http://example.com/?api_key=apiKey&date=2022-01-03',
      imageUrl: 'imageUrl3',
      provider: PictureProvider.NASA,
    },
  ],
});

describe('PICTURE/SERVICES Picture service', () => {
  const queryBusMock = jest.fn();
  const commandBusMock = jest.fn();
  const mapResponseMock = jest.fn();

  let service: PictureService;

  beforeEach(() => {
    service = new PictureService({
      commandBus: {
        execute: commandBusMock,
      } as any,
      queryBus: {
        execute: queryBusMock,
      } as any,
      appConfig: {
        concurrentRequests: 5,
        apiUrl: 'http://example.com',
        apiKey: 'apiKey',
      } as any,
      pictureProvider: {
        name: PictureProvider.NASA,
        mapResponse: mapResponseMock,
      } as any,
    });
  });

  describe('getPictures()', () => {
    it('should get all pictures from database without fetching', async () => {
      const fixtures = getFixtures();

      queryBusMock.mockResolvedValue({
        result: fixtures.pictures,
      });

      const runQueriesInBatchesSpy = jest.spyOn(runQueryHelper, 'runQueriesInBatches');

      await expect(service.getPictures(fixtures.addresses)).resolves.toMatchObject(fixtures.imageUrls);

      expect(runQueriesInBatchesSpy).not.toHaveBeenCalled();
    });

    it('should fetch all requested addresses', async () => {
      const fixtures = getFixtures();

      queryBusMock.mockResolvedValue({
        result: [],
      });

      const runQueriesInBatchesSpy = jest.spyOn(runQueryHelper, 'runQueriesInBatches');
      runQueriesInBatchesSpy.mockReturnValueOnce([
        { url: fixtures.addresses[0], json: () => ({ url: 'imageUrl1', media_type: 'image' }) },
        { url: fixtures.addresses[1], json: () => ({ url: 'imageUrl2', media_type: 'image' }) },
        { url: fixtures.addresses[2], json: () => ({ url: 'imageUrl3', media_type: 'image' }) },
      ] as any);

      mapResponseMock.mockReturnValueOnce({ imageUrl: fixtures.imageUrls[0] });
      mapResponseMock.mockReturnValueOnce({ imageUrl: fixtures.imageUrls[1] });
      mapResponseMock.mockReturnValueOnce({ imageUrl: fixtures.imageUrls[2] });

      await expect(service.getPictures(fixtures.addresses)).resolves.toMatchObject(fixtures.imageUrls);

      expect(commandBusMock).toBeCalledWith({
        type: CREATE_PICTURES_COMMAND_TYPE,
        payload: { data: fixtures.pictures },
      });

      expect(runQueriesInBatchesSpy).toHaveBeenCalledWith(fixtures.addresses, 5);
    });

    it('should fetch only those pictures that are not present in database', async () => {
      const fixtures = getFixtures();

      queryBusMock.mockResolvedValue({
        result: [fixtures.pictures[0], fixtures.pictures[1]],
      });

      const runQueriesInBatchesSpy = jest.spyOn(runQueryHelper, 'runQueriesInBatches');
      runQueriesInBatchesSpy.mockReturnValueOnce([
        { url: fixtures.addresses[2], json: () => ({ url: 'imageUrl3', media_type: 'image' }) },
      ] as any);

      mapResponseMock.mockReturnValue({ imageUrl: fixtures.imageUrls[2] });

      await expect(service.getPictures(fixtures.addresses)).resolves.toMatchObject(fixtures.imageUrls);

      expect(commandBusMock).toBeCalledWith({
        type: CREATE_PICTURES_COMMAND_TYPE,
        payload: { data: [fixtures.pictures[2]] },
      });

      expect(runQueriesInBatchesSpy).toHaveBeenCalledWith(fixtures.addresses, 5);
    });
  });
});
