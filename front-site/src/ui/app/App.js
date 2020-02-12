import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import withAuthentication from 'auth/withAuthentication';
import withAuthorization from 'auth/withAuthorization';
import withPublic from 'auth/withPublic';
import {
  ROUTE_HOME,
  ROUTE_DASHBOARD,
  ROUTE_PROFILE,
  ROUTE_SIGN_UP,
} from 'app-init/router';
import { clientRole, realtorRole, adminRole } from 'utils/const';
import DashboardPage from 'ui/dashboard/DashboardPage';
import NotFoundPage from 'ui/notfound/NotfoundPage';
import ProfilePage from 'ui/profile/ProfilePage';
import LoginPage from 'ui/login/LoginPage';
import ToastsContainer from 'ui/app/ToastsContainer';
import SignupPage from 'ui/signup/SignupPage';

const Client = withAuthorization(clientRole);
const Realtor = withAuthorization(realtorRole);
const Admin = withAuthorization(adminRole);

const dashboard = Client(withAuthentication(DashboardPage));
const profile = Client(withAuthentication(ProfilePage));

const login = withPublic(LoginPage);
const signup = withPublic(SignupPage);

const App = () => (
  <React.Fragment>
    <ToastsContainer />
    <Switch>
      <Route exact path={ROUTE_HOME} component={login} />
      <Route exact path={ROUTE_SIGN_UP} component={signup} />
      <Route path={ROUTE_DASHBOARD} component={dashboard} />
      <Route path={ROUTE_PROFILE} component={profile} />
      {/* 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  </React.Fragment>
);

export default App;
