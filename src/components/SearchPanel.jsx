import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Search, MapPin, Check, BookOpen, Coffee, Laptop, Building, Trophy, Car } from 'lucide-react';

export function SearchPanel({
  buildings,
  startId,
  setStartId,
  destId,
  setDestId,
  onSwap,
  quickAccessList
}) {
  const [startQuery, setStartQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null); // 'start' | 'dest' | null

  const startRef = useRef(null);
  const destRef = useRef(null);

  // Sync input text with active IDs
  useEffect(() => {
    const s = buildings.find(b => b.id === startId);
    if (s) setStartQuery(s.name);
  }, [startId, buildings]);

  useEffect(() => {
    const d = buildings.find(b => b.id === destId);
    if (d) setDestQuery(d.name);
  }, [destId, buildings]);

  // Click outside listener to dismiss autocomplete dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startRef.current && !startRef.current.contains(event.target) &&
        destRef.current && !destRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter buildings for dropdown suggestions
  const filterBuildings = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return buildings;
    return buildings.filter(b => 
      b.name.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.departments.some(d => d.toLowerCase().includes(q))
    );
  };

  const startSuggestions = filterBuildings(startQuery);
  const destSuggestions = filterBuildings(destQuery);

  const handleSelectStart = (building) => {
    setStartId(building.id);
    setStartQuery(building.name);
    setActiveDropdown(null);
  };

  const handleSelectDest = (building) => {
    setDestId(building.id);
    setDestQuery(building.name);
    setActiveDropdown(null);
  };

  // Quick access icon resolver
  const getQuickIcon = (id) => {
    switch (id) {
      case 'library_lrc': return <BookOpen size={12} color="var(--apple-blue)" />;
      case 'canteen': return <Coffee size={12} color="var(--apple-orange)" />;
      case 'cs_it_labs': return <Laptop size={12} color="var(--apple-blue)" />;
      case 'admin_office': return <Building size={12} color="var(--apple-purple)" />;
      case 'seminar_hall': return <Trophy size={12} color="var(--apple-green)" />;
      case 'sports_ground': return <Trophy size={12} color="var(--apple-green)" />;
      default: return <MapPin size={12} />;
    }
  };

  return (
    <div className="search-form-card">
      <div className="section-label">
        <span>Plan Pedestrian Route</span>
        <button 
          type="button" 
          className="swap-endpoints-btn" 
          onClick={onSwap}
          title="Swap starting point and destination"
        >
          <ArrowUpDown size={11} />
          <span>Swap</span>
        </button>
      </div>

      {/* Start Input */}
      <div className="input-endpoint-group" ref={startRef}>
        <div className="endpoint-icon-pin start" title="Starting Point (A)">A</div>
        <div className="input-container">
          <input
            type="text"
            className="location-input-field"
            placeholder="Starting location (e.g. Main Gate)..."
            value={startQuery}
            onChange={(e) => {
              setStartQuery(e.target.value);
              setActiveDropdown('start');
            }}
            onFocus={() => setActiveDropdown('start')}
          />
          {activeDropdown === 'start' && (
            <div className="autocomplete-dropdown">
              {startSuggestions.map((b) => (
                <div
                  key={b.id}
                  className={`autocomplete-item ${b.id === startId ? 'active' : ''}`}
                  onClick={() => handleSelectStart(b)}
                >
                  <span className="autocomplete-item-name">{b.name}</span>
                  <span className="autocomplete-item-code">{b.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Destination Input */}
      <div className="input-endpoint-group" ref={destRef}>
        <div className="endpoint-icon-pin dest" title="Destination (B)">B</div>
        <div className="input-container">
          <input
            type="text"
            className="location-input-field"
            placeholder="Destination building (e.g. Kalam Library)..."
            value={destQuery}
            onChange={(e) => {
              setDestQuery(e.target.value);
              setActiveDropdown('dest');
            }}
            onFocus={() => setActiveDropdown('dest')}
          />
          {activeDropdown === 'dest' && (
            <div className="autocomplete-dropdown">
              {destSuggestions.map((b) => (
                <div
                  key={b.id}
                  className={`autocomplete-item ${b.id === destId ? 'active' : ''}`}
                  onClick={() => handleSelectDest(b)}
                >
                  <span className="autocomplete-item-name">{b.name}</span>
                  <span className="autocomplete-item-code">{b.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Pills */}
      <div className="quick-access-bar">
        <span className="section-label">Quick Waypoint Shortcuts</span>
        <div className="quick-pills-row">
          {quickAccessList.map((item) => (
            <button
              key={item.id}
              type="button"
              className="quick-pill"
              onClick={() => setDestId(item.id)}
            >
              {getQuickIcon(item.id)}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
