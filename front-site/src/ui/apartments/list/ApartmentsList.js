import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import moment from 'moment';
import Filter from 'ui/apartments/list/Filter';
import { defaultApartmentImage } from 'utils/const';


const ApartmentsList = ({
  mapView, searchByMap, searchByMapToggle, items, onHover, pagination: { totalItems, page },
  onPageChange, onPaginationChange, pageSizeOptions,
}) => (
  <div className={mapView ? 'hideApartments' : 'apartmentsList'}>
    <Filter searchByMap={searchByMap} searchByMapToggle={searchByMapToggle} />
    <div className="apartmentsWrapper" >
      {items.map(apartment => (
        <div
          className="apartment"
          // eslint-disable-next-line no-underscore-dangle
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
              <div className="apartment__rentButton">Rent Now</div>
            </div>
          </div>
        </div>
      ))}
      <div className="apartment__pagination" >
        <Pagination
          current={page}
          defaultCurrent={1}
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
  mapView: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchByMap: PropTypes.bool.isRequired,
  searchByMapToggle: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    totalItems: PropTypes.number,
    page: PropTypes.number,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
};

ApartmentsList.defaultProps = {
  pageSizeOptions: ['1', '5', '10', '20'],
};


export default ApartmentsList;

