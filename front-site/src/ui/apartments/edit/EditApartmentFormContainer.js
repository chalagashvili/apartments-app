import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import ApartmentForm from 'ui/apartments/common/ApartmentForm';
import { getLoading } from 'state/loading/selectors';
import { ROUTE_OWNED_APARTMENTS } from 'app-init/router';
import { EDIT_MODE } from 'utils/const';
import { fetchApartment, sendPutApartment, sendDeleteApartment } from 'state/apartments/actions';
import { getEditApartment } from 'state/apartments/selectors';

const mapStateToProps = state => ({
  loading: getLoading(state).editApartment,
  mode: EDIT_MODE,
  apartment: getEditApartment(state),
});

const mapDispatchToProps = (dispatch, { history, intl }) => ({
  onDidMount: (userId, apartmentId) => {
    dispatch(fetchApartment(apartmentId, userId));
  },
  onSubmit: (values, apartmentId) => dispatch(sendPutApartment(values, apartmentId))
    .then(() => {
      message.success(intl.formatMessage({ id: 'app.editApartmenSuccess' }));
      history.push(ROUTE_OWNED_APARTMENTS);
    })
    .catch(err => message.error(err)),
  onDelete: (apartmentId) => {
    dispatch(sendDeleteApartment(apartmentId)); history.push(ROUTE_OWNED_APARTMENTS);
  },
  onCancel: () => history.goBack(),
});

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ApartmentForm)));
