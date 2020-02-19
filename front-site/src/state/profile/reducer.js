import { SET_PROFILE } from 'state/profile/types';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_PROFILE:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
