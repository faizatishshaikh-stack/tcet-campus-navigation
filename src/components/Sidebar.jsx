import React from 'react';
import { SearchPanel } from './SearchPanel';
import { 
  Play, Square, Footprints, AlertOctagon, 
  CornerDownRight, CheckCircle2, Clock, Flame, 
  MapPin, ShieldAlert, XCircle
} from 'lucide-react';

const QUICK_ACCESS_ITEMS = [
  { id: 'library_lrc', label: 'LRC Library' },
  { id: 'canteen', label: 'Canteen' },
  { id: 'cs_it_labs', label: 'AI & CS Labs' },
  { id: 'admin_office', label: 'Admin Office' },
  { id: 'seminar_hall', label: 'Auditorium' },
  { id: 'sports_ground', label: 'Sports Turf' }
];

export function Sidebar({
  buildings,
  pathways,
  startId,
  setStartId,
  destId,
  setDestId,
  onSwap,
  routes,
  activeRoute,
  activeRouteType,
  setActiveRouteType,
  directions,
  activeStepIndex,
  setActiveStepIndex,
  isSimulating,
  onToggleSimulation,
  blockedEdgeIds,
  onToggleBlockEdge,
  onClearAllRoadblocks,
  isBlockModeActive,
  setIsBlockModeActive
}) {
  const primaryRoute = routes?.primary;
  const altRoute = routes?.alternative;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-scroll-content">
        {/* 1. Origin & Destination Search Panel */}
        <SearchPanel
          buildings={buildings}
          startId={startId}
          setStartId={setStartId}
          destId={destId}
          setDestId={setDestId}
          onSwap={onSwap}
          quickAccessList={QUICK_ACCESS_ITEMS}
        />

        {/* 2. Roadblocks & Maintenance Controller */}
        <div className="roadblock-section">
          <div className="roadblock-header">
            <span className="roadblock-title">
              <ShieldAlert size={14} />
              <span>Campus Pathway Roadblocks</span>
            </span>
            <button
              className={`toggle-block-mode-btn ${isBlockModeActive ? 'active' : ''}`}
              onClick={() => setIsBlockModeActive(!isBlockModeActive)}
            >
              {isBlockModeActive ? 'Editing Paths...' : 'Mark Roadblock'}
            </button>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {isBlockModeActive
              ? 'Click any pathway on the map to block or unblock it for construction.'
              : 'Simulate path maintenance to test Dijkstra dynamic rerouting.'}
          </p>

          {blockedEdgeIds.size > 0 ? (
            <div className="blocked-paths-chips">
              {Array.from(blockedEdgeIds).map((edgeId) => {
                const edge = pathways.find(p => p.id === edgeId);
                return (
                  <span key={edgeId} className="blocked-path-badge">
                    <span>{edge?.name || edgeId}</span>
                    <span 
                      className="remove-block-x" 
                      onClick={() => onToggleBlockEdge(edgeId)}
                      title="Remove roadblock"
                    >
                      ×
                    </span>
                  </span>
                );
              })}
              <button
                type="button"
                onClick={onClearAllRoadblocks}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--route-blocked, #C5221F)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear all
              </button>
            </div>
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              All 24 walkways are clear and accessible.
            </span>
          )}
        </div>

        {/* 3. Route Calculation Summary & Tabs */}
        {activeRoute?.found ? (
          <div className="route-summary-card">
            {/* Primary vs Alternative Tabs */}
            {altRoute?.found && (
              <div className="route-header-tabs">
                <button
                  className={`route-tab-btn ${activeRouteType === 'primary' ? 'active primary' : ''}`}
                  onClick={() => setActiveRouteType('primary')}
                >
                  Primary Route ({primaryRoute.distance}m)
                </button>
                <button
                  className={`route-tab-btn ${activeRouteType === 'alternative' ? 'active alternative' : ''}`}
                  onClick={() => setActiveRouteType('alternative')}
                >
                  Alternative Route ({altRoute.distance}m)
                </button>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="route-metrics-grid">
              <div className="metric-tile">
                <span className="metric-value">{activeRoute.distance}m</span>
                <span className="metric-label">Total Distance</span>
              </div>
              <div className="metric-tile">
                <span className="metric-value">{activeRoute.estimatedMinutes} min</span>
                <span className="metric-label">Walking Time</span>
              </div>
              <div className="metric-tile">
                <span className="metric-value">{activeRoute.estimatedCalories || 18} kcal</span>
                <span className="metric-label">Est. Calories</span>
              </div>
            </div>

            {/* Simulation Button */}
            <div className="sim-controls-row">
              <button
                className={`sim-btn ${isSimulating ? 'running' : ''}`}
                onClick={onToggleSimulation}
              >
                {isSimulating ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
                <span>{isSimulating ? 'Stop Walk Simulation' : 'Simulate Walking Route'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="route-summary-card" style={{ borderColor: 'var(--border-medium)', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--route-blocked, #E53E3E)' }}>
              <AlertOctagon size={16} />
              <strong style={{ fontSize: '12px' }}>Destination Unreachable</strong>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Active roadblocks have disconnected all possible pedestrian routes to the destination.
              Try removing some roadblocks above.
            </p>
          </div>
        )}

        {/* 4. Step-by-Step Directions */}
        {directions.length > 0 && (
          <div className="directions-card">
            <div className="directions-header">
              <span>Step-by-Step Wayfinding</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {directions.length} Segments
              </span>
            </div>
            <div className="directions-steps-list">
              {directions.map((step, idx) => (
                <div
                  key={idx}
                  className={`direction-step-row ${activeStepIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveStepIndex(idx)}
                >
                  <div className="step-seq-number">{step.stepNumber}</div>
                  <div className="step-content">
                    <span className="step-instruction">{step.instruction}</span>
                    <span className="step-subtext">{step.subtext}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
