import React, { useState, useRef, useMemo } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, AlertTriangle, 
  MapPin, Compass, Navigation, Eye, EyeOff
} from 'lucide-react';
import { CATEGORY_METADATA } from '../data/campusData';

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
  theme = 'light'
}) {
  const svgRef = useRef(null);
  const isDark = theme === 'dark';

  // Pan & Zoom state (Optimized for TCET campus masterplan)
  const [viewBox, setViewBox] = useState({ x: 80, y: 150, width: 1050, height: 580 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Map layer toggles
  const [showDistances, setShowDistances] = useState(true);
  const [showLawns, setShowLawns] = useState(true);

  // Reset View
  const handleResetView = () => {
    setViewBox({ x: 80, y: 150, width: 1050, height: 580 });
  };

  // Zoom In / Out
  const handleZoom = (factor) => {
    setViewBox((prev) => {
      const newWidth = Math.max(380, Math.min(1300, prev.width * factor));
      const newHeight = Math.max(260, Math.min(900, prev.height * factor));
      const dx = (prev.width - newWidth) / 2;
      const dy = (prev.height - newHeight) / 2;
      return {
        x: prev.x + dx,
        y: prev.y + dy,
        width: newWidth,
        height: newHeight
      };
    });
  };

  // Pan handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.interactive-path') || e.target.closest('.interactive-building')) {
      return; // Allow clicking buildings or paths
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    const dx = (e.clientX - startPan.x) * (viewBox.width / svgRef.current.clientWidth);
    const dy = (e.clientY - startPan.y) * (viewBox.height / svgRef.current.clientHeight);
    setViewBox((prev) => ({
      ...prev,
      x: prev.x - dx,
      y: prev.y - dy
    }));
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 0.92 : 1.08;
    handleZoom(factor);
  };

  // Lookup building coordinates map
  const buildingCoordMap = useMemo(() => {
    const map = new Map();
    for (const b of buildings) {
      map.set(b.id, { x: b.x, y: b.y });
    }
    return map;
  }, [buildings]);

  // Generate SVG polyline path for a route
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

    return {
      x: p1.x + (p2.x - p1.x) * subProgress,
      y: p1.y + (p2.y - p1.y) * subProgress
    };
  }, [isSimulating, activeRoute, simulatedProgress, buildingCoordMap]);

  return (
    <div className="map-canvas-container">
      {/* Compass / Orientation indicator */}
      <div className="map-compass-badge">
        <Compass size={14} />
        <span>TCET CAMPUS MAP • KANDIVALI EAST</span>
      </div>

      {/* Floating Zoom & Layer Controls */}
      <div className="map-floating-controls">
        <button 
          className="map-control-btn" 
          onClick={() => handleZoom(0.85)} 
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          className="map-control-btn" 
          onClick={() => handleZoom(1.15)} 
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          className="map-control-btn" 
          onClick={handleResetView} 
          title="Reset View"
        >
          <RotateCcw size={16} />
        </button>
        <button 
          className="map-control-btn" 
          onClick={() => setShowDistances(!showDistances)} 
          title="Toggle Distance Tags"
        >
          {showDistances ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      {/* Map Legend Banner */}
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
          <div className="legend-item" style={{ color: isDark ? '#F6AD55' : '#D96B27', fontWeight: 700 }}>
            <span>⚠️ Roadblock Tool Active (Click walkway to toggle)</span>
          </div>
        )}
      </div>

      {/* Main SVG Vector Canvas */}
      <svg
        ref={svgRef}
        className="campus-svg-viewport"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke={isDark ? '#1C2920' : '#E3DFC7'} 
              strokeWidth="0.5" 
              strokeOpacity={isDark ? 0.7 : 0.5} 
            />
          </pattern>

          {/* Construction Roadblock Hazard Pattern */}
          <pattern id="hazard-stripe" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#E53E3E" strokeWidth="5" />
            <line x1="6" y1="0" x2="6" y2="12" stroke={isDark ? '#1A202C' : '#FFFFFF'} strokeWidth="5" />
          </pattern>

          {/* Drop Shadows */}
          <filter id="building-shadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow 
              dx="1" 
              dy="3" 
              stdDeviation="2.5" 
              floodColor={isDark ? '#000000' : '#1F2823'} 
              floodOpacity={isDark ? 0.6 : 0.18} 
            />
          </filter>

          <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isDark ? 5 : 3} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Terrain Grid */}
        <rect x="-500" y="-500" width="2200" height="2000" fill={isDark ? '#0D1310' : 'url(#campus-grid)'} />
        {isDark && <rect x="-500" y="-500" width="2200" height="2000" fill="url(#campus-grid)" opacity="0.6" />}

        {/* 2. TCET Campus Real Architectural Landscaping */}
        {showLawns && (
          <g className="campus-landscaping">
            {/* Western Main Access Road: Shyamnarayan Thakur Marg */}
            <rect 
              x="70" 
              y="100" 
              width="55" 
              height="640" 
              rx="3" 
              fill={isDark ? '#151D18' : '#E6E2D8'} 
              stroke={isDark ? '#233228' : '#D8D4C8'} 
              strokeWidth="1" 
            />
            <line 
              x1="97" 
              y1="110" 
              x2="97" 
              y2="730" 
              stroke={isDark ? '#3D5344' : '#FFFFFF'} 
              strokeWidth="2" 
              strokeDasharray="12 12" 
            />
            <text 
              x="92" 
              y="420" 
              transform="rotate(-90 92 420)" 
              fontSize="9" 
              fontWeight="700" 
              fill={isDark ? '#5E7D68' : '#7C867F'} 
              letterSpacing="0.1em" 
              fontFamily="var(--font-mono)"
            >
              SHYAMNARAYAN THAKUR MARG (THAKUR VILLAGE ROAD)
            </text>

            {/* TCET Campus Perimeter Compound Boundary */}
            <rect 
              x="135" 
              y="150" 
              width="970" 
              height="580" 
              rx="10" 
              fill={isDark ? '#111A15' : '#F4F1E9'} 
              stroke={isDark ? '#273B2E' : '#DDD8CB'} 
              strokeWidth="1.5" 
              strokeDasharray="4 2" 
            />

            {/* A-Block Master Architectural Footprint Base */}
            <rect 
              x="365" 
              y="195" 
              width="295" 
              height="425" 
              rx="8" 
              fill={isDark ? '#16221B' : '#EDE9DF'} 
              stroke={isDark ? '#2B4031' : '#DCD6C8'} 
              strokeWidth="1.5" 
            />
            <text 
              x="512" 
              y="212" 
              textAnchor="middle" 
              fontSize="9.5" 
              fontWeight="800" 
              fill={isDark ? '#7E9F88' : '#58635B'} 
              letterSpacing="0.06em" 
              fontFamily="var(--font-mono)"
            >
              TCET A-BLOCK (7-STOREY ENGINEERING COMPLEX)
            </text>

            {/* Central Courtyard & Amphitheatre Paved Plaza */}
            <circle 
              cx="740" 
              cy="390" 
              r="62" 
              fill={isDark ? '#18241C' : '#E8E4D8'} 
              stroke={isDark ? '#273B2E' : '#D6D0C2'} 
              strokeWidth="1.5" 
            />
            <circle 
              cx="740" 
              cy="390" 
              r="38" 
              fill={isDark ? '#131D17' : '#E0DDD2'} 
              stroke={isDark ? '#203126' : '#CCC6B8'} 
              strokeWidth="1" 
              strokeDasharray="3 3" 
            />
            <circle cx="740" cy="390" r="8" fill={isDark ? '#2F4839' : '#B4AD9F'} />

            {/* Thakur Sports Ground & Turf (3.5 Acres) */}
            <rect 
              x="880" 
              y="210" 
              width="160" 
              height="300" 
              rx="20" 
              fill={isDark ? '#132819' : '#DEEBDF'} 
              stroke={isDark ? '#214229' : '#C5DBC6'} 
              strokeWidth="2" 
            />
            {/* Athletic Track Boundary */}
            <rect 
              x="895" 
              y="225" 
              width="130" 
              height="270" 
              rx="14" 
              fill={isDark ? '#271D18' : '#E9DFD8'} 
              stroke={isDark ? '#3F2C24' : '#D5C5BC'} 
              strokeWidth="2" 
            />
            <rect 
              x="905" 
              y="235" 
              width="110" 
              height="250" 
              rx="10" 
              fill={isDark ? '#122D1A' : '#D3E5D4'} 
              stroke={isDark ? '#24522D' : '#B8D5BA'} 
              strokeWidth="1.5" 
            />
            {/* Cricket Pitch */}
            <rect 
              x="952" 
              y="325" 
              width="16" 
              height="70" 
              rx="2" 
              fill={isDark ? '#383020' : '#D9CCA8'} 
              stroke={isDark ? '#4D422B' : '#C7B892'} 
              strokeWidth="1" 
            />
            <text 
              x="960" 
              y="280" 
              textAnchor="middle" 
              fontSize="9" 
              fontWeight="800" 
              fill={isDark ? '#5EE87E' : '#4B6E52'} 
              fontFamily="var(--font-mono)"
            >
              THAKUR SPORTS TURF
            </text>
            <text 
              x="960" 
              y="293" 
              textAnchor="middle" 
              fontSize="8" 
              fontWeight="600" 
              fill={isDark ? '#7BB887' : '#5C8263'}
            >
              3.5 ACRE ARENA
            </text>
          </g>
        )}

        {/* 3. Base Pedestrian Pathways */}
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
                  strokeWidth="20"
                />

                {/* Base Walkway Paver */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isBlocked ? '#E53E3E' : (isDark ? '#263B2F' : '#D1CBBF')}
                  strokeWidth={isBlocked ? 4 : 5}
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
                    stroke={isDark ? 'rgba(72, 187, 120, 0.3)' : '#FFFFFF'}
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    strokeOpacity="0.8"
                  />
                )}

                {/* Roadblock Hazard Indicator */}
                {isBlocked && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect 
                      x="-24" 
                      y="-10" 
                      width="48" 
                      height="20" 
                      rx="4" 
                      fill="#E53E3E" 
                      stroke="#FFFFFF" 
                      strokeWidth="1.5" 
                    />
                    <text 
                      x="0" 
                      y="3.5" 
                      textAnchor="middle" 
                      fontSize="9" 
                      fontWeight="800" 
                      fill="#FFFFFF" 
                      fontFamily="var(--font-mono)"
                    >
                      BLOCKED
                    </text>
                  </g>
                )}

                {/* Distance Badge */}
                {!isBlocked && showDistances && (
                  <g transform={`translate(${midX}, ${midY})`} className="distance-badge-group">
                    <rect
                      x="-18"
                      y="-8"
                      width="36"
                      height="16"
                      rx="3"
                      fill={isDark ? '#17241C' : '#FFFFFF'}
                      stroke={isDark ? '#293E31' : '#D8D4C8'}
                      strokeWidth="1"
                      opacity={isDark ? '0.95' : '0.9'}
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="var(--font-mono)"
                      fill={isDark ? '#98AD9F' : '#5C665F'}
                    >
                      {edge.distance}m
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 4. Alternative Route (Dashed Terracotta / Neon Amber) */}
        {alternativeSvgPath && activeRouteType !== 'alternative' && (
          <g className="route-alternative-layer">
            <path
              d={alternativeSvgPath}
              fill="none"
              stroke={isDark ? '#F6AD55' : '#D96B27'}
              strokeWidth="5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </g>
        )}

        {/* 5. Primary Active Route (Glowing Forest Green / Radiant Emerald) */}
        {primarySvgPath && (
          <g className="route-primary-layer">
            {/* Soft Glow Underlay */}
            <path
              d={primarySvgPath}
              fill="none"
              stroke={isDark ? 'rgba(56, 224, 133, 0.45)' : 'rgba(27, 59, 43, 0.25)'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Solid Foreground Route */}
            <path
              d={primarySvgPath}
              fill="none"
              stroke={
                activeRouteType === 'alternative' 
                  ? (isDark ? '#F6AD55' : '#D96B27') 
                  : (isDark ? '#38E085' : '#1B3B2B')
              }
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Animated Directional Dash */}
            <path
              d={primarySvgPath}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="6 10"
              strokeLinecap="round"
              opacity="0.9"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="32"
                to="0"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        )}

        {/* 6. Buildings Footprints & Labels */}
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
                style={{ cursor: 'pointer' }}
              >
                {/* Building Footprint Body */}
                <rect
                  x={-halfW}
                  y={-halfH}
                  width={b.width}
                  height={b.height}
                  rx="6"
                  fill={isDark ? '#17221C' : '#FFFFFF'}
                  stroke={
                    isStart ? (isDark ? '#38E085' : '#1B3B2B') :
                    isDest ? (isDark ? '#F6AD55' : '#D96B27') :
                    isWayPoint ? (isDark ? '#3E7D56' : '#7C9385') :
                    (isDark ? '#283B2F' : '#D1CAC0')
                  }
                  strokeWidth={isStart || isDest ? 2.5 : 1.5}
                  filter="url(#building-shadow)"
                  className="building-rect"
                />

                {/* Inner Architectural Courtyard Cutout */}
                {b.shape === 'courtyard' && (
                  <rect
                    x={-halfW + 16}
                    y={-halfH + 14}
                    width={b.width - 32}
                    height={b.height - 28}
                    rx="3"
                    fill={isDark ? '#101713' : '#F2EFE8'}
                    stroke={isDark ? '#223328' : '#D8D3C8'}
                    strokeWidth="1"
                  />
                )}

                {/* Category Color Accent Header Bar */}
                <rect
                  x={-halfW + 1}
                  y={-halfH + 1}
                  width={b.width - 2}
                  height="5"
                  rx="2"
                  fill={isDark && isStart ? '#38E085' : categoryMeta.color}
                />

                {/* Building Code Badge */}
                <rect
                  x={-halfW + 8}
                  y={-halfH + 10}
                  width="36"
                  height="16"
                  rx="3"
                  fill={isDark ? '#223328' : categoryMeta.badgeBg}
                />
                <text
                  x={-halfW + 26}
                  y={-halfH + 21.5}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="800"
                  fontFamily="var(--font-mono)"
                  fill={isDark ? '#81E6D9' : categoryMeta.badgeText}
                >
                  {b.code}
                </text>

                {/* Building Name */}
                <text
                  x={-halfW + 8}
                  y={halfH - 12}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="var(--font-sans)"
                  fill={isDark ? '#EDF4EF' : '#1C221F'}
                >
                  {b.shortName || (b.name.length > 18 ? b.name.substring(0, 16) + '…' : b.name)}
                </text>

                {/* Start Pin Badge (Green) */}
                {isStart && (
                  <g transform={`translate(0, ${-halfH - 14})`}>
                    <circle cx="0" cy="0" r="12" fill={isDark ? '#28A745' : '#1B3B2B'} stroke="#FFFFFF" strokeWidth="2" />
                    <text x="0" y="3.5" textAnchor="middle" fontSize="10" fontWeight="800" fill="#FFFFFF">
                      A
                    </text>
                  </g>
                )}

                {/* Destination Pin Badge (Orange) */}
                {isDest && (
                  <g transform={`translate(0, ${-halfH - 14})`}>
                    <circle cx="0" cy="0" r="12" fill={isDark ? '#DD6B20' : '#D96B27'} stroke="#FFFFFF" strokeWidth="2" />
                    <text x="0" y="3.5" textAnchor="middle" fontSize="10" fontWeight="800" fill="#FFFFFF">
                      B
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 7. Pedestrian Walking Avatar Pin during Simulation */}
        {simulationPoint && (
          <g transform={`translate(${simulationPoint.x}, ${simulationPoint.y})`}>
            {/* Animated Pulse Ring */}
            <circle cx="0" cy="0" r="18" fill={isDark ? 'rgba(246, 173, 85, 0.4)' : 'rgba(217, 107, 39, 0.25)'}>
              <animate attributeName="r" values="10;22;10" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.5s" repeatCount="indefinite" />
            </circle>
            {/* Center Walker Pin */}
            <circle cx="0" cy="0" r="8" fill={isDark ? '#ED8936' : '#D96B27'} stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
}
