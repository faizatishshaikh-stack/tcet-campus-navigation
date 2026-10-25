import React from 'react';
import { Compass, Cpu, Navigation, Sparkles, MapPin, Server, Activity, Sun, Moon } from 'lucide-react';

export function Header({
  onOpenDsaInspector,
  onOpenNearbyModal,
  backendMode,
  setBackendMode,
  cBackendStatus,
  onCheckCBackend,
  blockedCount,
  theme,
  onToggleTheme
}) {
  return (
    <header className="app-header">
      {/* Brand & Crest */}
      <div className="brand-section">
        <div className="brand-logo-mark">
          <Compass size={22} strokeWidth={2.2} />
        </div>
        <div className="brand-text-block">
          <div className="brand-title">
            TCET Smart Campus Navigation
            <span className="brand-badge">KANDIVALI EAST</span>
          </div>
          <div className="brand-subtext">
            Thakur College of Engineering & Technology • Graph DSA Wayfinding
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="header-actions">
        {/* Theme Toggle Button */}
        <button 
          className="header-btn theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun size={14} color="#F6AD55" /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Roadblock active indicator */}
        {blockedCount > 0 && (
          <div className="backend-indicator" style={{ backgroundColor: 'rgba(217, 56, 41, 0.12)', borderColor: 'var(--route-blocked)', color: 'var(--route-blocked)' }}>
            <span>⚠️ {blockedCount} {blockedCount === 1 ? 'roadblock' : 'roadblocks'} active</span>
          </div>
        )}

        {/* Nearby explorer */}
        <button className="header-btn" onClick={onOpenNearbyModal}>
          <MapPin size={14} />
          <span>Explore Nearby (BFS)</span>
        </button>

        {/* DSA Inspector / Lab */}
        <button className="header-btn primary" onClick={onOpenDsaInspector}>
          <Cpu size={14} />
          <span>DSA Lab & Inspector</span>
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
