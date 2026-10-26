/**
 * Thakur College of Engineering and Technology (TCET), Kandivali East, Mumbai
 * Campus Spatial Graph Data & Walkway Network
 * 
 * Campus Address: A-Block, Thakur Educational Campus, Shyamnarayan Thakur Marg, 
 * Thakur Village, Kandivali (East), Mumbai, Maharashtra 400101
 * 
 * Vertices: Verified college buildings, gates, departmental hubs, and facilities.
 * Edges: Pedestrian walkways with physical distance calibrated in meters.
 */

export const CAMPUS_BUILDINGS = [
  {
    id: 'gate_5',
    code: 'GATE-5',
    name: 'Gate No. 5 (TCET Main Entrance)',
    shortName: 'Gate 5',
    category: 'transit',
    categoryLabel: 'Campus Entry',
    x: 180,
    y: 390,
    width: 100,
    height: 52,
    shape: 'rectangle',
    description: 'Primary dedicated entrance for TCET students, faculty, and visitors off Shyamnarayan Thakur Marg. Equipped with security guard post, biometric turnstiles, and visitor log registry.',
    hours: '06:30 AM – 10:00 PM',
    floors: 1,
    facilities: ['Security Checkpost', 'Biometric Turnstiles', 'Visitor Registry', 'Wheelchair Ramp'],
    departments: ['Campus Security', 'Visitor Helpdesk'],
    popular: true
  },
  {
    id: 'tcet_foyer',
    code: 'FOYER',
    name: 'A-Block Central Foyer & Elevator Lobby',
    shortName: 'Central Foyer',
    category: 'administrative',
    categoryLabel: 'Academic Hub',
    x: 440,
    y: 390,
    width: 130,
    height: 70,
    shape: 'rectangle',
    description: 'The central ground-floor entrance lobby of TCET A-Block. Provides direct access to high-speed Lifts (1 to 4), central staircases, digital directory kiosks, and notice boards.',
    hours: '07:30 AM – 08:30 PM',
    floors: 'Ground Floor (A-Block)',
    facilities: ['Digital Directory Kiosks', 'Lifts 1 to 4', 'Central Staircase', 'Information Desk'],
    departments: ['Main Reception', 'Student Information Cell'],
    popular: true
  },
  {
    id: 'admin_office',
    code: 'ADM',
    name: 'Administrative Office & Accounts Section',
    shortName: 'Admin Office',
    category: 'administrative',
    categoryLabel: 'Administration',
    x: 440,
    y: 250,
    width: 130,
    height: 65,
    shape: 'rectangle',
    description: 'Located on A-Block Ground Floor (North Wing). Handles student admissions, Mumbai University verification, fee payment counters, bonafide certificates, and accounts.',
    hours: '09:00 AM – 05:00 PM',
    floors: 'Ground Floor (North Wing)',
    facilities: ['Fee Payment Counters', 'Admissions Cell', 'Registrar Desk', 'Token Queuing System'],
    departments: ['Registrar Office', 'Accounts Section', 'Student Welfare Cell'],
    popular: true
  },
  {
    id: 'exam_cell',
    code: 'EXAM',
    name: "Examination Cell & Principal's Office",
    shortName: 'Exam Cell',
    category: 'administrative',
    categoryLabel: 'Administration',
    x: 440,
    y: 530,
    width: 130,
    height: 65,
    shape: 'rectangle',
    description: "Located on A-Block Ground Floor (South Wing). Houses the Controller of Examinations (COE) for autonomous assessments, results processing, and the Principal's executive secretariat.",
    hours: '09:00 AM – 05:30 PM',
    floors: 'Ground Floor (South Wing)',
    facilities: ['COE Confidential Office', 'Principal Cabin', 'Executive Boardroom', 'Document Verification'],
    departments: ['Controller of Examinations', 'Academic Dean Secretariat'],
    popular: false
  },
  {
    id: 'stationery_kiosk',
    code: 'XEROX',
    name: 'Stationery, Reprography & Xerox Centre',
    shortName: 'Stationery Kiosk',
    category: 'amenity',
    categoryLabel: 'Student Utility',
    x: 340,
    y: 340,
    width: 90,
    height: 50,
    shape: 'rectangle',
    description: 'Ground-level utility counter adjacent to A-Block entrance. Provides engineering drawing sheets, journal files, high-speed photocopying, color printouts, and spiral project binding.',
    hours: '08:00 AM – 06:30 PM',
    floors: 'Ground Level (Portico)',
    facilities: ['High-speed Xerox', 'Color Laser Printing', 'Spiral Binding', 'Engineering Stationery'],
    departments: ['Student Utility Section'],
    popular: true
  },
  {
    id: 'central_workshop',
    code: 'WKSHP',
    name: 'Central Engineering Workshop',
    shortName: 'Workshop',
    category: 'academic',
    categoryLabel: 'Practical Labs',
    x: 350,
    y: 640,
    width: 125,
    height: 65,
    shape: 'rectangle',
    description: 'Comprehensive ground-floor engineering workshop (~350 sq. m). Equipped with CNC lathe, milling, carpentry, fitting, welding, and smithy for First Year and Mechanical/Production students.',
    hours: '08:00 AM – 06:00 PM',
    floors: 'Ground Level (South Annex)',
    facilities: ['CNC Machine Lab', 'Machine Shop', 'Fitting Shop', 'Carpentry & Welding', 'Safety Goggle Station'],
    departments: ['Mechanical Engineering Dept', 'Workshop Section'],
    popular: false
  },
  {
    id: 'library_lrc',
    code: 'LRC',
    name: 'Learning Resource Centre (Library - 4th Floor)',
    shortName: 'Central Library',
    category: 'academic',
    categoryLabel: 'Academic & Research',
    x: 580,
    y: 390,
    width: 125,
    height: 70,
    shape: 'rectangle',
    description: 'Central Library on the 4th Floor of A-Block, spanning over 1,120 sq. m. Houses 60,000+ volumes, IEEE/Springer digital terminals, silent reading cubicles, and faculty reading room.',
    hours: '08:00 AM – 08:30 PM (24/7 during exam weeks)',
    floors: '4th Floor (A-Block)',
    facilities: ['60-PC Digital Lab', 'RFID Issue Counters', 'Quiet Reading Hall', 'E-Journals Access', 'Photocopy'],
    departments: ['Library & Information Centre'],
    popular: true
  },
  {
    id: 'cs_it_labs',
    code: 'COMP',
    name: 'Computing & AI Labs Hub (3rd & 5th Floors)',
    shortName: 'CS / IT Labs',
    category: 'academic',
    categoryLabel: 'Academic & Research',
    x: 580,
    y: 250,
    width: 125,
    height: 65,
    shape: 'rectangle',
    description: 'Dedicated computing wing on 3rd & 5th floors of A-Block. Features Labs 301-306 & 501-506 for Computer Engineering, IT, AI&DS, and Cyber Security with high-spec workstations and NVIDIA GPUs.',
    hours: '08:00 AM – 07:30 PM',
    floors: '3rd & 5th Floors (A-Block)',
    facilities: ['NVIDIA GPU Workstations', 'High-Speed LAN', 'Smart Interactive Displays', 'Air-Conditioned'],
    departments: ['Computer Engineering (CMPN)', 'Information Technology (IT)', 'AI & Data Science (AI&DS)'],
    popular: true
  },
  {
    id: 'seminar_hall',
    code: 'AUD',
    name: 'Auditorium & Seminar Halls',
    shortName: 'Seminar Hall',
    category: 'academic',
    categoryLabel: 'Auditorium & Events',
    x: 580,
    y: 530,
    width: 125,
    height: 65,
    shape: 'horseshoe',
    description: 'Fully air-conditioned seminar halls and main auditorium (Ground & 7th Floors). Features tiered acoustics, audio-visual projection, and stage for guest lectures, seminars, and placements.',
    hours: '08:30 AM – 06:30 PM',
    floors: 'Ground & 7th Floors (A-Block)',
    facilities: ['Dolby Surround Sound', 'HD Dual Projectors', 'Tiered Seating', 'Stage & Green Room'],
    departments: ['Training & Placement Cell (T&P)', 'Seminar Committee'],
    popular: true
  },
  {
    id: 'central_courtyard',
    code: 'COURT',
    name: 'Central Courtyard & Amphitheatre',
    shortName: 'Courtyard',
    category: 'recreational',
    categoryLabel: 'Cultural & Gathering',
    x: 740,
    y: 390,
    width: 125,
    height: 70,
    shape: 'courtyard',
    description: 'The iconic central open-air paved quadrangle connecting A-Block, the Canteen, and the sports ground. Host venue for annual fests (Zephyr, Sojourn), robotics arena, and student gatherings.',
    hours: '07:00 AM – 08:30 PM',
    floors: 'Ground Level (Open Quadrangle)',
    facilities: ['Elevated Cultural Stage', 'Outdoor Seating Benches', 'Event Lighting Rigging'],
    departments: ['Student Council', 'Cultural & Technical Committee'],
    popular: true
  },
  {
    id: 'canteen',
    code: 'CAFE',
    name: 'Central Campus Canteen & Cafeteria',
    shortName: 'Canteen',
    category: 'amenity',
    categoryLabel: 'Dining & Refreshment',
    x: 740,
    y: 230,
    width: 125,
    height: 65,
    shape: 'hexagon',
    description: 'Spacious campus food court accommodating over 200 students. Serving fresh breakfast, South Indian dishes, vegetarian lunch thalis, snacks, sandwiches, juices, and tea/coffee.',
    hours: '07:30 AM – 07:30 PM',
    floors: 'Ground & Mezzanine Levels',
    facilities: ['Dining Hall (200+ Capacity)', 'Juice & Snack Counter', 'Digital Payment UPI/Card', 'RO Purified Water'],
    departments: ['Campus Dining Services'],
    popular: true
  },
  {
    id: 'timsr_block',
    code: 'TIMSR',
    name: 'TIMSR Management Block',
    shortName: 'TIMSR Wing',
    category: 'academic',
    categoryLabel: 'Management Institute',
    x: 740,
    y: 560,
    width: 125,
    height: 65,
    shape: 'rectangle',
    description: 'Adjacent Thakur Institute of Management Studies and Research wing within the shared campus complex. Houses MBA/MMS air-conditioned lecture theatres, management library, and boardroom.',
    hours: '08:30 AM – 08:00 PM',
    floors: '4 Floors (Management Wing)',
    facilities: ['Executive Lecture Theatres', 'Management Library', 'Corporate Boardroom', 'Elevator'],
    departments: ['Thakur Management Studies'],
    popular: false
  },
  {
    id: 'sports_ground',
    code: 'SPRT',
    name: 'Thakur Sports Ground & Turf (3.5 Acres)',
    shortName: 'Sports Turf',
    category: 'recreational',
    categoryLabel: 'Sports & Athletics',
    x: 960,
    y: 360,
    width: 140,
    height: 80,
    shape: 'rectangle',
    description: 'Sprawling 3.5-acre outdoor sports arena featuring full cricket pitch, football turf, volleyball and basketball courts, running perimeter, and spectator pavilion.',
    hours: '06:00 AM – 08:00 PM',
    floors: 'Outdoor Sports Complex',
    facilities: ['Cricket Net Pitches', 'Football Turf', 'Volleyball Court', 'Spectator Pavilion'],
    departments: ['Physical Education & Sports Dept'],
    popular: true
  },
  {
    id: 'student_parking',
    code: 'PRK-2W',
    name: 'Two-Wheeler Student Parking Bay',
    shortName: 'Student Parking',
    category: 'transit',
    categoryLabel: 'Parking & Mobility',
    x: 200,
    y: 230,
    width: 100,
    height: 52,
    shape: 'parking_grid',
    description: 'Dedicated two-wheeler parking lot inside Gate No. 5 with marked parking bays for student motorcycles and scooters, CCTV surveillance, and security supervision.',
    hours: '07:00 AM – 08:00 PM',
    floors: 'Ground Level',
    facilities: ['Marked Two-Wheeler Bays', 'CCTV Security', 'Security Guard Post', 'Speed Breakers'],
    departments: ['Campus Security & Estate'],
    popular: false
  },
  {
    id: 'faculty_parking',
    code: 'PRK-4W',
    name: 'Faculty & Four-Wheeler Covered Parking',
    shortName: 'Faculty Parking',
    category: 'transit',
    categoryLabel: 'Parking & Mobility',
    x: 210,
    y: 550,
    width: 100,
    height: 52,
    shape: 'parking_grid',
    description: 'Covered parking slots reserved for TCET faculty, administrative staff, and official college visitors near the main porch drive.',
    hours: '07:00 AM – 08:30 PM',
    floors: 'Ground Level (Covered Porch)',
    facilities: ['Covered Shade Canopy', 'EV Charging Point', 'Reserved Faculty Bays', 'Security Guard'],
    departments: ['Campus Security & Estate'],
    popular: false
  },
  {
    id: 'gate_4',
    code: 'GATE-4',
    name: 'Gate No. 4 (East Campus Gate)',
    shortName: 'Gate 4',
    category: 'transit',
    categoryLabel: 'Campus Entry',
    x: 1020,
    y: 560,
    width: 100,
    height: 52,
    shape: 'rectangle',
    description: 'Secondary campus gate providing direct pedestrian and vehicular access between the college campus, Thakur Sports Ground, and Thakur Village eastern road.',
    hours: '06:00 AM – 09:30 PM',
    floors: 'Ground Level',
    facilities: ['Security Guard Post', 'Turnstile Gate', 'Direct Ground Access'],
    departments: ['Campus Security'],
    popular: false
  }
];

export const CAMPUS_PATHWAYS = [
  // West Entrance & Parking Concourse
  {
    id: 'path_gate5_foyer',
    from: 'gate_5',
    to: 'tcet_foyer',
    distance: 65,
    name: 'TCET Entrance Promenade',
    surface: 'Paved Granite',
    description: 'Direct paved pedestrian avenue from Gate No. 5 to A-Block main entrance.'
  },
  {
    id: 'path_gate5_prks',
    from: 'gate_5',
    to: 'student_parking',
    distance: 45,
    name: 'North Entrance Driveway',
    surface: 'Asphalt & Pavers',
    description: 'Short pathway linking Gate No. 5 to the student two-wheeler parking lot.'
  },
  {
    id: 'path_gate5_prkf',
    from: 'gate_5',
    to: 'faculty_parking',
    distance: 55,
    name: 'South Porch Driveway',
    surface: 'Paved Flagstone',
    description: 'Vehicular and pedestrian lane leading to faculty car parking.'
  },
  {
    id: 'path_prks_foyer',
    from: 'student_parking',
    to: 'tcet_foyer',
    distance: 70,
    name: 'North Covered Walkway',
    surface: 'Ceramic Pavers',
    description: 'Covered canopy walkway from student parking to A-Block central lobby.'
  },
  {
    id: 'path_prkf_foyer',
    from: 'faculty_parking',
    to: 'tcet_foyer',
    distance: 60,
    name: 'South Foyer Path',
    surface: 'Polished Flagstone',
    description: 'Access walkway from faculty parking to the central foyer entrance.'
  },

  // A-Block Ground Floor Internal Connections
  {
    id: 'path_foyer_stat',
    from: 'tcet_foyer',
    to: 'stationery_kiosk',
    distance: 25,
    name: 'Lobby Portico Concourse',
    surface: 'Marble Pavers',
    description: 'Immediate corridor connecting the main foyer to the stationery & Xerox kiosk.'
  },
  {
    id: 'path_foyer_admin',
    from: 'tcet_foyer',
    to: 'admin_office',
    distance: 35,
    name: 'Ground Floor North Corridor',
    surface: 'Polished Granite',
    description: 'Wide internal corridor leading to the Registrar Office and Accounts counter.'
  },
  {
    id: 'path_foyer_exam',
    from: 'tcet_foyer',
    to: 'exam_cell',
    distance: 35,
    name: 'Ground Floor South Corridor',
    surface: 'Polished Granite',
    description: "Internal corridor to the Examination Cell and Principal's Office."
  },

  // A-Block Vertical Connections via Central Elevators & Staircases
  {
    id: 'path_foyer_lib',
    from: 'tcet_foyer',
    to: 'library_lrc',
    distance: 40,
    name: 'Central Library Lift / Stair Concourse',
    surface: 'Elevator & Central Stairs',
    description: 'Direct vertical access via Lift 1-4 and central staircase to 4th Floor Library (LRC).'
  },
  {
    id: 'path_foyer_cs',
    from: 'tcet_foyer',
    to: 'cs_it_labs',
    distance: 45,
    name: 'Computing Hub Lift / Stair Concourse',
    surface: 'Elevator & North Stairs',
    description: 'Vertical access to 3rd & 5th Floor Computer Engineering, IT, and AI&DS labs.'
  },
  {
    id: 'path_foyer_sem',
    from: 'tcet_foyer',
    to: 'seminar_hall',
    distance: 40,
    name: 'Auditorium & Seminar Concourse',
    surface: 'Elevator & South Stairs',
    description: 'Direct link to Ground Floor and 7th Floor air-conditioned seminar halls and auditorium.'
  },

  // Workshop & Practical Links
  {
    id: 'path_exam_work',
    from: 'exam_cell',
    to: 'central_workshop',
    distance: 55,
    name: 'Workshop Passage',
    surface: 'Heavy-duty Concrete',
    description: 'Covered passage connecting south ground corridor to the mechanical workshop.'
  },
  {
    id: 'path_prkf_work',
    from: 'faculty_parking',
    to: 'central_workshop',
    distance: 60,
    name: 'South Service Alley',
    surface: 'Asphalt Drive',
    description: 'Service driveway between faculty parking and the engineering workshop.'
  },

  // Central Courtyard & Canteen Links
  {
    id: 'path_foyer_court',
    from: 'tcet_foyer',
    to: 'central_courtyard',
    distance: 50,
    name: 'East Courtyard Arcade',
    surface: 'Ceramic Flagstone',
    description: 'Main pedestrian exit from A-Block opening out onto the Central Courtyard.'
  },
  {
    id: 'path_admin_canteen',
    from: 'admin_office',
    to: 'canteen',
    distance: 75,
    name: 'North Quad Walkway',
    surface: 'Granite Pavers',
    description: 'Shaded outdoor walkway connecting the admin office wing directly to the cafeteria.'
  },
  {
    id: 'path_court_canteen',
    from: 'central_courtyard',
    to: 'canteen',
    distance: 45,
    name: 'Cafeteria Plaza Walk',
    surface: 'Interlocking Pavers',
    description: 'Direct scenic pathway from the central amphitheater to the canteen dining hall.'
  },

  // TIMSR Management Wing Links
  {
    id: 'path_court_timsr',
    from: 'central_courtyard',
    to: 'timsr_block',
    distance: 60,
    name: 'Management Concourse',
    surface: 'Interlocking Bricks',
    description: 'Wide promenade linking the central courtyard with TIMSR Management Block.'
  },
  {
    id: 'path_exam_timsr',
    from: 'exam_cell',
    to: 'timsr_block',
    distance: 70,
    name: 'South Connecting Arcade',
    surface: 'Covered Walkway',
    description: 'Sheltered walkway connecting A-Block south wing with TIMSR.'
  },
  {
    id: 'path_work_timsr',
    from: 'central_workshop',
    to: 'timsr_block',
    distance: 85,
    name: 'South Campus Alley',
    surface: 'Concrete Pavers',
    description: 'Perimeter pathway linking the workshop annex to the management building.'
  },

  // Thakur Sports Ground & Gate 4 Links
  {
    id: 'path_court_sports',
    from: 'central_courtyard',
    to: 'sports_ground',
    distance: 85,
    name: 'Thakur Stadium Concourse',
    surface: 'Wide Flagstone',
    description: 'Ceremonial promenade opening into the 3.5-acre sports turf and cricket arena.'
  },
  {
    id: 'path_canteen_sports',
    from: 'canteen',
    to: 'sports_ground',
    distance: 90,
    name: 'North Sports Trail',
    surface: 'Paved Walkway',
    description: 'Direct pedestrian link from the canteen terrace to the sports ground.'
  },
  {
    id: 'path_timsr_gate4',
    from: 'timsr_block',
    to: 'gate_4',
    distance: 70,
    name: 'East Perimeter Way',
    surface: 'Smooth Asphalt',
    description: 'Direct pathway from TIMSR management block to Gate No. 4.'
  },
  {
    id: 'path_sports_gate4',
    from: 'sports_ground',
    to: 'gate_4',
    distance: 65,
    name: 'Stadium Perimeter Walk',
    surface: 'Rubberized / Paved',
    description: 'Perimeter trail running alongside the sports field to Gate No. 4.'
  }
];

export const CATEGORY_METADATA = {
  academic: {
    label: 'Academic & Labs',
    color: '#007AFF',       // Apple System Blue
    badgeBg: '#EBF5FF',
    badgeText: '#0062CC',
    icon: 'GraduationCap'
  },
  administrative: {
    label: 'Offices & Admin',
    color: '#5856D6',       // Apple System Indigo / Purple
    badgeBg: '#F3F2FD',
    badgeText: '#4340C7',
    icon: 'Building2'
  },
  amenity: {
    label: 'Dining & Services',
    color: '#FF9500',       // Apple System Orange
    badgeBg: '#FFF8EC',
    badgeText: '#B26200',
    icon: 'Coffee'
  },
  recreational: {
    label: 'Sports & Cultural',
    color: '#34C759',       // Apple System Green
    badgeBg: '#EDF9F0',
    badgeText: '#1E823D',
    icon: 'Trophy'
  },
  transit: {
    label: 'Gates & Parking',
    color: '#5AC8FA',       // Apple System Teal / Cyan
    badgeBg: '#EBF8FE',
    badgeText: '#007AA6',
    icon: 'Compass'
  }
};
