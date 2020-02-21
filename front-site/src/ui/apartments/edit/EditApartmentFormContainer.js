import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import ApartmentForm from 'ui/apartments/common/ApartmentForm';
import { getLoading } from 'state/loading/selectors';
import { ROUTE_OWNED_APARTMENTS, ROUTE_ADMIN_OWNED_APARTMENTS } from 'app-init/router';
import { EDIT_MODE } from 'utils/const';
import { fetchApartment, sendPutApartment, sendDeleteApartment, fetchApartmentAddress, setEditApartmentAddress } from 'state/apartments/actions';
import { getEditApartment, getEditApartmentAddress } from 'state/apartments/selectors';

const mapStateToProps = state => ({
  loading: getLoading(state).editApartment,
  mode: EDIT_MODE,
  apartment: getEditApartment(state),
  address: getEditApartmentAddress(state),
});

const mapDispatchToProps = (dispatch, { history, intl, match: { params: { userId } } }) => ({
  onWillUnmount: () => dispatch(setEditApartmentAddress('')),
  onDidMount: (id, apartmentId) => {
    dispatch(fetchApartment(apartmentId, userId)).catch(err => message.error(err));
  },
  onSubmit: (values, apartmentId) => dispatch(sendPutApartment(values, apartmentId))
    .then(() => {
      message.success(intl.formatMessage({ id: 'app.editApartmenSuccess' }));
      history.push(userId ? ROUTE_ADMIN_OWNED_APARTMENTS.replace(':userId', userId) : ROUTE_OWNED_APARTMENTS);
    })
    .catch(err => message.error(err)),
  onDelete: (apartmentId) => {
    dispatch(sendDeleteApartment(apartmentId)).then(() => {
      message.success(intl.formatMessage({ id: 'app.editApartmenSuccess' }));
      history.push(userId ? ROUTE_ADMIN_OWNED_APARTMENTS.replace(':userId', userId) : ROUTE_OWNED_APARTMENTS);
    })
      .catch(err => message.error(err));
  },
  onCancel: () => history.push(userId ? ROUTE_ADMIN_OWNED_APARTMENTS.replace(':userId', userId) : ROUTE_OWNED_APARTMENTS),
  onMarkerChange: (lat, lng) => dispatch(fetchApartmentAddress(lat, lng)
    .catch(err => message.error(err))),
  onAddressChange: address => dispatch(setEditApartmentAddress(address)),
});

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ApartmentForm)));
