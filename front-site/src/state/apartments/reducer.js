import { SET_AVAILABLE_APARTMENTS, SET_OWNED_APARTMENTS } from 'state/apartments/types';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_AVAILABLE_APARTMENTS: {
      return {
        ...state,
        availableApartments: action.payload,
      };
    }
    case SET_OWNED_APARTMENTS: {
      return {
        ...state,
        ownedApartments: action.payload,
      };
    }

    default:
      return state;
  }
};

export default reducer;
