import GoogleMapReact from 'google-map-react';
import React, { Component } from 'react';
import config from '../../../../config.json';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class MyMapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 29.9451248,
        lng: -90.0700054
      },
      zoom: 11
    }
  }
  // static defaultProps = {
  //   center: {
  //     lat: 29.9451248,
  //     lng: -90.0700054
  //   },
  //   zoom: 11
  // }
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '400px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: `${config.googleMapsAPI}` }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
      </div>
    );
  }
};


// const MyMapComponent = withScriptjs(withGoogleMap((props) =>
//   <GoogleMap
//   defaultZoom={8}
//   defaultCenter={{ lat: 29.9451248, lng: -90.0700054 }}
//   >
//     {props.isMarkerShown && <Marker position={{ lat: 29.9451248, lng: -90.0700054 }} />}
//   </GoogleMap>
// ))

export default MyMapComponent;