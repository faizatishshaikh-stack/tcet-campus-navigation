import React from 'react';
import { useCampusNavigation } from './hooks/useCampusNavigation';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CampusMap } from './components/CampusMap';
import { LocationModal } from './components/LocationModal';
import { NearbyModal } from './components/NearbyModal';
import { DsaInspectorModal } from './components/DsaInspectorModal';

export default function App() {
  const nav = useCampusNavigation();

  return (
    <div className="app-viewport">
      {/* 1. Header Bar with Brand, Metrics & Modal Triggers */}
      <Header
        onOpenDsaInspector={() => nav.setIsDsaInspectorOpen(true)}
        onOpenNearbyModal={() => nav.setIsNearbyModalOpen(true)}
        backendMode={nav.backendMode}
        setBackendMode={nav.setBackendMode}
        cBackendStatus={nav.cBackendStatus}
        onCheckCBackend={nav.checkCBackend}
        blockedCount={nav.blockedEdgeIds.size}
      />

      {/* 2. Main Workspace: Sidebar & Interactive Campus Map */}
      <div className="app-workspace">
        <Sidebar
          buildings={nav.buildings}
          pathways={nav.pathways}
          startId={nav.startId}
          setStartId={nav.setStartId}
          destId={nav.destId}
          setDestId={nav.setDestId}
          onSwap={nav.swapLocations}
          routes={nav.routes}
          activeRoute={nav.activeRoute}
          activeRouteType={nav.activeRouteType}
          setActiveRouteType={nav.setActiveRouteType}
          directions={nav.directions}
          activeStepIndex={nav.activeStepIndex}
          setActiveStepIndex={nav.setActiveStepIndex}
          isSimulating={nav.isSimulating}
          onToggleSimulation={() => nav.setIsSimulating(!nav.isSimulating)}
          blockedEdgeIds={nav.blockedEdgeIds}
          onToggleBlockEdge={nav.toggleEdgeBlocked}
          onClearAllRoadblocks={nav.clearAllRoadblocks}
          isBlockModeActive={nav.isBlockModeActive}
          setIsBlockModeActive={nav.setIsBlockModeActive}
        />

        <CampusMap
          buildings={nav.buildings}
          pathways={nav.pathways}
          graph={nav.graph}
          startId={nav.startId}
          destId={nav.destId}
          onSelectBuilding={(id) => nav.setInspectedBuildingId(id)}
          activeRoute={nav.activeRoute}
          alternativeRoute={nav.routes?.alternative}
          activeRouteType={nav.activeRouteType}
          blockedEdgeIds={nav.blockedEdgeIds}
          onToggleBlockEdge={nav.toggleEdgeBlocked}
          isBlockModeActive={nav.isBlockModeActive}
          isSimulating={nav.isSimulating}
          simulatedProgress={nav.simulatedProgress}
          activeStepIndex={nav.activeStepIndex}
          directions={nav.directions}
        />
      </div>

      {/* 3. Building Details Modal / Architectural Sheet */}
      <LocationModal
        building={nav.inspectedBuilding}
        onClose={() => nav.setInspectedBuildingId(null)}
        onSetStart={(id) => nav.setStartId(id)}
        onSetDest={(id) => nav.setDestId(id)}
        onFindNearby={(id) => {
          nav.setNearbyOriginId(id);
          nav.setIsNearbyModalOpen(true);
        }}
      />

      {/* 4. BFS Nearby Amenities & Explorer Modal */}
      <NearbyModal
        isOpen={nav.isNearbyModalOpen}
        onClose={() => nav.setIsNearbyModalOpen(false)}
        buildings={nav.buildings}
        originId={nav.nearbyOriginId}
        setOriginId={nav.setNearbyOriginId}
        categoryFilter={nav.nearbyCategory}
        setCategoryFilter={nav.setNearbyCategory}
        nearbyData={nav.nearbyData}
        onNavigateTo={(targetId) => {
          nav.setDestId(targetId);
        }}
      />

      {/* 5. DSA Laboratory & Algorithm Inspector */}
      <DsaInspectorModal
        isOpen={nav.isDsaInspectorOpen}
        onClose={() => nav.setIsDsaInspectorOpen(false)}
        activeTab={nav.dsaActiveTab}
        setActiveTab={nav.setDsaActiveTab}
        graph={nav.graph}
        hashTable={nav.hashTable}
        activeRoute={nav.activeRoute}
        routes={nav.routes}
        backendMode={nav.backendMode}
        cBackendStatus={nav.cBackendStatus}
        onCheckCBackend={nav.checkCBackend}
      />
    </div>
  );
}
