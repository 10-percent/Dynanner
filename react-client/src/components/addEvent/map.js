import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import React from 'react';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 29.9451248, lng: -90.0700054 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: 29.9451248, lng: -90.0700054 }} />}
  </GoogleMap>
))


export default MyMapComponent;