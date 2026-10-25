/**
 * Dijkstra's Shortest Path Algorithm
 * 
 * Computes minimum-distance walking routes on the campus weighted graph.
 * Supports:
 * - Blocked edge avoidance (re-routing during maintenance)
 * - Alternative path discovery (finding distinct secondary routes)
 * - Step-by-step trace generation for DSA algorithm inspection
 */

import { MinPriorityQueue } from './MinPriorityQueue.js';

export class Dijkstra {
  /**
   * Run Dijkstra between startNode and endNode
   * 
   * @param {Graph} graph 
   * @param {string} startId 
   * @param {string} endId 
   * @param {Object} options { excludedEdgeIds?: Set, penalizedEdgeIds?: Map }
   * @returns {Object} Route result with path, distance, edges, trace
   */
  static findShortestPath(graph, startId, endId, options = {}) {
    const { excludedEdgeIds = new Set(), penalizedEdgeIds = new Map() } = options;

    if (!graph.getVertex(startId) || !graph.getVertex(endId)) {
      return {
        found: false,
        error: 'Invalid start or destination location.',
        path: [],
        distance: 0,
        trace: []
      };
    }

    if (startId === endId) {
      return {
        found: true,
        path: [startId],
        distance: 0,
        estimatedMinutes: 0,
        edges: [],
        trace: [{ step: 'Start equals destination', node: startId }]
      };
    }

    const distances = new Map();
    const previous = new Map();
    const previousEdge = new Map();
    const visited = new Set();
    const pq = new MinPriorityQueue();
    const trace = [];

    // 1. Initialize distances
    for (const vertex of graph.getAllVertices()) {
      distances.set(vertex.id, Infinity);
    }
    distances.set(startId, 0);
    pq.push({ id: startId, priority: 0 });

    trace.push({
      type: 'INIT',
      description: `Initialized tentative distances to Infinity. Set start node "${startId}" to distance 0.`,
      distances: new Map(distances)
    });

    let targetReached = false;

    // 2. Main Dijkstra Loop
    while (!pq.isEmpty()) {
      const current = pq.pop();
      const u = current.id;
      const currentDist = current.priority;

      // Skip stale priority queue entries
      if (currentDist > distances.get(u)) continue;

      visited.add(u);

      trace.push({
        type: 'VISIT',
        node: u,
        distance: currentDist,
        description: `Popped node "${u}" with min tentative distance ${currentDist}m from priority queue.`
      });

      if (u === endId) {
        targetReached = true;
        break;
      }

      // 3. Relax outgoing edges
      const neighbors = graph.getNeighbors(u, false); // skips blocked edges
      for (const edge of neighbors) {
        // Skip explicitly excluded edges (used during alternative route calculation)
        if (excludedEdgeIds.has(edge.id)) continue;

        const v = edge.target;
        if (visited.has(v)) continue;

        // Apply penalty if computing secondary route
        const penaltyMultiplier = penalizedEdgeIds.get(edge.id) || 1.0;
        const effectiveWeight = edge.weight * penaltyMultiplier;
        const newDist = distances.get(u) + effectiveWeight;

        if (newDist < distances.get(v)) {
          const oldDist = distances.get(v);
          distances.set(v, newDist);
          previous.set(v, u);
          previousEdge.set(v, edge);
          pq.push({ id: v, priority: newDist });

          trace.push({
            type: 'RELAX',
            edgeId: edge.id,
            from: u,
            to: v,
            weight: edge.weight,
            oldDist: oldDist === Infinity ? '∞' : `${oldDist}m`,
            newDist: `${newDist}m`,
            description: `Relaxed edge (${u} → ${v}, ${edge.weight}m). Updated tentative distance of ${v} from ${oldDist === Infinity ? '∞' : oldDist + 'm'} to ${newDist}m.`
          });
        }
      }
    }

    if (!targetReached && distances.get(endId) === Infinity) {
      return {
        found: false,
        error: 'No available pathway exists between the selected locations (pathway may be blocked).',
        path: [],
        distance: 0,
        estimatedMinutes: 0,
        edges: [],
        trace
      };
    }

    // 4. Reconstruct path from endId back to startId
    const path = [];
    const edges = [];
    let curr = endId;
    let actualPhysicalDistance = 0;

    while (curr) {
      path.unshift(curr);
      const prevEdge = previousEdge.get(curr);
      if (prevEdge) {
        edges.unshift(prevEdge);
        actualPhysicalDistance += prevEdge.weight;
      }
      curr = previous.get(curr);
    }

    // Average walking speed ~80 meters per minute (1.33 m/s)
    const estimatedMinutes = Math.max(1, Math.round(actualPhysicalDistance / 80));
    const estimatedCalories = Math.round(actualPhysicalDistance * 0.045);

    return {
      found: true,
      path,
      distance: actualPhysicalDistance,
      estimatedMinutes,
      estimatedCalories,
      edges,
      visitedOrder: Array.from(visited),
      trace,
      pqLog: pq.getLog()
    };
  }

  /**
   * Calculate both primary shortest route and an alternative route
   */
  static findRoutes(graph, startId, endId) {
    // 1. Primary shortest path
    const primary = this.findShortestPath(graph, startId, endId);

    if (!primary.found || primary.path.length <= 2) {
      return {
        primary,
        alternative: null
      };
    }

    // 2. Find alternative path by penalizing primary path edges
    // We penalize the edges by a factor of 2.2 to encourage Dijkstra to explore different paths
    const penalizedEdges = new Map();
    for (const edge of primary.edges) {
      penalizedEdges.set(edge.id, 2.2);
    }

    const alternative = this.findShortestPath(graph, startId, endId, {
      penalizedEdgeIds: penalizedEdges
    });

    // Verify if alternative is distinct from primary
    const isDistinct = alternative.found && 
      (alternative.path.join('-') !== primary.path.join('-'));

    return {
      primary,
      alternative: isDistinct ? alternative : null
    };
  }
}
