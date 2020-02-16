import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import AddApartmentForm from 'ui/addApartment/AddApartmentForm';
import { sendPostLogin } from 'state/auth/actions';
import { getLoading } from 'state/loading/selectors';
import { ROUTE_DASHBOARD } from 'app-init/router';

const mapStateToProps = state => ({
  loading: getLoading(state).login,
});

const mapDispatchToProps = (dispatch, { history, intl }) => ({
  onSubmit: values => dispatch(sendPostLogin(values))
    .then(() => {
      message.success(intl.formatMessage({ id: 'app.loginSuccess' }));
      history.push(ROUTE_DASHBOARD);
    })
    .catch(err => message.error(err)),
});

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddApartmentForm)));
