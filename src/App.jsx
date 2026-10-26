import React, { useState, useEffect } from 'react';
import { useCampusNavigation } from './hooks/useCampusNavigation';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CampusMap } from './components/CampusMap';
import { LocationModal } from './components/LocationModal';
import { NearbyModal } from './components/NearbyModal';
import { DsaInspectorModal } from './components/DsaInspectorModal';
import { LandingPage } from './components/LandingPage';

export default function App() {
  const nav = useCampusNavigation();
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#map' || window.location.search.includes('view=map'))) {
      return 'map';
    }
    return 'landing';
  });
  const [isMobileDrawerCollapsed, setIsMobileDrawerCollapsed] = useState(false);

  // Sync hash with browser Back / Forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#map') {
        setCurrentView('map');
      } else if (window.location.hash === '#home' || !window.location.hash) {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToMap = () => {
    setCurrentView('map');
    window.location.hash = '#map';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileDrawer = () => {
    setIsMobileDrawerCollapsed(prev => !prev);
  };

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          onLaunchMap={navigateToMap}
          onOpenDsaInspector={() => nav.setIsDsaInspectorOpen(true)}
          theme={nav.theme}
          onToggleTheme={nav.toggleTheme}
          buildings={nav.buildings}
          pathways={nav.pathways}
          graph={nav.graph}
          routes={nav.routes}
          activeRoute={nav.activeRoute}
        />
      ) : (
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
            theme={nav.theme}
            onToggleTheme={nav.toggleTheme}
            isMobileDrawerCollapsed={isMobileDrawerCollapsed}
            onToggleMobileDrawer={toggleMobileDrawer}
            onGoToLanding={navigateToLanding}
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
              isMobileDrawerCollapsed={isMobileDrawerCollapsed}
              onToggleMobileDrawer={toggleMobileDrawer}
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
              theme={nav.theme}
            />
          </div>
        </div>
      )}

      {/* Global Modals Accessible From Both Landing Page & Map */}
      <LocationModal
        building={nav.inspectedBuilding}
        onClose={() => nav.setInspectedBuildingId(null)}
        onSetStart={(id) => {
          nav.setStartId(id);
          navigateToMap();
        }}
        onSetDest={(id) => {
          nav.setDestId(id);
          navigateToMap();
        }}
        onFindNearby={(id) => {
          nav.setNearbyOriginId(id);
          nav.setIsNearbyModalOpen(true);
        }}
      />

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
          navigateToMap();
        }}
      />

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
    </>
  );
}
