import React, { useState } from 'react';

const coimbatoreLocations = {
  'gandhipuram': { lat: 11.0168, lng: 76.9558 },
  'rs puram': { lat: 11.0050, lng: 76.9612 },
  'peelamedu': { lat: 11.0230, lng: 76.9850 },
  'ukkadam': { lat: 11.0120, lng: 76.9400 },
  'saibaba colony': { lat: 11.0310, lng: 76.9700 },
  'singanallur': { lat: 11.0000, lng: 76.9800 },
  'hopes college': { lat: 11.0400, lng: 76.9600 },
  'kovaipudur': { lat: 11.0300, lng: 76.9300 },
  'tidel park': { lat: 11.0130, lng: 76.9740 },
  'race course': { lat: 11.0070, lng: 76.9730 },
  'town hall': { lat: 11.0020, lng: 76.9620 },
  'railway station': { lat: 11.0010, lng: 76.9670 },
  'airport': { lat: 11.0300, lng: 77.0434 },
  'psg college': { lat: 11.0240, lng: 76.9980 },
  'coimbatore': { lat: 11.0168, lng: 76.9558 },
};

const quickPlaces = ['Airport', 'Railway Station', 'Town Hall', 'PSG College', 'Race Course'];

const RouteSearch = ({ dangerZones, userLocation, onRouteFound }) => {
  const [destination, setDestination] = useState('');
  const [searching, setSearching] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState('');

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calculateRouteSafety = (start, end) => {
    let totalDangerScore = 0;
    let highZones = [];

    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;

    dangerZones.forEach((zone) => {
      // Start, mid, end — 3 points check பண்ணு
      const distStart = getDistance(start.lat, start.lng, zone.lat, zone.lng);
      const distMid = getDistance(midLat, midLng, zone.lat, zone.lng);
      const distEnd = getDistance(end.lat, end.lng, zone.lat, zone.lng);

      const minDist = Math.min(distStart, distMid, distEnd);

      if (minDist < 1.5) {
        totalDangerScore += zone.danger_score || 50;
        if (zone.level === 'high') {
          highZones.push(zone.area);
        }
      }
    });

    const safetyScore = Math.max(0, 100 - totalDangerScore);
    return { safetyScore: Math.round(safetyScore), highZones };
  };

  const findSafeRoute = () => {
    if (!destination.trim()) {
      setError('Please enter a destination!');
      return;
    }

    setSearching(true);
    setError('');
    setRouteInfo(null);

    const destKey = destination.toLowerCase().trim();
    const destCoords = coimbatoreLocations[destKey];

    if (!destCoords) {
      setError('Location not found! Try: Airport, Railway Station, Town Hall...');
      setSearching(false);
      return;
    }

    const start = userLocation || { lat: 11.0168, lng: 76.9558 };
    const distance = getDistance(start.lat, start.lng, destCoords.lat, destCoords.lng);
    const safety = calculateRouteSafety(start, destCoords);
    const eta = Math.round((distance / 30) * 60);

    let safetyLevel = 'SAFE';
    let safetyColor = '#00C853';
    if (safety.safetyScore < 40) {
      safetyLevel = 'RISKY';
      safetyColor = '#FF0000';
    } else if (safety.safetyScore < 70) {
      safetyLevel = 'MODERATE';
      safetyColor = '#FFA500';
    }

    setTimeout(() => {
      setRouteInfo({
        destination: destination,
        destCoords: destCoords,
        distance: distance.toFixed(2),
        eta: eta,
        safetyScore: safety.safetyScore,
        safetyLevel: safetyLevel,
        safetyColor: safetyColor,
        highZones: safety.highZones,
      });
      if (onRouteFound) {
        onRouteFound({ start: start, end: destCoords });
      }
      setSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      findSafeRoute();
    }
  };

  const getMapsLink = () => {
    if (!routeInfo) return '#';
    const startLat = userLocation ? userLocation.lat : 11.0168;
    const startLng = userLocation ? userLocation.lng : 76.9558;
    return (
      'https://www.google.com/maps/dir/' +
      startLat + ',' + startLng +
      '/' +
      routeInfo.destCoords.lat + ',' + routeInfo.destCoords.lng
    );
  };

  const containerStyle = {
    position: 'absolute',
    top: '70px',
    left: '10px',
    zIndex: 1000,
    width: '270px',
    fontFamily: 'Arial, sans-serif',
  };

  const cardStyle = {
    background: 'rgba(10,10,26,0.95)',
    borderRadius: '12px',
    padding: '14px',
    border: '1px solid #333',
    marginBottom: '8px',
  };

  const darkBoxStyle = {
    background: '#1a1a2e',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
  };

  return (
    React.createElement('div', { style: containerStyle },

      React.createElement('div', { style: cardStyle },
        React.createElement('div', {
          style: { fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '10px' }
        }, 'Safe Route Finder'),

        React.createElement('div', {
          style: { background: '#1a1a2e', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', fontSize: '12px', color: '#aaa' }
        }, 'Your Current Location'),

        React.createElement('input', {
          type: 'text',
          placeholder: 'Enter destination...',
          value: destination,
          onChange: (e) => setDestination(e.target.value),
          onKeyPress: handleKeyPress,
          style: {
            width: '100%', padding: '8px 12px', borderRadius: '8px',
            border: '1px solid #444', background: '#1a1a2e', color: 'white',
            fontSize: '13px', marginBottom: '8px', outline: 'none', boxSizing: 'border-box',
          }
        }),

        error && React.createElement('div', {
          style: { color: '#FF6B6B', fontSize: '11px', marginBottom: '8px' }
        }, error),

        React.createElement('button', {
          onClick: findSafeRoute,
          disabled: searching,
          style: {
            width: '100%', padding: '10px',
            background: searching ? '#333' : '#4A90E2',
            border: 'none', borderRadius: '8px', color: 'white',
            fontSize: '13px', fontWeight: 'bold',
            cursor: searching ? 'wait' : 'pointer',
          }
        }, searching ? 'Finding Safe Route...' : 'Find Safe Route')
      ),

      routeInfo && React.createElement('div', { style: cardStyle },
        React.createElement('div', {
          style: { fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }
        }, 'Route Analysis'),

        React.createElement('div', {
          style: {
            background: routeInfo.safetyColor + '22',
            border: '1px solid ' + routeInfo.safetyColor,
            borderRadius: '8px', padding: '10px',
            textAlign: 'center', marginBottom: '12px',
          }
        },
          React.createElement('div', {
            style: { fontSize: '18px', fontWeight: 'bold', color: routeInfo.safetyColor }
          }, routeInfo.safetyLevel),
          React.createElement('div', {
            style: { fontSize: '11px', color: '#aaa' }
          }, 'Safety Score: ' + routeInfo.safetyScore + '/100')
        ),

        React.createElement('div', { style: darkBoxStyle },
          React.createElement('div', {
            style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }
          },
            React.createElement('span', { style: { fontSize: '12px', color: '#aaa' } }, 'Destination'),
            React.createElement('span', { style: { fontSize: '12px', color: 'white', fontWeight: 'bold' } }, routeInfo.destination)
          ),
          React.createElement('div', {
            style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }
          },
            React.createElement('span', { style: { fontSize: '12px', color: '#aaa' } }, 'Distance'),
            React.createElement('span', { style: { fontSize: '12px', color: 'white', fontWeight: 'bold' } }, routeInfo.distance + ' km')
          ),
          React.createElement('div', {
            style: { display: 'flex', justifyContent: 'space-between' }
          },
            React.createElement('span', { style: { fontSize: '12px', color: '#aaa' } }, 'ETA'),
            React.createElement('span', { style: { fontSize: '12px', color: 'white', fontWeight: 'bold' } }, routeInfo.eta + ' mins')
          )
        ),

        routeInfo.highZones.length > 0 && React.createElement('div', {
          style: {
            background: '#FF000022', border: '1px solid #FF0000',
            borderRadius: '8px', padding: '10px', marginBottom: '10px',
          }
        },
          React.createElement('div', {
            style: { fontSize: '12px', color: '#FF6B6B', fontWeight: 'bold', marginBottom: '4px' }
          }, 'High Risk Zones Nearby:'),
          routeInfo.highZones.map((zone, i) =>
            React.createElement('div', { key: i, style: { fontSize: '11px', color: '#ffaaaa' } }, zone)
          )
        ),

        React.createElement('a', {
          href: getMapsLink(),
          target: '_blank',
          rel: 'noreferrer',
          style: {
            display: 'block', textAlign: 'center',
            background: '#00C853', color: 'white',
            padding: '10px', borderRadius: '8px',
            fontSize: '13px', fontWeight: 'bold', textDecoration: 'none',
          }
        }, 'Open in Google Maps')
      ),

      React.createElement('div', { style: cardStyle },
        React.createElement('div', {
          style: { fontSize: '11px', color: '#aaa', marginBottom: '8px', fontWeight: 'bold' }
        }, 'Quick Destinations:'),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px' } },
          quickPlaces.map((place) =>
            React.createElement('button', {
              key: place,
              onClick: () => setDestination(place.toLowerCase()),
              style: {
                background: '#1a1a2e', border: '1px solid #333',
                color: '#aaa', padding: '4px 8px',
                borderRadius: '12px', fontSize: '10px', cursor: 'pointer',
              }
            }, place)
          )
        )
      )
    )
  );
};

export default RouteSearch;