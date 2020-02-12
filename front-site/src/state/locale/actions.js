import { SET_LANGUAGE } from 'state/locale/types';

export const setLanguage = langCode => ({
  type: SET_LANGUAGE,
  payload: {
    locale: langCode,
  },
});

export const setCurrentLanguage = langCode => (dispatch) => {
  dispatch(setLanguage(langCode));
};
