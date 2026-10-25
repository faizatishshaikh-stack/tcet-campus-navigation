import React from 'react';
import { 
  X, MapPin, Clock, Layers, CheckCircle2, 
  Building, Navigation, Compass, ArrowRight 
} from 'lucide-react';
import { CATEGORY_METADATA } from '../data/campusData';

export function LocationModal({
  building,
  onClose,
  onSetStart,
  onSetDest,
  onFindNearby
}) {
  if (!building) return null;

  const categoryMeta = CATEGORY_METADATA[building.category] || CATEGORY_METADATA.academic;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span 
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: categoryMeta.color
              }}
            />
            <span>{building.name}</span>
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: categoryMeta.badgeBg,
                color: categoryMeta.badgeText,
                fontWeight: 700
              }}
            >
              {building.code}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body">
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
            {building.description}
          </p>

          {/* Quick Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--bg-canvas)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>
                <Clock size={13} />
                <span>Operating Hours</span>
              </div>
              <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                {building.hours}
              </strong>
            </div>

            <div style={{ background: 'var(--bg-canvas)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>
                <Layers size={13} />
                <span>Architecture</span>
              </div>
              <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                {building.floors} • {building.categoryLabel}
              </strong>
            </div>
          </div>

          {/* Facilities */}
          {building.facilities && building.facilities.length > 0 && (
            <div>
              <span className="section-label" style={{ marginBottom: '8px' }}>
                Available Facilities & Accessibility
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {building.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 8px',
                      background: 'var(--bg-subtle)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <CheckCircle2 size={12} color="#2E8B57" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          {building.departments && building.departments.length > 0 && (
            <div>
              <span className="section-label" style={{ marginBottom: '8px' }}>
                Departments & Administrative Cells
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {building.departments.map((dept, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '3px 7px',
                      background: 'var(--forest-50)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--forest-800)',
                      border: '1px solid var(--forest-100)'
                    }}
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Navigation Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
            <button
              className="header-btn primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => {
                onSetStart(building.id);
                onClose();
              }}
            >
              <MapPin size={13} />
              <span>Navigate From Here (A)</span>
            </button>
            <button
              className="header-btn"
              style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--orange-600)', color: 'var(--orange-800)', backgroundColor: 'var(--orange-50)' }}
              onClick={() => {
                onSetDest(building.id);
                onClose();
              }}
            >
              <Navigation size={13} />
              <span>Navigate To Here (B)</span>
            </button>
            <button
              className="header-btn"
              style={{ justifyContent: 'center' }}
              onClick={() => {
                onFindNearby(building.id);
                onClose();
              }}
              title="Find nearby facilities using Breadth-First Search"
            >
              <Compass size={13} />
              <span>Explore Nearby (BFS)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
