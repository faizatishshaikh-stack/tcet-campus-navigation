/**
 * Queue Data Structure & Breadth-First Search (BFS) Implementation
 * 
 * Used for:
 * 1. Exploring connected locations on the campus graph
 * 2. Discovering nearby amenities, facilities, and academic blocks
 * 3. Level-by-level (hop-by-hop) frontier traversal
 */

class QueueNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

export class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  enqueue(value) {
    const newNode = new QueueNode(value);
    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  dequeue() {
    if (!this.head) return null;
    const removedValue = this.head.value;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    this.length--;
    return removedValue;
  }

  isEmpty() {
    return this.length === 0;
  }

  size() {
    return this.length;
  }

  toArray() {
    const items = [];
    let current = this.head;
    while (current) {
      items.push(current.value);
      current = current.next;
    }
    return items;
  }
}

export class BFS {
  /**
   * Traverse graph using BFS starting from startId
   * 
   * @param {Graph} graph 
   * @param {string} startId 
   * @param {number} maxHops Maximum levels to traverse (default 4)
   * @returns {Object} { visitedNodes, levels, trace }
   */
  static traverse(graph, startId, maxHops = 4) {
    if (!graph.getVertex(startId)) return { nodes: [], trace: [] };

    const visited = new Set([startId]);
    const queue = new Queue();
    const hopDistance = new Map([[startId, 0]]);
    const cumulativeDistance = new Map([[startId, 0]]);
    const predecessor = new Map([[startId, null]]);

    queue.enqueue({ id: startId, hop: 0, distance: 0 });

    const orderedResults = [];
    const trace = [];

    trace.push({
      step: 0,
      action: 'ENQUEUE_START',
      node: startId,
      queueState: queue.toArray().map(item => item.id),
      description: `Started BFS at "${startId}". Enqueued root with 0 hops.`
    });

    let stepCounter = 1;

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      const u = current.id;
      const uHop = current.hop;
      const uDist = current.distance;

      const vertexData = graph.getVertex(u);
      orderedResults.push({
        id: u,
        data: vertexData,
        hop: uHop,
        distance: uDist
      });

      if (uHop >= maxHops) continue;

      const neighbors = graph.getNeighbors(u, false); // skips blocked edges
      for (const edge of neighbors) {
        const v = edge.target;
        if (!visited.has(v)) {
          visited.add(v);
          hopDistance.set(v, uHop + 1);
          cumulativeDistance.set(v, uDist + edge.weight);
          predecessor.set(v, u);

          queue.enqueue({
            id: v,
            hop: uHop + 1,
            distance: uDist + edge.weight
          });

          trace.push({
            step: stepCounter++,
            action: 'DISCOVER_NEIGHBOR',
            from: u,
            node: v,
            hop: uHop + 1,
            distance: uDist + edge.weight,
            queueState: queue.toArray().map(item => item.id),
            description: `Discovered neighbor "${v}" from "${u}" (Hop ${uHop + 1}, cumulative ${uDist + edge.weight}m). Enqueued.`
          });
        }
      }
    }

    return {
      nodes: orderedResults,
      hopMap: Object.fromEntries(hopDistance),
      distanceMap: Object.fromEntries(cumulativeDistance),
      trace
    };
  }

  /**
   * Find nearby locations filtered optionally by category
   */
  static findNearby(graph, startId, categoryFilter = null) {
    const bfsResult = this.traverse(graph, startId, 5);

    // Filter out root itself
    let nearby = bfsResult.nodes.filter(item => item.id !== startId);

    if (categoryFilter && categoryFilter !== 'all') {
      nearby = nearby.filter(item => item.data?.category === categoryFilter);
    }

    return {
      startNode: graph.getVertex(startId),
      nearby,
      trace: bfsResult.trace
    };
  }
}
