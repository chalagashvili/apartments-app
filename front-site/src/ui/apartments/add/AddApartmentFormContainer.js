import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import AddApartmentForm from 'ui/apartments/common/ApartmentForm';
import { getLoading } from 'state/loading/selectors';
import { ROUTE_OWNED_APARTMENTS } from 'app-init/router';
import { sendPostApartment } from 'state/apartments/actions';
import { ADD_MODE } from 'utils/const';

const mapStateToProps = state => ({
  loading: getLoading(state).addApartment,
  mode: ADD_MODE,
});

const mapDispatchToProps = (dispatch, { history, intl }) => ({
  onSubmit: values => dispatch(sendPostApartment(values))
    .then(() => {
      message.success(intl.formatMessage({ id: 'app.addApartmenSuccess' }));
      history.push(ROUTE_OWNED_APARTMENTS);
    })
    .catch(err => message.error(err)),
  onCancel: () => history.goBack(),
});

export default
withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddApartmentForm)));
