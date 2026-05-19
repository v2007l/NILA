import React, { useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_pdnb3zg';
const EMAILJS_TEMPLATE_ID = 'template_d7yjz68';
const EMAILJS_PUBLIC_KEY = 'wuzLVFJWq_chKYcOe';

// ⚠️ உன் real emails போடு
const trustedContacts = [
  { name: 'vidhya', email: 'vv35848918@gmail.com' },
  { name: 'vishal', email: 'adhiyappanadhiyappan88@gmail.com' },
];

const SOS = ({ userLocation }) => {
  const [status, setStatus] = useState('idle');

  const handleSOS = useCallback(async () => {
    setStatus('sending');

    const mapsLink = userLocation
      ? 'https://maps.google.com/?q=' + userLocation.lat + ',' + userLocation.lng
      : 'Location unavailable';

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
    } catch (err) {
      console.error('Email error:', err);
      setStatus('error');
    }
  }, [userLocation]);

  return (
    <div style={{
      position: 'absolute', bottom: '30px',
      right: '300px', zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '8px'
    }}>

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
          Email Sent!
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
    </div>
  );
};

export default SOS;