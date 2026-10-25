/**
 * graph.c - Weighted Graph Implementation with Adjacency List
 */

#include "graph.h"

void graph_init(Graph* graph) {
    if (!graph) return;
    graph->vertexCount = 0;
    for (int i = 0; i < MAX_VERTICES; i++) {
        graph->vertices[i].head = NULL;
    }
}

int graph_add_vertex(Graph* graph, const char* id, const char* code, const char* name, 
                     const char* category, int x, int y, int floorCount) {
    if (!graph || graph->vertexCount >= MAX_VERTICES) return -1;

    // Check if vertex already exists
    int existing = graph_find_vertex(graph, id);
    if (existing != -1) return existing;

    int idx = graph->vertexCount++;
    Vertex* v = &graph->vertices[idx];
    
    strncpy(v->id, id, MAX_ID_LEN - 1);
    v->id[MAX_ID_LEN - 1] = '\0';

    strncpy(v->code, code, 7);
    v->code[7] = '\0';

    strncpy(v->name, name, MAX_NAME_LEN - 1);
    v->name[MAX_NAME_LEN - 1] = '\0';

    strncpy(v->category, category, MAX_CATEGORY_LEN - 1);
    v->category[MAX_CATEGORY_LEN - 1] = '\0';

    v->x = x;
    v->y = y;
    v->floorCount = floorCount;
    v->head = NULL;

    return idx;
}

int graph_find_vertex(const Graph* graph, const char* id) {
    if (!graph || !id) return -1;
    for (int i = 0; i < graph->vertexCount; i++) {
        if (strcasecmp(graph->vertices[i].id, id) == 0) {
            return i;
        }
    }
    return -1;
}

static void add_directed_edge(Graph* graph, int fromIdx, int toIdx, const char* edgeId, 
                              int weight, const char* walkwayName) {
    EdgeNode* newNode = (EdgeNode*)malloc(sizeof(EdgeNode));
    if (!newNode) return;

    newNode->targetIndex = toIdx;
    strncpy(newNode->targetId, graph->vertices[toIdx].id, MAX_ID_LEN - 1);
    newNode->targetId[MAX_ID_LEN - 1] = '\0';

    strncpy(newNode->edgeId, edgeId, MAX_ID_LEN - 1);
    newNode->edgeId[MAX_ID_LEN - 1] = '\0';

    strncpy(newNode->walkwayName, walkwayName, MAX_NAME_LEN - 1);
    newNode->walkwayName[MAX_NAME_LEN - 1] = '\0';

    newNode->weight = weight;
    newNode->isBlocked = false;

    // Insert at front of adjacency list
    newNode->next = graph->vertices[fromIdx].head;
    graph->vertices[fromIdx].head = newNode;
}

void graph_add_edge(Graph* graph, const char* edgeId, const char* fromId, const char* toId, 
                    int weight, const char* walkwayName, bool bidirectional) {
    if (!graph) return;
    int fromIdx = graph_find_vertex(graph, fromId);
    int toIdx = graph_find_vertex(graph, toId);

    if (fromIdx == -1 || toIdx == -1) return;

    add_directed_edge(graph, fromIdx, toIdx, edgeId, weight, walkwayName);
    if (bidirectional) {
        add_directed_edge(graph, toIdx, fromIdx, edgeId, weight, walkwayName);
    }
}

bool graph_set_edge_blocked(Graph* graph, const char* edgeId, bool isBlocked) {
    if (!graph || !edgeId) return false;
    bool found = false;

    for (int i = 0; i < graph->vertexCount; i++) {
        EdgeNode* curr = graph->vertices[i].head;
        while (curr != NULL) {
            if (strcmp(curr->edgeId, edgeId) == 0) {
                curr->isBlocked = isBlocked;
                found = true;
            }
            curr = curr->next;
        }
    }
    return found;
}

bool graph_is_edge_blocked(const Graph* graph, const char* edgeId) {
    if (!graph || !edgeId) return false;
    for (int i = 0; i < graph->vertexCount; i++) {
        EdgeNode* curr = graph->vertices[i].head;
        while (curr != NULL) {
            if (strcmp(curr->edgeId, edgeId) == 0) {
                return curr->isBlocked;
            }
            curr = curr->next;
        }
    }
    return false;
}

void graph_print_adj_list(const Graph* graph) {
    if (!graph) return;
    printf("\n=== CAMPUS GRAPH ADJACENCY LIST REPRESENTATION ===\n");
    for (int i = 0; i < graph->vertexCount; i++) {
        const Vertex* v = &graph->vertices[i];
        printf("[%02d] %-30s -> ", i, v->name);
        EdgeNode* edge = v->head;
        if (!edge) {
            printf("None");
        }
        while (edge != NULL) {
            printf("(%s, %dm%s) -> ", edge->targetId, edge->weight, 
                   edge->isBlocked ? " [BLOCKED]" : "");
            edge = edge->next;
        }
        printf("NULL\n");
    }
    printf("==================================================\n\n");
}

void graph_free(Graph* graph) {
    if (!graph) return;
    for (int i = 0; i < graph->vertexCount; i++) {
        EdgeNode* curr = graph->vertices[i].head;
        while (curr != NULL) {
            EdgeNode* next = curr->next;
            free(curr);
            curr = next;
        }
        graph->vertices[i].head = NULL;
    }
    graph->vertexCount = 0;
}
