import { Segments } from 'celebrate';
import { format } from 'date-fns';

import { PictureProvider } from '../../entities/picture.entity';
import { mockRequest, mockResponse } from '../../../../../tests/mocks';
import { getValidationError } from '../../../../../tests/utils/get-validation-error.helper';
import { GET_PICTURES_QUERY_TYPE } from '../../queries';
import { GetPicturesUrlsAction } from '../get-pictures-urls.action';

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

describe('PICTURE/ACTION Get pictures urls', () => {
  const queryBusMock = jest.fn();
  const getUrlsToFetchMock = jest.fn();
  const getPicturesMock = jest.fn();
  const getUrlsMock = jest.fn();

  let action: GetPicturesUrlsAction;

  beforeEach(() => {
    action = new GetPicturesUrlsAction({
      queryBus: {
        execute: queryBusMock,
      } as any,
      pictureService: {
        getUrlsToFetch: getUrlsToFetchMock,
        getPictures: getPicturesMock,
      } as any,
      pictureProvider: {
        getUrls: getUrlsMock,
      } as any,
    });
  });

  it('should successfully get 3 pictures from fetching api', async () => {
    const fixtures = getFixtures();

    const res = mockResponse();
    const req = mockRequest({
      query: fixtures.query,
    });

    getUrlsMock.mockReturnValue(fixtures.addresses);

    // no picture in database
    queryBusMock.mockResolvedValue({
      result: [],
    });

    getPicturesMock.mockResolvedValue(fixtures.imageUrls);

    await action.invoke(req, res);

    expect(getUrlsMock).toBeCalledWith(req.query);

    expect(queryBusMock).toBeCalledWith(
      expect.objectContaining({
        payload: {
          addresses: fixtures.addresses,
        },
        type: GET_PICTURES_QUERY_TYPE,
      })
    );

    expect(res.getContext().body).toMatchObject({ urls: fixtures.imageUrls });
  });

  it('should retrieve pictures from database without going into queue', async () => {
    const res = mockResponse();
    const req = mockRequest({
      query: {
        from: '2022-01-01',
        to: '2022-01-03',
      },
    });

    const fixtures = getFixtures();

    getUrlsMock.mockReturnValue(fixtures.addresses);

    queryBusMock.mockResolvedValue({
      result: fixtures.pictures,
    });

    await action.invoke(req, res);

    expect(queryBusMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        payload: {
          addresses: fixtures.addresses,
        },
        type: GET_PICTURES_QUERY_TYPE,
      })
    );

    expect(getPicturesMock).not.toBeCalled();

    expect(res.getContext().body).toMatchObject({ urls: fixtures.imageUrls });
  });

  it('should retrieve pictures from database when in queue', async () => {
    const fixtures = getFixtures();

    const res = mockResponse();
    const req = mockRequest({
      query: fixtures.query,
    });

    getUrlsMock.mockReturnValue(fixtures.addresses);
    queryBusMock.mockResolvedValueOnce({
      result: [],
    });
    getPicturesMock.mockResolvedValue(fixtures.imageUrls);

    queryBusMock.mockResolvedValueOnce({
      result: fixtures.pictures,
    });

    await action.invoke(req, res);

    expect(getUrlsMock).toBeCalledWith(req.query);

    expect(queryBusMock).toBeCalledWith(
      expect.objectContaining({
        payload: {
          addresses: fixtures.addresses,
        },
        type: GET_PICTURES_QUERY_TYPE,
      })
    );

    expect(getPicturesMock).toHaveBeenCalledWith(fixtures.addresses);

    expect(res.getContext().body).toMatchObject({ urls: fixtures.imageUrls });
  });

  describe('Payload validation', () => {
    it("should return error when date 'from' is not before date 'to'", async () => {
      const validator = action.getPayloadValidator();

      const req = mockRequest({
        query: {
          from: '2023-01-02',
          to: '2023-01-01',
        },
      });

      const errors = await getValidationError(validator, req, Segments.QUERY);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe("Date 'from' must be before date 'to'");
    });

    it("should return error when date 'to' is later than today", async () => {
      const validator = action.getPayloadValidator();

      const today = new Date();
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);

      const req = mockRequest({
        query: {
          from: '2023-01-01',
          to: format(nextDay, 'yyyy-MM-dd'),
        },
      });

      const errors = await getValidationError(validator, req, Segments.QUERY);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe(`Date 'from' must be before ${format(today, 'yyyy-MM-dd')}`);
    });

    it.each([0, 'string', '20230101', 20230101, true, undefined, null])(
      'should return error when date "from" is invalid:  %s',
      async (date) => {
        const validator = action.getPayloadValidator();

        const req = mockRequest({
          query: {
            from: date,
            to: '2023-01-10',
          },
        });

        const errors = await getValidationError(validator, req, Segments.QUERY);

        expect(errors).toHaveLength(1);
        expect([
          '"from" is required',
          '"from" must be a string',
          '"from" failed custom validation because Invalid time value',
        ]).toContain(errors[0].message);
      }
    );

    it.each([0, 'string', '20230101', 20230101, true, undefined, null])(
      'should return error when date "to" is invalid:  %s',
      async (date) => {
        const validator = action.getPayloadValidator();

        const req = mockRequest({
          query: {
            from: '2023-01-01',
            to: date,
          },
        });

        const errors = await getValidationError(validator, req, Segments.QUERY);

        expect(errors).toHaveLength(1);
        expect([
          '"to" is required',
          '"to" must be a string',
          '"to" failed custom validation because Invalid time value',
        ]).toContain(errors[0].message);
      }
    );
  });
});
