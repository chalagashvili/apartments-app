
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { getLocale } from 'state/locale/selectors';
import { enLocale, hrLocale } from 'app-init/locale';

export const mapStateToProps = state => ({
  locale: getLocale(state),
  messages: getLocale(state) === 'en' ? enLocale.messages : hrLocale.messages,
});

// connect the component
const IntlProviderContainer = connect(mapStateToProps, null)(IntlProvider);

// export connected component (Container)
export default IntlProviderContainer;
