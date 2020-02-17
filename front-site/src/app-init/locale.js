import enLocale from 'locales/en';
import hrLocale from 'locales/hr';

import Cookies from 'js-cookie';
import store from 'state/store';
import { setLanguage } from 'state/locale/actions';

const language = Cookies.get('language');

if (language) {
  store.dispatch(setLanguage(language));
}

export default enLocale;
export { hrLocale, enLocale };
