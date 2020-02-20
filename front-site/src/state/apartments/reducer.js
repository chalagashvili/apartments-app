import { SET_AVAILABLE_APARTMENTS, SET_OWNED_APARTMENTS, SET_EDIT_APARTMENT_LOCATION, SET_EDIT_APARTMENT, SET_BOOKED_APARTMENTS, SET_EDIT_APARTMENT_ADDRESS } from 'state/apartments/types';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_AVAILABLE_APARTMENTS: {
      return {
        ...state,
        availableApartments: action.payload,
      };
    }
    case SET_BOOKED_APARTMENTS: {
      return {
        ...state,
        bookedApartments: action.payload,
      };
    }
    case SET_OWNED_APARTMENTS: {
      return {
        ...state,
        ownedApartments: action.payload,
      };
    }
    case SET_EDIT_APARTMENT_LOCATION: {
      return {
        ...state,
        location: action.payload,
      };
    }
    case SET_EDIT_APARTMENT: {
      return {
        ...state,
        editApartment: action.payload,
      };
    }
    case SET_EDIT_APARTMENT_ADDRESS: {
      return {
        ...state,
        editApartmentAddress: action.payload,
      };
    }

    default:
      return state;
  }
};

export default reducer;
