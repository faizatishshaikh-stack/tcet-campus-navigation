/**
 * dsa_types.h - Core Data Structures for Campus Navigation DSA Mini-Project
 * 
 * Defines structures for:
 * - Weighted Graph with Adjacency List
 * - Separate Chaining Hash Table
 * - Binary Min-Heap Priority Queue
 * - FIFO Queue for Breadth-First Search
 */

#ifndef DSA_TYPES_H
#define DSA_TYPES_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_ID_LEN 32
#define MAX_NAME_LEN 64
#define MAX_CATEGORY_LEN 32
#define MAX_VERTICES 32
#define HASH_TABLE_CAPACITY 17
#define INF 1000000000

/* =========================================================================
 * 1. GRAPH STRUCTURES (Adjacency List)
 * ========================================================================= */

typedef struct EdgeNode {
    int targetIndex;                // Destination vertex index in graph array
    char targetId[MAX_ID_LEN];       // Target vertex ID
    char edgeId[MAX_ID_LEN];         // Unique identifier for walkway
    char walkwayName[MAX_NAME_LEN];  // Human-readable pathway title
    int weight;                     // Distance in meters
    bool isBlocked;                 // Dynamic roadblock flag
    struct EdgeNode* next;          // Pointer to next edge in adjacency list
} EdgeNode;

typedef struct {
    char id[MAX_ID_LEN];            // e.g. "gate", "library"
    char code[8];                   // e.g. "LIB"
    char name[MAX_NAME_LEN];        // e.g. "Kalam Central Library"
    char category[MAX_CATEGORY_LEN];// e.g. "academic"
    int x;                          // Coordinate X
    int y;                          // Coordinate Y
    int floorCount;
    EdgeNode* head;                 // Head of linked list of outgoing pathways
} Vertex;

typedef struct {
    Vertex vertices[MAX_VERTICES];
    int vertexCount;
} Graph;

/* =========================================================================
 * 2. HASH TABLE STRUCTURES (Separate Chaining)
 * ========================================================================= */

typedef struct HashEntry {
    char key[MAX_ID_LEN];           // Key: Building ID or lowercase name
    int vertexIndex;                // Corresponding vertex index in graph
    struct HashEntry* next;         // Next entry in collision chain
} HashEntry;

typedef struct {
    HashEntry* buckets[HASH_TABLE_CAPACITY];
    int size;
    int collisionCount;
} HashTable;

/* =========================================================================
 * 3. MIN-HEAP PRIORITY QUEUE (For Dijkstra's Algorithm)
 * ========================================================================= */

typedef struct {
    int vertexIndex;
    int distance;
} MinHeapNode;

typedef struct {
    MinHeapNode items[MAX_VERTICES * 4];
    int size;
} MinHeap;

/* =========================================================================
 * 4. FIFO QUEUE (For Breadth-First Search)
 * ========================================================================= */

typedef struct QueueNode {
    int vertexIndex;
    int hop;
    int cumulativeDist;
    struct QueueNode* next;
} QueueNode;

typedef struct {
    QueueNode* front;
    QueueNode* rear;
    int count;
} Queue;

/* =========================================================================
 * 5. ROUTE RESULT STRUCTURE
 * ========================================================================= */

typedef struct {
    bool found;
    int totalDistance;
    int estimatedMinutes;
    int pathIndices[MAX_VERTICES];
    char pathEdgeIds[MAX_VERTICES][MAX_ID_LEN];
    int pathLength;
} RouteResult;

#endif /* DSA_TYPES_H */
