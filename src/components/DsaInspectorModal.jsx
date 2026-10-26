import React, { useState } from 'react';
import { 
  X, Cpu, Network, Hash, GitBranch, Terminal, 
  ArrowRight, RefreshCw 
} from 'lucide-react';

export function DsaInspectorModal({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  graph,
  hashTable,
  activeRoute,
  routes,
  backendMode,
  cBackendStatus,
  onCheckCBackend
}) {
  const [hashTestInput, setHashTestInput] = useState('library');

  if (!isOpen) return null;

  // Hash table statistics and buckets
  const htInspection = hashTable.getInspectionData();
  const testHashVal = hashTable.hash(hashTestInput);
  const testSearchResult = hashTable.get(hashTestInput);

  // Adjacency list representation
  const adjList = graph.getAdjacencyListRepresentation();

  // Tabs list
  const tabs = [
    { id: 'dijkstra', label: "Dijkstra's Algorithm", icon: <GitBranch size={13} /> },
    { id: 'hashtable', label: 'Hash Table (Chaining)', icon: <Hash size={13} /> },
    { id: 'adjlist', label: 'Adjacency List (Graph)', icon: <Network size={13} /> },
    { id: 'c_backend', label: 'C Backend Architecture', icon: <Terminal size={13} /> }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Cpu size={18} color="var(--apple-blue)" />
            <span>DSA Laboratory & Algorithm Inspector</span>
            <span className="brand-badge">ACADEMIC AUDIT</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Close inspector">
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation - Apple Segmented Tabs */}
        <div className="modal-tabs-bar">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`modal-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {tab.icon}
                <span>{tab.label}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* TAB 1: DIJKSTRA */}
          {activeTab === 'dijkstra' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--apple-blue)' }}>
                    Dijkstra's Algorithm with Binary Min-Heap Priority Queue
                  </strong>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Time: O((V + E) log V) • Space: O(V)
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  Finds the shortest physical walking distance on the weighted campus graph.
                  Vertices with minimal tentative distance are extracted using a binary min-heap,
                  and outgoing edges are relaxed sequentially.
                </p>
              </div>

              {/* Active Route Summary */}
              {activeRoute?.found ? (
                <div>
                  <span className="section-label" style={{ marginBottom: '8px' }}>
                    Active Route Sequence & Relaxation Metrics
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', padding: '12px', background: 'var(--bg-canvas)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                    {activeRoute.path.map((nodeId, idx) => {
                      const v = graph.getVertex(nodeId);
                      const isFirst = idx === 0;
                      const isLast = idx === activeRoute.path.length - 1;
                      return (
                        <React.Fragment key={nodeId}>
                          <span style={{
                            padding: '3px 9px',
                            borderRadius: '980px',
                            background: isFirst ? 'var(--apple-blue)' : isLast ? 'var(--apple-orange)' : 'var(--bg-surface)',
                            color: (isFirst || isLast) ? '#FFFFFF' : 'var(--text-primary)',
                            border: `1px solid ${isFirst || isLast ? 'transparent' : 'var(--border-medium)'}`,
                            fontSize: '11px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-mono)'
                          }}>
                            {v?.code || nodeId}
                          </span>
                          {idx < activeRoute.path.length - 1 && (
                            <ArrowRight size={12} color="var(--text-muted)" />
                          )}
                        </React.Fragment>
                      );
                    })}
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700, color: 'var(--apple-blue)' }}>
                      Total: {activeRoute.distance}m
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--apple-red)', fontSize: '12px', fontWeight: 600, padding: '10px', background: 'var(--apple-red-subtle)', borderRadius: '8px' }}>
                  No active route found (all viable paths are currently obstructed by roadblocks).
                </div>
              )}

              {/* Relaxation Trace Log macOS Terminal */}
              {activeRoute?.trace && (
                <div>
                  <span className="section-label" style={{ marginBottom: '8px' }}>
                    Algorithm Execution Trace & Edge Relaxation Log
                  </span>
                  <div className="macos-terminal-card">
                    <div className="macos-terminal-header">
                      <div className="macos-traffic-lights">
                        <div className="traffic-light close" />
                        <div className="traffic-light minimize" />
                        <div className="traffic-light zoom" />
                      </div>
                      <span className="macos-terminal-title">dijkstra_trace.log</span>
                    </div>
                    <div className="macos-terminal-content">
                      {activeRoute.trace.map((item, idx) => (
                        <div key={idx} style={{ padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ color: item.type === 'VISIT' ? '#30D158' : item.type === 'RELAX' ? '#FF9F0A' : '#64D2FF' }}>
                            [{item.type}]
                          </span>{' '}
                          <span>{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HASH TABLE */}
          {activeTab === 'hashtable' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--apple-blue)' }}>
                    Separate Chaining Hash Table (M = {htInspection.capacity} Buckets)
                  </strong>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Horner's Polynomial Rolling Hash: h(s) = (∑ s[i] · 31^(n-1-i)) mod 17
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '8px' }}>
                  <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>CAPACITY</span>
                    <strong style={{ display: 'block', fontSize: '15px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{htInspection.capacity}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>ENTRIES</span>
                    <strong style={{ display: 'block', fontSize: '15px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{htInspection.size}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>COLLISIONS</span>
                    <strong style={{ display: 'block', fontSize: '15px', fontFamily: 'var(--font-mono)', color: 'var(--apple-orange)' }}>{htInspection.collisionCount}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>LOAD FACTOR (α)</span>
                    <strong style={{ display: 'block', fontSize: '15px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{htInspection.loadFactor}</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Hash Calculator */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-canvas)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>HASH LOOKUP TESTER:</span>
                <input
                  type="text"
                  value={hashTestInput}
                  onChange={(e) => setHashTestInput(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    width: '160px'
                  }}
                  placeholder="Type building or key..."
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--apple-blue)' }}>
                  → Hash("{hashTestInput}") = <strong>{testHashVal}</strong> (Bucket #{testHashVal})
                </span>
                {testSearchResult.found ? (
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--apple-green)', fontWeight: 600 }}>
                    ✓ Found in {testSearchResult.probeSteps} {testSearchResult.probeSteps === 1 ? 'step' : 'steps'}
                  </span>
                ) : (
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--apple-red)', fontWeight: 600 }}>
                    ✗ Key not present
                  </span>
                )}
              </div>

              {/* Bucket Distribution Table */}
              <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px', width: '80px' }}>Bucket</th>
                      <th style={{ padding: '8px 12px', width: '90px' }}>Chain Len</th>
                      <th style={{ padding: '8px 12px' }}>Separate Chaining Linked List (Collisions Handled)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {htInspection.buckets.map((b) => (
                      <tr key={b.index} style={{ borderBottom: '1px solid var(--border-light)', background: b.index === testHashVal ? 'var(--apple-blue-subtle)' : 'var(--bg-surface)' }}>
                        <td style={{ padding: '6px 12px', fontWeight: 700, color: 'var(--apple-blue)' }}>
                          [{b.index.toString().padStart(2, '0')}]
                        </td>
                        <td style={{ padding: '6px 12px', color: b.chainLength > 1 ? 'var(--apple-orange)' : 'var(--text-secondary)' }}>
                          {b.chainLength} {b.chainLength > 1 ? '⚠️' : ''}
                        </td>
                        <td style={{ padding: '6px 12px' }}>
                          {b.items.length === 0 ? (
                            <span style={{ color: 'var(--text-muted)' }}>NULL (empty slot)</span>
                          ) : (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                              {b.items.map((item, idx) => (
                                <React.Fragment key={idx}>
                                  <span style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-medium)', padding: '2px 8px', borderRadius: '6px' }}>
                                    "{item.key}" → <strong>{item.label}</strong>
                                  </span>
                                  {idx < b.items.length - 1 && <span style={{ color: 'var(--apple-orange)', fontWeight: 800 }}>→</span>}
                                </React.Fragment>
                              ))}
                              <span style={{ color: 'var(--text-muted)' }}>→ NULL</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ADJACENCY LIST */}
          {activeTab === 'adjlist' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--apple-blue)' }}>
                  Graph Adjacency List ({adjList.length} TCET Vertices, {graph.getAllEdges().length} Pathways)
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Weighted edges with physical distances in meters
                </span>
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {adjList.map((item) => (
                  <div
                    key={item.vertexId}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ width: '180px', flexShrink: 0 }}>
                      <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
                        {item.vertexName}
                      </strong>
                      <span style={{ display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        ID: {item.vertexId}
                      </span>
                    </div>

                    <ArrowRight size={13} color="var(--text-muted)" />

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
                      {item.edges.map((e) => (
                        <span
                          key={e.edgeId}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '980px',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            background: e.blocked ? 'var(--apple-red-subtle)' : 'var(--bg-subtle)',
                            border: `1px solid ${e.blocked ? 'rgba(255, 59, 48, 0.25)' : 'var(--border-light)'}`,
                            color: e.blocked ? 'var(--apple-red)' : 'var(--text-primary)'
                          }}
                        >
                          <span>{e.targetName}</span>
                          <strong style={{ color: e.blocked ? 'var(--apple-red)' : 'var(--apple-blue)' }}>
                            ({e.weight}m)
                          </strong>
                          {e.blocked && <span style={{ fontWeight: 800 }}>[BLOCKED]</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: C BACKEND ARCHITECTURE */}
          {activeTab === 'c_backend' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--apple-blue)' }}>
                    C ANSI Backend Architecture & Socket Server Integration
                  </strong>
                  <button
                    type="button"
                    className="header-btn"
                    style={{ fontSize: '11px' }}
                    onClick={onCheckCBackend}
                  >
                    <RefreshCw size={12} />
                    <span>Test Port 8080</span>
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.45' }}>
                  The project includes a pure ANSI C backend engine located in <code>backend_c/</code>,
                  implementing the identical graph data structures, Dijkstra algorithm, Min-Heap,
                  and separate chaining hash table.
                </p>
              </div>

              {/* Architecture Diagram macOS Terminal Window */}
              <div className="macos-terminal-card">
                <div className="macos-terminal-header">
                  <div className="macos-traffic-lights">
                    <div className="traffic-light close" />
                    <div className="traffic-light minimize" />
                    <div className="traffic-light zoom" />
                  </div>
                  <span className="macos-terminal-title">system_architecture.txt</span>
                </div>
                <div className="macos-terminal-content">
                  <pre style={{ margin: 0, lineHeight: '1.45' }}>{`+-------------------------------------------------------------+
|  React 19 Apple Maps Frontend (Single-Page Application)     |
|  - Architectural Vector Canvas with Pan/Zoom & Layers       |
|  - Dynamic Route Simulation & Step-by-Step Directions       |
|  - Dual Mode: Active JS DSA Engine <--> C REST Connector   |
+------------------------------+------------------------------+
                               |
                   HTTP REST   |  Port 8080 (JSON)
                   POST /api/route, POST /api/nearby
                               v
+-------------------------------------------------------------+
|  Native C Micro-Server (backend_c/server.c)                 |
|  - graph.c: Adjacency list representation & roadblock sync  |
|  - hash_table.c: Horner's polynomial hash & chaining        |
|  - priority_queue.c: Binary min-heap for optimal Dijkstra   |
|  - dijkstra.c: O((V + E) log V) shortest path routing       |
|  - bfs.c: FIFO Queue frontier discovery                     |
+-------------------------------------------------------------+`}</pre>
                </div>
              </div>

              {/* Compilation Snippet */}
              <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-light)', padding: '12px 14px', borderRadius: '10px' }}>
                <span className="section-label" style={{ marginBottom: '6px' }}>
                  Build and Run the C Server (Optional Native Acceleration):
                </span>
                <div className="macos-terminal-card" style={{ marginTop: '6px' }}>
                  <div className="macos-terminal-header" style={{ padding: '6px 10px' }}>
                    <div className="macos-traffic-lights">
                      <div className="traffic-light close" />
                      <div className="traffic-light minimize" />
                      <div className="traffic-light zoom" />
                    </div>
                    <span className="macos-terminal-title">terminal — bash</span>
                  </div>
                  <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px', color: '#30D158' }}>
                    <span>$ cd backend_c</span>
                    <span>$ gcc -O2 -o campus_server.exe server.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c -lws2_32</span>
                    <span>$ ./campus_server.exe</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
