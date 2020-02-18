import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Icon, InputNumber, Button } from 'antd';

class Filter extends React.Component {
  state = { isOpen: false }

  render() {
    const {
      searchByMapToggle, searchByMap, onFilterChange, onFilter, filters,
    } = this.props;
    const {
      pricePerMonthFrom, pricePerMonthTo, floorAreaSizeFrom,
      floorAreaSizeTo, numberOfRoomsFrom, numberOfRoomsTo,
    } = filters;
    return (
      <div style={{
        display: 'flex',
        padding: '0 20px 20px',
        backgroundColor: 'white',
        width: '100%',
        position: 'relative',
      }}
      >
        <div
          style={{
            border: '1px solid rgb(176, 176, 176)', marginRight: 10, cursor: 'pointer', padding: '8px 16px', borderRadius: 5, color: 'black',
          }}
          role="button"
          tabIndex={-1}
          onClick={() => this.setState({ isOpen: true })}
          onKeyDown={() => this.setState({ isOpen: true })}
        ><FormattedMessage id="app.filter" />
        </div>
        <div
          tabIndex={-2}
          role="button"
          onClick={() => searchByMapToggle()}
          onKeyDown={() => searchByMapToggle()}
          style={{
            border: '1px solid rgb(176, 176, 176)',
            marginRight: 10,
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: 5,
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
          }}
        > {searchByMap ? <Icon width={15} height={25} style={{ marginRight: 6, fontSize: 18 }} type="check-square" /> : <div style={{
          marginRight: 8, border: '1px solid black', width: 16, height: 16,
        }}
        />}  <FormattedMessage id="app.searchAsIMoveTheMap" />
        </div>
        {this.state.isOpen ? (
          <div style={{
          position: 'absolute',
          top: 50,
          left: 20,
          backgroundColor: 'white',
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'rgba(0, 0, 0, 0.18) 0px 3px 5px',
          padding: 20,
          paddingRight: 50,
        }}
          >
            <div style={{
            display: 'flex', alignItems: 'center', marginTop: 20, justifyContent: 'space-between',
          }}
            >
              <div style={{ marginRight: 20 }} ><FormattedMessage id="app.price" />: ($)</div>
              From:
              <InputNumber
                type="number"
                value={pricePerMonthFrom}
                onChange={val => onFilterChange('pricePerMonthFrom', val)}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
              To:
              <InputNumber
                type="number"
                value={pricePerMonthTo}
                onChange={val => onFilterChange('pricePerMonthTo', val)}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </div>
            <div style={{
            display: 'flex', alignItems: 'center', marginTop: 40, justifyContent: 'space-between',
          }}
            >
              <div style={{ marginRight: 20 }} ><FormattedMessage id="app.size" />: (m²)</div>
              From:
              <InputNumber
                type="number"
                value={floorAreaSizeFrom}
                onChange={val => onFilterChange('floorAreaSizeFrom', val)}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
              To:
              <InputNumber
                type="number"
                value={floorAreaSizeTo}
                onChange={val => onFilterChange('floorAreaSizeTo', val)}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </div>

            <div style={{
            display: 'flex', alignItems: 'center', marginTop: 40, justifyContent: 'space-between',
          }}
            >
              <div style={{ marginRight: 20 }} ><FormattedMessage id="app.rooms" />: </div>
              From:
              <InputNumber
                type="number"
                value={numberOfRoomsFrom}
                onChange={val => onFilterChange('numberOfRoomsFrom', val)}
                formatter={value => `${value}`}
              />
              To:
              <InputNumber
                type="number"
                value={numberOfRoomsTo}
                onChange={val => onFilterChange('numberOfRoomsTo', val)}
                formatter={value => `${value}`}
              />
            </div>
            <Button style={{ marginTop: 20 }} onClick={() => { this.setState({ isOpen: false }); onFilter(); }} type="primary"><FormattedMessage id="app.search" /></Button>
            <Button style={{ marginTop: 10 }} onClick={() => { this.setState({ isOpen: false }); }}><FormattedMessage id="app.cancel" /></Button>
          </div>) : null}

      </div>
    );
  }
}

Filter.propTypes = {
  searchByMapToggle: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  searchByMap: PropTypes.bool.isRequired,
  filters: PropTypes.shape({
    pricePerMonthFrom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pricePerMonthTo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    floorAreaSizeFrom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    floorAreaSizeTo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    numberOfRoomsFrom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    numberOfRoomsTo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};

Filter.defaultProps = {
  filters: {},
};


export default Filter;
