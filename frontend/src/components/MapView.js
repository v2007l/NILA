import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import Sidebar from './Sidebar';
import SOS from './SOS';
import RouteSearch from './RouteSearch';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const dangerColors = {
  high: '#FF0000',
  medium: '#FFA500',
  low: '#00C853',
};

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [dangerZones, setDangerZones] = useState([]);
  const [nearbyDanger, setNearbyDanger] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://nila-2.onrender.com/api/predict-all')
      .then((res) => {
        setDangerZones(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setUserLocation({ lat: 11.0168, lng: 76.9558 });
      }
    );
  }, []);

  useEffect(() => {
    if (userLocation && dangerZones.length > 0) {
      dangerZones.forEach((zone) => {
        const dist = getDistance(userLocation.lat, userLocation.lng, zone.lat, zone.lng);
        if (dist < zone.radius / 1000) {
          setNearbyDanger(zone);
        }
      });
    }
  }, [userLocation, dangerZones]);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  if (loading || !userLocation) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        height: '100vh', background: '#0a0a1a',
        color: 'white', fontSize: '22px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌙</div>
        <div>NILA Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>

      {/* Navbar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: 'rgba(10,10,26,0.92)', color: 'white',
        padding: '12px 20px', zIndex: 1001,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>🌙 NILA</div>
        <div style={{ fontSize: '13px', color: '#aaa' }}>
          Night Safety Intelligence and Live Alert System
        </div>
        <div style={{
          background: '#00C853', borderRadius: '20px',
          padding: '4px 12px', fontSize: '12px', fontWeight: 'bold'
        }}>
          LIVE
        </div>
      </div>

      {/* Danger Alert Banner */}
      {nearbyDanger && (
        <div style={{
          position: 'absolute', top: '56px', left: 0, right: '280px',
          background: '#FF0000', color: 'white', padding: '10px',
          textAlign: 'center', zIndex: 1000, fontSize: '15px', fontWeight: 'bold'
        }}>
          WARNING: You are near {nearbyDanger.area}! ({nearbyDanger.incidents} incidents reported)
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: '30px', left: '10px',
        background: 'rgba(10,10,26,0.88)', color: 'white',
        padding: '12px 16px', borderRadius: '10px',
        zIndex: 1000, fontSize: '13px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Danger Levels</div>
        <div>🔴 High Risk</div>
        <div>🟠 Medium Risk</div>
        <div>🟢 Low Risk</div>
        <div style={{ marginTop: '8px', color: '#aaa', fontSize: '11px' }}>
          {dangerZones.length} zones loaded
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <b>You are here</b>
            <br />
            Stay safe!
          </Popup>
        </Marker>

        {dangerZones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.radius}
            pathOptions={{
              color: dangerColors[zone.level],
              fillColor: dangerColors[zone.level],
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <b>{zone.area}</b>
                <br />
                Level: <b>{zone.level.toUpperCase()}</b>
                <br />
                Incidents: <b>{zone.incidents}</b>
                <br />
                Radius: {zone.radius}m
                <br />
                Updated: {zone.last_updated}
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Sidebar */}
      <Sidebar zones={dangerZones} onZoneClick={() => {}} />

      {/* SOS Button */}
      <SOS userLocation={userLocation} />

      {/* Safe Route Finder */}
      <RouteSearch
        dangerZones={dangerZones}
        userLocation={userLocation}
        onRouteFound={(route) => console.log('Route:', route)}
      />

    </div>
  );
};

export default MapView;