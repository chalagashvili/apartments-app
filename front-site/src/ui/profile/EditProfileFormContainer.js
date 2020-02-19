import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';
import EditProfileForm from 'ui/profile/EditProfileForm';
import { getLoading } from 'state/loading/selectors';
import { getProfile } from 'state/profile/selectors';
import { fetchProfile } from 'state/profile/actions';
import { sendPutUser } from 'state/users/actions';

const mapStateToProps = state => ({
  loading: getLoading(state).editProfile,
  profile: getProfile(state),
});

const mapDispatchToProps = (dispatch, { history }) => ({
  onDidMount: form => dispatch(fetchProfile(form)),
  onCancel: () => history.goBack(),
  onSubmit: (values) => {
    // eslint-disable-next-line no-param-reassign
    Object.keys(values).forEach(key => values[key] == null && delete values[key]);
    dispatch(sendPutUser(values)).then(() => {
      message.success('User profile succesfully updated!');
    })
      .catch(err => message.error(err));
  },
});

export default
withRouter(connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(EditProfileForm));
