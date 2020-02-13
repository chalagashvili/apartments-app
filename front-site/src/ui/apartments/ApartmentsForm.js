import React from 'react';
import { Table } from 'antd';
import MapContainer from './Map';
import AparmentsList from './ApartmentsList';


const apartments = [
  {
    name: 'Biltmore',
    title: 'Biltmore',
    lat: -37.847927,
    lng: 150.6517938,
    id: 1,
  },
  {
    name: 'Holiday Inn',
    title: 'Holiday Inn',
    lat: -33.9722342,
    lng: 149.7729561,
    id: 2,
  },
  {
    name: 'Marriot',
    title: 'Marriot',
    lat: -31.9546904,
    lng: 115.8350292,
    id: 3,
  },
];

class Users extends React.PureComponent {
  state = {
    selectedItem: { lat: 0, lng: 0 },
  };

  showInfo = (selectedItem) => {
    this.setState({ selectedItem });
    console.log(selectedItem);
  }

  render() {
    return (
      <div style={{ display: 'flex' }} >

        <AparmentsList items={apartments} onHover={this.showInfo} />
        <MapContainer
          center={{ lat: -24.9923319, lng: 135.2252427 }}
          zoom={4}
          data={apartments}
          onClick={this.showInfo}
          selectedItem={this.state.selectedItem}
        />
      </div>
    );
  }
}
export default Users;

