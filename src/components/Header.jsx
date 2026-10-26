import React from 'react';
import { Compass, Cpu, Navigation, Sparkles, MapPin, Server, Activity, Sun, Moon, Layers } from 'lucide-react';

export function Header({
  onOpenDsaInspector,
  onOpenNearbyModal,
  backendMode,
  setBackendMode,
  cBackendStatus,
  onCheckCBackend,
  blockedCount,
  theme,
  onToggleTheme,
  isMobileDrawerCollapsed,
  onToggleMobileDrawer
}) {
  return (
    <header className="app-header">
      {/* Brand & Crest - Apple Squircle Icon */}
      <div className="brand-section">
        <div className="brand-logo-mark">
          <Compass size={20} strokeWidth={2.2} />
        </div>
        <div className="brand-text-block">
          <div className="brand-title">
            TCET Campus
            <span className="brand-badge">KANDIVALI EAST</span>
          </div>
          <div className="brand-subtext">
            Thakur College of Engineering & Technology • Graph DSA Wayfinding
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="header-actions">
        {/* Mobile Drawer Trigger (Routes / Plan) */}
        {onToggleMobileDrawer && (
          <button 
            type="button"
            className="mobile-drawer-toggle-btn"
            onClick={onToggleMobileDrawer}
            title={isMobileDrawerCollapsed ? 'Open Route Planner Drawer' : 'Hide Drawer'}
          >
            <Navigation size={13} style={{ transform: 'rotate(45deg)' }} />
            <span>{isMobileDrawerCollapsed ? 'Plan Route' : 'Map View'}</span>
          </button>
        )}

        {/* Roadblock active indicator */}
        {blockedCount > 0 && (
          <div className="header-warning-pill" title={`${blockedCount} active road obstruction(s)`}>
            <span>⚠️</span>
            <span>{blockedCount} {blockedCount === 1 ? 'roadblock' : 'roadblocks'}</span>
          </div>
        )}

        {/* Nearby explorer */}
        <button className="header-btn" onClick={onOpenNearbyModal} title="Explore nearby facilities via Breadth-First Search">
          <MapPin size={13} />
          <span>Nearby (BFS)</span>
        </button>

        {/* DSA Inspector / Lab */}
        <button className="header-btn primary" onClick={onOpenDsaInspector} title="Open DSA Laboratory, Graph & Hash Table Inspector">
          <Cpu size={13} />
          <span>DSA Inspector</span>
        </button>

        {/* Theme Toggle Button */}
        <button 
          className="header-btn theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun size={13} color="#FF9F0A" /> : <Moon size={13} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* C Backend Connectivity Status */}
        <button 
          className="backend-indicator" 
          onClick={onCheckCBackend}
          title="Click to check C Backend Server status on http://localhost:8080"
        >
          <span className={`status-dot ${cBackendStatus === 'online' ? 'online' : 'client'}`}></span>
          <span>
            {cBackendStatus === 'online' 
              ? 'C Backend: ONLINE (Port 8080)' 
              : 'Engine: Client DSA (JS/C Parity)'}
          </span>
        </button>
      </div>
    </header>
  );
}
