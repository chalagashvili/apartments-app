// import React, { PureComponent } from 'react';
// import GoogleMapReact, { InfoWindow } from 'google-map-react';

// const AnyReactComponent = ({ text }: any) => <div>{text}</div>;

// export class MapContainer extends PureComponent {
//   render() {
//     const { google } = window;
//     const { data } = this.props;
//     const { center } = this.props;

//     return (
//       <div style={{ height: '100vh', width: '100%' }} >
//         <GoogleMapReact
//           containerStyle={{
//             position: 'fixed',
//           }}
//         // google={this.props.google}
//         // className="map"
//         // zoom={this.props.zoom}
//         // initialCenter={this.props.center}
//         >
//           {/* {data.map(item => (
//             <AnyReactComponent
//               lat={11.0168}
//               lng={76.9558}
//               text="My Marker"
//             />
//           ))}

//           <InfoWindow
//             visible
//             position={{
//               lat: this.props.selectedItem.lat,
//               lng: this.props.selectedItem.lng,
//             }}
//           >
//             <div>
//               <h1>{this.props.selectedItem.title}</h1>
//             </div>
//           </InfoWindow> */}
//         </GoogleMapReact>
//       </div>
//     );
//   }
// }

// export default MapContainer;

import React, { Component } from 'react';
import GoogleMapReact, { InfoWindow } from 'google-map-react';
import Marker from './Marker';

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: -37.9722342,
      lng: 144.7729561,
    },
    zoom: 11,
  };

  render() {
    const { selectedItem } = this.props;

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '50%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCbTP4oavyejp7WPxkkjuS2H0eX0mKhya0' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {this.props.data.map(item => (

            <Marker
              lat={item.lat}
              lng={item.lng}
              active={!!(item.lng === selectedItem.lng && item.lat === selectedItem.lat)}
              name="My Marker"
              onClick={this.props.onClick}
              item={item}
              selectedItem={selectedItem}
            />
          ))}
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;

