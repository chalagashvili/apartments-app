import Cookies from 'js-cookie';
import store from 'state/store';
import setAuth from 'state/auth/actions';

const token = Cookies.get('jwtToken');
const username = Cookies.get('username');
if (token != null) {
  store.dispatch(setAuth({
    authenticated: true,
    username,
  }));
}
