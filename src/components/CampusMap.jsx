import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, 
  Compass, Eye, EyeOff, Locate, Layers, Info, 
  X, CheckCircle2, AlertTriangle, ShieldCheck, 
  Navigation, Footprints, Coffee, Trophy, BookOpen, 
  Cpu, Wrench, Building2, MapPin
} from 'lucide-react';
import { CATEGORY_METADATA, TCET_CAMPUS_GEO } from '../data/campusData';

export function CampusMap({
  buildings,
  pathways,
  graph,
  startId,
  destId,
  onSelectBuilding,
  activeRoute,
  alternativeRoute,
  activeRouteType,
  blockedEdgeIds,
  onToggleBlockEdge,
  isBlockModeActive,
  isSimulating,
  simulatedProgress,
  activeStepIndex,
  directions,
  theme = 'light',
  disableWheelZoom = false,
  isPreview = false
}) {
  const svgRef = useRef(null);
  const isDark = theme === 'dark';

  // Masterplan ViewBox default (Optimal framing for TCET campus bounds)
  const defaultViewBox = useMemo(() => ({ x: 50, y: 110, width: 1080, height: 600 }), []);
  const [viewBox, setViewBox] = useState(defaultViewBox);

  // Mouse & Touch Pan/Zoom state
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [pinchDist, setPinchDist] = useState(0);

  // Map layer toggles
  const [showDistances, setShowDistances] = useState(true);
  const [showLandscaping, setShowLandscaping] = useState(true);
  const [hoveredBuildingId, setHoveredBuildingId] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Reset View
  const handleResetView = useCallback(() => {
    setViewBox(defaultViewBox);
  }, [defaultViewBox]);

  // Zoom In / Out with bounds protection
  const handleZoom = useCallback((factor) => {
    setViewBox((prev) => {
      const newWidth = Math.max(340, Math.min(1350, prev.width * factor));
      const newHeight = Math.max(220, Math.min(850, prev.height * factor));
      const dx = (prev.width - newWidth) / 2;
      const dy = (prev.height - newHeight) / 2;
      return {
        x: Math.max(-100, Math.min(750, prev.x + dx)),
        y: Math.max(-50, Math.min(550, prev.y + dy)),
        width: newWidth,
        height: newHeight
      };
    });
  }, []);

  // Lookup building coordinates map
  const buildingCoordMap = useMemo(() => {
    const map = new Map();
    for (const b of buildings) {
      map.set(b.id, { x: b.x, y: b.y, building: b });
    }
    return map;
  }, [buildings]);

  // Focus Camera on Active Route
  const handleFocusRoute = useCallback(() => {
    if (!activeRoute?.path || activeRoute.path.length < 2) {
      handleResetView();
      return;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const id of activeRoute.path) {
      const pt = buildingCoordMap.get(id);
      if (pt) {
        minX = Math.min(minX, pt.x);
        maxX = Math.max(maxX, pt.x);
        minY = Math.min(minY, pt.y);
        maxY = Math.max(maxY, pt.y);
      }
    }

    if (minX === Infinity) return;

    // Add comfortable padding around the route
    const paddingX = 140;
    const paddingY = 120;
    const routeWidth = Math.max(380, (maxX - minX) + paddingX * 2);
    const routeHeight = Math.max(260, (maxY - minY) + paddingY * 2);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setViewBox({
      x: centerX - routeWidth / 2,
      y: centerY - routeHeight / 2,
      width: routeWidth,
      height: routeHeight
    });
  }, [activeRoute, buildingCoordMap, handleResetView]);

  // Mouse Pan Handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.interactive-path') || e.target.closest('.interactive-building')) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isPanning || !svgRef.current) return;
    const dx = (e.clientX - startPan.x) * (viewBox.width / svgRef.current.clientWidth);
    const dy = (e.clientY - startPan.y) * (viewBox.height / svgRef.current.clientHeight);
    setViewBox((prev) => ({
      ...prev,
      x: Math.max(-150, Math.min(750, prev.x - dx)),
      y: Math.max(-80, Math.min(550, prev.y - dy))
    }));
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    if (disableWheelZoom) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 0.92 : 1.08;
    handleZoom(factor);
  };

  // Touch Handlers for Mobile & Tablet (Pan & Pinch-to-Zoom)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      if (e.target.closest('.interactive-path') || e.target.closest('.interactive-building')) {
        return;
      }
      setIsPanning(true);
      setStartPan({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchDist(dist);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isPanning && svgRef.current) {
      const dx = (e.touches[0].clientX - startPan.x) * (viewBox.width / svgRef.current.clientWidth);
      const dy = (e.touches[0].clientY - startPan.y) * (viewBox.height / svgRef.current.clientHeight);
      setViewBox((prev) => ({
        ...prev,
        x: Math.max(-150, Math.min(750, prev.x - dx)),
        y: Math.max(-80, Math.min(550, prev.y - dy))
      }));
      setStartPan({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2 && pinchDist > 0) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = pinchDist / currentDist;
      if (Math.abs(factor - 1) > 0.02) {
        handleZoom(factor);
        setPinchDist(currentDist);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setPinchDist(0);
  };

  // Generate SVG polyline path string for a route
  const getRouteSvgPath = (route) => {
    if (!route || !route.path || route.path.length < 2) return '';
    return route.path
      .map((id, idx) => {
        const pt = buildingCoordMap.get(id);
        if (!pt) return '';
        return `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
      })
      .join(' ');
  };

  const primarySvgPath = useMemo(() => getRouteSvgPath(activeRoute), [activeRoute, buildingCoordMap]);
  const alternativeSvgPath = useMemo(() => getRouteSvgPath(alternativeRoute), [alternativeRoute, buildingCoordMap]);

  // Compute pedestrian animated pin position along active route
  const simulationPoint = useMemo(() => {
    if (!isSimulating || !activeRoute?.path || activeRoute.path.length < 2) return null;
    const totalSegments = activeRoute.path.length - 1;
    const segmentProgress = simulatedProgress * totalSegments;
    const segmentIndex = Math.min(totalSegments - 1, Math.floor(segmentProgress));
    const subProgress = segmentProgress - segmentIndex;

    const fromId = activeRoute.path[segmentIndex];
    const toId = activeRoute.path[segmentIndex + 1];
    const p1 = buildingCoordMap.get(fromId);
    const p2 = buildingCoordMap.get(toId);

    if (!p1 || !p2) return null;

    // Angle of walking travel for the avatar puck
    const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angleDeg = (angleRad * 180) / Math.PI;

    return {
      x: p1.x + (p2.x - p1.x) * subProgress,
      y: p1.y + (p2.y - p1.y) * subProgress,
      angle: angleDeg
    };
  }, [isSimulating, activeRoute, simulatedProgress, buildingCoordMap]);

  // Currently hovered building object for tooltip
  const hoveredBuilding = useMemo(() => {
    if (!hoveredBuildingId) return null;
    return buildings.find(b => b.id === hoveredBuildingId) || null;
  }, [hoveredBuildingId, buildings]);

  return (
    <div className="map-canvas-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      
      {/* 1. Top Verified Campus Coordinates Badge */}
      {!isPreview && (
        <div 
          className="map-compass-badge" 
          onClick={() => setIsInfoModalOpen(true)}
          style={{ cursor: 'pointer' }}
          title="Click to view verified TCET campus layout details"
        >
          <Compass size={14} className="text-apple-blue" />
          <span>TCET CAMPUS • 19.2059° N, 72.8746° E</span>
          <span style={{ 
            fontSize: '9.5px', 
            padding: '1px 6px', 
            borderRadius: '980px', 
            backgroundColor: isDark ? 'rgba(52, 199, 89, 0.2)' : '#EDF9F0', 
            color: '#34C759',
            fontWeight: 700 
          }}>
            VERIFIED 2D
          </span>
          <Info size={12} style={{ opacity: 0.7, marginLeft: '2px' }} />
        </div>
      )}

      {/* 2. Floating Zoom & Control Stack (Apple Maps Style) */}
      {!isPreview && (
        <div className="map-floating-controls">
          <button 
            type="button"
            className="map-control-btn" 
            onClick={() => handleZoom(0.85)} 
            title="Zoom In (+)"
          >
            <ZoomIn size={16} />
          </button>
          <button 
            type="button"
            className="map-control-btn" 
            onClick={() => handleZoom(1.18)} 
            title="Zoom Out (−)"
          >
            <ZoomOut size={16} />
          </button>
          {activeRoute?.path && activeRoute.path.length >= 2 && (
            <button 
              type="button"
              className="map-control-btn" 
              onClick={handleFocusRoute} 
              title="Fit Calculated Route to View"
              style={{ color: '#007AFF' }}
            >
              <Locate size={16} />
            </button>
          )}
          <button 
            type="button"
            className="map-control-btn" 
            onClick={handleResetView} 
            title="Reset Campus View"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            type="button"
            className="map-control-btn" 
            onClick={() => setShowDistances(!showDistances)} 
            title={showDistances ? "Hide Walkway Distances" : "Show Walkway Distances"}
            style={{ color: showDistances ? 'var(--text-primary)' : 'var(--text-muted)' }}
          >
            {showDistances ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button 
            type="button"
            className="map-control-btn" 
            onClick={() => setShowLandscaping(!showLandscaping)} 
            title={showLandscaping ? "Hide Foliage & Terrain" : "Show Foliage & Terrain"}
            style={{ color: showLandscaping ? '#34C759' : 'var(--text-muted)' }}
          >
            <Layers size={16} />
          </button>
        </div>
      )}

      {/* 3. Bottom Legend Banner */}
      {!isPreview && (
        <div className="map-legend-banner">
          <div className="legend-item">
            <div className="legend-swatch primary-route"></div>
            <span>Shortest Path (Dijkstra)</span>
          </div>
          {alternativeRoute?.found && (
            <div className="legend-item">
              <div className="legend-swatch alt-route"></div>
              <span>Alternative Walkway</span>
            </div>
          )}
          <div className="legend-item">
            <div className="legend-swatch blocked-route"></div>
            <span>Blocked Pathway</span>
          </div>
          {isBlockModeActive && (
            <div className="legend-item" style={{ color: isDark ? '#FF9F0A' : '#D96B27', fontWeight: 700 }}>
              <span>⚠️ Roadblock Tool Active (Click walkway to toggle)</span>
            </div>
          )}
        </div>
      )}

      {/* 4. Desktop Hover Tooltip Micro-Card */}
      {hoveredBuilding && !isPreview && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          pointerEvents: 'none',
          backgroundColor: isDark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '8px 12px',
          boxShadow: 'var(--shadow-md)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          maxWidth: '280px',
          animation: 'appleFadeIn 0.15s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: CATEGORY_METADATA[hoveredBuilding.category]?.color || '#007AFF' 
            }} />
            <strong style={{ fontSize: '12px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {hoveredBuilding.name}
            </strong>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
            <span>{hoveredBuilding.floors}</span>
            <span>•</span>
            <span style={{ color: 'var(--apple-blue)', fontWeight: 600 }}>{hoveredBuilding.code}</span>
          </div>
        </div>
      )}

      {/* 5. Main SVG Vector Canvas */}
      <svg
        ref={svgRef}
        className="campus-svg-viewport"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <defs>
          {/* Subtle Apple Maps Topographic Grid */}
          <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke={isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.03)'} 
              strokeWidth="0.6" 
            />
          </pattern>

          {/* Construction Roadblock Hazard Pattern */}
          <pattern id="hazard-stripe" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#FF3B30" strokeWidth="5" />
            <line x1="6" y1="0" x2="6" y2="12" stroke={isDark ? '#1C1C1E' : '#FFFFFF'} strokeWidth="5" />
          </pattern>

          {/* Apple Diffused Card Shadows */}
          <filter id="building-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow 
              dx="0" 
              dy="3" 
              stdDeviation="3.5" 
              floodColor={isDark ? '#000000' : 'rgba(0, 0, 0, 0.12)'} 
              floodOpacity="0.8" 
            />
          </filter>

          <filter id="tree-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.15)" />
          </filter>

          {/* Active Navigation Glow */}
          <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isDark ? 5 : 3.5} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* =========================================================================
            LAYER 1: BASE TERRAIN & GROUND PLANE
            ========================================================================= */}
        <rect x="-300" y="-300" width="1800" height="1400" fill={isDark ? '#121214' : '#F6F6F8'} />
        <rect x="-300" y="-300" width="1800" height="1400" fill="url(#campus-grid)" />

        {/* =========================================================================
            LAYER 2: WESTERN MUNICIPAL ROAD (SHYAMNARAYAN THAKUR MARG)
            ========================================================================= */}
        {/* Road Surface */}
        <rect 
          x="62" 
          y="60" 
          width="64" 
          height="680" 
          rx="6" 
          fill={isDark ? '#18181C' : '#E8E8EE'} 
          stroke={isDark ? '#2C2C30' : '#DCDCE2'} 
          strokeWidth="1.5" 
        />
        {/* Road Center Median Dashed Line */}
        <line 
          x1="94" 
          y1="70" 
          x2="94" 
          y2="730" 
          stroke={isDark ? '#3A3A40' : '#C7C7CC'} 
          strokeWidth="2" 
          strokeDasharray="14 10" 
        />
        {/* Pedestrian Sidewalk Curb along Western Campus Boundary */}
        <rect 
          x="126" 
          y="70" 
          width="16" 
          height="660" 
          fill={isDark ? '#1C1C20' : '#EDEDF2'} 
          stroke={isDark ? '#28282C' : '#DFDFE5'} 
          strokeWidth="1" 
        />
        {/* Zebra Crossing at Gate No. 5 Main Entrance */}
        <g opacity="0.8">
          {[372, 380, 388, 396, 404].map((yVal, i) => (
            <line 
              key={`zebra-${i}`} 
              x1="66" 
              y1={yVal} 
              x2="122" 
              y2={yVal} 
              stroke="#FFFFFF" 
              strokeWidth="4" 
            />
          ))}
        </g>
        {/* Road Name Typography */}
        <text 
          x="88" 
          y="420" 
          transform="rotate(-90 88 420)" 
          fontSize="9.5" 
          fontWeight="700" 
          fill={isDark ? '#8E8E93' : '#8E8E93'} 
          letterSpacing="0.09em" 
          fontFamily="var(--font-sans)"
        >
          SHYAMNARAYAN THAKUR MARG (THAKUR VILLAGE ROAD)
        </text>

        {/* Bus Stop / Auto-Rickshaw Shelter */}
        <g transform="translate(130, 330)">
          <rect x="0" y="0" width="10" height="28" rx="2" fill={isDark ? '#2C2C2E' : '#C7C7CC'} />
          <text x="5" y="18" transform="rotate(-90 5 18)" fontSize="6" fontWeight="800" fill="#FFFFFF" textAnchor="middle">
            BUS
          </text>
        </g>

        {/* =========================================================================
            LAYER 3: CAMPUS PERIMETER BOUNDARY WALL & GATE ARCHWAYS
            ========================================================================= */}
        {/* Outer Perimeter Wall with Breaks for Gate 5 and Gate 4 */}
        <rect 
          x="142" 
          y="130" 
          width="970" 
          height="610" 
          rx="14" 
          fill={isDark ? '#161619' : '#FAF9F6'} 
          stroke={isDark ? '#2C2C30' : '#E2E0D8'} 
          strokeWidth="1.8" 
          strokeDasharray="8 4" 
        />

        {/* Gate No. 5 Architectural Pillars */}
        <g transform="translate(142, 360)">
          <rect x="-4" y="0" width="8" height="14" rx="2" fill={isDark ? '#007AFF' : '#007AFF'} />
          <rect x="-4" y="46" width="8" height="14" rx="2" fill={isDark ? '#007AFF' : '#007AFF'} />
          <line x1="0" y1="14" x2="0" y2="46" stroke="#FF9500" strokeWidth="2" strokeDasharray="3 3" />
        </g>

        {/* Gate No. 4 East Access Pillars */}
        <g transform="translate(1112, 535)">
          <rect x="-4" y="0" width="8" height="12" rx="2" fill={isDark ? '#5AC8FA' : '#5AC8FA'} />
          <rect x="-4" y="38" width="8" height="12" rx="2" fill={isDark ? '#5AC8FA' : '#5AC8FA'} />
          <line x1="0" y1="12" x2="0" y2="38" stroke="#5AC8FA" strokeWidth="2" strokeDasharray="3 3" />
        </g>

        {/* =========================================================================
            LAYER 4: ARCHITECTURAL LANDSCAPING, COURTYARD & SPORTS ARENA
            ========================================================================= */}
        {showLandscaping && (
          <g className="campus-landscaping">
            {/* 1. Manicured Green Lawns */}
            <rect 
              x="160" 
              y="150" 
              width="180" 
              height="60" 
              rx="12" 
              fill={isDark ? '#142618' : '#E6F3E6'} 
              stroke={isDark ? '#1E3823' : '#D1E6D2'} 
              strokeWidth="1" 
            />
            <rect 
              x="160" 
              y="620" 
              width="170" 
              height="70" 
              rx="12" 
              fill={isDark ? '#142618' : '#E6F3E6'} 
              stroke={isDark ? '#1E3823' : '#D1E6D2'} 
              strokeWidth="1" 
            />

            {/* 2. A-Block Master Architectural Envelope (7-Storey Engineering Core) */}
            <g className="a-block-complex-envelope">
              {/* Main Structural Boundary Outline */}
              <rect 
                x="355" 
                y="180" 
                width="325" 
                height="450" 
                rx="14" 
                fill={isDark ? '#1C1C22' : '#ECECF0'} 
                stroke={isDark ? '#323238' : '#D8D8DF'} 
                strokeWidth="2" 
              />
              
              {/* Central Light Well / Skylight Atrium */}
              <rect 
                x="490" 
                y="330" 
                width="40" 
                height="120" 
                rx="6" 
                fill={isDark ? '#16161A' : '#E2E2E8'} 
                stroke={isDark ? '#2C2C32' : '#D0D0D8'} 
                strokeWidth="1" 
                strokeDasharray="4 3" 
              />

              {/* Entrance Portico Columns (Gate 5 Concourse) */}
              <rect 
                x="320" 
                y="370" 
                width="35" 
                height="40" 
                rx="6" 
                fill={isDark ? '#24242A' : '#F0F0F5'} 
                stroke={isDark ? '#3A3A42' : '#D0D0D8'} 
                strokeWidth="1.2" 
              />
              <circle cx="328" cy="376" r="3" fill="#007AFF" />
              <circle cx="328" cy="404" r="3" fill="#007AFF" />

              {/* Rooftop Solar PV Arrays Detailing */}
              <g opacity="0.6">
                {[195, 205, 215].map((yPos, idx) => (
                  <line 
                    key={`solar-${idx}`} 
                    x1="375" 
                    y1={yPos} 
                    x2="655" 
                    y2={yPos} 
                    stroke={isDark ? '#007AFF' : '#007AFF'} 
                    strokeWidth="0.8" 
                    strokeDasharray="8 4" 
                  />
                ))}
              </g>

              {/* A-Block Architectural Title */}
              <text 
                x="517" 
                y="198" 
                textAnchor="middle" 
                fontSize="10" 
                fontWeight="800" 
                fill={isDark ? '#A1A1A6' : '#6E6E73'} 
                letterSpacing="0.08em" 
                fontFamily="var(--font-sans)"
              >
                TCET A-BLOCK • 7-STOREY ENGINEERING COMPLEX
              </text>
            </g>

            {/* 3. Central Courtyard & Amphitheatre (Zephyr & Cultural Fest Plaza) */}
            <g className="central-amphitheatre-plaza">
              {/* Outer Plaza Pavers */}
              <circle 
                cx="740" 
                cy="390" 
                r="72" 
                fill={isDark ? '#1A1A1E' : '#E8E8ED'} 
                stroke={isDark ? '#2C2C32' : '#DCDCE2'} 
                strokeWidth="1.5" 
              />
              {/* Stepped Granite Amphitheatre Seating Tiers */}
              <circle cx="740" cy="390" r="54" fill={isDark ? '#18181C' : '#DFDFE5'} stroke={isDark ? '#26262B' : '#D1D1D8'} strokeWidth="1" />
              <circle cx="740" cy="390" r="38" fill={isDark ? '#161619' : '#D6D6DD'} stroke={isDark ? '#222226' : '#C7C7CF'} strokeWidth="1" />
              <circle cx="740" cy="390" r="22" fill={isDark ? '#141416' : '#CECED6'} stroke={isDark ? '#1E1E22' : '#BEBEC7'} strokeWidth="1" />
              {/* Central Cultural Fest Performance Stage */}
              <rect x="730" y="380" width="20" height="20" rx="3" fill={isDark ? '#007AFF' : '#007AFF'} opacity="0.85" />
              <text x="740" y="393" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#FFFFFF">STAGE</text>
            </g>

            {/* 4. Central Canteen Dining Terrace & Pergola */}
            <g className="canteen-terrace-zone" transform="translate(740, 195)">
              <rect x="-65" y="0" width="130" height="22" rx="4" fill={isDark ? '#221C16' : '#FFF3E0'} stroke={isDark ? '#3D2D1B' : '#FFE0B2'} strokeWidth="1" />
              <text x="0" y="14" textAnchor="middle" fontSize="8" fontWeight="700" fill={isDark ? '#FF9500' : '#E65100'}>
                OUTDOOR CANTEEN TERRACE
              </text>
            </g>

            {/* 5. Thakur Sports Ground & Arena (3.5 Acres) - Apple Maps Precision */}
            <g className="thakur-sports-arena">
              {/* Outer Sports Ground Complex Boundary */}
              <rect 
                x="880" 
                y="190" 
                width="170" 
                height="330" 
                rx="20" 
                fill={isDark ? '#112215' : '#D8EED8'} 
                stroke={isDark ? '#1B3820' : '#C2E2C2'} 
                strokeWidth="2" 
              />

              {/* 4-Lane 400m Athletic Running Track (Terracotta / Red Clay) */}
              <rect 
                x="892" 
                y="204" 
                width="146" 
                height="302" 
                rx="16" 
                fill={isDark ? '#261B16' : '#EAD5C7'} 
                stroke={isDark ? '#3E2A22' : '#D7BAA6'} 
                strokeWidth="1.5" 
              />
              <rect 
                x="898" 
                y="210" 
                width="134" 
                height="290" 
                rx="13" 
                fill="none" 
                stroke={isDark ? '#3E2A22' : '#F5EAE1'} 
                strokeWidth="1" 
                strokeDasharray="5 3" 
              />

              {/* Inner Synthetic Football Turf (High-Contrast Vibrant Pitch) */}
              <rect 
                x="904" 
                y="216" 
                width="122" 
                height="278" 
                rx="10" 
                fill={isDark ? '#122D18' : '#CEECCF'} 
                stroke={isDark ? '#1F4D28' : '#A9DCA9'} 
                strokeWidth="1.5" 
              />
              {/* Pitch Midfield Line & Circle */}
              <line x1="904" y1="355" x2="1026" y2="355" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.2" />
              <circle cx="965" cy="355" r="22" fill="none" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.2" />
              <circle cx="965" cy="355" r="2.5" fill="#FFFFFF" />

              {/* North & South Penalty Boxes */}
              <rect x="940" y="216" width="50" height="24" fill="none" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1" />
              <rect x="940" y="470" width="50" height="24" fill="none" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1" />

              {/* Central Cricket Pitch (Clay Wicket) */}
              <rect 
                x="957" 
                y="320" 
                width="16" 
                height="70" 
                rx="2" 
                fill={isDark ? '#362B1D' : '#DFD1B5'} 
                stroke={isDark ? '#4F3F2A' : '#CCA87B'} 
                strokeWidth="1.2" 
              />
              {/* Batting & Bowling Creases */}
              <line x1="954" y1="326" x2="976" y2="326" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="954" y1="384" x2="976" y2="384" stroke="#FFFFFF" strokeWidth="1" />

              {/* Sports Arena Typography */}
              <text 
                x="965" 
                y="255" 
                textAnchor="middle" 
                fontSize="9" 
                fontWeight="800" 
                fill={isDark ? '#5EE87E' : '#2D7538'} 
                fontFamily="var(--font-mono)"
                letterSpacing="0.05em"
              >
                THAKUR SPORTS TURF
              </text>
              <text 
                x="965" 
                y="268" 
                textAnchor="middle" 
                fontSize="8" 
                fontWeight="600" 
                fill={isDark ? '#7BB887' : '#4C8A57'}
              >
                3.5 ACRE ARENA • CRICKET & FOOTBALL
              </text>
            </g>

            {/* 6. Realistic Top-Down Architectural Trees & Foliage */}
            <g className="campus-trees" filter="url(#tree-shadow)">
              {/* Avenue Street Trees along Shyamnarayan Thakur Marg */}
              {[120, 180, 250, 310, 470, 540, 610, 670].map((yPos, i) => (
                <g key={`tree-ave-${i}`} transform={`translate(134, ${yPos})`}>
                  <circle cx="0" cy="0" r="9" fill={isDark ? '#1C4022' : '#4E9E57'} />
                  <circle cx="-2" cy="-2" r="6" fill={isDark ? '#26542D' : '#64B86D'} />
                  <circle cx="0" cy="0" r="1.5" fill={isDark ? '#102614' : '#2C5E33'} />
                </g>
              ))}

              {/* Courtyard Plaza Shade Trees */}
              {[
                { x: 670, y: 330 }, { x: 670, y: 450 },
                { x: 810, y: 330 }, { x: 810, y: 450 },
                { x: 740, y: 300 }, { x: 740, y: 480 }
              ].map((pos, i) => (
                <g key={`tree-court-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="11" fill={isDark ? '#173D1E' : '#489451'} />
                  <circle cx="-2" cy="-2" r="8" fill={isDark ? '#23522A' : '#5EB067'} />
                  <circle cx="0" cy="0" r="2" fill={isDark ? '#0F2613' : '#28542E'} />
                </g>
              ))}

              {/* Sports Arena Perimeter Trees */}
              {[
                { x: 870, y: 220 }, { x: 870, y: 310 }, { x: 870, y: 400 }, { x: 870, y: 490 },
                { x: 1060, y: 220 }, { x: 1060, y: 310 }, { x: 1060, y: 400 }, { x: 1060, y: 490 }
              ].map((pos, i) => (
                <g key={`tree-sports-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="10" fill={isDark ? '#1A4020' : '#4B9954'} />
                  <circle cx="-2" cy="-2" r="7" fill={isDark ? '#27572E' : '#61B56A'} />
                </g>
              ))}
            </g>
          </g>
        )}

        {/* =========================================================================
            LAYER 5: BASE PEDESTRIAN PATHWAYS (CALIBRATED CAMPUS WALKWAYS)
            ========================================================================= */}
        <g className="pathways-layer">
          {pathways.map((edge) => {
            const p1 = buildingCoordMap.get(edge.from);
            const p2 = buildingCoordMap.get(edge.to);
            if (!p1 || !p2) return null;

            const isBlocked = blockedEdgeIds.has(edge.id);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g 
                key={edge.id} 
                className="interactive-path"
                onClick={() => onToggleBlockEdge(edge.id)}
                style={{ cursor: isBlockModeActive ? 'pointer' : 'default' }}
              >
                {/* Clickable hit area */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="transparent"
                  strokeWidth="24"
                />

                {/* Base Walkway Paver Bed */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isBlocked ? '#FF3B30' : (isDark ? '#2A2A2E' : '#DFDFE5')}
                  strokeWidth={isBlocked ? 4.5 : 5.5}
                  strokeDasharray={isBlocked ? '6 4' : 'none'}
                  strokeLinecap="round"
                />

                {/* Walkway Center Guideline */}
                {!isBlocked && (
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isDark ? '#38383D' : '#FFFFFF'}
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    strokeOpacity="0.9"
                  />
                )}

                {/* Roadblock Hazard Indicator */}
                {isBlocked && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect 
                      x="-26" 
                      y="-11" 
                      width="52" 
                      height="22" 
                      rx="6" 
                      fill="#FF3B30" 
                      stroke="#FFFFFF" 
                      strokeWidth="1.8" 
                      filter="url(#building-shadow)"
                    />
                    <text 
                      x="0" 
                      y="4" 
                      textAnchor="middle" 
                      fontSize="9" 
                      fontWeight="800" 
                      fill="#FFFFFF" 
                      fontFamily="var(--font-sans)"
                      letterSpacing="0.04em"
                    >
                      BLOCKED
                    </text>
                  </g>
                )}

                {/* Distance Badge */}
                {!isBlocked && showDistances && !isPreview && (
                  <g transform={`translate(${midX}, ${midY})`} className="distance-badge-group">
                    <rect
                      x="-20"
                      y="-9"
                      width="40"
                      height="18"
                      rx="5"
                      fill={isDark ? '#1C1C1E' : '#FFFFFF'}
                      stroke={isDark ? '#3A3A3C' : '#D1D1D6'}
                      strokeWidth="0.8"
                      opacity="0.96"
                      filter="url(#building-shadow)"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                      fill={isDark ? '#AEAEB2' : '#48484A'}
                    >
                      {edge.distance}m
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* =========================================================================
            LAYER 6: ALTERNATIVE ROUTE (APPLE MAPS CYAN / AMBER DASHED)
            ========================================================================= */}
        {alternativeSvgPath && activeRouteType !== 'alternative' && (
          <g className="route-alternative-layer">
            <path
              d={alternativeSvgPath}
              fill="none"
              stroke={isDark ? '#FF9F0A' : '#5AC8FA'}
              strokeWidth="5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.92"
            />
          </g>
        )}

        {/* =========================================================================
            LAYER 7: ACTIVE PRIMARY ROUTE (SIGNATURE APPLE MAPS NAVIGATION BLUE)
            ========================================================================= */}
        {primarySvgPath && (
          <g className="route-primary-layer">
            {/* Ambient Diffused Glow Underlay */}
            <path
              d={primarySvgPath}
              fill="none"
              stroke={isDark ? 'rgba(10, 132, 255, 0.45)' : 'rgba(0, 122, 255, 0.28)'}
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* High-Contrast Core Route Line */}
            <path
              d={primarySvgPath}
              fill="none"
              stroke={
                activeRouteType === 'alternative' 
                  ? (isDark ? '#FF9F0A' : '#FF9500') 
                  : (isDark ? '#0A84FF' : '#007AFF')
              }
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Directional Dash Animation Advancing in Walking Flow */}
            <path
              d={primarySvgPath}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeDasharray="6 12"
              strokeLinecap="round"
              opacity="0.9"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="36"
                to="0"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        )}

        {/* =========================================================================
            LAYER 8: BUILDINGS & CAMPUS LANDMARK CARDS
            ========================================================================= */}
        <g className="buildings-layer">
          {buildings.map((b) => {
            const isStart = b.id === startId;
            const isDest = b.id === destId;
            const isWayPoint = activeRoute?.path?.includes(b.id);
            const categoryMeta = CATEGORY_METADATA[b.category] || CATEGORY_METADATA.academic;

            const halfW = b.width / 2;
            const halfH = b.height / 2;

            return (
              <g
                key={b.id}
                className="interactive-building"
                transform={`translate(${b.x}, ${b.y})`}
                onClick={() => onSelectBuilding(b.id)}
                onMouseEnter={() => setHoveredBuildingId(b.id)}
                onMouseLeave={() => setHoveredBuildingId(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Building Footprint Card Body */}
                <rect
                  x={-halfW}
                  y={-halfH}
                  width={b.width}
                  height={b.height}
                  rx="10"
                  fill={isDark ? '#1C1C1E' : '#FFFFFF'}
                  stroke={
                    isStart ? (isDark ? '#0A84FF' : '#007AFF') :
                    isDest ? (isDark ? '#FF9F0A' : '#FF9500') :
                    isWayPoint ? (isDark ? '#0A84FF' : '#007AFF') :
                    (isDark ? '#2C2C2E' : 'rgba(0, 0, 0, 0.08)')
                  }
                  strokeWidth={isStart || isDest ? 3 : (isWayPoint ? 2 : 1.2)}
                  filter="url(#building-shadow)"
                  className="building-rect"
                />

                {/* Top Category Accent Line */}
                <rect
                  x={-halfW + 1}
                  y={-halfH + 1}
                  width={b.width - 2}
                  height="4.5"
                  rx="3"
                  fill={isStart ? '#007AFF' : (isDest ? '#FF9500' : categoryMeta.color)}
                />

                {/* Inner Courtyard / Parking Stalls Styling */}
                {b.shape === 'parking_grid' && (
                  <g opacity="0.35">
                    {[-halfW + 20, -halfW + 40, -halfW + 60, -halfW + 80].map((lineX, i) => (
                      <line 
                        key={`stall-${i}`} 
                        x1={lineX} 
                        y1={-halfH + 12} 
                        x2={lineX + 10} 
                        y2={halfH - 8} 
                        stroke={isDark ? '#FFFFFF' : '#000000'} 
                        strokeWidth="1.2" 
                      />
                    ))}
                  </g>
                )}

                {/* Building Code Badge */}
                <rect
                  x={-halfW + 8}
                  y={-halfH + 10}
                  width="38"
                  height="16"
                  rx="4"
                  fill={isDark ? '#2C2C2E' : categoryMeta.badgeBg}
                />
                <text
                  x={-halfW + 27}
                  y={-halfH + 21.5}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="800"
                  fontFamily="var(--font-mono)"
                  fill={isDark ? '#64D2FF' : categoryMeta.badgeText}
                >
                  {b.code}
                </text>

                {/* Floor Level Badge */}
                <text
                  x={halfW - 8}
                  y={-halfH + 21}
                  textAnchor="end"
                  fontSize="8.5"
                  fontWeight="600"
                  fill={isDark ? '#8E8E93' : '#8E8E93'}
                  fontFamily="var(--font-mono)"
                >
                  {b.floorBadge || (b.floors === 1 ? 'GF' : (typeof b.floors === 'string' && b.floors.includes('4th') ? 'FL 4' : 'GF'))}
                </text>

                {/* Building Name */}
                <text
                  x={-halfW + 8}
                  y={halfH - 12}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="var(--font-sans)"
                  fill={isDark ? '#F5F5F7' : '#1D1D1F'}
                >
                  {b.shortName || (b.name.length > 17 ? b.name.substring(0, 15) + '…' : b.name)}
                </text>

                {/* Start Pin Badge (Apple Green / Blue "A") */}
                {isStart && (
                  <g transform={`translate(0, ${-halfH - 16})`}>
                    <line x1="0" y1="0" x2="0" y2="16" stroke="#007AFF" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="14" fill="#007AFF" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#building-shadow)" />
                    <text x="0" y="4.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF" fontFamily="var(--font-sans)">
                      A
                    </text>
                  </g>
                )}

                {/* Destination Pin Badge (Apple Orange / Red "B") */}
                {isDest && (
                  <g transform={`translate(0, ${-halfH - 16})`}>
                    <line x1="0" y1="0" x2="0" y2="16" stroke="#FF9500" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="14" fill="#FF9500" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#building-shadow)" />
                    <text x="0" y="4.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF" fontFamily="var(--font-sans)">
                      B
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* =========================================================================
            LAYER 9: PEDESTRIAN WALKING SIMULATION PUCK (APPLE MAPS NAVIGATION PUCK)
            ========================================================================= */}
        {simulationPoint && (
          <g transform={`translate(${simulationPoint.x}, ${simulationPoint.y})`}>
            {/* Animated Radar Pulse Wave */}
            <circle cx="0" cy="0" r="22" fill={isDark ? 'rgba(10, 132, 255, 0.4)' : 'rgba(0, 122, 255, 0.25)'}>
              <animate attributeName="r" values="10;26;10" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.4s" repeatCount="indefinite" />
            </circle>

            {/* Navigation Directional Cone */}
            <g transform={`rotate(${simulationPoint.angle})`}>
              <polygon points="0,-16 7,0 -7,0" fill={isDark ? '#0A84FF' : '#007AFF'} opacity="0.4" />
            </g>

            {/* Solid Navigation Center Puck */}
            <circle cx="0" cy="0" r="8.5" fill={isDark ? '#0A84FF' : '#007AFF'} stroke="#FFFFFF" strokeWidth="2.5" filter="url(#building-shadow)" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
          </g>
        )}
      </svg>

      {/* =========================================================================
          LAYER 10: TCET CAMPUS LAYOUT VERIFICATION MODAL
          ========================================================================= */}
      {isInfoModalOpen && (
        <div className="modal-overlay" onClick={() => setIsInfoModalOpen(false)}>
          <div className="modal-dialog large" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
            <div className="modal-header">
              <div className="modal-title">
                <ShieldCheck size={20} color="#34C759" />
                <span>TCET Campus Layout Verification & Cartographic Audit</span>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsInfoModalOpen(false)}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{
                backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: 'var(--text-primary)' }}>
                  {TCET_CAMPUS_GEO.name}
                </h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {TCET_CAMPUS_GEO.address}
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--apple-blue)' }}>📍 GPS: {TCET_CAMPUS_GEO.coordinates.formatted}</span>
                  <span style={{ color: '#34C759' }}>🏛️ Status: {TCET_CAMPUS_GEO.accreditation}</span>
                </div>
              </div>

              <h4 style={{ fontSize: '13.5px', color: '#34C759', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Verified Physical Campus Elements (100% Calibrated)
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '10px',
                marginBottom: '22px'
              }}>
                {TCET_CAMPUS_GEO.verifiedFeatures.map((f, i) => (
                  <div key={i} style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: isDark ? '#242426' : '#FFFFFF',
                    border: '1px solid var(--border-light)',
                    fontSize: '12px'
                  }}>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      {f.name}
                    </strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {f.location}
                    </div>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: '13.5px', color: '#FF9500', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} /> Transparent Schematic Approximations
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {TCET_CAMPUS_GEO.approximatedFeatures.map((af, i) => (
                  <div key={i} style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(255, 149, 0, 0.1)' : '#FFF8EC',
                    border: '1px solid rgba(255, 149, 0, 0.25)',
                    fontSize: '12px',
                    color: isDark ? '#FFB340' : '#8A4B00'
                  }}>
                    <strong>{af.name}: </strong>
                    <span>{af.notes}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '12px 20px',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-surface)'
            }}>
              <button 
                type="button" 
                className="apple-button-primary"
                onClick={() => setIsInfoModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
