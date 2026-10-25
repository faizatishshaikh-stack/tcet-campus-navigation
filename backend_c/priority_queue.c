/**
 * priority_queue.c - Binary Min-Heap Priority Queue Implementation
 */

#include "priority_queue.h"

void minheap_init(MinHeap* heap) {
    if (!heap) return;
    heap->size = 0;
}

bool minheap_is_empty(const MinHeap* heap) {
    return (!heap || heap->size == 0);
}

int minheap_size(const MinHeap* heap) {
    return heap ? heap->size : 0;
}

static void swap_nodes(MinHeapNode* a, MinHeapNode* b) {
    MinHeapNode temp = *a;
    *a = *b;
    *b = temp;
}

void minheap_push(MinHeap* heap, int vertexIndex, int distance) {
    if (!heap || heap->size >= MAX_VERTICES * 4) return;

    int idx = heap->size++;
    heap->items[idx].vertexIndex = vertexIndex;
    heap->items[idx].distance = distance;

    // Bubble up
    while (idx > 0) {
        int parent = (idx - 1) / 2;
        if (heap->items[idx].distance < heap->items[parent].distance) {
            swap_nodes(&heap->items[idx], &heap->items[parent]);
            idx = parent;
        } else {
            break;
        }
    }
}

MinHeapNode minheap_pop(MinHeap* heap) {
    MinHeapNode empty = { -1, INF };
    if (!heap || heap->size == 0) return empty;

    MinHeapNode minNode = heap->items[0];
    heap->items[0] = heap->items[--heap->size];

    // Bubble down
    int idx = 0;
    while (true) {
        int left = 2 * idx + 1;
        int right = 2 * idx + 2;
        int smallest = idx;

        if (left < heap->size && heap->items[left].distance < heap->items[smallest].distance) {
            smallest = left;
        }
        if (right < heap->size && heap->items[right].distance < heap->items[smallest].distance) {
            smallest = right;
        }

        if (smallest != idx) {
            swap_nodes(&heap->items[idx], &heap->items[smallest]);
            idx = smallest;
        } else {
            break;
        }
    }

    return minNode;
}
