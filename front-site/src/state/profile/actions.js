import { SET_PROFILE } from 'state/profile/types';
import { getMe } from 'api/auth';
import { toggleLoading } from 'state/loading/actions';

export const setProfile = profile => ({
  type: SET_PROFILE,
  payload: profile,
});

export const fetchProfile = form => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(toggleLoading('editProfile'));
    getMe().then((response) => {
      dispatch(toggleLoading('editProfile'));
      // eslint-disable-next-line prefer-promise-reject-errors
      if (response.status === 401) return reject('You are not authorized');
      return response.json().then((json) => {
        if (response.ok) {
          const profile = json.payload.data[0];
          dispatch(setProfile(profile));
          form.setFieldsValue({
            email: profile.email,
            name: profile.name,
          });
          return resolve();
        }
        return reject(json.error);
      });
    }).catch(() => {
      dispatch(toggleLoading('editProfile'));
      reject();
    });
  });
