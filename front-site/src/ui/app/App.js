import React from 'react';
import { Route, Switch } from 'react-router-dom';
import withAuthentication from 'auth/withAuthentication';
import withAuthorization from 'auth/withAuthorization';
import {
  ROUTE_HOME,
  ROUTE_DASHBOARD,
  ROUTE_PROFILE,
  ROUTE_SIGN_UP,
} from 'app-init/router';
import { regularRole, managerRole, adminRole } from 'utils/const';
import DashboardPage from 'ui/dashboard/DashboardPage';
import NotFoundPage from 'ui/notfound/NotfoundPage';
import ProfilePage from 'ui/profile/ProfilePage';
import LoginPage from 'ui/login/LoginPage';
import ToastsContainer from 'ui/app/ToastsContainer';
import SignupPage from 'ui/signup/SignupPage';

const Regular = withAuthorization(regularRole);
const Manager = withAuthorization(managerRole);
const Admin = withAuthorization(adminRole);

// Cookies.set('name', 'value', { secure: true, domain: process.env.PUBLIC_DOMAIN });

const dashboard = Regular(withAuthentication(DashboardPage));
const profile = Regular(withAuthentication(ProfilePage));

const App = () => (
  <React.Fragment>
    {/* <ToastsContainer /> */}
    <Switch>
      <Route exact path={ROUTE_HOME} component={LoginPage} />
      <Route exact path={ROUTE_SIGN_UP} component={SignupPage} />
      <Route path={ROUTE_DASHBOARD} component={dashboard} />
      <Route path={ROUTE_PROFILE} component={profile} />
      {/* 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  </React.Fragment>
);

export default App;
