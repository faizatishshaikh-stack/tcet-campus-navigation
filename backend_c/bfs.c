/**
 * bfs.c - Implementation of Queue and Breadth-First Search (BFS)
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */

#include "bfs.h"

void queue_init(Queue* q) {
    if (!q) return;
    q->front = q->rear = NULL;
    q->count = 0;
}

bool queue_is_empty(const Queue* q) {
    return (!q || q->front == NULL);
}

void queue_push(Queue* q, int vertexIndex, int hop, int cumulativeDist) {
    if (!q) return;
    QueueNode* newNode = (QueueNode*)malloc(sizeof(QueueNode));
    if (!newNode) return;

    newNode->vertexIndex = vertexIndex;
    newNode->hop = hop;
    newNode->cumulativeDist = cumulativeDist;
    newNode->next = NULL;

    if (q->rear == NULL) {
        q->front = q->rear = newNode;
    } else {
        q->rear->next = newNode;
        q->rear = newNode;
    }
    q->count++;
}

QueueNode queue_pop(Queue* q) {
    QueueNode result = { -1, -1, -1, NULL };
    if (!q || q->front == NULL) return result;

    QueueNode* temp = q->front;
    result.vertexIndex = temp->vertexIndex;
    result.hop = temp->hop;
    result.cumulativeDist = temp->cumulativeDist;

    q->front = q->front->next;
    if (q->front == NULL) {
        q->rear = NULL;
    }
    free(temp);
    q->count--;
    return result;
}

void queue_free(Queue* q) {
    if (!q) return;
    while (!queue_is_empty(q)) {
        queue_pop(q);
    }
}

BFSResult bfs_find_nearby(const Graph* graph, int startIdx, int maxHops) {
    BFSResult result;
    result.count = 0;

    if (!graph || startIdx < 0 || startIdx >= graph->vertexCount) {
        return result;
    }

    bool visited[MAX_VERTICES] = { false };
    Queue q;
    queue_init(&q);

    visited[startIdx] = true;
    queue_push(&q, startIdx, 0, 0);

    while (!queue_is_empty(&q)) {
        QueueNode curr = queue_pop(&q);
        int u = curr.vertexIndex;
        int hop = curr.hop;
        int dist = curr.cumulativeDist;

        // Record all discovered nodes except root
        if (u != startIdx && result.count < MAX_VERTICES) {
            result.vertexIndices[result.count] = u;
            result.hopDistances[result.count] = hop;
            result.physicalDistances[result.count] = dist;
            result.count++;
        }

        if (hop >= maxHops) continue;

        EdgeNode* edge = graph->vertices[u].head;
        while (edge != NULL) {
            if (!edge->isBlocked) {
                int v = edge->targetIndex;
                if (!visited[v]) {
                    visited[v] = true;
                    queue_push(&q, v, hop + 1, dist + edge->weight);
                }
            }
            edge = edge->next;
        }
    }

    queue_free(&q);
    return result;
}

void bfs_print_results(const Graph* graph, const BFSResult* result, int startIdx) {
    const Vertex* start = &graph->vertices[startIdx];
    printf("\n=== BFS NEARBY LOCATIONS FROM: %s ===\n", start->name);
    printf("Total Discovered Locations: %d\n", result->count);
    printf("%-4s | %-28s | %-6s | %-12s | %-10s\n", "Hop", "Location Name", "Code", "Distance (m)", "Category");
    printf("-----------------------------------------------------------------------\n");

    for (int i = 0; i < result->count; i++) {
        int vIdx = result->vertexIndices[i];
        const Vertex* v = &graph->vertices[vIdx];
        printf("%-4d | %-28s | %-6s | %-12d | %-10s\n", 
               result->hopDistances[i], v->name, v->code, 
               result->physicalDistances[i], v->category);
    }
    printf("=======================================================================\n\n");
}
