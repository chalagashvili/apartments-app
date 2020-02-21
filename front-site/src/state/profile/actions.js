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
    getMe().then(response => response.json().then((json) => {
      if (response.ok) {
        const profile = json.payload.data[0];
        dispatch(setProfile(profile));
        form.setFieldsValue({
          email: profile.email,
          name: profile.name,
        });
        dispatch(toggleLoading('editProfile'));
        return resolve();
      }
      dispatch(toggleLoading('editProfile'));
      return reject(new Error(json.error));
    })).catch(() => {
      dispatch(toggleLoading('editProfile'));
      reject(new Error('Error occured when communicating with server'));
    });
  });
