import { SET_ERROR, CLEAR_ERROR } from 'state/error/types';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    // case SET_ERROR: {
    //   const { id, message } = action.payload;
    //   return { ...state, id, message };
    // }
    // case CLEAR_ERROR: {
    //   return { ...state, id: undefined };
    // }
    // default:
    //   return state;
    case SET_ERROR: {
      return { ...state, message: action.payload };
    }
    default:
      return state;
  }
};

export default reducer;
