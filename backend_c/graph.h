/**
 * graph.h - Weighted Graph with Adjacency List for Campus Navigation
 */

#ifndef GRAPH_H
#define GRAPH_H

#include "dsa_types.h"

void graph_init(Graph* graph);
int graph_add_vertex(Graph* graph, const char* id, const char* code, const char* name, 
                     const char* category, int x, int y, int floorCount);
int graph_find_vertex(const Graph* graph, const char* id);
void graph_add_edge(Graph* graph, const char* edgeId, const char* fromId, const char* toId, 
                    int weight, const char* walkwayName, bool bidirectional);
bool graph_set_edge_blocked(Graph* graph, const char* edgeId, bool isBlocked);
bool graph_is_edge_blocked(const Graph* graph, const char* edgeId);
void graph_print_adj_list(const Graph* graph);
void graph_free(Graph* graph);

#endif /* GRAPH_H */
