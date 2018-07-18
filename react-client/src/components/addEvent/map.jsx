import GoogleMapReact from 'google-map-react';
import React, { Component } from 'react';
import config from '../../../../config.json';
import SearchBox from './searchBox.jsx';

const greatPlaceStyle = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  height: '25px',
  width: '25px',
  backgroundImage: 'url(https://png.icons8.com/color/260/marker.png)',
  backgroundSize: 'cover'
}
const greatPlaceStyleHover = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  height: '25px',
  width: '25px',
  backgroundImage: 'url(https://www.artscape.ca/wp-content/uploads/2018/04/BigPin.png)',
  backgroundSize: 'cover'
}

const Marker = (props) => {
  const style = props.$hover ? greatPlaceStyleHover : greatPlaceStyle;
  return (
      <div style={style} className="gmap-marker">
        {props.text}
      </div>
  )
}

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
    this.onPlaceLookUp = this.onPlaceLookUp.bind(this);
  }
  // componentDidMount() {
  //   this.render();
  // }
  onPlaceLookUp(address) {
    this.setState({
      center: {
        lat: address.lat,
        lng: address.lng
      }
    })
  }
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '400px', width: '100%' }}>
        <SearchBox onPlaceLookUp={this.onPlaceLookUp} />
        <GoogleMapReact
          bootstrapURLKeys={{ key: `${config.googleMapsAPI}` }}
          center={this.state.center}
          defaultZoom={this.state.zoom}
          defaultCenter={{
            lat: 29.9451248,
            lng: -90.0700054
          }}
        >
        <Marker lat={this.state.center.lat} lng={this.state.center.lng} />
        </GoogleMapReact>
      </div>
    );
  }
};

export default MyMapComponent;
