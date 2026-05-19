import React, { useState } from 'react';

const levelColors = {
  high: '#FF0000',
  medium: '#FFA500',
  low: '#00C853',
};

const levelEmoji = {
  high: '🔴',
  medium: '🟠',
  low: '🟢',
};

const Sidebar = ({ zones, onZoneClick }) => {
  const [filter, setFilter] = useState('all');

  const totalIncidents = zones.reduce((sum, z) => sum + z.incidents, 0);
  const highCount = zones.filter(z => z.level === 'high').length;
  const mediumCount = zones.filter(z => z.level === 'medium').length;
  const lowCount = zones.filter(z => z.level === 'low').length;

  const filtered = filter === 'all' ? zones : zones.filter(z => z.level === filter);

  return (
    <div style={{
      position: 'absolute', top: '56px', right: 0,
      width: '280px', height: 'calc(100vh - 56px)',
      background: 'rgba(10,10,26,0.95)',
      color: 'white', zIndex: 1000,
      overflowY: 'auto', padding: '16px',
      borderLeft: '1px solid #333'
    }}>

      {/* Title */}
      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
        📊 Safety Dashboard
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <div style={{
          background: '#1a1a2e', borderRadius: '10px',
          padding: '12px', textAlign: 'center',
          border: '1px solid #333'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B6B' }}>
            {totalIncidents}
          </div>
          <div style={{ fontSize: '11px', color: '#aaa' }}>Total Incidents</div>
        </div>

        <div style={{
          background: '#1a1a2e', borderRadius: '10px',
          padding: '12px', textAlign: 'center',
          border: '1px solid #333'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00C853' }}>
            {zones.length}
          </div>
          <div style={{ fontSize: '11px', color: '#aaa' }}>Zones Monitored</div>
        </div>
      </div>

      {/* Risk Breakdown */}
      <div style={{
        background: '#1a1a2e', borderRadius: '10px',
        padding: '12px', marginBottom: '16px',
        border: '1px solid #333'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
          ⚡ Risk Breakdown
        </div>

        {/* High */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>🔴 High Risk</span>
            <span>{highCount} zones</span>
          </div>
          <div style={{ background: '#333', borderRadius: '4px', height: '6px' }}>
            <div style={{
              background: '#FF0000', borderRadius: '4px', height: '6px',
              width: `${(highCount / zones.length) * 100}%`
            }} />
          </div>
        </div>

        {/* Medium */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>🟠 Medium Risk</span>
            <span>{mediumCount} zones</span>
          </div>
          <div style={{ background: '#333', borderRadius: '4px', height: '6px' }}>
            <div style={{
              background: '#FFA500', borderRadius: '4px', height: '6px',
              width: `${(mediumCount / zones.length) * 100}%`
            }} />
          </div>
        </div>

        {/* Low */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>🟢 Low Risk</span>
            <span>{lowCount} zones</span>
          </div>
          <div style={{ background: '#333', borderRadius: '4px', height: '6px' }}>
            <div style={{
              background: '#00C853', borderRadius: '4px', height: '6px',
              width: `${(lowCount / zones.length) * 100}%`
            }} />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {['all', 'high', 'medium', 'low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flex: 1, padding: '6px 4px', borderRadius: '6px',
              border: 'none', cursor: 'pointer', fontSize: '11px',
              fontWeight: 'bold',
              background: filter === f ? '#4A90E2' : '#1a1a2e',
              color: filter === f ? 'white' : '#aaa',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Zone List */}
      <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
        📍 Zone Details
      </div>

      {filtered.map(zone => (
        <div
          key={zone.id}
          onClick={() => onZoneClick(zone)}
          style={{
            background: '#1a1a2e', borderRadius: '10px',
            padding: '12px', marginBottom: '8px',
            border: `1px solid ${levelColors[zone.level]}44`,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2a2a3e'}
          onMouseLeave={e => e.currentTarget.style.background = '#1a1a2e'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
              {levelEmoji[zone.level]} {zone.area}
            </div>
            <div style={{
              background: levelColors[zone.level],
              borderRadius: '4px', padding: '2px 8px',
              fontSize: '10px', fontWeight: 'bold'
            }}>
              {zone.level.toUpperCase()}
            </div>
          </div>
          <div style={{ color: '#aaa', fontSize: '11px', marginTop: '6px' }}>
            🚨 {zone.incidents} incidents &nbsp;|&nbsp; 📏 {zone.radius}m radius
          </div>
          <div style={{ color: '#666', fontSize: '10px', marginTop: '4px' }}>
            Updated: {zone.last_updated}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{
        marginTop: '16px', padding: '10px',
        background: '#1a1a2e', borderRadius: '8px',
        textAlign: 'center', fontSize: '11px', color: '#555'
      }}>
        🌙 NILA v1.0 — Stay Safe
      </div>
    </div>
  );
};

export default Sidebar;