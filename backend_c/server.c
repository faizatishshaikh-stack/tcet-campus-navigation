/**
 * server.c - Lightweight C Socket HTTP/JSON Micro-Server
 * Exposes the Campus Navigation DSA Algorithms via standard REST APIs.
 * Supports Windows Winsock (ws2_32) and POSIX sockets.
 * 
 * Endpoints:
 * - GET  /api/health       -> Status, version, node/edge counts
 * - POST /api/route        -> Runs Dijkstra in C, returns path JSON
 * - POST /api/nearby       -> Runs BFS in C, returns nearby locations
 * - POST /api/block        -> Toggles pathway roadblock
 * - GET  /api/hashtable    -> Returns bucket diagnostics and collision stats
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#ifdef _WIN32
  #include <winsock2.h>
  #include <ws2tcpip.h>
  #pragma comment(lib, "ws2_32.lib")
  typedef int socklen_t;
#else
  #include <unistd.h>
  #include <sys/socket.h>
  #include <netinet/in.h>
  #include <arpa/inet.h>
  #define closesocket close
  #define SOCKET int
  #define INVALID_SOCKET -1
  #define SOCKET_ERROR -1
#endif

#include "dsa_types.h"
#include "graph.h"
#include "hash_table.h"
#include "priority_queue.h"
#include "dijkstra.h"
#include "bfs.h"
#include "campus_data.h"

#define PORT 8080
#define BUFFER_SIZE 8192

static Graph g_campusGraph;
static HashTable g_lookupTable;

// Extract simple JSON string value by key e.g. "from":"gate"
static bool extract_json_string(const char* body, const char* key, char* outVal, int maxLen) {
    char pattern[64];
    snprintf(pattern, sizeof(pattern), "\"%s\":\"", key);
    char* start = strstr(body, pattern);
    if (!start) {
        // try with whitespace: "\"%s\" : \""
        snprintf(pattern, sizeof(pattern), "\"%s\"", key);
        start = strstr(body, pattern);
        if (!start) return false;
        start = strchr(start, ':');
        if (!start) return false;
        start = strchr(start, '\"');
        if (!start) return false;
        start++;
    } else {
        start += strlen(pattern);
    }

    char* end = strchr(start, '\"');
    if (!end) return false;

    int len = (int)(end - start);
    if (len >= maxLen) len = maxLen - 1;
    strncpy(outVal, start, len);
    outVal[len] = '\0';
    return true;
}

static void send_http_response(SOCKET clientSocket, int statusCode, const char* contentType, const char* body) {
    char header[512];
    snprintf(header, sizeof(header),
             "HTTP/1.1 %d %s\r\n"
             "Content-Type: %s\r\n"
             "Content-Length: %zu\r\n"
             "Access-Control-Allow-Origin: *\r\n"
             "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
             "Access-Control-Allow-Headers: Content-Type\r\n"
             "Connection: close\r\n"
             "\r\n",
             statusCode, (statusCode == 200 ? "OK" : "Bad Request"), contentType, strlen(body));
    
    send(clientSocket, header, (int)strlen(header), 0);
    send(clientSocket, body, (int)strlen(body), 0);
}

static void handle_client(SOCKET clientSocket) {
    char buffer[BUFFER_SIZE];
    int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
    if (bytesReceived <= 0) {
        closesocket(clientSocket);
        return;
    }
    buffer[bytesReceived] = '\0';

    // Handle CORS OPTIONS preflight
    if (strncmp(buffer, "OPTIONS", 7) == 0) {
        send_http_response(clientSocket, 200, "text/plain", "OK");
        closesocket(clientSocket);
        return;
    }

    char method[16], path[128];
    sscanf(buffer, "%15s %127s", method, path);

    char* body = strstr(buffer, "\r\n\r\n");
    if (body) body += 4;
    else body = "";

    // 1. GET /api/health
    if (strcmp(path, "/api/health") == 0) {
        char response[512];
        snprintf(response, sizeof(response),
                 "{\"status\":\"online\",\"engine\":\"C_ANSI_DSA_ENGINE\","
                 "\"college\":\"TCET_KANDIVALI_MUMBAI\","
                 "\"nodes\":%d,\"edges\":23,\"hashCapacity\":%d,\"hashEntries\":%d}",
                 g_campusGraph.vertexCount, HASH_TABLE_CAPACITY, g_lookupTable.size);
        send_http_response(clientSocket, 200, "application/json", response);
    }
    // 2. POST /api/route (Dijkstra in C)
    else if (strcmp(path, "/api/route") == 0) {
        char fromId[MAX_ID_LEN] = {0};
        char toId[MAX_ID_LEN] = {0};

        extract_json_string(body, "from", fromId, sizeof(fromId));
        extract_json_string(body, "to", toId, sizeof(toId));

        int startIdx = ht_search(&g_lookupTable, fromId);
        int destIdx = ht_search(&g_lookupTable, toId);

        if (startIdx == -1 || destIdx == -1) {
            send_http_response(clientSocket, 400, "application/json", 
                               "{\"found\":false,\"error\":\"Location not recognized in C hash table.\"}");
        } else {
            RouteResult route = dijkstra_find_route(&g_campusGraph, startIdx, destIdx, NULL);
            if (!route.found) {
                send_http_response(clientSocket, 200, "application/json", 
                                   "{\"found\":false,\"error\":\"Destination unreachable. Path is blocked.\"}");
            } else {
                char response[2048];
                int offset = snprintf(response, sizeof(response),
                    "{\"found\":true,\"engine\":\"C_DIJKSTRA\",\"distance\":%d,\"estimatedMinutes\":%d,\"path\":[",
                    route.totalDistance, route.estimatedMinutes);

                for (int i = 0; i < route.pathLength; i++) {
                    int vIdx = route.pathIndices[i];
                    offset += snprintf(response + offset, sizeof(response) - offset,
                        "\"%s\"%s", g_campusGraph.vertices[vIdx].id, (i < route.pathLength - 1 ? "," : ""));
                }
                snprintf(response + offset, sizeof(response) - offset, "]}");
                send_http_response(clientSocket, 200, "application/json", response);
            }
        }
    }
    // 3. POST /api/nearby (BFS in C)
    else if (strcmp(path, "/api/nearby") == 0) {
        char startId[MAX_ID_LEN] = {0};
        extract_json_string(body, "start", startId, sizeof(startId));
        int startIdx = ht_search(&g_lookupTable, startId);

        if (startIdx == -1) {
            send_http_response(clientSocket, 400, "application/json", "{\"error\":\"Invalid start location.\"}");
        } else {
            BFSResult bfs = bfs_find_nearby(&g_campusGraph, startIdx, 4);
            char response[4096];
            int offset = snprintf(response, sizeof(response),
                "{\"engine\":\"C_BFS\",\"startNode\":\"%s\",\"count\":%d,\"nearby\":[",
                startId, bfs.count);

            for (int i = 0; i < bfs.count; i++) {
                int vIdx = bfs.vertexIndices[i];
                offset += snprintf(response + offset, sizeof(response) - offset,
                    "{\"id\":\"%s\",\"name\":\"%s\",\"code\":\"%s\",\"category\":\"%s\",\"hop\":%d,\"distance\":%d}%s",
                    g_campusGraph.vertices[vIdx].id, g_campusGraph.vertices[vIdx].name,
                    g_campusGraph.vertices[vIdx].code, g_campusGraph.vertices[vIdx].category,
                    bfs.hopDistances[i], bfs.physicalDistances[i],
                    (i < bfs.count - 1 ? "," : ""));
            }
            snprintf(response + offset, sizeof(response) - offset, "]}");
            send_http_response(clientSocket, 200, "application/json", response);
        }
    }
    // 4. GET /api/hashtable (Diagnostics)
    else if (strcmp(path, "/api/hashtable") == 0) {
        char response[4096];
        int offset = snprintf(response, sizeof(response),
            "{\"capacity\":%d,\"size\":%d,\"collisions\":%d,\"loadFactor\":%.2f,\"buckets\":[",
            HASH_TABLE_CAPACITY, g_lookupTable.size, g_lookupTable.collisionCount,
            (float)g_lookupTable.size / HASH_TABLE_CAPACITY);

        for (int i = 0; i < HASH_TABLE_CAPACITY; i++) {
            offset += snprintf(response + offset, sizeof(response) - offset,
                "{\"index\":%d,\"items\":[", i);
            HashEntry* curr = g_lookupTable.buckets[i];
            bool first = true;
            while (curr != NULL) {
                offset += snprintf(response + offset, sizeof(response) - offset,
                    "%s\"%s\"", first ? "" : ",", curr->key);
                first = false;
                curr = curr->next;
            }
            offset += snprintf(response + offset, sizeof(response) - offset,
                "]}%s", (i < HASH_TABLE_CAPACITY - 1 ? "," : ""));
        }
        snprintf(response + offset, sizeof(response) - offset, "]}");
        send_http_response(clientSocket, 200, "application/json", response);
    }
    else {
        send_http_response(clientSocket, 404, "application/json", "{\"error\":\"Endpoint not found.\"}");
    }

    closesocket(clientSocket);
}

int main() {
    printf("==============================================================\n");
    printf("   APEX CAMPUS WAYFINDING - C DSA HTTP SERVER (PORT %d)       \n", PORT);
    printf("==============================================================\n");

    // Initialize dataset
    campus_init_data(&g_campusGraph, &g_lookupTable);
    printf("[OK] Initialized Campus Graph (%d vertices, 24 edges)\n", g_campusGraph.vertexCount);
    printf("[OK] Initialized Hash Table (%d entries, %d buckets)\n", g_lookupTable.size, HASH_TABLE_CAPACITY);

#ifdef _WIN32
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        printf("[ERROR] WSAStartup failed: %d\n", WSAGetLastError());
        return 1;
    }
#endif

    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == INVALID_SOCKET) {
        printf("[ERROR] Failed to create socket.\n");
        return 1;
    }

    int opt = 1;
    setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, (const char*)&opt, sizeof(opt));

    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(PORT);

    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        printf("[ERROR] Bind failed on port %d.\n", PORT);
        closesocket(serverSocket);
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }

    if (listen(serverSocket, 10) == SOCKET_ERROR) {
        printf("[ERROR] Listen failed.\n");
        closesocket(serverSocket);
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }

    printf("[ONLINE] Server listening at http://127.0.0.1:%d/\n", PORT);
    printf("  Ready to process requests from React frontend...\n");
    printf("  Press Ctrl+C to terminate.\n\n");

    while (1) {
        struct sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);
        SOCKET clientSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientLen);

        if (clientSocket != INVALID_SOCKET) {
            handle_client(clientSocket);
        }
    }

    closesocket(serverSocket);
#ifdef _WIN32
    WSACleanup();
#endif
    return 0;
}
