import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import AddApartmentForm from 'ui/apartments/common/ApartmentForm';
import { getLoading } from 'state/loading/selectors';
import { ROUTE_OWNED_APARTMENTS, ROUTE_ADMIN_OWNED_APARTMENTS } from 'app-init/router';
import { sendPostApartment, fetchApartmentAddress, setEditApartmentAddress } from 'state/apartments/actions';
import { ADD_MODE } from 'utils/const';
import { getEditApartmentAddress } from 'state/apartments/selectors';

const mapStateToProps = state => ({
  loading: getLoading(state).addApartment,
  mode: ADD_MODE,
  address: getEditApartmentAddress(state),
});

const mapDispatchToProps = (dispatch, { history, intl, match: { params: { userId } } }) => ({
  onWillUnmount: () => dispatch(setEditApartmentAddress('')),
  onSubmit: values => dispatch(sendPostApartment(values, userId))
    .then(() => {
      message.success(intl.formatMessage({ id: 'app.addApartmenSuccess' }));
      history.push(userId ? ROUTE_ADMIN_OWNED_APARTMENTS.replace(':userId', userId) : ROUTE_OWNED_APARTMENTS);
    })
    .catch(err => message.error(err)),
  onCancel: () => history.push(userId ? ROUTE_ADMIN_OWNED_APARTMENTS.replace(':userId', userId) : ROUTE_OWNED_APARTMENTS),
  onMarkerChange: (lat, lng) => dispatch(fetchApartmentAddress(lat, lng)),
  onAddressChange: address => dispatch(setEditApartmentAddress(address)),
});

export default
withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddApartmentForm)));
