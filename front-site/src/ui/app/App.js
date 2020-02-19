import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import withAuthentication from 'auth/withAuthentication';
import withAuthorization from 'auth/withAuthorization';
import withPublic from 'auth/withPublic';
import {
  ROUTE_HOME,
  ROUTE_PROFILE,
  ROUTE_SIGN_UP,
  ROUTE_LOGOUT,
  ROUTE_OWNED_APARTMENTS,
  ROUTE_ADD_APARTMENT,
  ROUTE_EDIT_APARTMENT,
  ROUTE_APARTMENTS,
  ROUTE_BOOKINGS,
  ROUTE_USERS,
  ROUTE_ADD_USER,
  ROUTE_RESET_PASSWORD,
  ROUTE_EDIT_USER,
} from 'app-init/router';
import { clientRole, realtorRole, adminRole } from 'utils/const';
import ProfilePage from 'ui/profile/ProfilePage';
import LoginPage from 'ui/login/LoginPage';
import BookingsPage from 'ui/bookings/BookingsPage';
import AddApartmentPage from 'ui/apartments/add/AddApartmentPage';
import EditApartmentPage from 'ui/apartments/edit/EditApartmentPage';
import SignupPage from 'ui/signup/SignupPage';
import LogoutContainer from 'ui/logout/LogoutContainer';
import OwnedApartmentsPage from 'ui/ownedApartments/OwnedApartmentsPage';
import AvailableApartmentsPage from 'ui/availableApartments/AvailableApartmentsPage';
import UsersListPage from 'ui/users/list/UsersListPage';
import AddUserPage from 'ui/users/add/AddUserPage';
import ResetPasswordPage from 'ui/resetPassword/ResetPasswordPage';
import EditUserPage from 'ui/users/edit/EditUserPage';

const Client = withAuthorization(clientRole);
const Realtor = withAuthorization(realtorRole);
const Admin = withAuthorization(adminRole);

// Client components
const profile = Client(withAuthentication(ProfilePage));
const availableApartments = Client(withAuthentication(AvailableApartmentsPage));
const bookings = Client(withAuthentication(BookingsPage));

// Realtor components
const addApartment = Realtor(withAuthentication(AddApartmentPage));
const editApartment = Realtor(withAuthentication(EditApartmentPage));
const ownedApartments = Realtor(withAuthentication(OwnedApartmentsPage));

// Admin components
const users = Admin(withAuthentication(UsersListPage));
const addUser = Admin(withAuthentication(AddUserPage));
const editUser = Admin(withAuthentication(EditUserPage));

const login = withPublic(LoginPage);
const signup = withPublic(SignupPage);
const resetPassword = ResetPasswordPage;

const App = () => (
  <React.Fragment>
    <Switch>
      {/* Public */}
      <Route exact path={ROUTE_HOME} component={login} />
      <Route exact path={ROUTE_SIGN_UP} component={signup} />
      <Route path={ROUTE_RESET_PASSWORD} component={resetPassword} />
      {/* Private (Client) */}
      <Route path={ROUTE_PROFILE} component={profile} />
      <Route exact path={ROUTE_APARTMENTS} component={availableApartments} />
      <Route exact path={ROUTE_BOOKINGS} component={bookings} />
      {/* Private (Realtor) */}
      <Route exact path={ROUTE_ADD_APARTMENT} component={addApartment} />
      <Route path={ROUTE_EDIT_APARTMENT} component={editApartment} />
      <Route exact path={ROUTE_OWNED_APARTMENTS} component={ownedApartments} />
      {/* Private (Admin) */}
      <Route exact path={ROUTE_USERS} component={users} />
      <Route exact path={ROUTE_ADD_USER} component={addUser} />
      <Route path={ROUTE_EDIT_USER} component={editUser} />
      {/* Logout */}
      <Route exact path={ROUTE_LOGOUT} component={LogoutContainer} />
      {/* 404 */}
      <Redirect to={ROUTE_HOME} />
    </Switch>
  </React.Fragment>
);

export default App;
