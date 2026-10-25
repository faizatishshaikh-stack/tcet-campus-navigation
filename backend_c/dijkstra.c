/**
 * dijkstra.c - Implementation of Dijkstra's Shortest Path Algorithm
 * with Min-Heap Priority Queue.
 * Time Complexity: O((V + E) log V)
 * Space Complexity: O(V)
 */

#include "dijkstra.h"
#include "priority_queue.h"

RouteResult dijkstra_find_route(const Graph* graph, int startIdx, int destIdx, 
                                const char* excludeEdgeId) {
    RouteResult result;
    result.found = false;
    result.totalDistance = 0;
    result.estimatedMinutes = 0;
    result.pathLength = 0;

    if (!graph || startIdx < 0 || startIdx >= graph->vertexCount ||
        destIdx < 0 || destIdx >= graph->vertexCount) {
        return result;
    }

    if (startIdx == destIdx) {
        result.found = true;
        result.pathIndices[0] = startIdx;
        result.pathLength = 1;
        return result;
    }

    int dist[MAX_VERTICES];
    int prev[MAX_VERTICES];
    char prevEdgeId[MAX_VERTICES][MAX_ID_LEN];
    bool visited[MAX_VERTICES];

    for (int i = 0; i < graph->vertexCount; i++) {
        dist[i] = INF;
        prev[i] = -1;
        prevEdgeId[i][0] = '\0';
        visited[i] = false;
    }

    MinHeap pq;
    minheap_init(&pq);

    dist[startIdx] = 0;
    minheap_push(&pq, startIdx, 0);

    while (!minheap_is_empty(&pq)) {
        MinHeapNode current = minheap_pop(&pq);
        int u = current.vertexIndex;

        if (visited[u]) continue;
        visited[u] = true;

        if (u == destIdx) break;

        EdgeNode* edge = graph->vertices[u].head;
        while (edge != NULL) {
            // Skip blocked edges or excluded edges (for alternative route calculation)
            if (edge->isBlocked) {
                edge = edge->next;
                continue;
            }
            if (excludeEdgeId && strcmp(edge->edgeId, excludeEdgeId) == 0) {
                edge = edge->next;
                continue;
            }

            int v = edge->targetIndex;
            if (!visited[v] && dist[u] + edge->weight < dist[v]) {
                dist[v] = dist[u] + edge->weight;
                prev[v] = u;
                strncpy(prevEdgeId[v], edge->edgeId, MAX_ID_LEN - 1);
                prevEdgeId[v][MAX_ID_LEN - 1] = '\0';
                minheap_push(&pq, v, dist[v]);
            }
            edge = edge->next;
        }
    }

    if (dist[destIdx] == INF) {
        // Destination unreachable
        return result;
    }

    // Backtrack path
    int tempPath[MAX_VERTICES];
    char tempEdges[MAX_VERTICES][MAX_ID_LEN];
    int count = 0;
    int curr = destIdx;

    while (curr != -1) {
        tempPath[count] = curr;
        if (prev[curr] != -1) {
            strncpy(tempEdges[count], prevEdgeId[curr], MAX_ID_LEN - 1);
            tempEdges[count][MAX_ID_LEN - 1] = '\0';
        }
        count++;
        curr = prev[curr];
    }

    // Reverse path into result
    result.found = true;
    result.totalDistance = dist[destIdx];
    result.estimatedMinutes = (dist[destIdx] + 79) / 80; // Ceiling walking time
    result.pathLength = count;

    for (int i = 0; i < count; i++) {
        result.pathIndices[i] = tempPath[count - 1 - i];
        if (i < count - 1) {
            strncpy(result.pathEdgeIds[i], tempEdges[count - 2 - i], MAX_ID_LEN - 1);
            result.pathEdgeIds[i][MAX_ID_LEN - 1] = '\0';
        }
    }

    return result;
}

void dijkstra_print_route(const Graph* graph, const RouteResult* route) {
    if (!route->found) {
        printf("Route Status: NO ROUTE FOUND (Path is blocked or unreachable)\n");
        return;
    }

    printf("\n=== DIJKSTRA SHORTEST PATH NAVIGATION ROUTE ===\n");
    printf("Total Walking Distance: %d meters\n", route->totalDistance);
    printf("Estimated Walking Time: %d minutes (@ 80 m/min)\n", route->estimatedMinutes);
    printf("Waypoints in Sequence (%d stops):\n", route->pathLength);

    for (int i = 0; i < route->pathLength; i++) {
        int vIdx = route->pathIndices[i];
        const Vertex* v = &graph->vertices[vIdx];
        if (i == 0) {
            printf("  [START]       %s (%s, %s)\n", v->name, v->code, v->category);
        } else if (i == route->pathLength - 1) {
            printf("  [DESTINATION] %s (%s, %s)\n", v->name, v->code, v->category);
        } else {
            printf("  [%02d]          %s (%s)\n", i, v->name, v->code);
        }
    }
    printf("===============================================\n\n");
}
