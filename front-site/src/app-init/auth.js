import Cookies from 'js-cookie';
import store from 'state/store';
import { setAuth } from 'state/auth/actions';

const token = Cookies.get('jwtToken');
const email = Cookies.get('email');
const role = Cookies.get('role');

if (token != null) {
  store.dispatch(setAuth({
    authenticated: true,
    email,
    role,
    token,
  }));
}
