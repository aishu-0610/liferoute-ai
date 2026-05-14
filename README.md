# LifeRoute AI

### Find the right hospital faster when every minute matters.

LifeRoute AI is a multi-city emergency hospital availability dashboard that helps patients, families, ambulance drivers, and emergency coordinators quickly find hospitals with available beds, ICU support, ventilators, blood units, and specialty care.

Built for **BluePrint 2026** under the **Healthcare** domain.

---

## Live Demo

https://7c43efdc-b0bd-4822-befd-e0b2dab4a819-00-3scy52kgdtl7u.pike.replit.dev

---

## Project Overview

During medical emergencies, people often lose critical time calling multiple hospitals to check whether beds, ICU support, ventilators, blood units, or specialists are available.

LifeRoute AI brings this information into one centralized city-based dashboard so users can quickly compare hospitals, filter by emergency needs, and receive a smart routing suggestion.

---

## Problem Statement

In emergency situations, patients and ambulance drivers need quick information about hospital availability. However, this information is usually scattered, outdated, or only available through phone calls.

This causes:

- Delay in finding the right hospital
- Confusion during critical cases
- Extra pressure on families and ambulance drivers
- Poor visibility of ICU, ventilator, and bed availability

LifeRoute AI addresses this by providing a practical, city-based emergency hospital availability platform.

---

## Solution

LifeRoute AI allows users to:

- Select a city
- View hospitals in that city
- Check availability of beds, ICU, ventilators, blood units, and specialties
- Filter by area, facility, status, and emergency level
- Get an AI-style hospital recommendation
- View city/state-based emergency contacts
- Add or update hospital availability for demo purposes

---

## Key Features

| Feature | Description |
|---|---|
| Multi-City Dashboard | View emergency hospital availability city-wise |
| Smart Filters | Filter by area, facility, status, and emergency level |
| AI Recommendation | Suggests the most suitable hospital using rule-based scoring |
| Emergency Contacts | Shows city/state-based emergency helpline numbers |
| Add/Update Hospital | Allows demo hospital data updates |
| Local Persistence | Saves added hospitals locally in the browser |
| Dark Mode | Supports light and dark themes |
| Responsive UI | Works on desktop and mobile screens |

---

## Supported Sample Cities

The MVP includes sample hospital data for:

- Madurai
- Chennai
- Bengaluru
- Mumbai
- Delhi

Additional cities can be added through the Add Hospital panel. Added hospitals are saved locally in the browser for demo purposes.

Unsupported cities show a friendly no-data message until hospital data is added.

---

## How It Works

1. User selects or enters a city.
2. The dashboard displays hospitals available in that city.
3. User filters hospitals by area, facility, status, or emergency level.
4. The AI recommendation card suggests the best hospital based on available resources.
5. Emergency contacts update based on the selected city/state.
6. Hospital data can be updated or added for demo purposes.

---

## AI Recommendation Logic

The AI Recommendation card uses rule-based scoring for the MVP.

It considers:

- Selected city
- Required facility
- Emergency level
- Hospital status
- Available beds
- ICU beds
- Ventilator availability
- Specialty match

For critical emergencies, the system prioritizes hospitals with:

- Available or limited status
- Available beds
- ICU beds
- Ventilators
- Matching facility support

This keeps the recommendation practical, transparent, and easy to explain during the hackathon demo.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express |
| Storage for MVP | Browser localStorage |
| Platform | Replit |
| Version Control | GitHub |

---

## Demo Data Notice

Hospital data and phone numbers used in this project are sample data for demo purposes only.

Real emergency helpline numbers such as 112, 108, 100, and 101 are kept for demonstration of emergency contact access.

---

## Practical Impact

LifeRoute AI can help reduce emergency decision time by allowing users to quickly compare hospital availability in one place.

Potential users include:

- Patients and families
- Ambulance drivers
- Emergency coordinators
- Hospital staff
- Healthcare administrators

The project is designed as a practical student-buildable solution that can be expanded with verified hospital data, GPS-based routing, and real-time integrations.

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

## How to Run Locally

Clone the repository:

git clone https://github.com/aishu-0610/liferoute-ai-dev.git

Go to the project folder:

cd liferoute-ai-dev

Install dependencies:

npm install

Run the project:

npm run dev

Open the local URL shown in the terminal.

---

## Hackathon Submission

This project was built for **BluePrint 2026**.

Domain: **Healthcare**

Focus: **Practical emergency healthcare accessibility and hospital resource visibility**
