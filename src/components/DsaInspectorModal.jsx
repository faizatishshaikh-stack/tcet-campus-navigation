import React, { useState } from 'react';
import { 
  X, Cpu, Network, Hash, GitBranch, Terminal, 
  CheckCircle2, ArrowRight, Server, RefreshCw 
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
    { id: 'c_backend', label: 'C Backend & Architecture', icon: <Terminal size={13} /> }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Cpu size={18} color="var(--forest-800)" />
            <span>DSA Laboratory & Algorithm Inspector</span>
            <span className="brand-badge">ACADEMIC AUDIT MODE</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs-bar">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`modal-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
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
              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--forest-800)' }}>
                    Dijkstra's Algorithm with Binary Min-Heap Priority Queue
                  </strong>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Time: O((V + E) log V) • Space: O(V)
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Finds the shortest physical walking distance on the weighted campus graph.
                  Vertices with minimal tentative distance are extracted using a binary min-heap,
                  and outgoing edges are relaxed sequentially.
                </p>
              </div>

              {/* Active Route Summary */}
              {activeRoute?.found ? (
                <div>
                  <span className="section-label" style={{ marginBottom: '6px' }}>
                    Active Route Sequence & Relaxation Metrics
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', padding: '10px', background: 'var(--bg-canvas)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                    {activeRoute.path.map((nodeId, idx) => {
                      const v = graph.getVertex(nodeId);
                      return (
                        <React.Fragment key={nodeId}>
                          <span style={{ padding: '3px 8px', borderRadius: '4px', background: idx === 0 ? 'var(--forest-800)' : idx === activeRoute.path.length - 1 ? 'var(--orange-600)' : 'var(--bg-surface)', color: (idx === 0 || idx === activeRoute.path.length - 1) ? '#FFFFFF' : 'var(--text-primary)', border: '1px solid var(--border-medium)', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            {v?.code || nodeId}
                          </span>
                          {idx < activeRoute.path.length - 1 && (
                            <ArrowRight size={12} color="var(--text-muted)" />
                          )}
                        </React.Fragment>
                      );
                    })}
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 800, color: 'var(--forest-800)' }}>
                      Total: {activeRoute.distance}m
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#C5221F', fontSize: '12px', fontWeight: 600 }}>
                  No active route found (the path is currently blocked).
                </div>
              )}

              {/* Relaxation Trace Log */}
              {activeRoute?.trace && (
                <div>
                  <span className="section-label" style={{ marginBottom: '6px' }}>
                    Algorithm Execution Trace & Edge Relaxation Log
                  </span>
                  <div style={{ background: '#19221C', color: '#D4E2D9', padding: '12px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', maxHeight: '240px', overflowY: 'auto' }}>
                    {activeRoute.trace.map((item, idx) => (
                      <div key={idx} style={{ padding: '3px 0', borderBottom: '1px solid #28362D' }}>
                        <span style={{ color: item.type === 'VISIT' ? '#68D391' : item.type === 'RELAX' ? '#F6AD55' : '#63B3ED' }}>
                          [{item.type}]
                        </span>{' '}
                        <span>{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HASH TABLE */}
          {activeTab === 'hashtable' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--forest-800)' }}>
                    Separate Chaining Hash Table (M = {htInspection.capacity} Buckets)
                  </strong>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Horner's Polynomial Rolling Hash: h(s) = (∑ s[i] · 31^(n-1-i)) mod 17
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '8px' }}>
                  <div style={{ background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>BUCKET CAPACITY</span>
                    <strong style={{ display: 'block', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{htInspection.capacity}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>STORED ENTRIES</span>
                    <strong style={{ display: 'block', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{htInspection.size}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>COLLISION COUNT</span>
                    <strong style={{ display: 'block', fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--orange-800)' }}>{htInspection.collisionCount}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LOAD FACTOR (α)</span>
                    <strong style={{ display: 'block', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{htInspection.loadFactor}</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Hash Calculator */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-canvas)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>HASH LOOKUP TESTER:</span>
                <input
                  type="text"
                  value={hashTestInput}
                  onChange={(e) => setHashTestInput(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '4px',
                    border: '1px solid var(--border-medium)',
                    width: '160px'
                  }}
                  placeholder="Type building or key..."
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--forest-800)' }}>
                  → Hash("{hashTestInput}") = <strong>{testHashVal}</strong> (Bucket #{testHashVal})
                </span>
                {testSearchResult.found ? (
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#2E8B57', fontWeight: 700 }}>
                    ✓ Found in {testSearchResult.probeSteps} {testSearchResult.probeSteps === 1 ? 'step' : 'steps'}
                  </span>
                ) : (
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#C5221F', fontWeight: 700 }}>
                    ✗ Key not present
                  </span>
                )}
              </div>

              {/* Bucket Distribution Table */}
              <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '6px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                      <th style={{ padding: '6px 10px', width: '80px' }}>Bucket</th>
                      <th style={{ padding: '6px 10px', width: '80px' }}>Chain Len</th>
                      <th style={{ padding: '6px 10px' }}>Separate Chaining Linked List (Collisions Handled)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {htInspection.buckets.map((b) => (
                      <tr key={b.index} style={{ borderBottom: '1px solid var(--border-light)', background: b.index === testHashVal ? 'var(--forest-50)' : 'var(--bg-surface)' }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700, color: 'var(--forest-800)' }}>
                          [{b.index.toString().padStart(2, '0')}]
                        </td>
                        <td style={{ padding: '6px 10px', color: b.chainLength > 1 ? '#A84814' : 'var(--text-secondary)' }}>
                          {b.chainLength} {b.chainLength > 1 ? '⚠️' : ''}
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          {b.items.length === 0 ? (
                            <span style={{ color: 'var(--text-muted)' }}>NULL (empty slot)</span>
                          ) : (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                              {b.items.map((item, idx) => (
                                <React.Fragment key={idx}>
                                  <span style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-medium)', padding: '2px 6px', borderRadius: '4px' }}>
                                    "{item.key}" → <strong>{item.label}</strong>
                                  </span>
                                  {idx < b.items.length - 1 && <span style={{ color: '#A84814', fontWeight: 800 }}>→</span>}
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
              <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--forest-800)' }}>
                  Graph Adjacency List ({adjList.length} TCET Vertices, {graph.getAllEdges().length} Pathways)
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Weighted edges with physical distances in meters
                </span>
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {adjList.map((item) => (
                  <div
                    key={item.vertexId}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{ width: '180px', flexShrink: 0 }}>
                      <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
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
                            padding: '3px 7px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            background: e.blocked ? '#FDEDED' : 'var(--bg-subtle)',
                            border: `1px solid ${e.blocked ? '#F5C6C6' : 'var(--border-light)'}`,
                            color: e.blocked ? '#C5221F' : 'var(--text-primary)'
                          }}
                        >
                          <span>{e.targetName}</span>
                          <strong style={{ color: e.blocked ? '#C5221F' : 'var(--forest-800)' }}>
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
              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--forest-800)' }}>
                    C ANSI Backend Architecture & Socket Server Integration
                  </strong>
                  <button
                    className="header-btn"
                    style={{ fontSize: '11px' }}
                    onClick={onCheckCBackend}
                  >
                    <RefreshCw size={12} />
                    <span>Test Port 8080</span>
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  The project includes a pure ANSI C backend engine located in <code>backend_c/</code>,
                  implementing the identical graph data structures, Dijkstra algorithm, Min-Heap,
                  and separate chaining hash table.
                </p>
              </div>

              {/* Architecture Diagram Box */}
              <div style={{ background: '#19221C', color: '#D4E2D9', padding: '14px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <div style={{ color: '#68D391', fontWeight: 700, marginBottom: '6px' }}>
                  System Architecture Pipeline:
                </div>
                <pre style={{ margin: 0, lineHeight: '1.4' }}>{`+-------------------------------------------------------------+
|  React 19 Frontend (Single-Page Application)                |
|  - Architectural SVG Campus Map with Pan/Zoom & Layers      |
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

              {/* Compilation Snippet */}
              <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '6px' }}>
                <span className="section-label" style={{ marginBottom: '6px' }}>
                  How to Build and Run the C Server (Optional Native Acceleration):
                </span>
                <div style={{ background: '#252F28', color: '#E4EDE7', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>&gt; cd backend_c</span>
                  <span>&gt; gcc -O2 -o campus_server.exe server.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c -lws2_32</span>
                  <span>&gt; .\campus_server.exe</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
