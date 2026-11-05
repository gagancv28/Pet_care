# PetCare Planner

> A full-stack MERN application for pet routine care scheduling, clinical visit records, and dietary management featuring a **Unified Overdue + Upcoming Care Timeline**.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Differentiating Feature: Unified Timeline](#differentiating-feature-unified-timeline)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Mongoose Schemas & Data Models](#mongoose-schemas--data-models)
- [REST API Endpoints](#rest-api-endpoints)
- [Validation & Error Handling](#validation--error-handling)
- [UI/UX Design Language](#uiux-design-language)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Problem Statement

Pet owners frequently juggle multiple routine preventive care milestones, chronic prescription schedules, and clinical visit histories across veterinary clinics. Missing critical vaccinations or anti-parasitic dosages poses direct health hazards to pets, yet fragmented record-keeping leads to:

- Forgetting routine care dates (vaccinations, deworming, grooming).
- Losing track of specialized dietary portions and critical allergy restrictions.
- Fragmented vet visit histories, clinical diagnoses, weights, and medical expenses.

**PetCare Planner** resolves this by centralizing comprehensive pet profiles, detailed dietary protocols, and a timeline consolidating overdue, due-today, and upcoming actions into a single actionable view.

---

## Differentiating Feature: Unified Timeline

Traditional calendar apps disperse overdue and upcoming tasks across distinct screens or hidden sub-menus. PetCare Planner's **Unified Timeline Engine** solves this:

1. **Urgency Classification**: Compares each task's `dueDate` against the current midnight boundary (`todayStart`), categorizing tasks into:
   - `OVERDUE`: Tasks whose due date is in the past (`daysDelta < 0`). Formatted as `X days overdue` with high-urgency red border indicators.
   - `DUE_TODAY`: Tasks due within today's window (`daysDelta === 0`) with amber border alerts.
   - `UPCOMING`: Tasks scheduled for future dates (`daysDelta > 0`) with subtle green indicator tags.
2. **Deterministic Priority Sorting**: Sorts by `daysDelta` ascending so overdue items requiring urgent intervention appear at the very top, followed by tasks due today, and chronologically ascending upcoming tasks.
3. **Automated Recurring Rescheduling & Visit Logging**: When completing any task via `PATCH /api/tasks/:id/complete`:
   - It marks the task `Completed` and sets `completedAt`.
   - It automatically logs an audit trail record in `VisitRecord`.
   - If the task recurrence is not `One-Time` (e.g. `Daily`, `Weekly`, `Monthly`, `Every 6 Months`, `Yearly`), it automatically creates the next scheduled task calculated from the previous `dueDate`.

---

## Architecture & Tech Stack

```
Pet_care/
├── package.json                 # Monorepo orchestration scripts
├── .gitignore                   # Multi-tier git exclusion rules
├── LICENSE                      # MIT license
├── README.md                    # System architecture documentation
├── server/
│   ├── .env.example             # Backend environment template
│   ├── index.js                 # Express server & dual MongoDB connection
│   ├── package.json             # Backend dependencies
│   ├── seed.js                  # Initial database seeder
│   ├── middleware/
│   │   ├── errorHandler.js      # Centralized HTTP error handler
│   │   └── validate.js          # Request payload validators
│   ├── models/
│   │   ├── CareTask.js          # Care task schema
│   │   ├── Pet.js               # Pet profile schema
│   │   └── VisitRecord.js       # Veterinary visit record schema
│   └── routes/
│       ├── pets.js              # Pet profile REST endpoints
│       ├── tasks.js             # Task & timeline REST endpoints
│       └── visits.js            # Visit log REST endpoints
└── client/
    ├── .env.example             # Frontend environment template
    ├── index.html               # Clean HTML entry point
    ├── package.json             # Frontend dependencies
    ├── vite.config.js           # Vite configuration with API proxy
    └── src/
        ├── App.jsx              # Main React SPA component
        ├── main.jsx             # React DOM root entry
        └── styles.css           # Modern SaaS stylesheet (Slate & Indigo)
```

### Dependencies

#### Server (`server/package.json`)
- **`express` (v4.21.2)**: Core Node.js web application framework.
- **`mongoose` (v8.9.5)**: Object Data Modeling (ODM) library for MongoDB.
- **`mongodb-memory-server` (v10.1.3)**: In-memory MongoDB server fallback ensuring zero-setup execution if local `mongod` is offline.
- **`cors` (v2.8.5)**: Cross-Origin Resource Sharing middleware.
- **`dotenv` (v16.4.7)**: Environment variable loader.
- **`nodemon` (v3.1.9)**: Development live-reload monitor.

#### Client (`client/package.json`)
- **`react` & `react-dom` (v18.3.1)**: Modern reactive UI library.
- **`vite` (v6.0.7)**: Fast ES-module frontend build tool and dev server.
- **`@vitejs/plugin-react` (v4.3.4)**: Vite Babel/Fast-Refresh plugin.

---

## Mongoose Schemas & Data Models

### 1. Pet (`server/models/Pet.js`)
| Field | Type | Rules & Constraints |
|---|---|---|
| `name` | String | Required, trimmed, max 60 chars |
| `species` | String | Required, enum: `['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']` |
| `breed` | String | Optional, trimmed, max 80 chars |
| `ageYears` | Number | Min 0, max 40 |
| `weightKg` | Number | Min 0.1, max 200 |
| `gender` | String | Enum: `['Male', 'Female', 'Unknown']` |
| `microchipId` | String | Optional, trimmed |
| `vetClinicName` | String | Optional, trimmed |
| `vetPhone` | String | Optional, trimmed |
| `feedingNotes` | Sub-schema | `morningMeal`, `eveningMeal`, `portionSizeGrams` (min 0), `dietBrand`, `allergiesAndRestrictions` |
| `medicalSummary`| String | Optional, trimmed |

### 2. CareTask (`server/models/CareTask.js`)
| Field | Type | Rules & Constraints |
|---|---|---|
| `petId` | ObjectId | Ref to `Pet`, required |
| `title` | String | Required, trimmed, max 120 chars |
| `category` | String | Required, enum: `['Vaccination', 'Feeding', 'Medication', 'Grooming', 'Deworming', 'Vet Appointment']` |
| `dueDate` | Date | Required |
| `recurrence` | String | Enum: `['One-Time', 'Daily', 'Weekly', 'Monthly', 'Every 6 Months', 'Yearly']` (default: `'One-Time'`) |
| `dosageOrInstruction` | String | Optional, trimmed |
| `priority` | String | Enum: `['High', 'Medium', 'Low']` (default: `'Medium'`) |
| `notes` | String | Optional, trimmed |
| `status` | String | Enum: `['Pending', 'Completed']` (default: `'Pending'`) |
| `completedAt` | Date | Populated on task completion |

### 3. VisitRecord (`server/models/VisitRecord.js`)
| Field | Type | Rules & Constraints |
|---|---|---|
| `petId` | ObjectId | Ref to `Pet`, required |
| `visitDate` | Date | Required |
| `title` | String | Required, trimmed |
| `category` | String | Category tag |
| `clinicName` | String | Optional, trimmed |
| `vetName` | String | Optional, trimmed |
| `weightRecordedKg` | Number | Min 0.1, max 200 |
| `costInr` | Number | Min 0 (cost in INR ₹) |
| `diagnosisAndNotes` | String | Clinical diagnosis & notes |
| `nextFollowUpDate` | Date | Optional follow-up date |

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets` | List all pets with aggregate task and visit counts |
| `POST` | `/api/pets` | Register a new pet profile |
| `GET` | `/api/pets/:id` | Fetch a single pet profile by ID |
| `PUT` | `/api/pets/:id` | Update pet profile & dietary routine |
| `DELETE`| `/api/pets/:id` | Cascade delete pet, tasks, and visit records |
| `GET` | `/api/timeline` | Fetch unified care timeline (sorted by overdue -> today -> upcoming) |
| `GET` | `/api/tasks` | Fetch tasks (filtered by `petId` or `status`) |
| `POST` | `/api/tasks` | Create a new scheduled care task |
| `PATCH`| `/api/tasks/:id/complete` | Complete task, log visit record, and reschedule recurring tasks |
| `DELETE`| `/api/tasks/:id` | Delete a care task |
| `GET` | `/api/visits` | Fetch veterinary visit history (filtered by `petId`) |
| `POST` | `/api/visits` | Log a new veterinary visit record |
| `DELETE`| `/api/visits/:id` | Delete a visit record |
| `GET` | `/api/health` | Service health status check |

---

## Validation & Error Handling

- **Request Input Validation (`server/middleware/validate.js`)**: Inspects request bodies prior to route execution. Returns structured `400 Bad Request` responses containing an array of specific field-level validation errors.
- **Centralized Error Middleware (`server/middleware/errorHandler.js`)**: Catches Mongoose `ValidationError` (400), `CastError` (404), and MongoDB duplicate key errors (`E11000`), preventing uncaught exceptions and formatting clean JSON errors.
- **HTTP Security Guardrails**: `server/index.js` enforces `nosniff`, `SAMEORIGIN`, `1; mode=block` XSS protection, and a `1mb` JSON payload cap.

---

## UI/UX Design Language

- **Visual Theme**: Clean modern consumer SaaS aesthetic (inspired by Linear and Apple Health).
- **Color Palette**:
  - Application Background: Cool slate-white (`#F8FAFC`).
  - Cards & Modals: Pure white (`#FFFFFF`) with crisp `1px solid #E2E8F0` borders.
  - Primary Accent: Indigo (`#4F46E5`).
  - Text Hierarchy: Deep slate (`#0F172A`) for high contrast, muted slate (`#475569`) for metadata.
- **No Emojis**: 100% clean inline SVG icons (Lucide-style).
- **Responsive Design**: Fluid CSS Grid and Flexbox layouts supporting desktop, tablet, and mobile breakpoints.

---

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v9 or later)
- Local MongoDB (optional; defaults automatically to `mongodb-memory-server` if local MongoDB is not running)

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gagancv28/Pet_care.git
   cd Pet_care
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Start backend API server**:
   ```bash
   npm run dev:server
   ```
   *The server connects to local MongoDB or spins up an in-memory database and seeds initial records at `http://localhost:5000`.*

4. **Start frontend client** (in a separate terminal):
   ```bash
   npm run dev:client
   ```
   *Vite development server starts at `http://localhost:5173` with proxy to the backend API.*

---

## Environment Variables

### Backend (`server/.env`)
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/petcare_planner
```

### Frontend (`client/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## License

This project is licensed under the terms of the [MIT License](LICENSE).
