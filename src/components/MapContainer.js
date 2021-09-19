import React from 'react'
import HEREMap, { Marker } from 'react-here-maps';


function MapContainer({ lat, lon }) {

  const center = { lat, lng: lon };
  return (
    <HEREMap
      appId="08UJuxYy3thH58V2zpjC"
      appCode="v9g_kxezwyxeoZ5o4PvNuPgJ9VSxVPCXiD-55SOa3ko"
      center={center}
      zoom={14}
    >
      {/* <Marker {...center}>
        <div className="circle-marker"></div>
      </Marker> */}
    </HEREMap>
  );
}

export default MapContainer