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
                padding: '2px 8px',
                borderRadius: '980px',
                backgroundColor: categoryMeta.badgeBg,
                color: categoryMeta.badgeText,
                fontWeight: 700
              }}
            >
              {building.code}
            </span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Close window">
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body">
          <p style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
            {building.description}
          </p>

          {/* Quick Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--bg-canvas)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>
                <Clock size={13} />
                <span>Operating Hours</span>
              </div>
              <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
                {building.hours}
              </strong>
            </div>

            <div style={{ background: 'var(--bg-canvas)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>
                <Layers size={13} />
                <span>Architecture</span>
              </div>
              <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
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
                      padding: '5px 10px',
                      background: 'var(--bg-subtle)',
                      borderRadius: '980px',
                      fontSize: '11.5px',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <CheckCircle2 size={12} color="var(--apple-green)" />
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
                      padding: '4px 9px',
                      background: 'var(--apple-blue-subtle)',
                      borderRadius: '980px',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--apple-blue)',
                      border: '1px solid var(--apple-blue-border)'
                    }}
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Navigation Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="header-btn primary"
              style={{ flex: 1, minWidth: '160px', justifyContent: 'center' }}
              onClick={() => {
                onSetStart(building.id);
                onClose();
              }}
            >
              <MapPin size={13} />
              <span>Navigate From (A)</span>
            </button>
            <button
              type="button"
              className="header-btn"
              style={{ flex: 1, minWidth: '160px', justifyContent: 'center', borderColor: 'rgba(255, 149, 0, 0.35)', color: 'var(--apple-orange)', backgroundColor: 'var(--apple-orange-subtle)' }}
              onClick={() => {
                onSetDest(building.id);
                onClose();
              }}
            >
              <Navigation size={13} />
              <span>Navigate To (B)</span>
            </button>
            <button
              type="button"
              className="header-btn"
              style={{ justifyContent: 'center' }}
              onClick={() => {
                onFindNearby(building.id);
                onClose();
              }}
              title="Find nearby facilities using Breadth-First Search"
            >
              <Compass size={13} />
              <span>Nearby (BFS)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
