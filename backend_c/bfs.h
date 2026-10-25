/**
 * bfs.h - Queue and Breadth-First Search (BFS) for Campus Proximity Exploration in C
 */

#ifndef BFS_H
#define BFS_H

#include "dsa_types.h"

void queue_init(Queue* q);
bool queue_is_empty(const Queue* q);
void queue_push(Queue* q, int vertexIndex, int hop, int cumulativeDist);
QueueNode queue_pop(Queue* q);
void queue_free(Queue* q);

typedef struct {
    int vertexIndices[MAX_VERTICES];
    int hopDistances[MAX_VERTICES];
    int physicalDistances[MAX_VERTICES];
    int count;
} BFSResult;

BFSResult bfs_find_nearby(const Graph* graph, int startIdx, int maxHops);
void bfs_print_results(const Graph* graph, const BFSResult* result, int startIdx);

#endif /* BFS_H */
