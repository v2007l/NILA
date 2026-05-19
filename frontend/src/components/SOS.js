import React, { useState, useCallback, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_pdnb3zg';
const EMAILJS_TEMPLATE_ID = 'template_d7yjz68';
const EMAILJS_PUBLIC_KEY = 'wuzLVFJWq_chKYcOe';

const trustedContacts = [
  { name: 'vidhya', email: 'vv35848918@gmail.com' },
  { name: 'vishal', email: 'adhiyappanadhiyappan88@gmail.com' },
];

// Nearest police stations (static data)
const policeStations = [
  { name: 'Gandhipuram Police Station', lat: 11.0183, lng: 76.9561, phone: '0422-2304100' },
  { name: 'RS Puram Police Station', lat: 11.0055, lng: 76.9600, phone: '0422-2544100' },
  { name: 'Ukkadam Police Station', lat: 11.0110, lng: 76.9390, phone: '0422-2316100' },
  { name: 'Peelamedu Police Station', lat: 11.0240, lng: 76.9840, phone: '0422-2570100' },
  { name: 'Saibaba Colony Police Station', lat: 11.0320, lng: 76.9710, phone: '0422-2436100' },
  { name: 'Erode Police Station', lat: 11.3420, lng: 77.7180, phone: '0424-2256100' },
  { name: 'Madurai North Police Station', lat: 9.9250, lng: 78.1200, phone: '0452-2531100' },
  { name: 'Theni Police Station', lat: 10.0120, lng: 77.4780, phone: '04546-252100' },
  { name: 'Sathyamangalam Police Station', lat: 11.5050, lng: 77.2390, phone: '04295-220100' },
];

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

const getNearestPoliceStation = (userLocation) => {
  if (!userLocation) return policeStations[0];
  let nearest = policeStations[0];
  let minDist = Infinity;
  policeStations.forEach((station) => {
    const dist = getDistance(userLocation.lat, userLocation.lng, station.lat, station.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = station;
    }
  });
  return nearest;
};

const SOS = ({ userLocation }) => {
  const [status, setStatus] = useState('idle');
  const [shakeCount, setShakeCount] = useState(0);
  const [showPolice, setShowPolice] = useState(false);
  const lastShake = useRef(0);
  const shakeTimer = useRef(null);

  const nearestPolice = getNearestPoliceStation(userLocation);

  const getLiveLocationLink = () => {
    if (!userLocation) return 'Location unavailable';
    return 'https://maps.google.com/?q=' + userLocation.lat + ',' + userLocation.lng;
  };

  const handleSOS = useCallback(async () => {
    if (status === 'sending') return;
    setStatus('sending');

    const mapsLink = getLiveLocationLink();

    try {
      for (const contact of trustedContacts) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: 'NILA SOS',
            to_email: contact.email,
            location: userLocation
              ? userLocation.lat.toFixed(4) + ', ' + userLocation.lng.toFixed(4)
              : 'Unknown',
            maps_link: mapsLink,
            time: new Date().toLocaleString(),
          },
          EMAILJS_PUBLIC_KEY
        );
      }
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Email error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [userLocation, status]);

  // Shake detection
  useEffect(() => {
    const SHAKE_THRESHOLD = 15;
    const SHAKE_TIMEOUT = 2000; // 2 seconds window for 3 shakes

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
      const now = Date.now();

      if (total > SHAKE_THRESHOLD && now - lastShake.current > 300) {
        lastShake.current = now;

        setShakeCount((prev) => {
          const newCount = prev + 1;

          // Reset timer
          if (shakeTimer.current) clearTimeout(shakeTimer.current);
          shakeTimer.current = setTimeout(() => setShakeCount(0), SHAKE_TIMEOUT);

          // 3 shakes = SOS!
          if (newCount >= 3) {
            setShakeCount(0);
            handleSOS();
          }

          return newCount;
        });
      }
    };

    if (window.DeviceMotionEvent) {
      // iOS 13+ needs permission
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then((permission) => {
            if (permission === 'granted') {
              window.addEventListener('devicemotion', handleMotion);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
    };
  }, [handleSOS]);

  return (
    <div style={{
      position: 'absolute', bottom: '30px',
      right: '300px', zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '8px'
    }}>

      {/* Shake indicator */}
      {shakeCount > 0 && (
        <div style={{
          background: '#FF6B00', color: 'white',
          padding: '6px 14px', borderRadius: '20px',
          fontSize: '12px', fontWeight: 'bold'
        }}>
          Shake {shakeCount}/3...
        </div>
      )}

      {/* Status Message */}
      {status === 'sending' && (
        <div style={{
          background: '#FF6B00', color: 'white',
          padding: '6px 14px', borderRadius: '20px',
          fontSize: '12px', fontWeight: 'bold'
        }}>
          Sending alert...
        </div>
      )}

      {status === 'sent' && (
        <div style={{
          background: '#00C853', color: 'white',
          padding: '6px 14px', borderRadius: '20px',
          fontSize: '12px', fontWeight: 'bold'
        }}>
          ✅ Alert Sent!
        </div>
      )}

      {status === 'error' && (
        <div style={{
          background: '#333', color: 'white',
          padding: '6px 14px', borderRadius: '20px',
          fontSize: '12px', fontWeight: 'bold'
        }}>
          Failed — check credentials
        </div>
      )}

      {/* Police Station Info */}
      {showPolice && (
        <div style={{
          background: 'rgba(10,10,26,0.95)',
          border: '1px solid #4A90E2',
          borderRadius: '10px', padding: '10px',
          fontSize: '11px', color: 'white',
          maxWidth: '180px', textAlign: 'center'
        }}>
          <div style={{ fontWeight: 'bold', color: '#4A90E2', marginBottom: '4px' }}>
            🚔 Nearest Police
          </div>
          <div style={{ marginBottom: '4px' }}>{nearestPolice.name}</div>
          <a href={'tel:' + nearestPolice.phone} style={{
            color: '#00C853', fontWeight: 'bold', textDecoration: 'none'
          }}>
            📞 {nearestPolice.phone}
          </a>
        </div>
      )}

      {/* Police Button */}
      <button
        onClick={() => setShowPolice(!showPolice)}
        style={{
          background: '#1a1a2e',
          border: '2px solid #4A90E2',
          color: '#4A90E2', width: '44px', height: '44px',
          borderRadius: '50%', fontSize: '18px',
          cursor: 'pointer',
        }}
        title="Nearest Police Station"
      >
        🚔
      </button>

      {/* SOS Button */}
      <button
        onClick={handleSOS}
        disabled={status === 'sending'}
        style={{
          background: status === 'sent' ? '#00C853' : '#CC0000',
          border: '3px solid ' + (status === 'sent' ? '#00FF00' : '#FF4444'),
          color: 'white', width: '64px', height: '64px',
          borderRadius: '50%', fontSize: '13px',
          fontWeight: 'bold', cursor: status === 'sending' ? 'wait' : 'pointer',
          boxShadow: '0 0 24px rgba(255,0,0,0.7)'
        }}
      >
        {status === 'sent' ? 'SENT' : 'SOS'}
      </button>

      {/* Shake hint */}
      <div style={{ fontSize: '10px', color: '#555', textAlign: 'center' }}>
        Shake 3x for SOS
      </div>
    </div>
  );
};

export default SOS;