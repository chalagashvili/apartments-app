import React from 'react';
import MapContainer from './Map';
import AparmentsList from './ApartmentsList';

const apartments = [
  {
    name: 'Biltmore',
    title: 'Biltmore',
    lat: -37.847927,
    lng: 150.6517938,
    id: 1,
    description: ' Very light flat. Available only for the customers who dont have any kind of pet. Smoking is not allowed. Some other descriptions please see below.',
    date: new Date(),
    size: 56,
    rooms: 4,
    price: 80,
    realtor: 'sandro',
    image: 'https://www.welcome-hotels.com/site/assets/files/30116/welcome_hotel_marburg_superior_1k.600x600.jpg',
  },
  {
    name: 'Holiday Inn',
    title: 'Holiday Inn',
    lat: -33.9722342,
    lng: 149.7729561,
    id: 2,
    description: ' Very light flat. Available only for the customers who dont have any kind of pet. Smoking is not allowed. Some other descriptions please see below.',
    date: new Date(),
    size: 56,
    rooms: 4,
    price: 80,
    realtor: 'sandro',
    image: 'https://www.welcome-hotels.com/site/assets/files/30116/welcome_hotel_marburg_superior_1k.600x600.jpg',
  },
  {
    name: 'Marriot',
    title: 'Marriot',
    lat: -31.9546904,
    lng: 115.8350292,
    id: 3,
    description: ' Very light flat. Available only for the customers who dont have any kind of pet. Smoking is not allowed. Some other descriptions please see below.',
    date: new Date(),
    size: 56,
    rooms: 4,
    price: 80,
    realtor: 'sandro',
    image: 'https://www.welcome-hotels.com/site/assets/files/30116/welcome_hotel_marburg_superior_1k.600x600.jpg',
  },
  {
    name: 'Holiday Inn',
    title: 'Holiday Inn',
    lat: -33.9722342,
    lng: 149.7729561,
    id: 2,
    description: ' Very light flat. Available only for the customers who dont have any kind of pet. Smoking is not allowed. Some other descriptions please see below.',
    date: new Date(),
    size: 56,
    rooms: 4,
    price: 80,
    realtor: 'sandro',
    image: 'https://www.welcome-hotels.com/site/assets/files/30116/welcome_hotel_marburg_superior_1k.600x600.jpg',
  },
  {
    name: 'Marriot',
    title: 'Marriot',
    lat: -31.9546904,
    lng: 115.8350292,
    id: 3,
    description: ' Very light flat. Available only for the customers who dont have any kind of pet. Smoking is not allowed. Some other descriptions please see below.',
    date: new Date(),
    size: 56,
    rooms: 4,
    price: 80,
    realtor: 'sandro',
    image: 'https://www.welcome-hotels.com/site/assets/files/30116/welcome_hotel_marburg_superior_1k.600x600.jpg',
  },
];

class Apartments extends React.PureComponent {
  state = {
    selectedItem: { lat: 0, lng: 0 },
    mapView: false,
    searchByMap: false,
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position, 'position');
    });
  }

  showInfo = (selectedItem) => {
    this.setState({ selectedItem });
  }

  render() {
    const { mapView, selectedItem, searchByMap } = this.state;

    return (
      <div className="apartmentsForm" >
        <AparmentsList
          mapView={mapView}
          items={apartments}
          onHover={this.showInfo}
          searchByMap={searchByMap}
          searchByMapToggle={() => this.setState(prevState => ({ searchByMap: !prevState.searchByMap }))}
        />
        <MapContainer
          mapView={mapView}
          center={{ lat: -24.9923319, lng: 135.2252427 }}
          zoom={4}
          data={apartments}
          onClick={this.showInfo}
          selectedItem={selectedItem}
        />
        <div
          className="apartmentsForm__view"
          onClick={() => this.setState(prevState => ({ mapView: !prevState.mapView }))}
        > {mapView ? 'LIST' : 'MAP'}
        </div>
      </div>
    );
  }
}
export default Apartments;

