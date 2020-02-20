import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Button, Switch, Icon, Spin } from 'antd';
import LocationAutocomplete from 'ui/apartments/common/LocationAutocomplete';
import LocationPicker from 'ui/apartments/common/LocationPicker';
import { coordinatesRegexPatter, mapDefaultCenterCoordinates, EDIT_MODE } from 'utils/const';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ApartmentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      centerCoordinates: mapDefaultCenterCoordinates,
      currentMarkerCoordinates: mapDefaultCenterCoordinates,
    };
    this.setCurrentMarkerCoordinates = this.setCurrentMarkerCoordinates.bind(this);
  }

  componentDidMount() {
    const {
      onDidMount, form, match: { params = {} },
    } = this.props;
    onDidMount(params.userId, params.apartmentId);
    // To disable submit button at the beginning.
    form.validateFields();
    navigator.geolocation.getCurrentPosition((position) => {
      if (position && position.coords) {
        const { longitude, latitude } = position;
        if (longitude != null && latitude != null) {
          const centerCoordinates = {
            longitude,
            latitude,
          };
          this.setState({ centerCoordinates });
        }
      }
    });
  }

  componentWillUpdate(nextProps, nextState) {
    const { mode, apartment, form } = this.props;
    const { setFields, setFieldsValue } = form;
    if (mode === EDIT_MODE && apartment !== nextProps.apartment) {
      const {
        name, description, floorAreaSize, isAvailable, pricePerMonth, loc, numberOfRooms,
      } = nextProps.apartment;
      setFields({
        name: {
          value: name,
          errors: null,
        },
        description: {
          value: description,
          errors: null,
        },
        floorAreaSize: {
          value: floorAreaSize,
          errors: null,
        },
        isAvailable: {
          value: isAvailable,
          checked: isAvailable,
          errors: null,
        },
        pricePerMonth: {
          value: pricePerMonth,
          errors: null,
        },
        numberOfRooms: {
          value: numberOfRooms,
          errors: null,
        },
        location: {
          value: loc && loc.coordinates && `${loc.coordinates[1]},${loc.coordinates[0]}`,
          errors: null,
        },
      });
      if (loc && loc.coordinates) {
        // eslint-disable-next-line react/no-will-update-set-state
        this.setState({
          currentMarkerCoordinates: {
            longitude: loc.coordinates[0],
            latitude: loc.coordinates[1],
          },
        });
      }
    }
    if (this.state.currentMarkerCoordinates !== nextState.currentMarkerCoordinates) {
      const { longitude, latitude } = nextState.currentMarkerCoordinates;
      setFieldsValue({
        location: `${latitude.toFixed(2)},${longitude.toFixed(2)}`,
      });
    }
  }

  componentWillUnmount() {
    const { onWillUnmount } = this.props;
    onWillUnmount();
  }

  setCurrentMarkerCoordinates(lng, lat) {
    this.setState({
      currentMarkerCoordinates: {
        longitude: lng,
        latitude: lat,
      },
    });
  }

  generateError(name) {
    const { intl, form } = this.props;
    const { isFieldTouched, getFieldError } = form;
    return isFieldTouched(name) && getFieldError(name)
    && intl.formatMessage({ id: getFieldError(name) });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { apartment, form, onSubmit } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const coords = values.location.split(',');
        // eslint-disable-next-line no-param-reassign
        values.location = {
          type: 'Point',
          coordinates: [parseFloat(coords[1]), parseFloat(coords[0])],
        };
        onSubmit(values, apartment._id);
      }
    });
  };

  render() {
    const {
      intl, form, loading, onCancel, apartment: { _id }, onDelete, mode,
      address, onMarkerChange, onAddressChange,
    } = this.props;
    const {
      getFieldDecorator, getFieldsError,
    } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const nameError = this.generateError('name');
    const sizeError = this.generateError('floorAreaSize');
    const priceError = this.generateError('pricePerMonth');
    const roomsError = this.generateError('numberOfRooms');
    const descriptionError = this.generateError('description');
    const availableError = this.generateError('isAvailable');
    const locationError = this.generateError('location');
    const renderDeleteButton = mode === EDIT_MODE ? (
      <Button
        type="danger"
        style={{
          marginLeft: '2rem',
        }}
        onClick={() => onDelete(_id)}
      >
        <FormattedMessage id="app.delete" />
      </Button>
    ) : null;

    return (
      <Spin spinning={!!loading}>
        <div className="ApartmentFormWrapper">
          <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
            <Form.Item
              label={intl.formatMessage({ id: 'app.fullname' })}
              validateStatus={nameError ? 'error' : ''}
              help={nameError || ''}
            >
              {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: 'app.inputName' }],
            })(<Input type="text" />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'app.floorAreaSize' })}
              validateStatus={sizeError ? 'error' : ''}
              help={sizeError || ''}
            >
              {getFieldDecorator('floorAreaSize', {
              rules: [{ required: true, message: 'app.inputSize' }],
            })(<Input type="number" min={0} />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'app.numberOfRooms' })}
              validateStatus={roomsError ? 'error' : ''}
              help={roomsError || ''}
            >
              {getFieldDecorator('numberOfRooms', {
              rules: [{ required: true, message: 'app.inputRooms' }],
            })(<Input type="number" min={0} />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'app.pricePerMonth' })}
              validateStatus={priceError ? 'error' : ''}
              help={priceError || ''}
            >
              {getFieldDecorator('pricePerMonth', {
              rules: [{ required: true, message: 'app.inputPrice' }],
            })(<Input type="number" min={0} />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'app.description' })}
              validateStatus={descriptionError ? 'error' : ''}
              help={descriptionError || ''}
            >
              {getFieldDecorator('description', {
              rules: [{ required: true, whitespace: true, message: 'app.inputDescription' }],
            })(<Input type="text" />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'app.available' })}
              validateStatus={availableError ? 'error' : ''}
              help={availableError || ''}
            >
              {getFieldDecorator('isAvailable', {
              rules: [{ required: false, message: 'app.inputAvailable' }],
              valuePropName: 'checked',
            })(<Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />)}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'app.location' })}
              validateStatus={locationError ? 'error' : ''}
              help={locationError || ''}
            >
              {getFieldDecorator('location', {
              rules: [{ required: true, whitespace: false, message: 'app.inputEmail' },
              { pattern: coordinatesRegexPatter, message: 'app.validCoordinates' }],
            })(<Input />)}
              <FormattedMessage id="app.geocodingHint" />
              <LocationAutocomplete
                setCurrentMarkerCoordinates={this.setCurrentMarkerCoordinates}
                address={address}
                onAddressChange={onAddressChange}
              />
              <LocationPicker
                centerCoordinates={this.state.centerCoordinates}
                currentMarkerCoordinates={this.state.currentMarkerCoordinates}
                setCurrentMarkerCoordinates={this.setCurrentMarkerCoordinates}
                onMarkerChange={onMarkerChange}
              />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-form-button"
                disabled={hasErrors(getFieldsError())}
              >
                <FormattedMessage id="app.save" />
              </Button>
              <Button
                onClick={onCancel}
                style={{ marginLeft: 10 }}
              >
                <FormattedMessage id="app.cancel" />
              </Button>
              {
              renderDeleteButton
            }
            </Form.Item>
          </Form>
        </div>
      </Spin>
    );
  }
}

ApartmentForm.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
    setFields: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    getFieldsError: PropTypes.func.isRequired,
    isFieldTouched: PropTypes.func.isRequired,
    getFieldError: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  onDidMount: PropTypes.func,
  apartment: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    createdAt: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    numberOfRooms: PropTypes.number,
    floorAreaSize: PropTypes.number,
    pricePerMonth: PropTypes.number,
    isAvailable: PropTypes.bool,
    loc: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({}),
  }).isRequired,
  onDelete: PropTypes.func,
  onMarkerChange: PropTypes.func.isRequired,
  onWillUnmount: PropTypes.func.isRequired,
  onAddressChange: PropTypes.func.isRequired,
  address: PropTypes.string,
};

ApartmentForm.defaultProps = {
  loading: false,
  onDidMount: () => {},
  apartment: {},
  onDelete: () => {},
  address: '',
};

export default Form.create({ name: 'apartmentForm' })(injectIntl(ApartmentForm));
