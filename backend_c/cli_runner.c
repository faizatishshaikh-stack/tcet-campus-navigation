/**
 * cli_runner.c - Standalone Command-Line Runner for Campus Navigation DSA Mini-Project
 * Demonstrates TCET (Thakur College of Engineering and Technology) Campus Navigation.
 * 
 * 1. Hash Table lookup with separate chaining collision diagnostics
 * 2. Dijkstra's Shortest Path Algorithm from Gate 5 to CS & IT Labs
 * 3. Dynamic Pathway Blockade and Real-Time Rerouting
 * 4. Breadth-First Search (BFS) for nearby amenities from A-Block Foyer
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "dsa_types.h"
#include "graph.h"
#include "hash_table.h"
#include "priority_queue.h"
#include "dijkstra.h"
#include "bfs.h"
#include "campus_data.h"

int main(int argc, char* argv[]) {
    Graph campusGraph;
    HashTable lookupTable;

    printf("==================================================================\n");
    printf("   TCET KANDIVALI EAST - SMART CAMPUS NAVIGATION ENGINE (C)       \n");
    printf("   Thakur College of Engineering and Technology - DSA Mini-Project\n");
    printf("==================================================================\n");

    // Initialize dataset
    campus_init_data(&campusGraph, &lookupTable);
    printf("[INIT] Campus Graph Loaded: %d Vertices, 23 Bidirectional Pathways.\n", campusGraph.vertexCount);
    printf("[INIT] Hash Table Populated: %d Keys across %d Buckets.\n\n", lookupTable.size, HASH_TABLE_CAPACITY);

    // DEMO 1: Hash Table Lookup
    printf(">>> DEMO 1: Hash Table Separate Chaining Lookup (TCET Locations)\n");
    const char* searchQueries[] = { "gate 5", "library", "canteen", "workshop", "cs", "unknown_loc" };
    for (int i = 0; i < 6; i++) {
        int idx = ht_search(&lookupTable, searchQueries[i]);
        if (idx != -1) {
            printf("  Lookup query '%s' -> Found: %s (%s, %s) at index %d\n",
                   searchQueries[i], campusGraph.vertices[idx].name, 
                   campusGraph.vertices[idx].code, campusGraph.vertices[idx].category, idx);
        } else {
            printf("  Lookup query '%s' -> Key NOT found in Hash Table.\n", searchQueries[i]);
        }
    }

    // Print Hash Table Diagnostics
    ht_print_diagnostics(&lookupTable, &campusGraph);

    // DEMO 2: Dijkstra Shortest Path Navigation
    printf(">>> DEMO 2: Dijkstra Shortest Path Navigation\n");
    const char* startId = "gate_5";
    const char* destId = "cs_it_labs";

    int startIdx = ht_search(&lookupTable, startId);
    int destIdx = ht_search(&lookupTable, destId);

    printf("Calculating route: %s (%s) ---> %s (%s)\n",
           campusGraph.vertices[startIdx].name, startId,
           campusGraph.vertices[destIdx].name, destId);

    RouteResult primaryRoute = dijkstra_find_route(&campusGraph, startIdx, destIdx, NULL);
    dijkstra_print_route(&campusGraph, &primaryRoute);

    // DEMO 3: Blocked Pathway Recalculation
    printf(">>> DEMO 3: Simulating Blocked Pathway & Real-Time Rerouting\n");
    const char* blockedEdge = "path_gate5_foyer"; // Main entrance promenade blocked
    printf("  [EVENT] Pathway '%s' is now BLOCKED due to portico maintenance!\n", blockedEdge);
    graph_set_edge_blocked(&campusGraph, blockedEdge, true);

    RouteResult reroutedPath = dijkstra_find_route(&campusGraph, startIdx, destIdx, NULL);
    printf("Recalculated New Shortest Route around roadblock (via Student Covered Walkway):\n");
    dijkstra_print_route(&campusGraph, &reroutedPath);

    // Unblock for BFS demo
    graph_set_edge_blocked(&campusGraph, blockedEdge, false);

    // DEMO 4: BFS Nearby Amenities Exploration
    printf(">>> DEMO 4: Breadth-First Search (BFS) for Nearby Locations from Central Foyer\n");
    int foyerIdx = ht_search(&lookupTable, "tcet_foyer");
    BFSResult nearby = bfs_find_nearby(&campusGraph, foyerIdx, 3);
    bfs_print_results(&campusGraph, &nearby, foyerIdx);

    // Clean up
    graph_free(&campusGraph);
    ht_free(&lookupTable);

    printf("TCET DSA Engine execution completed successfully.\n");
    return 0;
}
