/**
 * Seeded demo data for Love Vet AI.
 *
 * This module is the single source of mock data for the frontend demo.
 * Every shape here mirrors the future backend hierarchy:
 * Organization → Locations → Services → Veterinarians → Schedules →
 * Appointments → Patients → Intakes → Media.
 * Replace these constants with real API/database reads in the next phase.
 */

export type Priority = "ROUTINE" | "SAME-DAY" | "NEEDS ATTENTION" | "EMERGENCY";

export type Organization = {
  id: string;
  name: string;
  brandLine: string;
  locales: string[];
};

export type Location = {
  id: string;
  name: string;
  area: string;
  distance: string;
  services: string[];
  nextAvailable: string;
};

export type Service = {
  id: string;
  name: string;
  durationMin: number;
  category: string;
};

export type Veterinarian = {
  id: string;
  name: string;
  specialty: string;
  locationIds: string[];
  languages: string[];
  initials: string;
};

export type Patient = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  ownerName: string;
};

export type Media = {
  id: string;
  kind: "photo" | "video" | "voice";
  fileName: string;
  meta: string;
};

export type Intake = {
  id: string;
  patientId: string;
  originalLanguage: string;
  originalText: string;
  translatedText: string;
  concerns: string[];
  onset: string;
  priority: Priority;
  route: string;
  routeReason: string;
  inputs: string[];
  media: Media[];
  status: "CONFIRMED" | "AWAITING REVIEW" | "ROUTED";
  receivedAt: string;
};

export const organization: Organization = {
  id: "org_northline",
  name: "Northline Veterinary Group",
  brandLine: "Powered by Love Vet AI",
  locales: ["Russian", "English", "Spanish", "Portuguese", "German", "Mandarin"],
};

export const locations: Location[] = [
  {
    id: "loc_central",
    name: "Central Veterinary Center",
    area: "City Center · Meridian Ave 14",
    distance: "2.1 km away",
    services: ["Mobility / Orthopedic Care", "General Medicine", "Imaging"],
    nextAvailable: "Today · 3:30 PM",
  },
  {
    id: "loc_harbor",
    name: "Harbor Veterinary Center",
    area: "Harbor District · Pier 7",
    distance: "5.8 km away",
    services: ["General Medicine", "Mobility / Orthopedic Care", "Dermatology"],
    nextAvailable: "Today · 5:00 PM",
  },
  {
    id: "loc_north",
    name: "North Veterinary Center",
    area: "Northside · Larkfield Rd 3",
    distance: "11.4 km away",
    services: ["General Medicine", "Dermatology"],
    nextAvailable: "Tomorrow · 9:00 AM",
  },
];

export const services: Service[] = [
  { id: "svc_mobility", name: "Mobility / Orthopedic Consultation", durationMin: 30, category: "Mobility / Orthopedic Care" },
  { id: "svc_general", name: "General Veterinary Consultation", durationMin: 25, category: "General Medicine" },
  { id: "svc_derm", name: "Dermatology Consultation", durationMin: 30, category: "Dermatology" },
  { id: "svc_imaging", name: "Diagnostic Imaging", durationMin: 45, category: "Imaging" },
];

export const veterinarians: Veterinarian[] = [
  {
    id: "vet_rivera",
    name: "Dr. Daniel Rivera",
    specialty: "Mobility & Orthopedic Care",
    locationIds: ["loc_central", "loc_harbor"],
    languages: ["English", "Spanish"],
    initials: "DR",
  },
  {
    id: "vet_chen",
    name: "Dr. Maya Chen",
    specialty: "General Veterinary Medicine",
    locationIds: ["loc_central", "loc_north"],
    languages: ["English", "Mandarin"],
    initials: "MC",
  },
  {
    id: "vet_martins",
    name: "Dr. Sofia Martins",
    specialty: "Dermatology",
    locationIds: ["loc_harbor", "loc_north"],
    languages: ["English", "Portuguese"],
    initials: "SM",
  },
];

export const patients: Patient[] = [
  {
    id: "pat_luna",
    name: "Luna",
    species: "Dog",
    breed: "Golden Retriever",
    age: "6 years",
    ownerName: "Svetlana R.",
  },
  {
    id: "pat_miso",
    name: "Miso",
    species: "Cat",
    breed: "British Shorthair",
    age: "3 years",
    ownerName: "Tomás F.",
  },
  {
    id: "pat_bruno",
    name: "Bruno",
    species: "Dog",
    breed: "Boxer",
    age: "8 years",
    ownerName: "Anna K.",
  },
];

export const lunaOriginalText =
  "Моя собака Луна, золотистый ретривер, шесть лет. Со вчерашнего дня она начала хромать на переднюю лапу и иногда кашляет. Я прикрепила фотографию и короткое видео.";

export const timeSlots = ["10:30 AM", "11:45 AM", "3:30 PM", "4:15 PM", "5:00 PM"];

export const intakes: Intake[] = [
  {
    id: "int_luna",
    patientId: "pat_luna",
    originalLanguage: "Russian",
    originalText: lunaOriginalText,
    translatedText:
      "My dog Luna, a Golden Retriever, six years old. Since yesterday she started limping on a front leg and coughs occasionally. I attached a photo and a short video.",
    concerns: ["Front-leg limping", "Intermittent cough"],
    onset: "Yesterday",
    priority: "SAME-DAY",
    route: "Mobility / Orthopedic Care",
    routeReason:
      "Reported limping and mobility changes correspond to this veterinary service category.",
    inputs: ["Voice", "Photo", "Video"],
    media: [
      { id: "m_voice", kind: "voice", fileName: "luna-voice-note.m4a", meta: "00:18 · Russian" },
      { id: "m_photo", kind: "photo", fileName: "luna-leg.jpg", meta: "Photo · front left leg" },
      { id: "m_video", kind: "video", fileName: "luna-walking.mp4", meta: "Video · 00:09 · gait" },
    ],
    status: "CONFIRMED",
    receivedAt: "Today · 08:42",
  },
  {
    id: "int_miso",
    patientId: "pat_miso",
    originalLanguage: "Portuguese",
    originalText: "A Miso está a coçar-se muito e tem a pele vermelha na barriga.",
    translatedText: "Miso is scratching a lot and has red skin on the belly.",
    concerns: ["Excessive scratching", "Skin redness"],
    onset: "4 days ago",
    priority: "ROUTINE",
    route: "Dermatology",
    routeReason: "Reported skin and coat changes correspond to this veterinary service category.",
    inputs: ["Text", "Photo"],
    media: [{ id: "m_miso_photo", kind: "photo", fileName: "miso-belly.jpg", meta: "Photo · abdomen" }],
    status: "ROUTED",
    receivedAt: "Today · 09:15",
  },
  {
    id: "int_bruno",
    patientId: "pat_bruno",
    originalLanguage: "German",
    originalText: "Bruno frisst seit zwei Tagen kaum und ist sehr müde.",
    translatedText: "Bruno has barely eaten for two days and is very tired.",
    concerns: ["Reduced appetite", "Lethargy"],
    onset: "2 days ago",
    priority: "NEEDS ATTENTION",
    route: "General Medicine",
    routeReason:
      "Reported appetite and energy changes require veterinary review before scheduling.",
    inputs: ["Voice", "Text"],
    media: [{ id: "m_bruno_voice", kind: "voice", fileName: "bruno-voice-note.m4a", meta: "00:24 · German" }],
    status: "AWAITING REVIEW",
    receivedAt: "Today · 09:48",
  },
];

export const emergencyIntake = {
  originalText: "My dog collapsed and is struggling to breathe.",
  language: "English",
  priority: "EMERGENCY" as Priority,
  concerns: ["Collapse", "Breathing difficulty"],
  onset: "Minutes ago",
};

export const lunaAppointment = {
  patient: "Luna",
  service: "Mobility / Orthopedic Consultation",
  veterinarian: "Dr. Daniel Rivera",
  location: "Central Veterinary Center",
  date: "September 28, 2026",
  time: "3:30 PM",
};

export const dashboardMetrics = [
  { label: "Today's Appointments", value: "24", note: "6 remaining today" },
  { label: "AI-Handled Bookings", value: "18", note: "75% of today's volume" },
  { label: "Needs Attention", value: "3", note: "Awaiting veterinary review" },
  { label: "Urgent Cases", value: "1", note: "Routed to emergency desk", urgent: true },
];

export const analytics = {
  headline: [
    { label: "AI-handled bookings", value: "82%", note: "Last 30 days" },
    { label: "Avg. booking completion", value: "1 m 46 s", note: "From first message" },
    { label: "Staff scheduling actions avoided", value: "1,240", note: "Last 30 days" },
    { label: "Cases requiring human attention", value: "9%", note: "Routed to staff" },
  ],
  byLocation: [
    { label: "Central Veterinary Center", value: 52 },
    { label: "Harbor Veterinary Center", value: 31 },
    { label: "North Veterinary Center", value: 17 },
  ],
  byService: [
    { label: "General Medicine", value: 44 },
    { label: "Mobility / Orthopedic Care", value: 26 },
    { label: "Dermatology", value: 18 },
    { label: "Imaging", value: 12 },
  ],
  byLanguage: [
    { label: "English", value: 38 },
    { label: "Russian", value: 22 },
    { label: "Spanish", value: 17 },
    { label: "Portuguese", value: 13 },
    { label: "German", value: 10 },
  ],
};

export const patientById = (id: string) => patients.find((p) => p.id === id);
export const intakeById = (id: string) => intakes.find((i) => i.id === id);
