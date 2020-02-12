import { SET_ERROR } from 'state/error/types';

// export const setError = (id, message) => ({
//   type: SET_ERROR,
//   payload: {
//     id,
//     message,
//   },
// });

// export const clearError = id => ({
//   type: SET_ERROR,
//   payload: {
//     id,
//   },
// });

export const setError = message => ({
  type: SET_ERROR,
  payload: message,
});