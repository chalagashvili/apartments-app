import 'test/enzyme-init';

import Cookies from 'js-cookie';
import { getAddressByCoordinates } from 'api/services';

describe('api/auth', () => {
  beforeEach(() => {
    fetch.resetMocks();
    Cookies.get = jest.fn()
      .mockImplementation(key => ({
        id: '777',
        jwtToken: '123',
      }[key]));
  });

  it('returns a promise for getBookings', () => {
    const response = getAddressByCoordinates(1, 2);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch)
      .toHaveBeenCalledWith(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${1},${2}&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}&language=en`, {
        method: 'GET',
        cache: 'no-cache',
        referrerPolicy: 'no-referrer',
      });
    expect(response).toBeInstanceOf(Promise);
  });
});
