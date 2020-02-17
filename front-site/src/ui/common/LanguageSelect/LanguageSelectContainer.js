import { connect } from 'react-redux';
import { setLanguage } from 'state/locale/actions';
import { getLocale } from 'state/locale/selectors';
import LanguageSelectorForm from 'ui/common/LanguageSelect/LanguageSelectForm';
import { setCookie } from 'utils';

const mapStateToProps = state => ({
  language: getLocale(state),
});

const mapDispatchToProps = dispatch => ({
  setLanguage: (lang) => { dispatch(setLanguage(lang)); setCookie('language', lang); },
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelectorForm);
