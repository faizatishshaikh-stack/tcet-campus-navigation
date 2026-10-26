import React from 'react';
import { 
  Compass, Navigation, Cpu, GitBranch, Hash, Network, 
  ShieldCheck, ArrowRight, 
  Footprints, Sparkles, Sun, Moon, Building, Trophy, 
  ChevronRight, Terminal, BookOpen, Coffee, MapPin, Activity
} from 'lucide-react';
import { CampusMap } from './CampusMap';

export function LandingPage({
  onLaunchMap,
  onOpenDsaInspector,
  theme,
  onToggleTheme,
  buildings,
  pathways,
  graph,
  routes,
  activeRoute
}) {
  const isDark = theme === 'dark';

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page-root">
      {/* 1. Apple-Style Minimal Navigation Bar */}
      <header className="landing-nav-bar">
        <div className="landing-nav-container">
          {/* Brand */}
          <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="brand-logo-mark">
              <Compass size={20} strokeWidth={2.2} />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">
                TCET Campus
                <span className="brand-badge">KANDIVALI EAST</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="landing-nav-links">
            <button type="button" className="nav-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Home
            </button>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection('features')}>
              Features
            </button>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection('dsa')}>
              DSA Architecture
            </button>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection('about')}>
              About TCET
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="landing-nav-actions">
            {/* Theme Toggle */}
            <button 
              type="button" 
              className="header-btn theme-toggle-btn"
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={13} color="#FF9F0A" /> : <Moon size={13} />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* Launch Map Primary CTA */}
            <button 
              type="button" 
              className="apple-btn-primary launch-map-cta"
              onClick={onLaunchMap}
            >
              <Navigation size={13} style={{ transform: 'rotate(45deg)' }} />
              <span>Launch Campus Map</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-content-wrapper">
          {/* Eyebrow Pill */}
          <div className="hero-eyebrow-badge">
            <Sparkles size={12} color="var(--apple-blue)" />
            <span>THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY</span>
          </div>

          {/* Headline */}
          <h1 className="hero-main-title">
            Your Campus. <br className="hero-break" />
            <span className="hero-gradient-text">Your Way.</span>
          </h1>

          {/* Subtitle Description */}
          <p className="hero-lead-text">
            An intelligent pedestrian wayfinding system engineered for the TCET Mumbai campus.
            Powered by real-time Dijkstra graph algorithms, binary min-heaps, and sub-second pathfinding.
          </p>

          {/* CTA Buttons Group */}
          <div className="hero-cta-group">
            <button 
              type="button" 
              className="apple-btn-primary large"
              onClick={onLaunchMap}
            >
              <span>Explore Campus</span>
              <ArrowRight size={15} />
            </button>
            <button 
              type="button" 
              className="apple-btn-secondary large"
              onClick={() => scrollToSection('features')}
            >
              <span>Discover Features</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Quick Metrics Badges */}
          <div className="hero-metrics-strip">
            <div className="hero-stat-pill">
              <MapPin size={12} color="var(--apple-blue)" />
              <span>16 Campus Landmarks</span>
            </div>
            <div className="hero-stat-pill">
              <Footprints size={12} color="var(--apple-green)" />
              <span>24 Calibrated Walkways</span>
            </div>
            <div className="hero-stat-pill">
              <Activity size={12} color="var(--apple-orange)" />
              <span>Dijkstra Shortest Path</span>
            </div>
            <div className="hero-stat-pill">
              <Terminal size={12} color="var(--apple-purple)" />
              <span>ANSI C Engine Parity</span>
            </div>
          </div>
        </div>

        {/* 3. Live Interactive Map Preview Container */}
        <div className="hero-map-preview-container">
          <div className="map-preview-window-frame">
            {/* macOS Window Controls Header */}
            <div className="preview-window-header">
              <div className="macos-traffic-lights">
                <div className="traffic-light close" />
                <div className="traffic-light minimize" />
                <div className="traffic-light zoom" />
              </div>
              <div className="preview-window-title">
                <Compass size={12} />
                <span>TCET Smart Campus Map • Live Preview</span>
              </div>
              <button 
                type="button"
                className="preview-expand-btn"
                onClick={onLaunchMap}
                title="Open in full screen"
              >
                <span>Full Screen</span>
                <ArrowRight size={11} />
              </button>
            </div>

            {/* Embedded Live Campus Map */}
            <div className="preview-map-viewport">
              <CampusMap
                buildings={buildings}
                pathways={pathways}
                graph={graph}
                startId="gate_5"
                destId="cs_it_labs"
                onSelectBuilding={() => onLaunchMap()}
                activeRoute={activeRoute}
                alternativeRoute={routes?.alternative}
                activeRouteType="primary"
                blockedEdgeIds={new Set()}
                onToggleBlockEdge={() => {}}
                isBlockModeActive={false}
                isSimulating={false}
                simulatedProgress={0}
                activeStepIndex={0}
                directions={[]}
                theme={theme}
                disableWheelZoom={true}
              />

              {/* Floating Live Telemetry Cards on Preview */}
              <div className="preview-telemetry-overlay">
                <div className="telemetry-card">
                  <div className="telemetry-header">
                    <span className="telemetry-dot" />
                    <span>ACTIVE ROUTE</span>
                  </div>
                  <strong className="telemetry-val">Gate 5 → AI & CS Labs</strong>
                  <span className="telemetry-sub">110m • 1 min walk (Shortest Path)</span>
                </div>

                <button 
                  type="button" 
                  className="preview-launch-button-overlay"
                  onClick={onLaunchMap}
                >
                  <Navigation size={13} style={{ transform: 'rotate(45deg)' }} />
                  <span>Open Interactive Navigator</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stat Counter Ribbon */}
      <section className="stats-ribbon-section">
        <div className="stats-ribbon-container">
          <div className="stat-column">
            <span className="stat-big-number">110m</span>
            <span className="stat-column-label">Gate 5 to Labs Shortest Path</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-column">
            <span className="stat-big-number">O(E log V)</span>
            <span className="stat-column-label">Min-Heap Dijkstra Runtime</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-column">
            <span className="stat-big-number">17</span>
            <span className="stat-column-label">Hash Table Buckets (Horner's)</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-column">
            <span className="stat-big-number">&lt; 1ms</span>
            <span className="stat-column-label">Real-time Path Rerouting</span>
          </div>
        </div>
      </section>

      {/* 5. Features Grid Section */}
      <section id="features" className="landing-section">
        <div className="section-header-centered">
          <span className="section-kicker">ENGINEERED FOR EXCELLENCE</span>
          <h2 className="section-title">Built with Precision Pedestrian Algorithms</h2>
          <p className="section-subtitle">
            Every feature is backed by foundational computer science principles, calibrated specifically for TCET's multi-wing infrastructure.
          </p>
        </div>

        <div className="features-bento-grid">
          {/* Card 1: Dijkstra Shortest Path */}
          <div className="bento-feature-card primary-focus">
            <div className="feature-icon-bubble blue">
              <GitBranch size={22} />
            </div>
            <h3 className="bento-card-title">Dijkstra Shortest Path Routing</h3>
            <p className="bento-card-desc">
              Computes the mathematically shortest pedestrian path across 24 campus walkways using a binary min-heap priority queue. Extracts optimal paths in sub-millisecond execution time.
            </p>
            <div className="bento-tag-row">
              <span className="bento-pill">Binary Min-Heap</span>
              <span className="bento-pill">Weighted Graph</span>
              <span className="bento-pill">Turn-by-Turn Steps</span>
            </div>
          </div>

          {/* Card 2: BFS Exploration */}
          <div className="bento-feature-card">
            <div className="feature-icon-bubble green">
              <Network size={22} />
            </div>
            <h3 className="bento-card-title">BFS Queue Amenity Discovery</h3>
            <p className="bento-card-desc">
              Explores nearby facilities, labs, libraries, and canteens hop-by-hop using a FIFO breadth-first search frontier from any starting landmark.
            </p>
            <div className="bento-tag-row">
              <span className="bento-pill">Breadth-First Search</span>
              <span className="bento-pill">FIFO Queue</span>
              <span className="bento-pill">Category Filtering</span>
            </div>
          </div>

          {/* Card 3: Dynamic Roadblocks */}
          <div className="bento-feature-card">
            <div className="feature-icon-bubble orange">
              <ShieldCheck size={22} />
            </div>
            <h3 className="bento-card-title">Dynamic Roadblock Rerouting</h3>
            <p className="bento-card-desc">
              Simulates construction closures and walkway maintenance. Graph edges instantly update weights, triggering dynamic route recalculation with zero reload.
            </p>
            <div className="bento-tag-row">
              <span className="bento-pill">Real-Time Detours</span>
              <span className="bento-pill">Edge Disconnection</span>
              <span className="bento-pill">Alternative Routes</span>
            </div>
          </div>

          {/* Card 4: Dual C Backend Parity */}
          <div className="bento-feature-card">
            <div className="feature-icon-bubble purple">
              <Terminal size={22} />
            </div>
            <h3 className="bento-card-title">Full C Engine Parity</h3>
            <p className="bento-card-desc">
              Dual-engine architecture: A reactive client JavaScript implementation paired with an ANSI C socket server on port 8080 implementing identical memory structures.
            </p>
            <div className="bento-tag-row">
              <span className="bento-pill">ANSI C Architecture</span>
              <span className="bento-pill">Socket REST API</span>
              <span className="bento-pill">Algorithm Parity</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DSA Concepts & Architecture Section */}
      <section id="dsa" className="landing-section alt-bg">
        <div className="section-header-centered">
          <span className="section-kicker">DATA STRUCTURES & ALGORITHMS</span>
          <h2 className="section-title">Academic & Algorithmic Rigor</h2>
          <p className="section-subtitle">
            An open inspection into the data models and asymptotic complexities powering every routing decision.
          </p>
        </div>

        <div className="dsa-cards-container">
          {/* Concept 1 */}
          <div className="dsa-concept-card">
            <div className="dsa-card-header">
              <div className="dsa-concept-icon"><Network size={18} /></div>
              <div>
                <h4 className="dsa-card-heading">Graph Adjacency List</h4>
                <span className="dsa-card-badge">Space: O(V + E)</span>
              </div>
            </div>
            <p className="dsa-card-body">
              The TCET campus is modeled as an undirected weighted spatial graph with 16 verified vertices and 23 bidirectional pedestrian walkways calibrated in meters.
            </p>
            <div className="dsa-code-preview">
              <code>Graph = &#123; V: 16 landmarks, E: 23 calibrated paths &#125;</code>
            </div>
          </div>

          {/* Concept 2 */}
          <div className="dsa-concept-card">
            <div className="dsa-card-header">
              <div className="dsa-concept-icon"><Hash size={18} /></div>
              <div>
                <h4 className="dsa-card-heading">Polynomial Hash Table</h4>
                <span className="dsa-card-badge">Average: O(1) Lookup</span>
              </div>
            </div>
            <p className="dsa-card-body">
              Instant location searches utilize Horner's polynomial rolling hash function with separate chaining linked lists across 17 buckets to resolve collisions seamlessly.
            </p>
            <div className="dsa-code-preview">
              <code>h(s) = (∑ s[i] · 31^(n-1-i)) mod 17</code>
            </div>
          </div>

          {/* Concept 3 */}
          <div className="dsa-concept-card">
            <div className="dsa-card-header">
              <div className="dsa-concept-icon"><GitBranch size={18} /></div>
              <div>
                <h4 className="dsa-card-heading">Binary Min-Heap Queue</h4>
                <span className="dsa-card-badge">Extract-Min: O(log V)</span>
              </div>
            </div>
            <p className="dsa-card-body">
              Dijkstra extracts the unvisited vertex with minimal tentative distance using a binary heap, maintaining total search time within O((V + E) log V).
            </p>
            <div className="dsa-code-preview">
              <code>PriorityQueue &lt;Vertex, Distance&gt; (Min-Heap)</code>
            </div>
          </div>
        </div>

        {/* Audit Mode CTA */}
        <div className="dsa-audit-cta-row">
          <button 
            type="button" 
            className="apple-btn-secondary"
            onClick={onOpenDsaInspector}
          >
            <Cpu size={14} color="var(--apple-blue)" />
            <span>Open Interactive DSA Inspector</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* 7. About TCET Section */}
      <section id="about" className="landing-section">
        <div className="campus-about-card">
          <div className="about-text-content">
            <span className="section-kicker">CAMPUS PROFILE</span>
            <h2 className="about-title">Thakur College of Engineering & Technology</h2>
            <p className="about-desc">
              TCET is an autonomous engineering institution accredited with an 'A' grade by NAAC, located in Thakur Village, Kandivali East, Mumbai.
              The campus spans seven multi-floor wings in the A-Block complex, specialized AI & Computing laboratories, the APJ Abdul Kalam Learning Resource Centre, a 3.5-acre athletic sports arena, and modern academic departments.
            </p>

            <div className="about-highlights-grid">
              <div className="about-stat-item">
                <Building size={16} color="var(--apple-blue)" />
                <div>
                  <strong>A-Block Complex</strong>
                  <span>7-storey engineering wings</span>
                </div>
              </div>
              <div className="about-stat-item">
                <BookOpen size={16} color="var(--apple-purple)" />
                <div>
                  <strong>Central LRC Library</strong>
                  <span>4th Floor reference collections</span>
                </div>
              </div>
              <div className="about-stat-item">
                <Trophy size={16} color="var(--apple-green)" />
                <div>
                  <strong>Thakur Sports Turf</strong>
                  <span>3.5-acre athletic grounds</span>
                </div>
              </div>
              <div className="about-stat-item">
                <Coffee size={16} color="var(--apple-orange)" />
                <div>
                  <strong>Campus Canteen</strong>
                  <span>Central dining terrace</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. High-Impact Final Call-to-Action */}
      <section className="landing-final-cta-section">
        <div className="final-cta-card">
          <div className="cta-icon-glow">
            <Compass size={32} color="#FFFFFF" />
          </div>
          <h2 className="final-cta-title">Ready to Navigate TCET?</h2>
          <p className="final-cta-subtitle">
            Plan your pedestrian route from any gate, find classrooms, or explore nearby amenities in seconds.
          </p>
          <div className="final-cta-buttons">
            <button 
              type="button" 
              className="apple-btn-primary large"
              onClick={onLaunchMap}
            >
              <Navigation size={15} style={{ transform: 'rotate(45deg)' }} />
              <span>Launch Campus Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. Apple-Style Minimal Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-top-row">
            <div className="footer-brand">
              <Compass size={18} color="var(--apple-blue)" />
              <span className="footer-brand-title">TCET Smart Campus Navigation</span>
            </div>
            <div className="footer-tags">
              <span className="footer-pill">React 19</span>
              <span className="footer-pill">Vite</span>
              <span className="footer-pill">Dijkstra Algorithm</span>
              <span className="footer-pill">C Socket Server</span>
            </div>
          </div>
          <div className="footer-bottom-row">
            <p className="footer-copy">
              © 2026 Thakur College of Engineering & Technology, Kandivali (E), Mumbai. All rights reserved.
            </p>
            <div className="footer-nav-links">
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
              <button type="button" onClick={() => scrollToSection('features')}>Features</button>
              <button type="button" onClick={() => scrollToSection('dsa')}>DSA Inspector</button>
              <button type="button" onClick={onLaunchMap}>Campus Map</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
