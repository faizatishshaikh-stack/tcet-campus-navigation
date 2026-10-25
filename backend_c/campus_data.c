/**
 * campus_data.c - Populates Campus Graph and Hash Table for TCET, Kandivali East, Mumbai
 * Includes 16 verified buildings and 23 bidirectional pathways with exact meters.
 */

#include "campus_data.h"

void campus_init_data(Graph* graph, HashTable* ht) {
    graph_init(graph);
    ht_init(ht);

    // 1. Add Vertices (TCET Campus Buildings)
    int v_gate5   = graph_add_vertex(graph, "gate_5", "GATE-5", "Gate No. 5 (TCET Main Entrance)", "transit", 180, 390, 1);
    int v_foyer   = graph_add_vertex(graph, "tcet_foyer", "FOYER", "A-Block Central Foyer & Elevator Lobby", "administrative", 440, 390, 7);
    int v_admin   = graph_add_vertex(graph, "admin_office", "ADM", "Admin Office & Accounts Section", "administrative", 440, 250, 1);
    int v_exam    = graph_add_vertex(graph, "exam_cell", "EXAM", "Exam Cell & Principal Office", "administrative", 440, 530, 1);
    int v_xerox   = graph_add_vertex(graph, "stationery_kiosk", "XEROX", "Stationery & Reprography Kiosk", "amenity", 340, 340, 1);
    int v_work    = graph_add_vertex(graph, "central_workshop", "WKSHP", "Central Engineering Workshop", "academic", 350, 640, 1);
    int v_lib     = graph_add_vertex(graph, "library_lrc", "LRC", "Learning Resource Centre (Library)", "academic", 580, 390, 4);
    int v_cs      = graph_add_vertex(graph, "cs_it_labs", "COMP", "Computing & AI Labs Hub", "academic", 580, 250, 5);
    int v_sem     = graph_add_vertex(graph, "seminar_hall", "AUD", "Auditorium & Seminar Halls", "academic", 580, 530, 7);
    int v_court   = graph_add_vertex(graph, "central_courtyard", "COURT", "Central Courtyard & Amphitheatre", "recreational", 740, 390, 1);
    int v_cafe    = graph_add_vertex(graph, "canteen", "CAFE", "Central Campus Canteen & Cafeteria", "amenity", 740, 230, 2);
    int v_timsr   = graph_add_vertex(graph, "timsr_block", "TIMSR", "TIMSR Management Block", "academic", 740, 560, 4);
    int v_sports  = graph_add_vertex(graph, "sports_ground", "SPRT", "Thakur Sports Ground & Turf", "recreational", 960, 360, 1);
    int v_prks    = graph_add_vertex(graph, "student_parking", "PRK-2W", "Two-Wheeler Student Parking Bay", "transit", 200, 230, 1);
    int v_prkf    = graph_add_vertex(graph, "faculty_parking", "PRK-4W", "Faculty & Four-Wheeler Parking", "transit", 210, 550, 1);
    int v_gate4   = graph_add_vertex(graph, "gate_4", "GATE-4", "Gate No. 4 (East Campus Gate)", "transit", 1020, 560, 1);

    // 2. Insert into Hash Table (Keys: ID, Code, Short name, and common student search terms)
    ht_insert(ht, "gate_5", v_gate5);
    ht_insert(ht, "gate 5", v_gate5);
    ht_insert(ht, "main gate", v_gate5);
    ht_insert(ht, "entrance", v_gate5);
    ht_insert(ht, "thakur marg", v_gate5);

    ht_insert(ht, "tcet_foyer", v_foyer);
    ht_insert(ht, "foyer", v_foyer);
    ht_insert(ht, "lobby", v_foyer);
    ht_insert(ht, "lifts", v_foyer);
    ht_insert(ht, "a block", v_foyer);

    ht_insert(ht, "admin_office", v_admin);
    ht_insert(ht, "admin", v_admin);
    ht_insert(ht, "registrar", v_admin);
    ht_insert(ht, "accounts", v_admin);
    ht_insert(ht, "fees", v_admin);

    ht_insert(ht, "exam_cell", v_exam);
    ht_insert(ht, "exam", v_exam);
    ht_insert(ht, "coe", v_exam);
    ht_insert(ht, "principal", v_exam);

    ht_insert(ht, "stationery_kiosk", v_xerox);
    ht_insert(ht, "xerox", v_xerox);
    ht_insert(ht, "stationery", v_xerox);
    ht_insert(ht, "print", v_xerox);

    ht_insert(ht, "central_workshop", v_work);
    ht_insert(ht, "workshop", v_work);
    ht_insert(ht, "mechanical", v_work);
    ht_insert(ht, "cnc", v_work);

    ht_insert(ht, "library_lrc", v_lib);
    ht_insert(ht, "library", v_lib);
    ht_insert(ht, "lrc", v_lib);
    ht_insert(ht, "books", v_lib);
    ht_insert(ht, "reading hall", v_lib);

    ht_insert(ht, "cs_it_labs", v_cs);
    ht_insert(ht, "comp", v_cs);
    ht_insert(ht, "cs", v_cs);
    ht_insert(ht, "it", v_cs);
    ht_insert(ht, "ai", v_cs);
    ht_insert(ht, "coding labs", v_cs);

    ht_insert(ht, "seminar_hall", v_sem);
    ht_insert(ht, "auditorium", v_sem);
    ht_insert(ht, "seminar", v_sem);
    ht_insert(ht, "placement", v_sem);

    ht_insert(ht, "central_courtyard", v_court);
    ht_insert(ht, "courtyard", v_court);
    ht_insert(ht, "amphitheatre", v_court);
    ht_insert(ht, "zephyr", v_court);

    ht_insert(ht, "canteen", v_cafe);
    ht_insert(ht, "cafe", v_cafe);
    ht_insert(ht, "cafeteria", v_cafe);
    ht_insert(ht, "food", v_cafe);

    ht_insert(ht, "timsr_block", v_timsr);
    ht_insert(ht, "timsr", v_timsr);
    ht_insert(ht, "management", v_timsr);

    ht_insert(ht, "sports_ground", v_sports);
    ht_insert(ht, "sports", v_sports);
    ht_insert(ht, "turf", v_sports);
    ht_insert(ht, "cricket", v_sports);

    ht_insert(ht, "student_parking", v_prks);
    ht_insert(ht, "bike parking", v_prks);
    ht_insert(ht, "two wheeler", v_prks);

    ht_insert(ht, "faculty_parking", v_prkf);
    ht_insert(ht, "car parking", v_prkf);
    ht_insert(ht, "faculty parking", v_prkf);

    ht_insert(ht, "gate_4", v_gate4);
    ht_insert(ht, "gate 4", v_gate4);
    ht_insert(ht, "east gate", v_gate4);

    // 3. Add Edges (Pathways) with Distance in Meters
    graph_add_edge(graph, "path_gate5_foyer", "gate_5", "tcet_foyer", 65, "TCET Entrance Promenade", true);
    graph_add_edge(graph, "path_gate5_prks", "gate_5", "student_parking", 45, "North Entrance Driveway", true);
    graph_add_edge(graph, "path_gate5_prkf", "gate_5", "faculty_parking", 55, "South Porch Driveway", true);
    graph_add_edge(graph, "path_prks_foyer", "student_parking", "tcet_foyer", 70, "North Covered Walkway", true);
    graph_add_edge(graph, "path_prkf_foyer", "faculty_parking", "tcet_foyer", 60, "South Foyer Path", true);

    graph_add_edge(graph, "path_foyer_stat", "tcet_foyer", "stationery_kiosk", 25, "Lobby Portico Concourse", true);
    graph_add_edge(graph, "path_foyer_admin", "tcet_foyer", "admin_office", 35, "Ground Floor North Corridor", true);
    graph_add_edge(graph, "path_foyer_exam", "tcet_foyer", "exam_cell", 35, "Ground Floor South Corridor", true);

    graph_add_edge(graph, "path_foyer_lib", "tcet_foyer", "library_lrc", 40, "Central Library Lift / Stair Concourse", true);
    graph_add_edge(graph, "path_foyer_cs", "tcet_foyer", "cs_it_labs", 45, "Computing Hub Lift / Stair Concourse", true);
    graph_add_edge(graph, "path_foyer_sem", "tcet_foyer", "seminar_hall", 40, "Auditorium & Seminar Concourse", true);

    graph_add_edge(graph, "path_exam_work", "exam_cell", "central_workshop", 55, "Workshop Passage", true);
    graph_add_edge(graph, "path_prkf_work", "faculty_parking", "central_workshop", 60, "South Service Alley", true);

    graph_add_edge(graph, "path_foyer_court", "tcet_foyer", "central_courtyard", 50, "East Courtyard Arcade", true);
    graph_add_edge(graph, "path_admin_canteen", "admin_office", "canteen", 75, "North Quad Walkway", true);
    graph_add_edge(graph, "path_court_canteen", "central_courtyard", "canteen", 45, "Cafeteria Plaza Walk", true);

    graph_add_edge(graph, "path_court_timsr", "central_courtyard", "timsr_block", 60, "Management Concourse", true);
    graph_add_edge(graph, "path_exam_timsr", "exam_cell", "timsr_block", 70, "South Connecting Arcade", true);
    graph_add_edge(graph, "path_work_timsr", "central_workshop", "timsr_block", 85, "South Campus Alley", true);

    graph_add_edge(graph, "path_court_sports", "central_courtyard", "sports_ground", 85, "Thakur Stadium Concourse", true);
    graph_add_edge(graph, "path_canteen_sports", "canteen", "sports_ground", 90, "North Sports Trail", true);
    graph_add_edge(graph, "path_timsr_gate4", "timsr_block", "gate_4", 70, "East Perimeter Way", true);
    graph_add_edge(graph, "path_sports_gate4", "sports_ground", "gate_4", 65, "Stadium Perimeter Walk", true);
}
