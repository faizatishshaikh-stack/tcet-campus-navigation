# TCET Smart Campus Navigation System
### Thakur College of Engineering and Technology, Kandivali East, Mumbai
#### Data Structures & Algorithms (DSA) Mini-Project

A modern, high-performance pedestrian navigation web application and standalone C algorithmic engine modeled on the **Thakur College of Engineering and Technology (TCET)** campus, located in Thakur Village, Kandivali East, Mumbai. Built with **React 19**, **JavaScript**, **Vanilla CSS**, and a **C-based Backend** for core Data Structures and Algorithms.

---

## 🏛️ 1. Campus Identity & Verified Layout

- **Institute**: Thakur College of Engineering and Technology (TCET)
- **Campus**: Thakur Educational Campus, A-Block, Shyamnarayan Thakur Marg, Thakur Village, Kandivali (East), Mumbai 400101
- **Visual Identity**: Warm parchment canvas (`#F6F5EE`), collegiate forest-green accents (`#1B3B2B`), architectural terracotta highlights (`#D96B27`), and dark charcoal typography.
- **Architectural Schematic Map**:
  - Western boundary: **Shyamnarayan Thakur Marg** with **Gate No. 5** (Main TCET Entrance).
  - Main academic block: **A-Block (7-Storey Engineering High-Rise)** housing the Central Foyer, Registrar & Admin Office, Accounts Section, Autonomous Examination Cell, 4th-Floor Central Library (LRC), 3rd/5th-Floor Computing & AI Labs Hub, Ground/7th-Floor Seminar Halls & Auditorium, and the Central Engineering Workshop annex.
  - Central quadrangle: **Central Paved Courtyard & Amphitheatre** (home to Zephyr & Sojourn cultural and technical fests) directly facing the **Campus Canteen & Cafeteria**.
  - Management wing: **TIMSR Management Block** (MBA/MMS).
  - Eastern arena: **Thakur Sports Ground & Turf (3.5 Acres)** and **Gate No. 4 (East Gate)**.
  - Mobility: **Two-Wheeler Student Parking Bay** and **Faculty & Four-Wheeler Covered Parking**.

---

## ⚙️ 2. Core Data Structures & Algorithms

| Data Structure / Algorithm | Source Files | Purpose & Computational Complexity |
| :--- | :--- | :--- |
| **Weighted Graph (Adjacency List)** | `src/dsa/Graph.js`<br>`backend_c/graph.c` | Stores 16 verified TCET campus vertices and 23 bidirectional pathways with physical walking meters. Supports real-time edge blocking. **Space: $O(V + E)$** |
| **Separate Chaining Hash Table** | `src/dsa/HashTable.js`<br>`backend_c/hash_table.c` | Constant-time lookup of campus buildings by ID, name, code, or alias using Horner's polynomial rolling hash with prime capacity ($M = 17$). **Search/Insert: Average $O(1)$** |
| **Binary Min-Heap Priority Queue** | `src/dsa/MinPriorityQueue.js`<br>`backend_c/priority_queue.c` | 0-indexed binary heap for optimal vertex selection in Dijkstra's algorithm. **Push/Pop: $O(\log V)$** |
| **Dijkstra's Algorithm** | `src/dsa/Dijkstra.js`<br>`backend_c/dijkstra.c` | Minimum physical walking distance calculation with tentative distance relaxation, path reconstruction, and alternative route generation. **Time: $O((V + E) \log V)$** |
| **Queue & Breadth-First Search (BFS)** | `src/dsa/BFS.js`<br>`backend_c/bfs.c` | Explores connected locations level-by-level to discover nearest facilities, dining, and academic blocks within $k$ hops. **Time: $O(V + E)$** |

---

## 🗺️ 3. Core Navigation Features

1. **Interactive TCET Campus Map**:
   - Pan, zoom, and layer toggles.
   - Clickable buildings displaying floor levels, departments, and facilities.
   - Clickable pathways with physical distance tags (meters).
2. **Shortest-Path Navigation (Dijkstra)**:
   - Select start & destination via map or floating typeahead search.
   - Displays total distance in meters, estimated brisk walking time (~80 m/min), and calorie estimates.
   - Animated glowing forest-green route line with directional chevron pulses.
3. **Alternative Routes**:
   - Calculates distinct secondary paths (e.g. traveling via Student Parking covered canopy vs direct entrance promenade).
   - Instant one-tap route switching.
4. **Dynamic Roadblocks & Real-Time Rerouting**:
   - Click **"Mark Roadblock"** to block any walkway for campus maintenance.
   - Dijkstra automatically reroutes around the obstruction in real time.
5. **Turn-by-Turn Directions & Simulation**:
   - Natural language pedestrian directions (e.g. *"Walk 65m along TCET Entrance Promenade to A-Block Foyer"*).
   - "Simulate Walking Route" animates a pulsating pedestrian avatar smoothly along the path.
6. **BFS Nearby Locations Explorer**:
   - Discover closest amenities ordered by graph hop level from any origin.
   - Filter by Dining, Academic, Recreation, or Transit, with an expandable BFS Queue execution trace.
7. **DSA Laboratory & Inspector Panel** *(Dedicated Academic Audit Mode)*:
   - **Dijkstra Tab**: Min-heap push/pop log, tentative distance updates array, relaxation history.
   - **Hash Table Tab**: Interactive hash tester, bucket chain inspector, collision count, and load factor ($\alpha$).
   - **Adjacency List Tab**: Full graph edge weights and blocked status.
   - **C Backend Tab**: Architectural pipeline diagram, socket server integration guide, and native code viewer.

---

## 🚀 4. How to Run & Verify

### 1. Web Application
```bash
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Automated DSA Algorithmic Verification
Verify the JavaScript algorithmic engine in the terminal:
```bash
node test_dsa.js
```

### 3. Production Build
```bash
npm run build
```

### 4. Running the C Engine (Optional)
```cmd
cd backend_c
build.bat
.\campus_cli.exe       # Runs terminal DSA diagnostics for TCET
.\campus_server.exe    # Starts native C HTTP server on port 8080
```
