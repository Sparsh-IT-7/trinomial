export interface CivicIssue {
  id: string;
  title: string;
  location: string;
  city: string;
  ward: string;
  category: 'Waste Management' | 'Roads & Infrastructure' | 'Water Supply' | 'Public Safety' | 'Environmental Concerns';
  severity: 'High Priority' | 'Moderate' | 'Critical' | 'Under Review';
  status: 'Open Issues' | 'Authority Notified' | 'Citizen Action Active' | 'Under Investigation' | 'Work Order Issued' | 'Resolved';
  description: string;
  image: string;
  geoCoordinates?: string;
  verifiedSource: string;
  assignedAuthority: string;
  citizensMobilized: number;
  petitionSignatures?: number;
  petitionTarget?: number;
  updatedAt: string;
  firstRecorded?: string;
  escalationLevel?: number;
  isWatchlisted?: boolean;
}

export interface VolunteeringDrive {
  id: string;
  title: string;
  organizer: string;
  organizerType: 'Verified Organizer' | 'Research & Civic Audit' | 'Public Safety Initiative' | 'Grassroots Partner';
  date: string;
  time: string;
  location: string;
  ward: string;
  skills: string;
  description: string;
  volunteersRegistered: number;
  volunteersNeeded: number;
  category: 'Ground Action / Clean-up' | 'Legal & RTI Assistance' | 'Data Collection / Survey' | 'Logistics & Tech';
  scheduleType: 'This Weekend' | 'Upcoming Week' | 'Ongoing / Flexible';
  cityZone: 'Bengaluru' | 'Delhi NCR' | 'Mumbai' | 'Pune' | 'Hyderabad';
  roles: { title: string; needed: number; filled: number }[];
  isJoined?: boolean;
  statusBadge?: string;
}

export interface AuditLogEntry {
  id: string;
  author: string;
  role: string;
  action: string;
  timestamp: string;
  type: 'authority' | 'milestone' | 'volunteer' | 'incident';
}

// Concrete generated assets
export const IMAGES = {
  canalWaste: '/src/assets/images/canal_waste_dumping_1791697089890.jpg',
  brokenDrain: '/src/assets/images/broken_storm_drain_1791697101515.jpg',
  waterPipeLeak: '/src/assets/images/water_pipe_leak_mumbai_1791697114912.jpg',
  chemicalFoam: '/src/assets/images/chemical_foam_river_1791697128130.jpg',
  volunteerTesting: '/src/assets/images/volunteer_water_testing_1791697147299.jpg',
  priyaAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
};

export const INITIAL_ISSUES: CivicIssue[] = [
  {
    id: 'KTV-2024-8841',
    title: 'Severe Industrial Effluent Discharge & Pungent Odor in Bellandur Drainage Outflow',
    location: 'Ward 150 (Yamalur - Bellandur Outfall)',
    city: 'Bengaluru',
    ward: 'Ward 150',
    category: 'Environmental Concerns',
    severity: 'Critical',
    status: 'Citizen Action Active',
    description: 'Persistent accumulation of dense surfactant froth and chemical discharge documented along the Yamalur feeder canal leading into Bellandur Lake. Telemetry sensors positioned at Outflow Culvert #7 indicate heavy midnight spikes between 01:00 AM and 04:30 AM, releasing unneutralized ammonia and heavy metal byproducts into public surface water.',
    image: IMAGES.chemicalFoam,
    geoCoordinates: '12.9372° N, 77.6823° E',
    verifiedSource: 'CPCB & Resident Federation',
    assignedAuthority: 'Karnataka State Pollution Control Board (KSPCB)',
    citizensMobilized: 20,
    petitionSignatures: 842,
    petitionTarget: 1000,
    updatedAt: '14 mins ago',
    firstRecorded: 'Oct 12, 2024',
    escalationLevel: 3,
    isWatchlisted: true,
  },
  {
    id: 'KRT-BLR-2025-04',
    title: 'Illegal Industrial Waste Dumping near Vrishabhavathi Canal',
    location: 'Ward 142, Bengaluru',
    city: 'Bengaluru',
    ward: 'Ward 142',
    category: 'Environmental Concerns',
    severity: 'High Priority',
    status: 'Citizen Action Active',
    description: 'Unpermitted tanker offloading of caustic sludge along the canal embankment during nocturnal hours. Citizen sensor readings recorded localized DO drop below 1.2 mg/L.',
    image: IMAGES.canalWaste,
    geoCoordinates: '12.9142, 77.4988',
    verifiedSource: 'Public Pollution Control Board Feed & Citizen Geo-Tag',
    assignedAuthority: 'Karnataka State Pollution Control Board (KSPCB)',
    citizensMobilized: 12,
    updatedAt: '2h ago',
    firstRecorded: 'Oct 08, 2024',
    escalationLevel: 2,
    isWatchlisted: false,
  },
  {
    id: 'BG-89021',
    title: 'Uncovered Stormwater Drain Posing Hazard to Pedestrians',
    location: 'Sector 4, HSR Layout, Bengaluru',
    city: 'Bengaluru',
    ward: 'Ward 174',
    category: 'Roads & Infrastructure',
    severity: 'High Priority',
    status: 'Authority Notified',
    description: 'A 3-meter section of concrete culvert slab collapsed along 14th Main footpath. Rain runoff poses immediate tripping hazard during evening commuter hours.',
    image: IMAGES.brokenDrain,
    geoCoordinates: '12.9116, 77.6389',
    verifiedSource: 'BBMP Grievance #BG-89021',
    assignedAuthority: 'Bruhat Bengaluru Mahanagara Palike (BBMP Engineering)',
    citizensMobilized: 6,
    updatedAt: '4h ago',
    firstRecorded: 'Oct 14, 2024',
    escalationLevel: 1,
    isWatchlisted: false,
  },
  {
    id: 'DL-ND-4412',
    title: 'Chronic Solid Waste Burning near Railway Underpass',
    location: 'Anand Vihar Ward 21, New Delhi',
    city: 'Delhi NCR',
    ward: 'Ward 21',
    category: 'Waste Management',
    severity: 'Moderate',
    status: 'Citizen Action Active',
    description: 'Unsegregated municipal plastic and leaf litter burned repeatedly after sunset. Local air sensors indicate localized particulate spike impacting school zones.',
    image: IMAGES.canalWaste,
    geoCoordinates: '28.6508, 77.3153',
    verifiedSource: 'Citizen Geolocation & CPCB',
    assignedAuthority: 'Municipal Corporation of Delhi (MCD Zone 3)',
    citizensMobilized: 19,
    updatedAt: '6h ago',
    firstRecorded: 'Oct 09, 2024',
    escalationLevel: 2,
    isWatchlisted: false,
  },
  {
    id: 'MH-MUM-7731',
    title: 'Drinking Water Pipeline Leakage Causing Road Subsidence',
    location: 'Dadar West, Mumbai',
    city: 'Mumbai',
    ward: 'G/North Ward',
    category: 'Water Supply',
    severity: 'High Priority',
    status: 'Under Investigation',
    description: 'Subsurface rupture leaking potable water for 48 hours, creating asphalt cave-in near market bus stop. Ward engineer notified via direct escalation docket.',
    image: IMAGES.waterPipeLeak,
    geoCoordinates: '19.0178, 72.8478',
    verifiedSource: 'Municipal Hydraulic Dept Advisory',
    assignedAuthority: 'Brihanmumbai Municipal Corporation (BMC Hydraulics)',
    citizensMobilized: 11,
    updatedAt: '1h ago',
    firstRecorded: 'Oct 15, 2024',
    escalationLevel: 2,
    isWatchlisted: false,
  },
  {
    id: 'KTV-2024-7120',
    title: 'Dangerous Potholes at Sarjapur-ORR Junction',
    location: 'Iblur Flyover Down-ramp, Ward 150',
    city: 'Bengaluru',
    ward: 'Ward 150',
    category: 'Roads & Infrastructure',
    severity: 'High Priority',
    status: 'Work Order Issued',
    description: 'Deep consecutive asphalt craters causing dangerous swerving of two-wheelers during peak traffic. BBMP Road Infrastructure Division accepted work order #BBMP-WO-902.',
    image: IMAGES.brokenDrain,
    geoCoordinates: '12.9248, 77.6698',
    verifiedSource: 'Citizen Audit & Traffic Police Alert',
    assignedAuthority: 'BBMP Major Roads Division',
    citizensMobilized: 128,
    updatedAt: 'Yesterday',
    firstRecorded: 'Sep 29, 2024',
    escalationLevel: 3,
    isWatchlisted: true,
  },
  {
    id: 'KTV-2024-6502',
    title: 'Non-Functional Streetlights on Kasavanahalli Main Road',
    location: 'Stretch from Hosa Road Jn to Lake Gate',
    city: 'Bengaluru',
    ward: 'Ward 150',
    category: 'Public Safety',
    severity: 'High Priority',
    status: 'Citizen Action Active',
    description: '14 consecutive street poles completely dark for 11 consecutive nights. Women and evening walkers vulnerable. BESCOM and Ward Engineering desk missed statutory 72-hour SLA.',
    image: IMAGES.brokenDrain,
    geoCoordinates: '12.8982, 77.6749',
    verifiedSource: 'Resident Welfare Association & BESCOM Desk',
    assignedAuthority: 'BESCOM Mahadevapura Sub-division',
    citizensMobilized: 512,
    updatedAt: '3h ago',
    firstRecorded: 'Oct 02, 2024',
    escalationLevel: 2,
    isWatchlisted: true,
  },
];

export const INITIAL_VOLUNTEER_DRIVES: VolunteeringDrive[] = [
  {
    id: 'VOL-BLR-01',
    title: 'Cubbon Park Native Sapling Plantation & Soil Aeration Drive',
    organizer: 'Green Brigade Foundation & Bengaluru City Volunteers',
    organizerType: 'Verified Organizer',
    date: 'Saturday, 26 Oct',
    time: '07:00 AM – 10:30 AM',
    location: 'Cubbon Park East Gate, Bengaluru',
    ward: 'Central-11',
    skills: 'Physical planting, tool management, gardening guidance',
    description: 'Help plant 120 indigenous trees to restore native bird canopy and aerate compacted walking trail soils. Refreshments and gardening gloves provided.',
    volunteersRegistered: 18,
    volunteersNeeded: 30,
    category: 'Ground Action / Clean-up',
    scheduleType: 'This Weekend',
    cityZone: 'Bengaluru',
    roles: [
      { title: 'Sapling Planters', needed: 15, filled: 12 },
      { title: 'Soil Aerators', needed: 10, filled: 5 },
      { title: 'Logistics & Refreshments', needed: 5, filled: 1 },
    ],
    isJoined: true,
    statusBadge: 'Attendance Confirmed',
  },
  {
    id: 'VOL-BLR-02',
    title: 'Community Water Audit & Heavy Metal Field Test Survey',
    organizer: 'Clean Waters Initiative in collaboration with IISc Research Scholars',
    organizerType: 'Research & Civic Audit',
    date: 'Sunday, 27 Oct',
    time: '08:30 AM – 01:00 PM',
    location: '8 Community Borewells across Mahadevapura Ward',
    ward: 'Mahadevapura-84',
    skills: 'Basic sample collection (training provided on-site), GPS logging',
    description: 'Citizen science testing of residential ground water to build an independent public record for municipal representation.',
    volunteersRegistered: 6,
    volunteersNeeded: 10,
    category: 'Data Collection / Survey',
    scheduleType: 'This Weekend',
    cityZone: 'Bengaluru',
    roles: [
      { title: 'Field Sample Collector', needed: 5, filled: 3 },
      { title: 'Spectrometer Assayer', needed: 3, filled: 2 },
      { title: 'GPS Data Logger', needed: 2, filled: 1 },
    ],
    isJoined: true,
    statusBadge: 'In 3 Days',
  },
  {
    id: 'VOL-BLR-03',
    title: 'Pothole Geo-Tagging & Pedestrian Safety Audit',
    organizer: 'Safe Streets Citizen Coalition',
    organizerType: 'Public Safety Initiative',
    date: 'Saturday, 02 Nov',
    time: '09:00 AM – 12:00 PM',
    location: 'Outer Ring Road stretch (Marathahalli to Bellandur)',
    ward: 'Bellandur-150',
    skills: 'Smartphone photo capture, walking survey',
    description: 'Systematically mapping 250+ road hazards before the municipal asphalt tender review.',
    volunteersRegistered: 12,
    volunteersNeeded: 15,
    category: 'Data Collection / Survey',
    scheduleType: 'Upcoming Week',
    cityZone: 'Bengaluru',
    roles: [
      { title: 'Geo-Tagger Walkers', needed: 10, filled: 8 },
      { title: 'Dimension Measurers', needed: 5, filled: 4 },
    ],
    isJoined: false,
  },
  {
    id: 'VOL-BLR-04',
    title: 'Weekend Civic Remediation: Urban Waste Segregation Workshop & Drive',
    organizer: 'Hasiru Dala Community Partner',
    organizerType: 'Grassroots Partner',
    date: 'Sunday, 03 Nov',
    time: '08:00 AM – 11:30 AM',
    location: 'Community Hall, Koramangala 4th Block',
    ward: 'Koramangala-151',
    skills: 'Resident outreach, door-to-door education',
    description: 'Guiding 400 households on zero-waste composting and ward dry-waste collection timings.',
    volunteersRegistered: 8,
    volunteersNeeded: 12,
    category: 'Ground Action / Clean-up',
    scheduleType: 'Upcoming Week',
    cityZone: 'Bengaluru',
    roles: [
      { title: 'Outreach Facilitators', needed: 8, filled: 5 },
      { title: 'Demo Composter Leads', needed: 4, filled: 3 },
    ],
    isJoined: false,
  },
  {
    id: 'VOL-BLR-05',
    title: 'Save Bellandur Waterways Volunteer Drive',
    organizer: 'Save Bellandur Waterways Citizen Collective',
    organizerType: 'Verified Organizer',
    date: 'Saturday, 19 Oct',
    time: '07:30 AM – 11:00 AM',
    location: 'Yamalur Gate, Bellandur Lake Buffer',
    ward: 'Ward 150',
    skills: 'Sample collection, evidence documentation, resident registry',
    description: 'Comprehensive water sampling and photographic documentation along Yamalur feeder canal outfall culverts.',
    volunteersRegistered: 15,
    volunteersNeeded: 20,
    category: 'Data Collection / Survey',
    scheduleType: 'This Weekend',
    cityZone: 'Bengaluru',
    roles: [
      { title: 'Sample Collectors', needed: 2, filled: 1 },
      { title: 'Evidence Photographer', needed: 1, filled: 0 },
      { title: 'Citizen Desk Host', needed: 2, filled: 1 },
    ],
    isJoined: false,
  },
];

export const BELLANDUR_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'LOG-01',
    author: 'KSPCB Regional Inspector',
    role: 'Official Authority',
    action: 'Official inspection scheduled for Friday morning. Subpoena issued to 4 industrial electroplating workshops along the outer ring corridor.',
    timestamp: 'Today, 11:20 AM',
    type: 'authority',
  },
  {
    id: 'LOG-02',
    author: 'Petition Milestone Reached',
    role: 'Civic Milestone',
    action: '800 verified resident signatures crossed. Automated dispatch copied to Member Secretary, Central Pollution Control Board (CPCB).',
    timestamp: 'Yesterday, 06:45 PM',
    type: 'milestone',
  },
  {
    id: 'LOG-03',
    author: 'Volunteer Team #2',
    role: 'Citizen Science',
    action: 'Completed morning baseline turbidity meter checks. Data ingested directly into Kartavya Open Telemetry API.',
    timestamp: 'Oct 15, 08:00 AM',
    type: 'volunteer',
  },
  {
    id: 'LOG-04',
    author: 'Incident Ticket Created',
    role: 'Telemetry Alert',
    action: 'First sensor threshold breach flagged by Resident Federation telemetry beacon #BLR-YML-04.',
    timestamp: 'Oct 12, 02:40 AM',
    type: 'incident',
  },
];

export const USER_PROFILE = {
  name: 'Priya Sharma',
  email: 'priya.sharma@bengaluru.civic.in',
  role: 'Verified Civic Contributor',
  ward: 'Ward 150 (Bellandur)',
  ledgerId: '#BLR-W150-8492',
  trustRegistry: 'Digital Public Trust Registry Verified',
  avatar: IMAGES.priyaAvatar,
  stats: {
    joinedDrives: 4,
    trackedIssues: 9,
    resolvedIssues: 2,
    serviceHours: 16,
    standingScore: 88,
    standingLevel: 'Integrity Level IV',
    reportsVerified: 32,
    falseFlags: 0,
    topPercent: 'Top 5% in Ward',
  },
  badges: ['Water Custodian', 'RTI Initiator', 'First 100 Mobilizers'],
  assignedWardDesk: {
    bbmpEngineer: 'K. R. Jagadeesh (Roads & Storm Water)',
    bbmpEmail: 'bbmp.ward150.eng@bbmp.gov.in',
    kspcbInspector: 'Dr. M. Sangeetha (Regional Officer)',
    kspcbEmail: 'ro.mahadevapura@kspcb.gov.in',
    nextMeeting: 'Saturday, Nov 02 • 10:00 AM',
    meetingLocation: 'Bellandur Ward Office, Near Central Jail Road',
  },
  recentSubmissions: [
    {
      id: 'SUB-01',
      title: 'Bellandur Inflow Channel A',
      metric: 'pH: 8.6 • Critical',
      submitter: 'Submitted by Volunteer Field Unit 3',
      date: 'Oct 24, 11:20 AM',
      image: IMAGES.volunteerTesting,
    },
    {
      id: 'SUB-02',
      title: 'Sarjapur-ORR Patch Assessment',
      metric: 'Pre-repair Audit Complete',
      submitter: 'Submitted by Priya Sharma',
      date: 'Oct 23, 05:40 PM',
      image: IMAGES.brokenDrain,
    },
  ],
};
