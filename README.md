# LifeRoute AI

**Find the right hospital faster when every minute matters.**

LifeRoute AI is a multi-city emergency hospital availability dashboard that helps patients, families, ambulance drivers, and emergency coordinators quickly find hospitals with available beds, ICU support, ventilators, blood units, and specialty care.

---

## Problem Statement

During medical emergencies, people often lose critical time calling multiple hospitals to check whether beds, ICU support, ventilators, blood units, or specialists are available. This delay can affect treatment outcomes, especially in trauma, ICU, and critical care situations.

LifeRoute AI solves this problem by bringing hospital availability information into one centralized city-based dashboard.

---

## Solution

LifeRoute AI allows users to select a city and instantly view hospitals in that city along with emergency resource availability. Users can filter hospitals by area, facility, status, and emergency level. The platform also includes an AI-style routing recommendation that suggests the most suitable hospital based on availability and emergency needs.

---

## Key Features

- Multi-city hospital availability dashboard
- City-based hospital search
- Area, facility, status, and emergency level filters
- AI-style hospital recommendation engine
- Emergency contacts based on selected city/state
- Hospital update panel
- Add new hospital option
- Dark mode support
- Responsive design for desktop and mobile
- Local data persistence for demo updates

---

## Supported Sample Cities

The MVP includes sample data for cities such as:

- Madurai
- Chennai
- Bengaluru
- Mumbai
- Delhi
- Pune

Unsupported cities show a friendly no-data message and can be extended by adding hospitals through the update panel.

---

## Target Users

- Patients and families
- Ambulance drivers
- Emergency coordinators
- Hospital staff
- Healthcare administrators

---

## How It Works

1. User selects or enters a city.
2. The dashboard displays hospitals available in that city.
3. User filters by area, facility, status, or emergency level.
4. The AI routing engine recommends the best hospital based on available resources.
5. Hospital staff can update hospital availability or add new hospitals.
6. Emergency contacts update based on the selected city/state.

---

## AI Recommendation Logic

The recommendation engine uses rule-based scoring for the MVP. It considers:

- Selected city
- Required facility
- Emergency level
- Hospital status
- Available beds
- ICU beds
- Ventilator availability
- Specialty match

For critical emergencies, the system prioritizes hospitals with ICU beds, ventilators, available beds, and non-full status.

---

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Node.js
- Express
- Replit

---

## Practical Impact

LifeRoute AI can help reduce emergency decision time by allowing users to quickly compare hospital availability in one place. It is designed as a practical student-buildable solution that can be expanded with verified hospital data, GPS-based routing, and real-time integrations.

---

## Future Scope

- GPS-based nearest hospital suggestions
- Verified hospital staff login
- Ambulance driver mode
- Blood bank integration
- WhatsApp/SMS emergency alerts
- Real-time hospital data verification
- Government health dashboard
- Multi-language support
- Mobile app version

---

## Hackathon

Built for **BluePrint 2026** under the **Healthcare** domain.

---

