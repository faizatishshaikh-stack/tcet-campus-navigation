# TCET Campus Navigation System - C DSA Backend Engine
### Thakur College of Engineering and Technology, Kandivali East, Mumbai

This directory contains the standalone, high-performance C implementation of the core Data Structures and Algorithms powering the TCET Smart Campus Navigation System.

---

## 1. Algorithms & Data Structures Implemented

| Data Structure / Algorithm | File | Role & Complexity |
| :--- | :--- | :--- |
| **Weighted Graph (Adjacency List)** | `graph.c`, `graph.h` | Stores 16 verified TCET campus vertices and 23 bidirectional pathways with physical walking meters. Supports dynamic pathway blocking. **Space: $O(V + E)$** |
| **Hash Table (Separate Chaining)** | `hash_table.c`, `hash_table.h` | Fast lookup of TCET buildings by ID, name, code, or alias using Horner's polynomial rolling hash with prime table capacity ($M = 17$). **Search/Insert: Average $O(1)$** |
| **Binary Min-Heap Priority Queue** | `priority_queue.c`, `priority_queue.h` | 0-indexed binary heap for optimal vertex selection in Dijkstra's algorithm. **Push/Pop: $O(\log V)$** |
| **Dijkstra's Algorithm** | `dijkstra.c`, `dijkstra.h` | Computes the shortest physical walking distance between any two locations with path reconstruction and metric evaluation. **Time: $O((V + E) \log V)$** |
| **Breadth-First Search (BFS)** | `bfs.c`, `bfs.h` | Queue-based frontier exploration for finding nearby facilities, amenities, and department blocks within $k$ hops. **Time: $O(V + E)$** |
| **HTTP Micro-Server** | `server.c` | Standalone socket-based REST API daemon listening on port `8080` with CORS support for seamless integration with the React UI. |
| **CLI Test Suite** | `cli_runner.c` | Terminal diagnostic runner demonstrating all algorithms, bucket dumps, and roadblock simulations on TCET graph. |

---

## 2. Compilation Instructions

### On Windows (with MinGW / GCC):
```cmd
cd backend_c
build.bat
```
Or manually:
```cmd
gcc -O2 -o campus_cli.exe cli_runner.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c
gcc -O2 -o campus_server.exe server.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c -lws2_32
```

### On Windows (with Visual Studio / MSVC `cl`):
```cmd
cl /O2 cli_runner.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c /Fe:campus_cli.exe
cl /O2 server.c graph.c hash_table.c priority_queue.c dijkstra.c bfs.c campus_data.c ws2_32.lib /Fe:campus_server.exe
```

### On Linux / macOS:
```bash
cd backend_c
make
```

---

## 3. Running the Executables

### 1. Standalone CLI Diagnostics
Run the command-line test runner to inspect the data structures in ASCII terminal:
```cmd
.\campus_cli.exe
```
This tests:
1. Hash table key lookups and collision bucket distribution.
2. Shortest route from Main Gate to Turing Engineering Block.
3. Dynamic edge blocking of Turing Avenue and automatic recalculation.
4. BFS traversal showing all nearby amenities ordered by hop distance from Chancellery Tower.

### 2. Live HTTP Micro-Server
Start the server daemon on port 8080:
```cmd
.\campus_server.exe
```
Once running, the React web app can toggle into **C Backend Engine** mode and dispatch Dijkstra / BFS / HashTable requests directly to `http://127.0.0.1:8080/api/route`.

---

## 4. REST API Documentation

### `GET /api/health`
Returns server status and graph telemetry.
```json
{
  "status": "online",
  "engine": "C_ANSI_DSA_ENGINE",
  "nodes": 14,
  "edges": 24,
  "hashCapacity": 17,
  "hashEntries": 28
}
```

### `POST /api/route`
Computes shortest path between two location IDs.
- **Request:** `{"from": "gate", "to": "eng_block"}`
- **Response:**
```json
{
  "found": true,
  "engine": "C_DIJKSTRA",
  "distance": 595,
  "estimatedMinutes": 8,
  "path": ["gate", "admin", "library", "eng_block"]
}
```

### `POST /api/nearby`
Finds nearby campus locations using BFS traversal.
- **Request:** `{"start": "admin"}`
- **Response:**
```json
{
  "engine": "C_BFS",
  "startNode": "admin",
  "count": 13,
  "nearby": [
    {"id": "gate", "name": "Main Campus Gate (North)", "hop": 1, "distance": 140},
    {"id": "library", "name": "Kalam Central Library", "hop": 1, "distance": 270}
  ]
}
```
