import React from 'react';
import moment from 'moment';
import { Icon, Button } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { defaultApartmentImage, nonClient, RealtorOnly, ClientOnly } from 'utils/const';
import 'ui/apartments/list/Marker.css';

const Marker = (props) => {
  const {
    name, active, onClick, item, selectedItem, auth: { role }, onEdit,
    onBook, groupLoading, onUnBook, mode,
  } = props;
  return (
    <div
      className="marker"
      role="button"
      tabIndex={-1}
      onClick={() => onClick({ ...item, clicked: !selectedItem.clicked })}
      onKeyDown={() => onClick({ ...item, clicked: !selectedItem.clicked })}
      title={name}
      style={{
        backgroundColor: active ? 'black' : 'white',
      }}
    >
      <div style={{
        cursor: 'pointer', color: active ? 'white' : 'black', fontWeight: 'bold', textAlign: 'center',
      }}
      > ${item.pricePerMonth}
      </div>
      {active && selectedItem && selectedItem.clicked ? (
        <div style={{
        position: 'absolute',
        top: 38,
        width: 300,
        heigth: 300,
        backgroundColor: 'white',
        borderRadius: 20,
        zIndex: 5,
        overflow: 'hidden',
      }}
        >
          <div key={item._id}>
            <img
              style={{ objectFit: 'cover' }}
              width={300}
              height={150}
              src={item.imageUrl || defaultApartmentImage}
              alt="Apartment"
            />
            <div style={{ padding: '15px 20px 20px' }} >
              {
                nonClient.includes(role) && mode !== ClientOnly ? (
                  <button
                    className="apartment-edit-button"
                    onClick={() => onEdit(item._id)}
                  >
                    <FormattedMessage id="app.edit" />
                    <Icon type="setting" theme="filled" />
                  </button>
                ) : null
              }
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                  <div style={{ fontSize: 19, color: 'black' }} >{item.name}</div>

                  <div style={{ fontSize: 12 }} >
                    {moment(item.createdAt).toDate().toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                fontSize: 13, paddingBottom: 10, paddingTop: 10,
              }}
                >{item.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex' }} >
                    <div style={{ fontSize: 14, color: 'black' }} >{item.floorAreaSize} m² </div>
                    <div style={{ color: 'black' }} > &nbsp;• &nbsp;</div>
                    <div style={{ fontSize: 14, color: 'black' }} >{item.numberOfRooms} <FormattedMessage id="app.rooms" /></div>
                  </div>
                  <div style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  display: 'flex',
                  color: 'black',
                  paddingBottom: 5,
                  textAlign: 'end',
                }}
                  >${item.pricePerMonth}<div style={{ fontWeight: 'normal' }} > / mo</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }} >

                  <div style={{
                  fontSize: 13, backgroundColor: '#F7F7F7', borderRadius: 10, padding: '0 10px 0', fontWeight: 'bold', color: 'black', width: 'max-content',
                }}
                  >ⓒ {item.owner.name || item.owner.email}
                  </div>


                  {
                    // eslint-disable-next-line no-nested-ternary
                    role === RealtorOnly ?
                    (
                      <div className={`apartment__availability apartment__availability--${item.isAvailable ? 'free' : 'booked'}`}>
                        {
                        item.isAvailable ? <FormattedMessage id="app.available" /> : <FormattedMessage id="app.booked" />
                      }
                      </div>
                    ) :
                    (
                      item.isAvailable ?
                        <Button
                          className="apartment__rentButton"
                          onClick={() => onBook(item._id)}
                          loading={groupLoading[item._id]}
                        >
                          <div style={{
                          cursor: 'pointer',
                          border: '1px solid black',
                          color: 'rgb(34, 34, 34)',
                          padding: '5px 20px',
                          borderRadius: 5,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                          >
                            <FormattedMessage id="app.bookNow" />
                          </div>
                        </Button>
                      :
                        <Button
                          type="danger"
                          className="apartment__rentButton"
                          onClick={() => onUnBook(item._id)}
                          loading={groupLoading[item._id]}
                        >
                          <FormattedMessage id="app.unbook" />
                        </Button>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>) : null}

    </div>
  );
};

Marker.propTypes = {
  active: PropTypes.bool,
  auth: PropTypes.shape({
    role: PropTypes.string,
  }).isRequired,
  selectedItem: PropTypes.shape({
    clicked: PropTypes.bool,
  }),
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    numberOfRooms: PropTypes.number.isRequired,
    floorAreaSize: PropTypes.number.isRequired,
    pricePerMonth: PropTypes.number.isRequired,
    isAvailable: PropTypes.bool.isRequired,
    owner: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string.isRequired,
    }).isRequired,
    loc: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }).isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onBook: PropTypes.func,
  onUnBook: PropTypes.func,
  groupLoading: PropTypes.shape({}),
  mode: PropTypes.string.isRequired,
};

Marker.defaultProps = {
  active: false,
  selectedItem: {
    onClick: () => {},
  },
  item: null,
  onBook: () => {},
  onUnBook: () => {},
  groupLoading: {},
};

export default Marker;
