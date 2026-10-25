/**
 * priority_queue.h - Binary Min-Heap Priority Queue for Dijkstra's Algorithm in C
 */

#ifndef PRIORITY_QUEUE_H
#define PRIORITY_QUEUE_H

#include "dsa_types.h"

void minheap_init(MinHeap* heap);
bool minheap_is_empty(const MinHeap* heap);
int minheap_size(const MinHeap* heap);
void minheap_push(MinHeap* heap, int vertexIndex, int distance);
MinHeapNode minheap_pop(MinHeap* heap);

#endif /* PRIORITY_QUEUE_H */
