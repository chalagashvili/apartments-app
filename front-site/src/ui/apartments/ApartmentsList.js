import React from 'react';
import { Pagination } from 'antd';
import Filter from './Filter';


const ApartmentsList = props => (
  <div className={props.mapView ? 'hideApartments' : 'apartmentsList'}>
    <Filter searchByMap={props.searchByMap} searchByMapToggle={props.searchByMapToggle} />
    <div className="apartmentsWrapper" >
      {props.items.map(apartment => (
        <div
          className="apartment"
          key={apartment.lng + apartment.lat}
          onFocus={() => props.onHover({ ...apartment, clicked: false })}
          onMouseOver={() => props.onHover({ ...apartment, clicked: false })}
          tabIndex={-1}
        >
          <div>
            <img
              className="apartment__image"
              width={300}
              height={200}
              src={apartment.image}
              alt={apartment.name}
            />
          </div>
          <div className="apartment__infoWrapper" >
            <div className="apartment__infoWrapper-firstSection" >
              <div className="apartment__name">{apartment.title}</div>
              <div className="apartmen__postDate" >{apartment.date.toLocaleDateString()}</div>
            </div>
            <div className="apartment__description">
              {apartment.description}
            </div>
            <div className="apartment__infoWrapper-secondSection">
              <div className="apartment__details" >
                <div>{apartment.size} m² </div>
                <div> &nbsp;• &nbsp;</div>
                <div>{apartment.rooms} {apartment.rooms > 1 ? 'Rooms' : 'Room'}</div>
              </div>
              <div className="apartment__price">${apartment.price}<div style={{ fontWeight: 'normal' }} > / mo</div>
              </div>
            </div>
            <div className="apartment__infoWrapper-thirdSection" >
              <div className="apartment__realtor">
                ⓒ {apartment.realtor}
              </div>
              <div className="apartment__rentButton">Rent Now</div>
            </div>
          </div>
        </div>
      ))}
      <div className="apartment__pagination" >
        <Pagination defaultCurrent={1} total={3} />
      </div>
    </div>
  </div>
);


export default ApartmentsList;

