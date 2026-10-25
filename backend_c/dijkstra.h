/**
 * dijkstra.h - Dijkstra Shortest Path Algorithm for Campus Navigation in C
 */

#ifndef DIJKSTRA_H
#define DIJKSTRA_H

#include "dsa_types.h"

RouteResult dijkstra_find_route(const Graph* graph, int startIdx, int destIdx, 
                                const char* excludeEdgeId);
void dijkstra_print_route(const Graph* graph, const RouteResult* route);

#endif /* DIJKSTRA_H */
