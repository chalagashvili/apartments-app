import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Pagination, Icon, Button } from 'antd';
import moment from 'moment';
import Filter from 'ui/apartments/list/Filter';
import { defaultApartmentImage, RealtorOnly, nonClient, AdminOnly, ClientOnly } from 'utils/const';


const ApartmentsList = ({
  mapView, searchByMap, searchByMapToggle, items, onHover,
  pagination: { totalItems, page, pageSize },
  onPageChange, onPaginationChange, pageSizeOptions, auth: { role }, onEdit, onFilterChange,
  onFilter, filters, onBook, groupLoading, onUnBook, onAdd, mode,
}) => (
  <div className={mapView ? 'hideApartments' : 'apartmentsList'}>
    <Filter
      searchByMap={searchByMap}
      searchByMapToggle={searchByMapToggle}
      onFilterChange={onFilterChange}
      onFilter={onFilter}
      filters={filters}
    />
    <div className="apartmentsWrapper" >
      {
      role === AdminOnly && mode === RealtorOnly ?
      (
        <div>
          <Button type="primary" onClick={onAdd} style={{ margin: 20 }}>
            <FormattedMessage id="app.addNewApartmentForRealtor" />
          </Button>
        </div>
      ) : null
    }
      {items.map(apartment => (
        <div
          className="apartment"
          key={apartment._id}
          onFocus={() => onHover({ ...apartment, clicked: false })}
          onMouseOver={() => onHover({ ...apartment, clicked: false })}
          tabIndex={-1}
        >
          <div>
            <img
              className="apartment__image"
              width={300}
              height={200}
              src={apartment.imageUrl || defaultApartmentImage}
              alt={apartment.name}
            />
          </div>
          <div className="apartment__infoWrapper" >
            {
            nonClient.includes(role) && mode !== ClientOnly ? (
              <button
                className="apartment-list-edit-button"
                onClick={() => onEdit(apartment._id)}
              >
                <FormattedMessage id="app.edit" />
                <Icon type="setting" theme="filled" />
              </button>
            ) : null
          }
            <div className="apartment__infoWrapper-firstSection" >
              <div className="apartment__name">{apartment.name}</div>
              <div className="apartmen__postDate" >{moment(apartment.createdAd).toDate().toLocaleDateString()}</div>
            </div>
            <div className="apartment__description">
              {apartment.description}
            </div>
            <div className="apartment__infoWrapper-secondSection">
              <div className="apartment__details" >
                <div>{apartment.floorAreaSize} m² </div>
                <div> &nbsp;• &nbsp;</div>
                <div>{apartment.numberOfRooms} {apartment.numberOfRooms > 1 ? 'Rooms' : 'Room'}</div>
              </div>
              <div className="apartment__price">${apartment.pricePerMonth}<div style={{ fontWeight: 'normal' }} > / mo</div>
              </div>
            </div>
            <div className="apartment__infoWrapper-thirdSection" >
              <div className="apartment__realtor">
                ⓒ {apartment.owner.name || apartment.owner.email}
              </div>
              {
                // eslint-disable-next-line no-nested-ternary
                (role === RealtorOnly) || (role === AdminOnly && mode === RealtorOnly) ?
                (
                  <div className={`apartment__availability apartment__availability--${apartment.isAvailable ? 'free' : 'booked'}`}>
                    {
                    apartment.isAvailable ? <FormattedMessage id="app.available" /> : <FormattedMessage id="app.booked" />
                  }
                  </div>
                 ) :
                (
                  apartment.isAvailable ?
                    <Button
                      onClick={() => onBook(apartment._id)}
                      loading={groupLoading[apartment._id]}
                      className="apartment__rentButton"
                    ><FormattedMessage id="app.bookNow" />
                    </Button>
                  :
                    <Button
                      type="danger"
                      onClick={() => onUnBook(apartment._id)}
                      loading={groupLoading[apartment._id]}
                      className="apartment__rentButton"
                    ><FormattedMessage id="app.unbook" />
                    </Button>
                  )
              }
            </div>
          </div>
        </div>
      ))}
      <div className="apartment__pagination" >
        <Pagination
          current={page}
          defaultCurrent={1}
          pageSize={pageSize}
          total={totalItems}
          showSizeChanger
          onChange={onPageChange}
          pageSizeOptions={pageSizeOptions}
          onShowSizeChange={onPaginationChange}
        />
      </div>
    </div>
  </div>
);

ApartmentsList.propTypes = {
  auth: PropTypes.shape({
    role: PropTypes.string,
  }),
  mapView: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchByMap: PropTypes.bool.isRequired,
  searchByMapToggle: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    totalItems: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onFilterChange: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
  filters: PropTypes.shape({}),
  onBook: PropTypes.func,
  onUnBook: PropTypes.func,
  onAdd: PropTypes.func,
  groupLoading: PropTypes.shape({}),
  mode: PropTypes.string.isRequired,
};

ApartmentsList.defaultProps = {
  pageSizeOptions: ['1', '5', '10', '20'],
  auth: {
    role: '',
  },
  filters: {},
  onBook: () => {},
  onUnBook: () => {},
  groupLoading: {},
  onEdit: () => {},
  onAdd: () => {},
};


export default ApartmentsList;

