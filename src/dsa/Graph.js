/**
 * Weighted Graph Representation using Adjacency Lists
 * 
 * Vertices: Campus buildings & landmarks
 * Edges: Pedestrian walkways with weights representing physical walking distance (meters)
 * Features dynamic edge blocking (for construction/maintenance rerouting)
 */

export class Edge {
  constructor(id, source, target, weight, name = '', surface = '', blocked = false) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.weight = weight;
    this.name = name;
    this.surface = surface;
    this.blocked = blocked;
  }
}

export class Graph {
  constructor() {
    this.adjacencyList = new Map(); // vertexId -> Array of Edge
    this.vertices = new Map();      // vertexId -> vertexData
    this.edges = new Map();         // edgeId -> Edge
  }

  addVertex(id, data = {}) {
    if (!this.adjacencyList.has(id)) {
      this.adjacencyList.set(id, []);
      this.vertices.set(id, { id, ...data });
    }
  }

  addEdge(id, source, target, weight, name = '', surface = '', bidirectional = true) {
    if (!this.adjacencyList.has(source)) this.addVertex(source);
    if (!this.adjacencyList.has(target)) this.addVertex(target);

    const edgeForward = new Edge(id, source, target, weight, name, surface, false);
    this.edges.set(id, edgeForward);

    this.adjacencyList.get(source).push(edgeForward);

    if (bidirectional) {
      // Reverse edge references the same edgeId so blocking affects both directions
      const edgeBackward = new Edge(id, target, source, weight, name, surface, false);
      this.adjacencyList.get(target).push(edgeBackward);
    }
  }

  setEdgeBlocked(edgeId, isBlocked) {
    if (this.edges.has(edgeId)) {
      const edge = this.edges.get(edgeId);
      edge.blocked = isBlocked;

      // Update both directions in adjacency list
      for (const [_, edgeList] of this.adjacencyList) {
        for (const e of edgeList) {
          if (e.id === edgeId) {
            e.blocked = isBlocked;
          }
        }
      }
      return true;
    }
    return false;
  }

  isEdgeBlocked(edgeId) {
    return this.edges.get(edgeId)?.blocked ?? false;
  }

  getBlockedEdges() {
    const blocked = [];
    for (const [id, edge] of this.edges) {
      if (edge.blocked) {
        blocked.push(edge);
      }
    }
    return blocked;
  }

  getNeighbors(vertexId, includeBlocked = false) {
    if (!this.adjacencyList.has(vertexId)) return [];
    const edges = this.adjacencyList.get(vertexId);
    if (includeBlocked) return edges;
    return edges.filter(e => !e.blocked);
  }

  getEdgeBetween(u, v) {
    const edges = this.adjacencyList.get(u) || [];
    return edges.find(e => e.target === v) || null;
  }

  getVertex(id) {
    return this.vertices.get(id);
  }

  getAllVertices() {
    return Array.from(this.vertices.values());
  }

  getAllEdges() {
    return Array.from(this.edges.values());
  }

  /**
   * Returns clean structure for DSA Inspector visualization
   */
  getAdjacencyListRepresentation() {
    const representation = [];
    for (const [vertexId, edges] of this.adjacencyList.entries()) {
      const vertex = this.vertices.get(vertexId);
      representation.push({
        vertexId,
        vertexName: vertex?.name || vertexId,
        category: vertex?.category || 'general',
        edges: edges.map(e => ({
          targetId: e.target,
          targetName: this.vertices.get(e.target)?.name || e.target,
          weight: e.weight,
          edgeId: e.id,
          name: e.name,
          blocked: e.blocked
        }))
      });
    }
    return representation;
  }
}
