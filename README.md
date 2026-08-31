<div align="center">

<img src="./assets/saviorai-header.svg" alt="SaviorAI — Safety Intelligence for the Moments That Matter" width="100%">

# 🛟 SaviorAI

### **Safety Intelligence for the Moments That Matter.**

AI-assisted injury triage, first-response guidance, safety escalation, emergency resources, injury monitoring and benchmark tooling — wrapped in a calm, structured health-tech experience.

<br>

[![Live App](https://img.shields.io/badge/🚑%20LIVE%20APP-5C9BC3?style=for-the-badge)](https://chillingbing648-sketch.github.io/SaviorAI/)
[![Repository](https://img.shields.io/badge/💻%20SOURCE-181717?style=for-the-badge&logo=github)](https://github.com/chillingbing648-sketch/SaviorAI)
[![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript%205.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite%206-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Express 4](https://img.shields.io/badge/Express%204-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind 4](https://img.shields.io/badge/Tailwind%204-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

**🩺 Assessment · 🛡️ Safety Pipeline · 🚨 Emergency Mode · 📈 Injury Watch · 🏥 Find Help · 🧪 Benchmarks**

</div>

---

## 🌐 Preview

<div align="center">

<a href="https://chillingbing648-sketch.github.io/SaviorAI/">
  <img src="./frontend-full-page.png" alt="SaviorAI full application preview" width="94%">
</a>

### 👆 Click the preview to open SaviorAI

</div>

---

## 🧭 At a Glance

| | |
|---|---|
| **Product** | AI-assisted injury triage & first-response safety platform |
| **Frontend** | React `19.0.1` + TypeScript `5.8.2` |
| **Build** | Vite `6.2.3` + esbuild |
| **Backend** | Node.js + Express `4.21.2` |
| **AI** | Google Gemini via `@google/genai` |
| **UI** | Tailwind CSS `4.1.14` + Lucide React + Motion |
| **Persistence** | Client-side storage + in-memory server stores |
| **Validation** | TypeScript `tsc --noEmit` + production build |
| **CI/CD** | GitHub Actions → Render deploy hook |
| **Status** | MVP / Active Development |

---

# 🧠 What is SaviorAI?

**SaviorAI** is a full-stack AI-assisted safety platform designed around a simple principle:

> **Don't just generate an answer. Help guide the next safer decision.**

The application combines a guided injury assessment experience with a server-side safety pipeline, deterministic escalation logic, structured medical protocols, emergency resources, healthcare-facility discovery, injury monitoring and safety benchmark tooling.

The project is also an engineering exploration: it brings together React architecture, TypeScript domain models, Express APIs, Gemini integration, responsive health-tech UX, local persistence, offline-aware workflows, accessibility considerations and automated safety checks in one product.

> ⚠️ SaviorAI is an experimental software project. It is **not a medical device, diagnostic system, emergency service or substitute for professional healthcare.**

---

## ✨ The Experience

| | Capability | Purpose |
|---|---|---|
| 🩺 | **Smart Assessment** | Guided injury assessment with structured triage outcomes and red-flag handling. |
| 🛡️ | **Safety Pipeline** | Server-side safety gates, escalation triggers and controlled AI-assisted processing. |
| 🚨 | **Emergency Mode** | Prioritizes urgent actions and regional emergency resources when escalation is required. |
| 📈 | **Injury Watch** | Save injuries and monitor their status over time. |
| 🏥 | **Find Help** | Explore healthcare facilities and estimate distance from user coordinates. |
| 📚 | **Medical Library** | Structured protocols and reference information for supported injury scenarios. |
| 🧪 | **Safety Benchmarks** | Run predefined cases and verify emergency recall and prohibited-advice checks. |
| 🧾 | **Audit Logs** | Record triage and safety events for inspection. |
| 🌐 | **Offline Awareness** | Keeps supported saved guidance and emergency actions available when connectivity changes. |
| ♿ | **Accessibility** | High-contrast and language-aware UI options. |
| 📦 | **Data Controls** | Supported local-data export and clearing workflows. |
| 🎛️ | **Admin Safety Tools** | Protocol management and benchmark-oriented views for engineering evaluation. |

---

## 🧬 How It Works

```text
                         ┌─────────────────────────┐
                         │        SAVIORAI         │
                         │   Safety-first Client   │
                         └────────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                         ▼                         ▼
                  React 19 + TS             Express + TS
                         │                         │
              ┌──────────┼──────────┐      ┌───────┼────────┐
              │          │          │      │       │        │
           Assess     Injury      Library  Triage Protocol Audit
           Wizard      Watch                 │       │      │
              │          │          │        └───────┼──────┘
              └──────────┴──────────┘                │
                         │                            │
                         └────────────┬───────────────┘
                                      ▼
                              Safety Pipeline
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                   Gemini-assisted          Deterministic
                     reasoning                 safety gates
                         │                         │
                         └────────────┬────────────┘
                                      ▼
                           Guidance / Escalation
```

### Safety principle

The interesting engineering choice is that **AI is not treated as the only authority**. The server routes assessment requests through a dedicated safety pipeline, records the resulting triage event, and exposes benchmark tooling designed to catch emergency false negatives and explicitly unsafe advice patterns.

---

## 🧱 Architecture Layers

### 01 · Presentation

React components provide the assessment wizard, emergency modal, injury watch, help finder, library, settings and safety/admin views.

### 02 · Domain Data

Structured TypeScript data covers emergency numbers, healthcare facilities, medical protocols and benchmark cases.

### 03 · API Layer

Express exposes health, triage, protocol, facility, audit and benchmark endpoints.

### 04 · Safety Layer

`server/safetyPipeline.ts` contains the dedicated safety/triage processing path used by both interactive assessment and benchmark execution.

### 05 · AI Layer

Google Gemini is integrated through `@google/genai` for AI-assisted processing while the application retains deterministic safety checks and escalation logic.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Role |
|---|---|
| ⚛️ React 19 | Component architecture and application UI |
| 🟦 TypeScript 5.8 | Domain types and type-safe application logic |
| ⚡ Vite 6 | Development server and frontend build |
| 🎨 Tailwind CSS 4 | Utility-first styling |
| 🧩 Lucide React | Interface icon system |
| 🎞️ Motion | UI animation and interaction polish |

### Backend

| Technology | Role |
|---|---|
| 🟢 Node.js | Server runtime |
| 🚂 Express 4 | HTTP API and server middleware |
| 🟦 TypeScript | Server-side type safety |
| 📦 esbuild | Server bundling |
| 🔐 dotenv | Environment configuration |

### AI

| Technology | Role |
|---|---|
| ✨ Google Gemini | AI-assisted injury/triage processing |
| `@google/genai` | Gemini SDK integration |

### Engineering

`npm` · `REST APIs` · `Git` · `GitHub` · `GitHub Actions` · `Render` · `responsive UI` · `client-side storage` · `safety benchmarks`

---

## 📁 Project Structure

```text
SaviorAI/
│
├── .github/
│   └── workflows/
│       └── main.yml                 # CI/CD + Render deployment hook
│
├── server/
│   └── safetyPipeline.ts            # Core safety / triage processing
│
├── src/
│   ├── components/
│   │   ├── AdminSafetyBenchmarkView.tsx
│   │   ├── AssessWizard.tsx
│   │   ├── EmergencyModal.tsx
│   │   ├── FindHelpView.tsx
│   │   ├── Header.tsx
│   │   ├── HomeView.tsx
│   │   ├── InjuryWatchView.tsx
│   │   ├── LibraryView.tsx
│   │   ├── MedicalReportModal.tsx
│   │   ├── SettingsView.tsx
│   │   └── ui/                       # Reusable UI primitives
│   │
│   ├── data/
│   │   ├── emergencyNumbers.ts
│   │   ├── facilities.ts
│   │   └── protocols.ts
│   │
│   ├── lib/
│   │   ├── storage.ts
│   │   └── translations.ts
│   │
│   ├── types/                        # Domain models
│   ├── App.tsx                       # Application shell
│   ├── index.css                     # Global styling
│   └── main.tsx                      # React entry point
│
├── frontend-full-page.png            # Product preview
├── server.ts                          # Express + Vite server
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
└── vite.config.ts
```

---

## 🔌 API Surface

```text
GET  /api/health
POST /api/triage/assess
GET  /api/protocols
POST /api/protocols/update
GET  /api/facilities
GET  /api/audit-logs
POST /api/audit-logs/event
POST /api/safety-benchmark/run
```

### `POST /api/triage/assess`

The central assessment route accepts an `InjuryAssessmentRequest`, sends it through the safety triage pipeline, records an audit event and returns the resulting triage guidance.

### `GET /api/facilities`

Supports optional latitude/longitude parameters and calculates an approximate distance/drive-time estimate against the repository's facility dataset.

### `POST /api/safety-benchmark/run`

Executes the repository's demo safety cases and reports emergency recall, unsafe-advice checks, execution time and case-level outcomes.

---

## 🧪 Safety Benchmarking

One of SaviorAI's strongest engineering features is that it doesn't stop at **"the AI generated something."**

The server contains a benchmark runner that evaluates predefined cases and checks whether emergency scenarios remain classified as emergency cases while also scanning generated avoidance guidance for explicitly prohibited recommendations.

```text
Demo Cases
    │
    ▼
Safety Triage Pipeline
    │
    ├── Expected urgency
    ├── Actual urgency
    ├── Emergency recall
    ├── Red-flag detection
    ├── Execution time
    └── Unsafe-advice verification
    │
    ▼
Benchmark Report
```

This is an **engineering safety mechanism**, not clinical validation.

---

## 🚀 Run Locally

### 01 · Clone

```bash
git clone https://github.com/chillingbing648-sketch/SaviorAI.git
cd SaviorAI
```

### 02 · Install

```bash
npm install
```

### 03 · Configure Gemini

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> 🔐 Never commit API keys, tokens or private credentials.

### 04 · Start development

```bash
npm run dev
```

The server is configured to listen on port `3000`.

### 05 · Production build

```bash
npm run build
```

### 06 · Start production server

```bash
npm start
```

### Command Cheat Sheet

| Command | Purpose |
|---|---|
| `npm run dev` | ⚡ Start development server |
| `npm run build` | 🏗️ Build frontend + bundle server |
| `npm start` | 🚀 Run bundled production server |
| `npm run preview` | 👀 Preview Vite build |
| `npm run lint` | 🔍 TypeScript validation |
| `npm run clean` | 🧹 Remove generated build artifacts |

---

## ⚙️ CI/CD

The repository includes a GitHub Actions workflow that runs on pushes and pull requests targeting `main`. It installs dependencies with `npm ci`, runs TypeScript validation, builds the project, verifies both frontend and server build outputs, and triggers a Render deployment hook after successful pushes to `main`.

```text
                Git Push / Pull Request
                         │
                         ▼
                 GitHub Actions
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
           npm ci              TypeScript check
              │                     │
              └──────────┬──────────┘
                         ▼
                    Vite + esbuild
                         │
                         ▼
                  Verify dist files
                         │
                         ▼
                    Render Deploy
```

---

## 🎨 Design Philosophy

### **Clean. Calm. Technical. Human.**

SaviorAI intentionally avoids the visual language of a generic AI chatbot.

The product is structured like a health-tech workflow: clear hierarchy, strong emergency affordances, restrained motion, reusable cards, readable typography, responsive layouts and accessibility-aware states.

The new repository identity follows that same direction — **clinical blue + mint safety green + soft violet**, rather than a dark hacker aesthetic.

---

## 🗺️ Roadmap

### ✓ Current foundation

- [x] React application architecture
- [x] Guided injury assessment
- [x] Server-side safety pipeline
- [x] Gemini integration
- [x] Emergency escalation flow
- [x] Injury monitoring
- [x] Healthcare facility discovery
- [x] Medical protocol library
- [x] Audit logging
- [x] Safety benchmark runner
- [x] Responsive UI foundation
- [x] CI validation
- [x] Automated Render deployment trigger

### → Next engineering milestones

- [ ] 🔐 Production authentication and authorization
- [ ] 🗄️ Persistent production database
- [ ] 🧪 Automated safety regression suite in CI
- [ ] 📊 Production observability and structured telemetry
- [ ] 🌍 Expanded localization
- [ ] ♿ Deeper accessibility audit
- [ ] 🔒 Security/privacy hardening
- [ ] 🏥 Clinical review and formal validation before any real-world medical use

---

## 📊 Engineering Status

| Area | Status |
|---|:---:|
| React Architecture | 🟢 |
| TypeScript Domain Models | 🟢 |
| Guided Assessment | 🟢 |
| Safety Pipeline | 🟢 |
| Gemini Integration | 🟢 |
| Emergency Workflow | 🟢 |
| Injury Watch | 🟢 |
| Medical Library | 🟢 |
| Facility Discovery | 🟢 |
| Audit Logging | 🟢 |
| Safety Benchmarks | 🟢 |
| CI/CD Foundation | 🟢 |
| Production Authentication | 🟡 |
| Persistent Production Database | 🟡 |
| Automated Regression Suite | 🟡 |
| Observability | 🟡 |
| Formal Clinical Validation | ⚪ Not yet performed |

**Current stage:** MVP / Active Development

---

## ⚠️ Medical & Safety Disclaimer

**SaviorAI is an experimental software project and must not be relied upon for diagnosis, treatment, emergency dispatch or medical decision-making.**

AI-generated information can be inaccurate, incomplete or inappropriate for an individual situation. For severe symptoms, emergencies, suspected life-threatening conditions or uncertainty about a serious injury, contact local emergency services or a qualified healthcare professional immediately.

The benchmark suite described in this repository is an engineering evaluation mechanism. It does **not** establish clinical accuracy, medical efficacy or regulatory compliance.

Any future real-world deployment would require appropriate clinical validation, privacy and security controls, regulatory assessment, professional medical oversight and extensive safety testing.

---

## 🤝 Contributing

SaviorAI is a learning-oriented engineering project, and thoughtful contributions are welcome.

```bash
git checkout -b feature/your-idea
npm install
npm run lint
npm run build
git add .
git commit -m "feat: describe your improvement"
git push origin feature/your-idea
```

When opening a pull request, include:

- **What changed**
- **Why it changed**
- **How it was tested**
- **Any safety or user-impact implications**

For changes to triage logic or safety behavior, explain the relevant benchmark impact whenever possible.

---

## 🔗 Links

<div align="center">

[🚑 **Live Application**](https://chillingbing648-sketch.github.io/SaviorAI/) · [💻 **GitHub Repository**](https://github.com/chillingbing648-sketch/SaviorAI) · [🐛 **Issues**](https://github.com/chillingbing648-sketch/SaviorAI/issues)

</div>

---

<div align="center">

![Footer](https://capsule-render.vercel.app/api?type=waving&color=5C9BC3,45A77A,8068B8&height=150&section=footer&text=SaviorAI&fontSize=36&fontColor=ffffff&animation=fadeIn)

### 🛟 **Build for the moment that matters. Build for the safer next step.**

<sub>React · TypeScript · Gemini · Express · Vite · Tailwind · Safety Engineering</sub>

<br>

<sub><i>Built as a student project. Designed with production-minded engineering.</i></sub>

</div>
