# Skillpath — Dynamic Learning Platform

> A production-style learning platform landing page built as a WebVeda Junior Developer technical assessment. The project demonstrates a responsive React interface, live API integration, resilient data fetching, localization-aware pricing, filtering, sorting, Framer Code Component integration, and thoughtful loading/error/empty states.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Framer](https://img.shields.io/badge/Framer-Code%20Component-000000?logo=framer&logoColor=white)](https://www.framer.com/)
[![License](https://img.shields.io/badge/License-Assessment%20Project-lightgrey)](#license)

---

## ✨ Overview

**Skillpath** is a modern learning-platform landing page designed around one core requirement: display live course data from an external API and turn that raw data into a polished, usable learning experience.

Instead of treating the API response as a simple list, the project adds product-level behavior around it:

- Live course data fetching
- Country-aware currency detection
- INR / USD price formatting
- Automatic retry handling
- Request cancellation with `AbortController`
- Search across course name, category, and description
- Dynamic category filtering
- Price sorting
- Loading skeletons
- Error and retry states
- Empty-result handling
- Responsive course grid
- Framer-ready React Code Component
- Configurable section title and accent color
- Copy-to-clipboard Framer integration example
- Technical interview/documentation section explaining key implementation decisions

The goal was to demonstrate not only that the UI can be built, but that the developer understands **reliability, UX, maintainability, integration constraints, and real-world production behavior**.

---

## 🎯 Why this project exists

This repository was created for the **WebVeda Junior Developer technical assessment**.

The role focuses on day-to-day web and tech operations, including a Framer-based frontend and an LMS/backend ecosystem. This implementation therefore focuses on the skills most relevant to that environment:

1. **Frontend execution** — clean responsive UI and reusable React components.
2. **API integration** — consuming external course and country endpoints.
3. **Failure handling** — retrying transient failures and keeping independent API concerns isolated.
4. **Product thinking** — making live data useful through search, filters, sorting, and clear UI states.
5. **Framer integration** — providing a self-contained React Code Component that can be embedded in Framer.
6. **Async-friendly documentation** — explaining what was built, why it was built this way, and how to run it.

---

## 🚀 Live Demo

> Replace the placeholder below with your deployed URL before submitting the assessment.

**Live:** `YOUR_DEPLOYED_URL`

**Repository:** https://github.com/ujjwalkr7449/skillpathhh

---

## 🖥️ What the application includes

### 1. Hero / Landing experience

The page opens with a clean learning-platform hero section and a primary CTA that smoothly scrolls the user toward the course catalog.

### 2. Navigation

The navigation provides direct access to:

- Courses
- Technical Interview Guide
- Framer Code

The primary **Explore Courses** CTA scrolls directly to the live course section.

### 3. Live course catalog

The course section is the heart of the application. It retrieves data from the assessment API and renders a responsive card grid.

Each course card can display:

- Course name
- Category
- Description
- Refundable status
- Lifetime-access pricing
- Enrollment CTA

### 4. Search

Users can search across course name, category, and description.

### 5. Category filtering

Categories are generated dynamically from the API response rather than hard-coded, so newly returned categories can become filter options automatically.

### 6. Price sorting

Courses can be sorted by:

- Recommended order
- Lowest price first
- Highest price first

Sorting uses the smallest currency unit returned by the API.

### 7. Responsive behavior

The UI adapts across desktop, tablet, and mobile widths with responsive grids and flexible controls.

### 8. Loading state

Skeleton placeholders are shown while API data is loading instead of leaving the page blank.

### 9. Error state

If course data cannot be loaded after the configured retry attempts, the application shows a clear error message and a **Try Again** action.

### 10. Empty state

If the API succeeds but the selected filters produce no results, the interface explains the situation and allows the user to reset the filters.

---

## 🌍 API Integration

The application consumes two external endpoints provided for the assessment:

```text
GET https://syncsphere-hiv6.onrender.com/assignment/country-code
GET https://syncsphere-hiv6.onrender.com/assignment/course-data
```

### Country endpoint

The country endpoint determines which currency presentation should be used.

If it fails, the application falls back to `US`, allowing the main course experience to continue.

### Course endpoint

The course endpoint supplies the catalogue data. The application validates that the returned value is an array before rendering it.

### Retry strategy

Course loading supports up to **3 attempts** for transient failures with a short delay between attempts.

### AbortController

An `AbortController` is created when the course component mounts and is aborted when it unmounts. This prevents unnecessary outstanding work and avoids state updates after the component is gone.

---

## 💰 Currency handling

The API returns prices in their smallest denominations:

- INR → paise
- USD → cents

The application converts those integer values only for display and uses the browser's native `Intl.NumberFormat` API for locale-aware formatting.

Examples:

```text
199900 paise → ₹1,999
3999 cents   → $39.99
```

This keeps calculation values as integers and avoids unnecessary floating-point precision issues.

---

## 🧩 Framer Code Component

A dedicated Framer component is included at:

```text
src/components/SkillpathCoursesFramer.tsx
```

The component is designed to be moved into a Framer canvas with minimal adaptation.

It includes:

- React state management
- API calls
- Retry behavior
- Loading / error / empty states
- Search
- Category filters
- Sorting
- Currency formatting
- Framer Property Controls
- Inline styling

### Framer Property Controls

The component exposes editable properties for:

- **Section Title**
- **Accent Color**

This allows a Framer editor to change presentation without modifying the component source.

---

## 🏗️ Architecture

```text
src/
├── App.tsx                         # Main page composition and interactive sections
├── App.css                         # Application-level styling
├── index.css                       # Global styles and responsive rules
├── main.tsx                        # React entry point
├── components/
│   ├── Hero.tsx                    # Hero section
│   ├── Courses.tsx                 # API-backed course catalogue
│   ├── Footer.tsx                  # Footer content
│   └── SkillpathCoursesFramer.tsx  # Framer-ready Code Component
├── types/                          # Shared TypeScript types
└── assets/                         # Local assets
```

The live course behavior is separated into a dedicated component so it remains independently understandable and reusable.

---

## 🧠 Key engineering decisions

### Independent failure domains

The country lookup is treated as an auxiliary request. If it fails, course loading still continues using a fallback currency configuration.

### Defensive API handling

The course response is validated before being accepted. Invalid data is treated as a failure instead of being rendered blindly.

### Retries only where useful

Course data is the critical path, so it receives retry logic. The country request is non-critical and fails softly.

### UX-first loading states

Skeleton cards provide a stable visual layout while content is loading.

### Dynamic metadata

Category filters are generated from the actual API response, keeping the interface aligned with backend data.

### Reusable component structure

The page is assembled from focused components rather than keeping the entire application in one file.

### Framer-friendly integration

The Framer version is self-contained and exposes design properties through Framer Property Controls.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI and component architecture |
| TypeScript 6 | Type safety and maintainability |
| Vite 8 | Development server and production bundling |
| Lucide React | Interface icons |
| Framer Code Components | Dynamic React functionality inside Framer |
| Fetch API | External API communication |
| `Intl.NumberFormat` | Currency and locale formatting |
| `AbortController` | Request cancellation |
| CSS | Responsive layout and visual system |
| Oxlint | Static code-quality checks |

The repository's package configuration defines React, React DOM, TypeScript, Vite, Lucide React, and Oxlint as the main project dependencies and tooling.

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/ujjwalkr7449/skillpathhh.git
cd skillpathhh
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, typically:

```text
http://localhost:5173
```

### 4. Create a production build

```bash
npm run build
```

### 5. Run linting

```bash
npm run lint
```

### 6. Preview the production build

```bash
npm run preview
```

---

## 🔎 API Data Flow

```text
User opens Skillpath
        │
        ▼
Courses component mounts
        │
        ├──────────────► Country API
        │                    │
        │                    ├── success → country code
        │                    └── failure → fallback to US
        │
        ▼
Course API
        │
        ├── success → validate array → render courses
        │
        ├── failure → retry (up to 3 attempts)
        │
        └── final failure → error state + Retry button
        │
        ▼
Search / Category Filter / Sort
        │
        ▼
Processed course list
```

This keeps optional country detection from blocking the primary course experience.

---

## ✅ UX & Reliability Checklist

- [x] Live API-powered course data
- [x] Country-aware currency presentation
- [x] Retry handling
- [x] Abortable requests
- [x] Loading skeletons
- [x] Error recovery
- [x] Empty-result state
- [x] Search
- [x] Category filtering
- [x] Price sorting
- [x] Responsive layout
- [x] Accessible labels / ARIA text where relevant
- [x] Reusable React components
- [x] Framer Code Component
- [x] Configurable Framer properties
- [x] Technical implementation notes

---

## 🎤 Technical Interview Talking Points

### Why React?

React makes it straightforward to split the page into reusable components and keep the live catalogue logic isolated from the surrounding landing page.

### Why TypeScript?

The course API has a defined shape, so explicit interfaces make the data contract visible and reduce accidental field misuse.

### Why `AbortController`?

A component can unmount while an API request is pending. Cancelling the request prevents unnecessary work and state updates after the UI is gone.

### Why `Intl.NumberFormat`?

It provides native locale-aware currency formatting instead of manually constructing currency strings.

### Why retries?

External APIs can fail transiently. A small retry budget improves resilience without introducing excessive waiting or hiding persistent failures.

### Why a custom Framer Code Component?

The course section needs behavior beyond a static list: independent error handling, currency logic, search, sorting, filtering, loading states, and retry behavior. A custom Code Component provides programmatic control over those interactions.

### What would I improve next?

For a production deployment, the next improvements could include:

- API proxying where appropriate
- analytics for search and course interactions
- stronger runtime schema validation
- exponential backoff with jitter
- automated tests for filtering and data transformation
- real enrollment destinations
- centralized API utilities
- production monitoring

---

## ⚠️ Assessment Notes

This repository was built as a technical assessment project. The external API is part of the assessment environment, so availability may depend on that service.

No private API keys or credentials are required by the current implementation.

Before submission, verify that:

1. The repository is public.
2. The deployment URL works.
3. The external API is reachable.
4. The final UI is responsive.
5. No secrets or local environment files are committed.
6. The `YOUR_DEPLOYED_URL` placeholder is replaced.

---

## 📌 Project Status

**Status:** Assessment-ready prototype / demonstration project

The repository contains the React application, reusable components, styling, live API integration, and a dedicated Framer Code Component.

---

## 👤 Author

**Ujjwal Kumar**

GitHub: https://github.com/ujjwalkr7449

---

## 📄 License

This project is created for evaluation and demonstration purposes as part of a hiring assessment. The assessment-specific API and any third-party assets remain subject to their respective owners' terms.

---

## ⭐ Reviewer Guide

For a quick technical review, start with these files:

```text
src/components/Courses.tsx
src/components/SkillpathCoursesFramer.tsx
src/App.tsx
```

These contain the main engineering decisions around API integration, resilient async state handling, data transformation, filtering/sorting, UI states, and Framer integration.
