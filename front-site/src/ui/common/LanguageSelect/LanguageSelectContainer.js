import { connect } from 'react-redux';
import { setLanguage } from 'state/locale/actions';
import { getLocale } from 'state/locale/selectors';
import LanguageSelectorForm from 'ui/common/LanguageSelect/LanguageSelectForm';

const mapStateToProps = state => ({
  language: getLocale(state),
});

const mapDispatchToProps = dispatch => ({
  setLanguage: lang => dispatch(setLanguage(lang)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelectorForm);
