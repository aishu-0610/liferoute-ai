import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  area: string;
  status: "Available" | "Limited" | "Full";
  emergencyLevel: "Low" | "Medium" | "High" | "Critical" | null;
  bedsAvailable: number;
  icuAvailable: number;
  ventilatorsAvailable: number;
  bloodUnitsAvailable: string | null;
  specialties: string[];
  contactNumber: string;
  lastUpdated: string;
}

interface CityInfo {
  name: string;
  state: string;
  hasData: boolean;
}

interface StateContacts {
  ambulance: string;
  police: string;
  fire: string;
  disaster: string;
  healthHelpline: string;
}

const now = () => new Date().toISOString();

const hospitals: Hospital[] = [
  // ── Madurai, Tamil Nadu ──────────────────────────────────────────
  {
    id: "1",
    name: "CityCare Hospital",
    city: "Madurai",
    state: "Tamil Nadu",
    area: "Anna Nagar",
    status: "Available",
    emergencyLevel: "Medium",
    bedsAvailable: 24,
    icuAvailable: 5,
    ventilatorsAvailable: 3,
    bloodUnitsAvailable: "A+, O+, B+",
    specialties: ["Trauma Care", "Cardiology", "Emergency Ward"],
    contactNumber: "+91 90000 00001",
    lastUpdated: now(),
  },
  {
    id: "2",
    name: "LifeLine Medical Center",
    city: "Madurai",
    state: "Tamil Nadu",
    area: "KK Nagar",
    status: "Limited",
    emergencyLevel: "High",
    bedsAvailable: 8,
    icuAvailable: 1,
    ventilatorsAvailable: 0,
    bloodUnitsAvailable: "O+, AB+",
    specialties: ["Emergency Ward", "Neurology"],
    contactNumber: "+91 90000 00002",
    lastUpdated: now(),
  },
  {
    id: "3",
    name: "Hope MultiSpeciality Hospital",
    city: "Madurai",
    state: "Tamil Nadu",
    area: "Tallakulam",
    status: "Full",
    emergencyLevel: "Critical",
    bedsAvailable: 0,
    icuAvailable: 0,
    ventilatorsAvailable: 0,
    bloodUnitsAvailable: "Limited",
    specialties: ["Kidney Care", "Liver Care", "Operation Theatre"],
    contactNumber: "+91 90000 00003",
    lastUpdated: now(),
  },
  {
    id: "4",
    name: "Green Valley Hospital",
    city: "Madurai",
    state: "Tamil Nadu",
    area: "Mattuthavani",
    status: "Available",
    emergencyLevel: "Low",
    bedsAvailable: 18,
    icuAvailable: 4,
    ventilatorsAvailable: 2,
    bloodUnitsAvailable: "A-, B+, O-",
    specialties: ["Trauma Care", "ICU", "Blood Bank"],
    contactNumber: "+91 90000 00004",
    lastUpdated: now(),
  },
  {
    id: "5",
    name: "Sunrise Emergency Care",
    city: "Madurai",
    state: "Tamil Nadu",
    area: "Goripalayam",
    status: "Limited",
    emergencyLevel: "High",
    bedsAvailable: 6,
    icuAvailable: 2,
    ventilatorsAvailable: 1,
    bloodUnitsAvailable: "B+, O+",
    specialties: ["Emergency Ward", "Cardiology", "Ventilator"],
    contactNumber: "+91 90000 00005",
    lastUpdated: now(),
  },

  // ── Chennai, Tamil Nadu ──────────────────────────────────────────
  {
    id: "6",
    name: "Apollo Hospitals",
    city: "Chennai",
    state: "Tamil Nadu",
    area: "Anna Nagar",
    status: "Available",
    emergencyLevel: "Medium",
    bedsAvailable: 40,
    icuAvailable: 10,
    ventilatorsAvailable: 7,
    bloodUnitsAvailable: "A+, A-, B+, B-, O+, O-, AB+",
    specialties: ["Cardiology", "Neurology", "Trauma Care", "Operation Theatre", "ICU"],
    contactNumber: "+91 90000 00006",
    lastUpdated: now(),
  },
  {
    id: "7",
    name: "Fortis Malar Hospital",
    city: "Chennai",
    state: "Tamil Nadu",
    area: "Adyar",
    status: "Available",
    emergencyLevel: "Low",
    bedsAvailable: 22,
    icuAvailable: 6,
    ventilatorsAvailable: 4,
    bloodUnitsAvailable: "O+, A+, B+",
    specialties: ["Cardiology", "Trauma Care", "Emergency Ward", "Blood Bank"],
    contactNumber: "+91 90000 00007",
    lastUpdated: now(),
  },
  {
    id: "8",
    name: "MIOT International",
    city: "Chennai",
    state: "Tamil Nadu",
    area: "Porur",
    status: "Limited",
    emergencyLevel: "High",
    bedsAvailable: 9,
    icuAvailable: 2,
    ventilatorsAvailable: 1,
    bloodUnitsAvailable: "AB-, O+",
    specialties: ["Orthopedics", "Neurology", "Emergency Ward"],
    contactNumber: "+91 90000 00008",
    lastUpdated: now(),
  },
  {
    id: "9",
    name: "Vijaya Hospital",
    city: "Chennai",
    state: "Tamil Nadu",
    area: "T. Nagar",
    status: "Available",
    emergencyLevel: "Medium",
    bedsAvailable: 15,
    icuAvailable: 4,
    ventilatorsAvailable: 3,
    bloodUnitsAvailable: "A+, O+",
    specialties: ["Kidney Care", "Liver Care", "Operation Theatre"],
    contactNumber: "+91 90000 00009",
    lastUpdated: now(),
  },
  {
    id: "10",
    name: "Chettinad Health City",
    city: "Chennai",
    state: "Tamil Nadu",
    area: "Velachery",
    status: "Full",
    emergencyLevel: "Critical",
    bedsAvailable: 0,
    icuAvailable: 0,
    ventilatorsAvailable: 0,
    bloodUnitsAvailable: "Limited",
    specialties: ["Emergency Ward", "Trauma Care"],
    contactNumber: "+91 90000 00010",
    lastUpdated: now(),
  },

  // ── Bengaluru, Karnataka ─────────────────────────────────────────
  {
    id: "11",
    name: "Manipal Hospital",
    city: "Bengaluru",
    state: "Karnataka",
    area: "Indiranagar",
    status: "Available",
    emergencyLevel: "Medium",
    bedsAvailable: 35,
    icuAvailable: 9,
    ventilatorsAvailable: 6,
    bloodUnitsAvailable: "A+, O+, B+, AB+",
    specialties: ["Cardiology", "Neurology", "Trauma Care", "ICU", "Operation Theatre"],
    contactNumber: "+91 90000 00011",
    lastUpdated: now(),
  },
  {
    id: "12",
    name: "Whitefield Care Hospital",
    city: "Bengaluru",
    state: "Karnataka",
    area: "Whitefield",
    status: "Available",
    emergencyLevel: "Low",
    bedsAvailable: 20,
    icuAvailable: 5,
    ventilatorsAvailable: 3,
    bloodUnitsAvailable: "O+, A-, B+",
    specialties: ["Emergency Ward", "Blood Bank", "Cardiology", "ICU"],
    contactNumber: "+91 90000 00012",
    lastUpdated: now(),
  },
  {
    id: "13",
    name: "Narayana Health",
    city: "Bengaluru",
    state: "Karnataka",
    area: "Electronic City",
    status: "Limited",
    emergencyLevel: "High",
    bedsAvailable: 7,
    icuAvailable: 2,
    ventilatorsAvailable: 1,
    bloodUnitsAvailable: "B+, O+",
    specialties: ["Cardiology", "Trauma Care", "Emergency Ward"],
    contactNumber: "+91 90000 00013",
    lastUpdated: now(),
  },
  {
    id: "14",
    name: "Fortis Hospital Bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    area: "Jayanagar",
    status: "Available",
    emergencyLevel: "Medium",
    bedsAvailable: 18,
    icuAvailable: 4,
    ventilatorsAvailable: 2,
    bloodUnitsAvailable: "A+, B-, O+, AB-",
    specialties: ["Kidney Care", "Liver Care", "Neurology", "Operation Theatre"],
    contactNumber: "+91 90000 00014",
    lastUpdated: now(),
  },
  {
    id: "15",
    name: "Sakra World Hospital",
    city: "Bengaluru",
    state: "Karnataka",
    area: "Koramangala",
    status: "Full",
    emergencyLevel: "Critical",
    bedsAvailable: 0,
    icuAvailable: 0,
    ventilatorsAvailable: 0,
    bloodUnitsAvailable: "None",
    specialties: ["Trauma Care", "Emergency Ward"],
    contactNumber: "+91 90000 00015",
    lastUpdated: now(),
  },

  // ── Mumbai, Maharashtra ──────────────────────────────────────────
  {
    id: "16",
    name: "Kokilaben Dhirubhai Ambani",
    city: "Mumbai",
    state: "Maharashtra",
    area: "Andheri",
    status: "Available",
    emergencyLevel: "Medium",
    bedsAvailable: 45,
    icuAvailable: 12,
    ventilatorsAvailable: 8,
    bloodUnitsAvailable: "A+, A-, B+, B-, O+, O-, AB+, AB-",
    specialties: ["Cardiology", "Neurology", "Trauma Care", "ICU", "Operation Theatre"],
    contactNumber: "+91 90000 00016",
    lastUpdated: now(),
  },
  {
    id: "17",
    name: "Lilavati Hospital",
    city: "Mumbai",
    state: "Maharashtra",
    area: "Bandra",
    status: "Available",
    emergencyLevel: "Low",
    bedsAvailable: 28,
    icuAvailable: 7,
    ventilatorsAvailable: 5,
    bloodUnitsAvailable: "O+, A+, AB+",
    specialties: ["Emergency Ward", "Trauma Care", "Blood Bank", "Cardiology"],
    contactNumber: "+91 90000 00017",
    lastUpdated: now(),
  },
  {
    id: "18",
    name: "Hinduja Hospital",
    city: "Mumbai",
    state: "Maharashtra",
    area: "Dadar",
    status: "Limited",
    emergencyLevel: "High",
    bedsAvailable: 10,
    icuAvailable: 3,
    ventilatorsAvailable: 1,
    bloodUnitsAvailable: "B+, O-",
    specialties: ["Kidney Care", "Liver Care", "Emergency Ward", "Neurology"],
    contactNumber: "+91 90000 00018",
    lastUpdated: now(),
  },
  {
    id: "19",
    name: "Hiranandani Hospital",
    city: "Mumbai",
    state: "Maharashtra",
    area: "Powai",
    status: "Available",
    emergencyLevel: "Medium",
    bedsAvailable: 16,
    icuAvailable: 5,
    ventilatorsAvailable: 3,
    bloodUnitsAvailable: "A+, O+, B+",
    specialties: ["Operation Theatre", "Cardiology", "ICU", "Trauma Care"],
    contactNumber: "+91 90000 00019",
    lastUpdated: now(),
  },
  {
    id: "20",
    name: "MGM Hospital Navi Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    area: "Navi Mumbai",
    status: "Limited",
    emergencyLevel: "High",
    bedsAvailable: 8,
    icuAvailable: 2,
    ventilatorsAvailable: 0,
    bloodUnitsAvailable: "O+, AB+",
    specialties: ["Emergency Ward", "Trauma Care"],
    contactNumber: "+91 90000 00020",
    lastUpdated: now(),
  },

  // ── Delhi ────────────────────────────────────────────────────────
  {
    id: "21",
    name: "AIIMS Delhi",
    city: "Delhi",
    state: "Delhi",
    area: "Connaught Place",
    status: "Limited",
    emergencyLevel: "High",
    bedsAvailable: 12,
    icuAvailable: 4,
    ventilatorsAvailable: 3,
    bloodUnitsAvailable: "A+, O+, B+, AB+",
    specialties: ["Cardiology", "Neurology", "Trauma Care", "Operation Theatre", "ICU"],
    contactNumber: "+91 90000 00021",
    lastUpdated: now(),
  },
  {
    id: "22",
    name: "Max Super Specialty Rohini",
    city: "Delhi",
    state: "Delhi",
    area: "Rohini",
    status: "Available",
    emergencyLevel: "Medium",
    bedsAvailable: 25,
    icuAvailable: 7,
    ventilatorsAvailable: 5,
    bloodUnitsAvailable: "O+, A-, B+",
    specialties: ["Emergency Ward", "Trauma Care", "Cardiology", "Blood Bank"],
    contactNumber: "+91 90000 00022",
    lastUpdated: now(),
  },
  {
    id: "23",
    name: "Venkateshwar Hospital",
    city: "Delhi",
    state: "Delhi",
    area: "Dwarka",
    status: "Available",
    emergencyLevel: "Low",
    bedsAvailable: 19,
    icuAvailable: 5,
    ventilatorsAvailable: 3,
    bloodUnitsAvailable: "A+, B+, AB-",
    specialties: ["Kidney Care", "Liver Care", "Neurology", "ICU"],
    contactNumber: "+91 90000 00023",
    lastUpdated: now(),
  },
  {
    id: "24",
    name: "Fortis Escorts Heart Institute",
    city: "Delhi",
    state: "Delhi",
    area: "Saket",
    status: "Available",
    emergencyLevel: "Medium",
    bedsAvailable: 20,
    icuAvailable: 6,
    ventilatorsAvailable: 4,
    bloodUnitsAvailable: "A+, O+, B-, AB+",
    specialties: ["Cardiology", "Trauma Care", "Operation Theatre", "Emergency Ward"],
    contactNumber: "+91 90000 00024",
    lastUpdated: now(),
  },
  {
    id: "25",
    name: "Batra Hospital",
    city: "Delhi",
    state: "Delhi",
    area: "Karol Bagh",
    status: "Full",
    emergencyLevel: "Critical",
    bedsAvailable: 0,
    icuAvailable: 0,
    ventilatorsAvailable: 0,
    bloodUnitsAvailable: "None",
    specialties: ["Emergency Ward", "Trauma Care"],
    contactNumber: "+91 90000 00025",
    lastUpdated: now(),
  },
];

const cities: CityInfo[] = [
  { name: "Madurai", state: "Tamil Nadu", hasData: true },
  { name: "Chennai", state: "Tamil Nadu", hasData: true },
  { name: "Bengaluru", state: "Karnataka", hasData: true },
  { name: "Mumbai", state: "Maharashtra", hasData: true },
  { name: "Delhi", state: "Delhi", hasData: true },
  { name: "Hyderabad", state: "Telangana", hasData: false },
  { name: "Kochi", state: "Kerala", hasData: false },
  { name: "Coimbatore", state: "Tamil Nadu", hasData: false },
  { name: "Pune", state: "Maharashtra", hasData: false },
  { name: "Kolkata", state: "West Bengal", hasData: false },
];

const stateContacts: Record<string, StateContacts> = {
  "Tamil Nadu": {
    ambulance: "108",
    police: "100",
    fire: "101",
    disaster: "1077",
    healthHelpline: "104",
  },
  Karnataka: {
    ambulance: "108",
    police: "100",
    fire: "101",
    disaster: "1077",
    healthHelpline: "104",
  },
  Maharashtra: {
    ambulance: "108",
    police: "100",
    fire: "101",
    disaster: "1077",
    healthHelpline: "104",
  },
  Delhi: {
    ambulance: "102 / 108",
    police: "100",
    fire: "101",
    disaster: "1077",
    healthHelpline: "1031",
  },
  Telangana: {
    ambulance: "108",
    police: "100",
    fire: "101",
    disaster: "1077",
    healthHelpline: "104",
  },
  Kerala: {
    ambulance: "108",
    police: "100",
    fire: "101",
    disaster: "1077",
    healthHelpline: "104",
  },
};

const defaultContacts: StateContacts = {
  ambulance: "108",
  police: "100",
  fire: "101",
  disaster: "1077",
  healthHelpline: "104",
};

// Canonical specialty keywords for text-based facilities
const FACILITY_SPECIALTY_MAP: Record<string, string[]> = {
  "Trauma Care": ["Trauma Care"],
  "Kidney Care": ["Kidney Care"],
  "Liver Care": ["Liver Care"],
  Cardiology: ["Cardiology"],
  Neurology: ["Neurology"],
  "Emergency Ward": ["Emergency Ward"],
  "Operation Theatre": ["Operation Theatre"],
};

/**
 * Returns true if a hospital provides the requested facility.
 *
 * For resource-backed facilities (ICU, Ventilator, Blood Bank, General Beds)
 * we check the numeric/text resource fields first, then fall back to the
 * specialties list so hospitals that list the specialty but haven't entered
 * resource counts are still included.
 */
function facilityMatches(hospital: Hospital, facility: string | undefined): boolean {
  if (!facility || facility === "all") return true;

  const fac = facility.toLowerCase();

  if (fac === "general beds") {
    return hospital.bedsAvailable > 0;
  }

  if (fac === "icu") {
    return (
      hospital.icuAvailable > 0 ||
      hospital.specialties.some((s) => s.toLowerCase().includes("icu"))
    );
  }

  if (fac === "ventilator" || fac === "ventilators") {
    return (
      hospital.ventilatorsAvailable > 0 ||
      hospital.specialties.some((s) =>
        s.toLowerCase().includes("vent")
      )
    );
  }

  if (fac === "blood bank") {
    const blood = (hospital.bloodUnitsAvailable || "").trim().toLowerCase();
    const hasBlood =
      blood.length > 0 && blood !== "none" && blood !== "n/a" && blood !== "-";
    return (
      hasBlood ||
      hospital.specialties.some((s) => s.toLowerCase().includes("blood bank"))
    );
  }

  // For all other named specialties (Trauma Care, Cardiology, etc.)
  const keywords = FACILITY_SPECIALTY_MAP[facility] || [facility];
  return keywords.some((kw) =>
    hospital.specialties.some((s) => s.toLowerCase().includes(kw.toLowerCase()))
  );
}

function scoreHospital(
  hospital: Hospital,
  area: string | undefined,
  facility: string | undefined,
  emergencyLevel: string | undefined
): number {
  let score = 0;

  // Status baseline — Full is disqualified outright
  if (hospital.status === "Available") score += 50;
  else if (hospital.status === "Limited") score += 20;
  else if (hospital.status === "Full") return -10000; // never recommend

  // Area match bonus
  if (area && hospital.area.toLowerCase().includes(area.toLowerCase())) {
    score += 20;
  }

  // Facility match bonus — uses shared facilityMatches which checks numeric
  // resource fields (icuAvailable, ventilatorsAvailable, blood) first, then
  // falls back to specialties text for non-resource facilities.
  if (facility && facilityMatches(hospital, facility)) {
    score += 25;

    // Extra bonus when the selected facility is directly measurable by count
    const fac = facility.toLowerCase();
    if (fac === "icu") score += hospital.icuAvailable * 3;
    if (fac === "ventilator" || fac === "ventilators")
      score += hospital.ventilatorsAvailable * 4;
    if (fac === "general beds") score += hospital.bedsAvailable * 0.5;
  }

  // Resource counts
  score += hospital.bedsAvailable;
  score += hospital.icuAvailable * 5;
  score += hospital.ventilatorsAvailable * 6;

  // Critical emergency: strongly reward ICU + ventilator presence,
  // and heavily penalize their absence
  if (emergencyLevel === "Critical") {
    if (hospital.icuAvailable > 0 && hospital.ventilatorsAvailable > 0) {
      score += 120;
    } else if (hospital.icuAvailable > 0) {
      score += 30;
    } else if (hospital.ventilatorsAvailable > 0) {
      score += 20;
    } else {
      // No ICU AND no ventilators — cannot safely handle critical case
      score -= 500;
    }
    if (hospital.bedsAvailable === 0) score -= 300;
  }

  // High emergency: reward ICU + ventilator presence
  if (emergencyLevel === "High") {
    if (hospital.icuAvailable > 0) score += 40;
    if (hospital.ventilatorsAvailable > 0) score += 20;
  }

  return score;
}

function buildRecommendationReasons(
  hospital: Hospital,
  area: string | undefined,
  facility: string | undefined,
  emergencyLevel: string | undefined
): string[] {
  const reasons: string[] = [];

  // Lead with critical-specific reason when applicable
  if (emergencyLevel === "Critical") {
    if (hospital.icuAvailable > 0 && hospital.ventilatorsAvailable > 0) {
      reasons.push(
        `Recommended because it has available ICU beds, ventilator support, and emergency capacity for critical cases`
      );
    } else if (hospital.icuAvailable > 0) {
      reasons.push(`Has ${hospital.icuAvailable} ICU bed(s) available for critical care`);
    }
  } else {
    if (hospital.status === "Available") {
      reasons.push("Has available emergency capacity");
    } else if (hospital.status === "Limited") {
      reasons.push("Has limited but open capacity");
    }
  }

  if (area && hospital.area.toLowerCase().includes(area.toLowerCase())) {
    reasons.push(`Located in your selected area (${hospital.area})`);
  }

  if (facility && facilityMatches(hospital, facility)) {
    const fac = facility.toLowerCase();
    if (fac === "ventilator" || fac === "ventilators") {
      reasons.push(`Has ${hospital.ventilatorsAvailable} ventilator(s) available`);
    } else if (fac === "icu") {
      reasons.push(`Has ${hospital.icuAvailable} ICU bed(s) available`);
    } else if (fac === "blood bank") {
      reasons.push(`Blood units available: ${hospital.bloodUnitsAvailable}`);
    } else if (fac === "general beds") {
      reasons.push(`${hospital.bedsAvailable} general bed(s) available`);
    } else {
      // Text-matched specialty
      const keywords = FACILITY_SPECIALTY_MAP[facility] || [facility];
      const matching = hospital.specialties.filter((s) =>
        keywords.some((kw) => s.toLowerCase().includes(kw.toLowerCase()))
      );
      if (matching.length > 0) {
        reasons.push(`Provides requested facility: ${matching.join(", ")}`);
      }
    }
  }

  // Generic resource counts — skip any already mentioned in the facility block above
  const facLower = (facility || "").toLowerCase();
  if (emergencyLevel !== "Critical" && hospital.icuAvailable > 0 && facLower !== "icu") {
    reasons.push(`${hospital.icuAvailable} ICU bed(s) available`);
  }
  if (hospital.ventilatorsAvailable > 0 && emergencyLevel !== "Critical" &&
    facLower !== "ventilator" && facLower !== "ventilators") {
    reasons.push(`${hospital.ventilatorsAvailable} ventilator(s) available`);
  }
  if (hospital.bedsAvailable > 0 && facLower !== "general beds") {
    reasons.push(`${hospital.bedsAvailable} bed(s) available`);
  }

  if (hospital.status === "Available" && emergencyLevel === "Critical") {
    reasons.push("Currently accepting emergency patients");
  } else if (hospital.status === "Limited" && emergencyLevel === "Critical") {
    reasons.push("Partial capacity — can still accept critical patients");
  }

  return reasons;
}

// ── Routes ───────────────────────────────────────────────────────────

router.get("/cities", (_req: Request, res: Response) => {
  res.json(cities);
});

router.get("/emergency-contacts", (req: Request, res: Response) => {
  const { city } = req.query as Record<string, string>;
  const cityInfo = cities.find(
    (c) => c.name.toLowerCase() === (city || "").toLowerCase()
  );
  const state = cityInfo?.state || "National";
  const contacts = stateContacts[state] || defaultContacts;

  res.json({
    city: city || "India",
    state,
    national: "112",
    ...contacts,
  });
});

router.get("/hospitals", (req: Request, res: Response) => {
  const { city, area, facility, status, emergencyLevel, search } =
    req.query as Record<string, string>;

  let filtered = [...hospitals];

  if (city) {
    filtered = filtered.filter(
      (h) => h.city.toLowerCase() === city.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (h) =>
        h.name.toLowerCase().includes(q) || h.area.toLowerCase().includes(q)
    );
  }

  if (area) {
    filtered = filtered.filter((h) =>
      h.area.toLowerCase().includes(area.toLowerCase())
    );
  }

  if (facility) {
    filtered = filtered.filter((h) => facilityMatches(h, facility));
  }

  if (status) {
    filtered = filtered.filter((h) => h.status === status);
  }

  // emergencyLevel is intentionally NOT used to filter the hospital list.
  // It is a user intent signal (severity of the patient's condition) used
  // only by the recommendation engine, not a property to filter hospitals by.

  res.json(filtered);
});

router.post("/hospitals", (req: Request, res: Response) => {
  const body = req.body as Omit<Hospital, "id" | "lastUpdated">;
  const newHospital: Hospital = {
    ...body,
    id: String(Date.now()),
    lastUpdated: now(),
  };
  hospitals.push(newHospital);
  // Mark city as having data
  const cityEntry = cities.find(
    (c) => c.name.toLowerCase() === newHospital.city.toLowerCase()
  );
  if (cityEntry) {
    cityEntry.hasData = true;
  } else {
    cities.push({ name: newHospital.city, state: newHospital.state, hasData: true });
  }
  res.status(201).json(newHospital);
});

router.get("/hospitals/stats", (req: Request, res: Response) => {
  const { city } = req.query as Record<string, string>;
  const scope = city
    ? hospitals.filter((h) => h.city.toLowerCase() === city.toLowerCase())
    : hospitals;

  res.json({
    totalHospitals: scope.length,
    availableHospitals: scope.filter((h) => h.status === "Available").length,
    limitedHospitals: scope.filter((h) => h.status === "Limited").length,
    fullHospitals: scope.filter((h) => h.status === "Full").length,
    totalIcuBeds: scope.reduce((sum, h) => sum + h.icuAvailable, 0),
    totalVentilators: scope.reduce((sum, h) => sum + h.ventilatorsAvailable, 0),
    totalBeds: scope.reduce((sum, h) => sum + h.bedsAvailable, 0),
  });
});

router.get("/hospitals/recommend", (req: Request, res: Response) => {
  const { city, area, facility, emergencyLevel } = req.query as Record<
    string,
    string
  >;

  // Start with all non-Full hospitals in the selected city
  let pool = hospitals.filter((h) => h.status !== "Full");
  if (city) {
    pool = pool.filter(
      (h) => h.city.toLowerCase() === city.toLowerCase()
    );
  }

  const cityLabel = city ? ` in ${city}` : "";

  if (pool.length === 0) {
    res.json({
      found: false,
      message: `No suitable hospital found${cityLabel}. All hospitals are currently at full capacity. Please contact the emergency helpline shown above.`,
      hospital: null,
      reasons: [],
    });
    return;
  }

  // For Critical emergencies, check upfront if any hospital has ICU + ventilators
  if (emergencyLevel === "Critical") {
    const criticalReady = pool.filter(
      (h) => h.icuAvailable > 0 && h.ventilatorsAvailable > 0 && h.bedsAvailable > 0
    );
    if (criticalReady.length === 0) {
      res.json({
        found: false,
        message: `No critical-care-ready hospital found${cityLabel}. Please contact the emergency helpline or expand your search to nearby cities.`,
        hospital: null,
        reasons: [],
      });
      return;
    }
  }

  const scored = pool.map((h) => ({
    hospital: h,
    score: scoreHospital(h, area, facility, emergencyLevel),
  }));
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  // If the top score is deeply negative, no good match exists
  if (best.score < -100) {
    const noMatchMsg =
      emergencyLevel === "Critical"
        ? `No critical-care-ready hospital found${cityLabel}. Please contact the emergency helpline or expand your search.`
        : `No suitable hospital found for the selected filters. Try expanding the area or choosing another facility.`;
    res.json({ found: false, message: noMatchMsg, hospital: null, reasons: [] });
    return;
  }

  const reasons = buildRecommendationReasons(
    best.hospital,
    area,
    facility,
    emergencyLevel
  );
  const facilityText = facility && facility !== "all" ? ` for ${facility}` : "";
  const areaText = area ? ` near ${area}` : "";
  const cityText = city ? ` in ${city}` : "";
  const levelText = emergencyLevel === "Critical" ? "critical emergency" : "emergency";
  const message = `For ${levelText}${facilityText}${areaText}${cityText}, **${best.hospital.name}** is currently the best option.`;

  res.json({ found: true, message, hospital: best.hospital, reasons });
});

router.get("/hospitals/:id", (req: Request, res: Response) => {
  const hospital = hospitals.find((h) => h.id === req.params.id);
  if (!hospital) {
    res.status(404).json({ error: "Hospital not found" });
    return;
  }
  res.json(hospital);
});

router.put("/hospitals/:id", (req: Request, res: Response) => {
  const idx = hospitals.findIndex((h) => h.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Hospital not found" });
    return;
  }
  const updates = req.body as Partial<Hospital>;
  hospitals[idx] = {
    ...hospitals[idx],
    ...updates,
    id: hospitals[idx].id,
    name: hospitals[idx].name,
    city: hospitals[idx].city,
    state: hospitals[idx].state,
    area: hospitals[idx].area,
    lastUpdated: now(),
  };
  res.json(hospitals[idx]);
});

export default router;
