import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import auth from 'state/auth/reducer';
import locale from 'state/locale/reducer';
import pagination from 'state/pagination/reducer';
import loading from 'state/loading/reducer';
import apartments from 'state/apartments/reducer';
import filters from 'state/filters/reducer';
import profile from 'state/profile/reducer';
import users from 'state/users/reducer';

const reducerDef = {
  form,
  auth,
  pagination,
  locale,
  loading,
  apartments,
  filters,
  profile,
  users,
};

// app root reducer
const reducer = combineReducers(reducerDef);

export default reducer;
