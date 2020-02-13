import React from 'react';
import { Route, Switch } from 'react-router-dom';
import withAuthentication from 'auth/withAuthentication';
import withAuthorization from 'auth/withAuthorization';
import withPublic from 'auth/withPublic';
import {
  ROUTE_HOME,
  ROUTE_DASHBOARD,
  ROUTE_PROFILE,
  ROUTE_SIGN_UP,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  USERS,
  APARTMENTS,
  ROUTE_LOGOUT,
  ROUTE_MY_RENTED_APARTMENTS_AS_CLIENT,
  ROUTE_ADD_APARTMENT,
  ROUTE_EDIT_APARTMENT,
  ROUTE_APARTMENTS_I_RENT_AS_REALTOR,
  ROUTE_USERS,
  ROUTE_ADD_USER,
  ROUTE_EDIT_USER,
} from 'app-init/router';
import { clientRole, realtorRole, adminRole } from 'utils/const';
import DashboardPage from 'ui/dashboard/DashboardPage';
import NotFoundPage from 'ui/notfound/NotfoundPage';
import ProfilePage from 'ui/profile/ProfilePage';
import LoginPage from 'ui/login/LoginPage';
import UsersPage from 'ui/users/UsersPage';
import ResetPasswordPage from 'ui/resetPassword/ResetPasswordPage';
import ForgotPasswordPage from 'ui/forgotPassword/ForgotPasswordPage';
import Apartments from 'ui/apartments/ApartmentsForm';
// import ToastsContainer from 'ui/app/ToastsContainer';
import SignupPage from 'ui/signup/SignupPage';
import LogoutContainer from 'ui/logout/LogoutContainer';

const Client = withAuthorization(clientRole);
const Realtor = withAuthorization(realtorRole);
const Admin = withAuthorization(adminRole);

// Client components
const dashboard = Client(withAuthentication(DashboardPage));
const profile = Client(withAuthentication(ProfilePage));
const myRentedApartments = Client(withAuthentication(DashboardPage));

// Realtor components
const addApartment = Realtor(withAuthentication(DashboardPage));
const editApartment = Realtor(withAuthentication(DashboardPage));
const apartmentsIRent = Realtor(withAuthentication(DashboardPage));

// Admin components
const users = Admin(withAuthentication(DashboardPage));
const addUser = Admin(withAuthentication(DashboardPage));
const editUser = Admin(withAuthentication(DashboardPage));

const login = withPublic(LoginPage);
const signup = withPublic(SignupPage);

const App = () => (
  <React.Fragment>
    <Switch>
      <Route exact path={FORGOT_PASSWORD} component={ForgotPasswordPage} />
      <Route exact path={RESET_PASSWORD} component={ResetPasswordPage} />
      <Route exact path={USERS} component={UsersPage} />
      <Route exact path={APARTMENTS} component={Apartments} />
      {/* <Route exact path={RESET_PASSWORD} component={ResetPasswordPage} /> */}
      <Route path={ROUTE_DASHBOARD} component={dashboard} />
      <Route path={ROUTE_PROFILE} component={profile} />
      {/* Public */}
      <Route exact path={ROUTE_HOME} component={login} />
      <Route exact path={ROUTE_SIGN_UP} component={signup} />
      {/* Add password gen and reset pages */}
      {/* Private (Client) */}
      <Route exact path={ROUTE_DASHBOARD} component={dashboard} />
      <Route exact path={ROUTE_PROFILE} component={profile} />
      <Route exact path={ROUTE_MY_RENTED_APARTMENTS_AS_CLIENT} component={myRentedApartments} />
      {/* Private (Realtor) */}
      <Route exact path={ROUTE_ADD_APARTMENT} component={addApartment} />
      <Route path={ROUTE_EDIT_APARTMENT} component={editApartment} />
      <Route exact path={ROUTE_APARTMENTS_I_RENT_AS_REALTOR} component={apartmentsIRent} />
      {/* Private (Admin) */}
      <Route exact path={ROUTE_USERS} component={users} />
      <Route exact path={ROUTE_ADD_USER} component={addUser} />
      <Route path={ROUTE_EDIT_USER} component={editUser} />
      {/* Logout */}
      <Route exact path={ROUTE_LOGOUT} component={LogoutContainer} />
      {/* 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  </React.Fragment>
);

export default App;
