import React, { useState } from 'react';
import { X, Compass, MapPin, Navigation, ListOrdered, Filter, ArrowRight } from 'lucide-react';
import { CATEGORY_METADATA } from '../data/campusData';

export function NearbyModal({
  isOpen,
  onClose,
  buildings,
  originId,
  setOriginId,
  categoryFilter,
  setCategoryFilter,
  nearbyData,
  onNavigateTo
}) {
  const [showTrace, setShowTrace] = useState(false);

  if (!isOpen) return null;

  const originBuilding = buildings.find(b => b.id === originId);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'amenity', label: 'Dining & Services' },
    { id: 'academic', label: 'Academic & Labs' },
    { id: 'recreational', label: 'Sports & Culture' },
    { id: 'transit', label: 'Transit & Parking' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Compass size={18} color="var(--apple-blue)" />
            <span>Nearby Campus Locations (BFS Queue Traversal)</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Close window">
            <X size={16} />
          </button>
        </div>

        {/* Controls Toolbar */}
        <div style={{ padding: '12px 20px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* Origin Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>FROM ORIGIN:</span>
            <select
              style={{
                padding: '6px 12px',
                borderRadius: '980px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                cursor: 'pointer'
              }}
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Filter size={13} color="var(--text-muted)" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`quick-pill ${categoryFilter === cat.id ? 'active' : ''}`}
                style={{
                  backgroundColor: categoryFilter === cat.id ? 'var(--apple-blue)' : 'var(--bg-surface)',
                  color: categoryFilter === cat.id ? '#FFFFFF' : 'var(--text-secondary)',
                  borderColor: categoryFilter === cat.id ? 'transparent' : 'var(--border-light)'
                }}
                onClick={() => setCategoryFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Toggle BFS Trace */}
          <button
            type="button"
            className="header-btn"
            style={{ marginLeft: 'auto', fontSize: '11px' }}
            onClick={() => setShowTrace(!showTrace)}
          >
            <ListOrdered size={12} />
            <span>{showTrace ? 'Hide Queue Trace' : 'Show BFS Queue Trace'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body">
          {/* BFS Exploration Trace macOS Terminal */}
          {showTrace && (
            <div className="macos-terminal-card">
              <div className="macos-terminal-header">
                <div className="macos-traffic-lights">
                  <div className="traffic-light close" />
                  <div className="traffic-light minimize" />
                  <div className="traffic-light zoom" />
                </div>
                <span className="macos-terminal-title">BFS Queue Execution Log (Root: {originId})</span>
              </div>
              <div className="macos-terminal-content">
                {nearbyData.trace.map((t, idx) => (
                  <div key={idx} style={{ padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#FF9F0A' }}>[Step {t.step}]</span> {t.description}
                    {t.queueState && (
                      <span style={{ color: '#64D2FF', marginLeft: '8px' }}>
                        Queue: [{t.queueState.join(', ')}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discovered Buildings Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {nearbyData.nearby.length > 0 ? (
              nearbyData.nearby.map((item) => {
                const b = item.data;
                const catMeta = CATEGORY_METADATA[b?.category] || CATEGORY_METADATA.academic;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '14px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '980px',
                          background: catMeta.badgeBg,
                          color: catMeta.badgeText
                        }}
                      >
                        {b?.code}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '980px',
                          background: 'var(--apple-blue-subtle)',
                          color: 'var(--apple-blue)',
                          fontFamily: 'var(--font-sans)'
                        }}
                      >
                        Hop Level {item.hop}
                      </span>
                    </div>

                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {b?.name}
                    </strong>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
                        🚶 ~{item.distance}m away
                      </span>
                      <button
                        type="button"
                        className="header-btn"
                        style={{ padding: '4px 10px', fontSize: '11px', color: 'var(--apple-blue)' }}
                        onClick={() => {
                          onNavigateTo(item.id);
                          onClose();
                        }}
                      >
                        <span>Navigate</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No nearby locations matching the selected category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
