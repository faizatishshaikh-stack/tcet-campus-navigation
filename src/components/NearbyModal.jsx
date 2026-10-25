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
            <Compass size={18} color="var(--forest-800)" />
            <span>Nearby Campus Locations (BFS Queue Traversal)</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div style={{ padding: '14px 20px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          {/* Origin Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>FROM ORIGIN:</span>
            <select
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary)'
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
                  backgroundColor: categoryFilter === cat.id ? 'var(--forest-800)' : 'var(--bg-surface)',
                  color: categoryFilter === cat.id ? '#FFFFFF' : 'var(--text-secondary)'
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
            <span>{showTrace ? 'Hide BFS Queue Trace' : 'Show BFS Queue Trace'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body">
          {/* BFS Exploration Trace Drawer */}
          {showTrace && (
            <div style={{ background: '#1B241E', color: '#DEE8E2', padding: '12px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', maxHeight: '180px', overflowY: 'auto' }}>
              <div style={{ fontWeight: 700, color: '#68D391', marginBottom: '6px' }}>
                &gt; BFS Queue Execution Trace (Root: {originId})
              </div>
              {nearbyData.trace.map((t, idx) => (
                <div key={idx} style={{ padding: '2px 0', borderBottom: '1px solid #2B3830' }}>
                  <span style={{ color: '#F6AD55' }}>[Step {t.step}]</span> {t.description}
                  {t.queueState && (
                    <span style={{ color: '#90CDF4', marginLeft: '8px' }}>
                      Queue: [{t.queueState.join(', ')}]
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Discovered Buildings Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
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
                      borderRadius: '8px',
                      padding: '12px',
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
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: catMeta.badgeBg,
                          color: catMeta.badgeText
                        }}
                      >
                        {b?.code}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'var(--forest-100)',
                          color: 'var(--forest-800)',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        Hop Level {item.hop}
                      </span>
                    </div>

                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      {b?.name}
                    </strong>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        🚶 ~{item.distance}m away
                      </span>
                      <button
                        className="header-btn"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
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
              <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No nearby locations matching the selected category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
