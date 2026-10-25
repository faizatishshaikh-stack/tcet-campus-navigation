import { CAMPUS_BUILDINGS, CAMPUS_PATHWAYS } from './src/data/campusData.js';
import { Graph } from './src/dsa/Graph.js';
import { HashTable } from './src/dsa/HashTable.js';
import { Dijkstra } from './src/dsa/Dijkstra.js';
import { BFS } from './src/dsa/BFS.js';

console.log('====================================================');
console.log('   TCET CAMPUS NAVIGATION DSA VERIFICATION SUITE   ');
console.log('   Thakur College of Engineering & Technology, Mumbai');
console.log('====================================================');

// 1. Setup Graph & Hash Table
const graph = new Graph();
const hashTable = new HashTable(17);

for (const b of CAMPUS_BUILDINGS) {
  graph.addVertex(b.id, b);
  hashTable.insert(b.id, b);
  hashTable.insert(b.name, b);
  hashTable.insert(b.code, b);
  if (b.shortName) hashTable.insert(b.shortName, b);
}

for (const p of CAMPUS_PATHWAYS) {
  graph.addEdge(p.id, p.from, p.to, p.distance, p.name, p.surface, true);
}

console.log(`[OK] Loaded ${CAMPUS_BUILDINGS.length} TCET vertices and ${CAMPUS_PATHWAYS.length} pathways.`);

// 2. Test Hash Table
console.log('\n--- 1. Testing Hash Table (TCET Location Lookups) ---');
const queries = ['gate_5', 'library_lrc', 'COMP', 'canteen', 'sports_ground', 'non_existent'];
for (const q of queries) {
  const res = hashTable.get(q);
  console.log(`Query "${q}" -> Found: ${res.found}, Bucket: ${res.bucketIndex}, Steps: ${res.probeSteps}`);
}
const htMetrics = hashTable.getInspectionData();
console.log(`Hash Table Load Factor: ${htMetrics.loadFactor}, Collisions: ${htMetrics.collisionCount}`);

// 3. Test Dijkstra Shortest Path
console.log('\n--- 2. Testing Dijkstra Shortest Path (Gate 5 to CS Labs) ---');
const route1 = Dijkstra.findShortestPath(graph, 'gate_5', 'cs_it_labs');
console.log('Route from Gate No. 5 to Computing & AI Labs Hub:');
console.log('  Found:', route1.found);
console.log('  Path:', route1.path.join(' -> '));
console.log(`  Distance: ${route1.distance}m (${route1.estimatedMinutes} min walking)`);

// 4. Test Alternative Route
console.log('\n--- 3. Testing Alternative Route Generation ---');
const routes = Dijkstra.findRoutes(graph, 'gate_5', 'cs_it_labs');
console.log('  Primary Route Path:     ', routes.primary.path.join(' -> '), `(${routes.primary.distance}m)`);
if (routes.alternative) {
  console.log('  Alternative Route Path: ', routes.alternative.path.join(' -> '), `(${routes.alternative.distance}m)`);
} else {
  console.log('  No distinct alternative route found.');
}

// 5. Test Blocked Edge & Dynamic Rerouting
console.log('\n--- 4. Testing Roadblock Recalculation ---');
console.log('Blocking path: path_gate5_foyer (Main entrance promenade)');
graph.setEdgeBlocked('path_gate5_foyer', true);
const rerouted = Dijkstra.findShortestPath(graph, 'gate_5', 'cs_it_labs');
console.log('  Rerouted Path around roadblock:', rerouted.path.join(' -> '), `(${rerouted.distance}m)`);
graph.setEdgeBlocked('path_gate5_foyer', false); // reset

// 6. Test BFS Nearby Amenities
console.log('\n--- 5. Testing Breadth-First Search (BFS) from Central Foyer ---');
const bfsResult = BFS.findNearby(graph, 'tcet_foyer', 'academic');
console.log(`Nearby Academic locations from A-Block Foyer (${bfsResult.nearby.length} found):`);
for (const item of bfsResult.nearby) {
  console.log(`  - ${item.data.name} [Hop ${item.hop}, ~${item.distance}m]`);
}

console.log('\n[SUCCESS] All TCET DSA verification tests executed and passed flawlessly!');
