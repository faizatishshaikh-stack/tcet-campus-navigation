import { useState, useEffect, useMemo, useCallback } from 'react';
import { CAMPUS_BUILDINGS, CAMPUS_PATHWAYS } from '../data/campusData';
import { Graph } from '../dsa/Graph';
import { HashTable } from '../dsa/HashTable';
import { Dijkstra } from '../dsa/Dijkstra';
import { BFS } from '../dsa/BFS';
import { DirectionsGenerator } from '../dsa/Directions';

export function useCampusNavigation() {
  // Navigation endpoints (TCET Gate 5 to Computing & AI Labs)
  const [startId, setStartId] = useState('gate_5');
  const [destId, setDestId] = useState('cs_it_labs');

  // Currently inspected building for info drawer
  const [inspectedBuildingId, setInspectedBuildingId] = useState(null);

  // Roadblocks: set of blocked edge IDs
  const [blockedEdgeIds, setBlockedEdgeIds] = useState(new Set());

  // Block Mode toggle (when enabled, clicking any path on the map blocks/unblocks it)
  const [isBlockModeActive, setIsBlockModeActive] = useState(false);

  // Route state
  const [activeRouteType, setActiveRouteType] = useState('primary'); // 'primary' | 'alternative'
  const [routes, setRoutes] = useState({ primary: null, alternative: null });

  // Step-by-step guidance
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Walking simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0); // 0 to 1

  // Modals & Panels
  const [isDsaInspectorOpen, setIsDsaInspectorOpen] = useState(false);
  const [dsaActiveTab, setDsaActiveTab] = useState('dijkstra'); // 'dijkstra' | 'hashtable' | 'adjlist' | 'c_backend'
  const [isNearbyModalOpen, setIsNearbyModalOpen] = useState(false);
  const [nearbyOriginId, setNearbyOriginId] = useState('tcet_foyer');
  const [nearbyCategory, setNearbyCategory] = useState('all');

  // Backend mode
  const [backendMode, setBackendMode] = useState('client'); // 'client' | 'c_backend'
  const [cBackendStatus, setCBackendStatus] = useState('unknown'); // 'online' | 'offline' | 'checking'

  // Initialize Graph and Hash Table
  const { graph, hashTable } = useMemo(() => {
    const g = new Graph();
    const ht = new HashTable(17);

    // Populate Vertices
    for (const b of CAMPUS_BUILDINGS) {
      g.addVertex(b.id, b);
      ht.insert(b.id, b);
      ht.insert(b.name, b);
      ht.insert(b.code, b);
      if (b.shortName) ht.insert(b.shortName, b);
    }

    // Authentic TCET location aliases
    ht.insert('gate 5', g.getVertex('gate_5'));
    ht.insert('main gate', g.getVertex('gate_5'));
    ht.insert('entrance', g.getVertex('gate_5'));
    ht.insert('thakur marg', g.getVertex('gate_5'));

    ht.insert('gate 4', g.getVertex('gate_4'));
    ht.insert('east gate', g.getVertex('gate_4'));

    ht.insert('foyer', g.getVertex('tcet_foyer'));
    ht.insert('lobby', g.getVertex('tcet_foyer'));
    ht.insert('lifts', g.getVertex('tcet_foyer'));
    ht.insert('reception', g.getVertex('tcet_foyer'));
    ht.insert('a block', g.getVertex('tcet_foyer'));

    ht.insert('admin', g.getVertex('admin_office'));
    ht.insert('registrar', g.getVertex('admin_office'));
    ht.insert('accounts', g.getVertex('admin_office'));
    ht.insert('fees', g.getVertex('admin_office'));
    ht.insert('admission', g.getVertex('admin_office'));

    ht.insert('exam', g.getVertex('exam_cell'));
    ht.insert('coe', g.getVertex('exam_cell'));
    ht.insert('principal', g.getVertex('exam_cell'));

    ht.insert('library', g.getVertex('library_lrc'));
    ht.insert('lrc', g.getVertex('library_lrc'));
    ht.insert('reading hall', g.getVertex('library_lrc'));
    ht.insert('books', g.getVertex('library_lrc'));

    ht.insert('comp', g.getVertex('cs_it_labs'));
    ht.insert('cs', g.getVertex('cs_it_labs'));
    ht.insert('it', g.getVertex('cs_it_labs'));
    ht.insert('ai', g.getVertex('cs_it_labs'));
    ht.insert('coding labs', g.getVertex('cs_it_labs'));

    ht.insert('canteen', g.getVertex('canteen'));
    ht.insert('cafe', g.getVertex('canteen'));
    ht.insert('food', g.getVertex('canteen'));
    ht.insert('cafeteria', g.getVertex('canteen'));

    ht.insert('auditorium', g.getVertex('seminar_hall'));
    ht.insert('seminar', g.getVertex('seminar_hall'));
    ht.insert('placement', g.getVertex('seminar_hall'));

    ht.insert('workshop', g.getVertex('central_workshop'));
    ht.insert('mechanical', g.getVertex('central_workshop'));
    ht.insert('cnc', g.getVertex('central_workshop'));

    ht.insert('courtyard', g.getVertex('central_courtyard'));
    ht.insert('amphitheatre', g.getVertex('central_courtyard'));
    ht.insert('quad', g.getVertex('central_courtyard'));
    ht.insert('zephyr', g.getVertex('central_courtyard'));

    ht.insert('sports', g.getVertex('sports_ground'));
    ht.insert('turf', g.getVertex('sports_ground'));
    ht.insert('cricket', g.getVertex('sports_ground'));
    ht.insert('ground', g.getVertex('sports_ground'));

    ht.insert('xerox', g.getVertex('stationery_kiosk'));
    ht.insert('stationery', g.getVertex('stationery_kiosk'));
    ht.insert('print', g.getVertex('stationery_kiosk'));

    ht.insert('bike parking', g.getVertex('student_parking'));
    ht.insert('two wheeler', g.getVertex('student_parking'));

    ht.insert('car parking', g.getVertex('faculty_parking'));
    ht.insert('faculty parking', g.getVertex('faculty_parking'));

    ht.insert('timsr', g.getVertex('timsr_block'));
    ht.insert('management', g.getVertex('timsr_block'));

    // Populate Edges
    for (const p of CAMPUS_PATHWAYS) {
      g.addEdge(p.id, p.from, p.to, p.distance, p.name, p.surface, true);
    }

    return { graph: g, hashTable: ht };
  }, []);

  // Sync blocked edges into the Graph instance
  useEffect(() => {
    for (const edge of CAMPUS_PATHWAYS) {
      graph.setEdgeBlocked(edge.id, blockedEdgeIds.has(edge.id));
    }
  }, [graph, blockedEdgeIds]);

  // Recalculate routes when start, destination, or roadblocks change
  useEffect(() => {
    if (!startId || !destId) {
      setRoutes({ primary: null, alternative: null });
      return;
    }

    const calculated = Dijkstra.findRoutes(graph, startId, destId);
    setRoutes(calculated);
    setActiveStepIndex(0);
    setIsSimulating(false);
    setSimulatedProgress(0);
  }, [graph, startId, destId, blockedEdgeIds]);

  // Active Route
  const activeRoute = useMemo(() => {
    if (activeRouteType === 'alternative' && routes.alternative?.found) {
      return routes.alternative;
    }
    return routes.primary;
  }, [routes, activeRouteType]);

  // Step-by-Step Directions
  const directions = useMemo(() => {
    if (!activeRoute || !activeRoute.found) return [];
    return DirectionsGenerator.generateSteps(graph, activeRoute.path, activeRoute.edges);
  }, [graph, activeRoute]);

  // Nearby amenities using BFS
  const nearbyData = useMemo(() => {
    const origin = nearbyOriginId || startId || 'admin';
    return BFS.findNearby(graph, origin, nearbyCategory);
  }, [graph, nearbyOriginId, startId, nearbyCategory]);

  // Walking simulation effect
  useEffect(() => {
    let animFrame;
    if (isSimulating && activeRoute?.found && activeRoute.path.length > 1) {
      let startTime = null;
      const durationMs = Math.max(4000, Math.min(12000, (activeRoute.distance || 200) * 15));

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        setSimulatedProgress(progress);

        // Update active step index based on progress
        if (directions.length > 0) {
          const stepIdx = Math.min(
            directions.length - 1,
            Math.floor(progress * directions.length)
          );
          setActiveStepIndex(stepIdx);
        }

        if (progress < 1) {
          animFrame = requestAnimationFrame(step);
        } else {
          setIsSimulating(false);
        }
      };

      animFrame = requestAnimationFrame(step);
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isSimulating, activeRoute, directions.length]);

  // Toggle edge blocked state
  const toggleEdgeBlocked = useCallback((edgeId) => {
    setBlockedEdgeIds((prev) => {
      const next = new Set(prev);
      if (next.has(edgeId)) {
        next.delete(edgeId);
      } else {
        next.add(edgeId);
      }
      return next;
    });
  }, []);

  // Clear all roadblocks
  const clearAllRoadblocks = useCallback(() => {
    setBlockedEdgeIds(new Set());
  }, []);

  // Swap start & destination
  const swapLocations = useCallback(() => {
    setStartId(destId);
    setDestId(startId);
  }, [startId, destId]);

  // Check C backend health
  const checkCBackend = useCallback(async () => {
    setCBackendStatus('checking');
    try {
      const res = await fetch('http://127.0.0.1:8080/api/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        const data = await res.json();
        setCBackendStatus('online');
        return { online: true, data };
      } else {
        setCBackendStatus('offline');
        return { online: false };
      }
    } catch {
      setCBackendStatus('offline');
      return { online: false };
    }
  }, []);

  return {
    // Spatial Data
    buildings: CAMPUS_BUILDINGS,
    pathways: CAMPUS_PATHWAYS,
    graph,
    hashTable,

    // Selection
    startId,
    setStartId,
    destId,
    setDestId,
    swapLocations,

    // Building modal
    inspectedBuildingId,
    setInspectedBuildingId,
    inspectedBuilding: inspectedBuildingId ? graph.getVertex(inspectedBuildingId) : null,

    // Roadblocks
    blockedEdgeIds,
    toggleEdgeBlocked,
    clearAllRoadblocks,
    isBlockModeActive,
    setIsBlockModeActive,

    // Navigation & Routes
    routes,
    activeRoute,
    activeRouteType,
    setActiveRouteType,
    directions,
    activeStepIndex,
    setActiveStepIndex,

    // Simulation
    isSimulating,
    setIsSimulating,
    simulatedProgress,

    // Modals
    isDsaInspectorOpen,
    setIsDsaInspectorOpen,
    dsaActiveTab,
    setDsaActiveTab,
    isNearbyModalOpen,
    setIsNearbyModalOpen,
    nearbyOriginId,
    setNearbyOriginId,
    nearbyCategory,
    setNearbyCategory,
    nearbyData,

    // Backend status
    backendMode,
    setBackendMode,
    cBackendStatus,
    checkCBackend
  };
}
