<div align="center">

  <h1>SaviorAI</h1>
  <p><strong>AI-assisted injury assessment, safety triage, monitoring, and emergency guidance.</strong></p>

  <p>
    <a href="https://github.com/chillingbing648-sketch/SaviorAI/stargazers"><img src="https://img.shields.io/github/stars/chillingbing648-sketch/SaviorAI?style=for-the-badge" alt="GitHub stars" /></a>
    <a href="https://github.com/chillingbing648-sketch/SaviorAI/network/members"><img src="https://img.shields.io/github/forks/chillingbing648-sketch/SaviorAI?style=for-the-badge" alt="GitHub forks" /></a>
    <a href="https://github.com/chillingbing648-sketch/SaviorAI/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=for-the-badge" alt="Apache 2.0 license" /></a>
    <a href="https://github.com/chillingbing648-sketch/SaviorAI"><img src="https://img.shields.io/github/last-commit/chillingbing648-sketch/SaviorAI?style=for-the-badge" alt="Last commit" /></a>
  </p>
</div>

---

## Overview

**SaviorAI** is a full-stack health-safety application designed to help users organize injury information, perform structured injury assessments, receive AI-assisted triage guidance, monitor injuries over time, locate care resources, and access emergency actions.

The application combines a React-based interface with an Express/TypeScript server and a safety-oriented triage pipeline. It is designed around a simple principle: **make the next safe action clearer without pretending to replace professional medical care.**

> **Medical safety notice:** SaviorAI is an assistive software project, not a doctor, emergency service, diagnostic device, or substitute for professional medical evaluation. AI-generated guidance can be incomplete or incorrect. In a real emergency or when serious symptoms are present, contact local emergency services or a qualified healthcare professional immediately.

## Core Capabilities

### 🩺 Structured Injury Assessment
- Guided assessment workflow for injury-related inputs.
- Structured triage levels and suggested care pathways.
- Safety-gate escalation for detected red flags.
- Assessment results can be converted into a medical-style report view.

### 🛡️ Safety & Triage Pipeline
- Dedicated server-side safety pipeline for assessment processing.
- Explicit emergency escalation states.
- Audit logging for triage and escalation events.
- Built-in safety benchmark test cases and an administrative benchmark interface.

### 📈 Injury Watch
- Save injuries for continued monitoring.
- Track active monitored injuries and their status.
- Re-open assessment/report information from monitored cases.
- Persistent client-side storage for supported user data.

### 🚑 Emergency & Find Help
- Emergency access from the main application shell.
- Regional emergency-number data.
- Healthcare-facility discovery endpoints with optional coordinate-based distance estimation.
- Offline-aware interface with saved guidance and emergency dialer availability.

### 📚 Medical Knowledge Library
- Structured medical protocols and reference content.
- Protocol listing API.
- Administrative protocol update/create endpoint.

### 🔐 User Data Controls
- Local preference persistence.
- Export supported application data as JSON.
- Clear-all-data functionality.
- Language preference support and high-contrast accessibility mode.

## Architecture

```text
SaviorAI
├── React 19 + TypeScript
│   ├── Home
│   ├── Assessment Wizard
│   ├── Injury Watch
│   ├── Find Help
│   ├── Medical Library
│   ├── Safety Benchmark
│   └── Settings
│
├── Express + TypeScript Server
│   ├── /api/health
│   ├── /api/triage/assess
│   ├── /api/protocols
│   ├── /api/facilities
│   ├── /api/audit-logs
│   └── /api/safety-benchmark/*
│
└── AI / Safety Layer
    ├── Gemini API integration
    ├── Safety triage pipeline
    ├── Escalation triggers
    └── Safety benchmark cases
```

## Technology Stack

| Layer | Technology |
| --- | --- |
| UI | React 19, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Motion | Motion |
| Server | Node.js, Express, TypeScript |
| AI | Google Gemini via `@google/genai` |
| Bundling | esbuild |
| Package Manager | npm |
| Data Persistence | Client-side storage + in-memory server stores |

The current project scripts use `tsx` for development, Vite for the client build, and esbuild for the bundled server output. fileciteturn1file0L2-L2

## Project Structure

```text
.
├── server.ts                    # Express server and API routes
├── server/
│   └── safetyPipeline.ts        # Safety/triage processing layer
├── src/
│   ├── components/              # Application and UI components
│   ├── data/                    # Protocols, facilities, emergency data
│   ├── lib/                     # Storage and shared utilities
│   ├── types/                   # TypeScript domain types
│   ├── App.tsx                  # Application shell and navigation state
│   ├── index.css                # Global styling
│   └── main.tsx                 # React entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── frontend-full-page.png       # UI preview
```

The application shell currently coordinates Home, Assessment, Injury Watch, Find Help, Library, Safety Benchmark, and Settings views, alongside emergency and report modals. fileciteturn3file0L2-L2

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- A Google Gemini API key for AI-powered assessment functionality

### 1. Clone the repository

```bash
git clone https://github.com/chillingbing648-sketch/SaviorAI.git
cd SaviorAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Never commit API keys or other secrets to Git.** Keep `.env` files out of version control.

### 4. Start the development server

```bash
npm run dev
```

The development script starts the TypeScript server through `tsx`. fileciteturn1file0L2-L2

### 5. Build for production

```bash
npm run build
```

### 6. Start the production server

```bash
npm start
```

### Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the Vite client and bundled server |
| `npm start` | Run the production server bundle |
| `npm run preview` | Preview the Vite production build |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove generated build artifacts |

## API Overview

### Health Check

```http
GET /api/health
```

Returns service status, API-key availability, application version, and active protocol count.

### Injury Triage

```http
POST /api/triage/assess
Content-Type: application/json
```

Accepts an `InjuryAssessmentRequest` and returns the triage pipeline result.

### Medical Protocols

```http
GET /api/protocols
POST /api/protocols/update
```

Retrieve the current protocol collection or create/update a protocol.

### Healthcare Facilities

```http
GET /api/facilities?lat=<latitude>&lng=<longitude>&type=<type>
```

Returns facility data and regional emergency numbers. When coordinates are supplied, the server calculates approximate distances and estimated drive times.

### Audit Logs

```http
GET /api/audit-logs
POST /api/audit-logs/event
```

Provides application-level triage and safety event logging.

The server currently exposes health, triage, protocol, facility, audit-log, and safety-benchmark functionality. fileciteturn4file0L2-L2

## Safety & Privacy Considerations

SaviorAI is intentionally designed with safety-oriented product behavior, but this repository should **not** be treated as a clinically validated medical system.

Before using the project with real users or sensitive health information, consider implementing:

- Authentication and authorization.
- Encrypted data storage and transport.
- Secure, authenticated administrative endpoints.
- Production-grade audit logging.
- Formal clinical validation and medical review.
- Regulatory and jurisdiction-specific compliance assessment.
- Robust observability, rate limiting, input validation, and abuse protection.
- A documented incident-response and model-evaluation process.

The current server uses in-memory stores for some audit/protocol data, so those stores should not be considered durable production storage. fileciteturn4file0L2-L2

## Development Principles

SaviorAI is being developed around the following principles:

1. **Safety first** — serious warning signs should take priority over convenience.
2. **Human escalation** — software should make it easier to seek appropriate professional help, not discourage it.
3. **Transparent AI assistance** — AI output should be treated as assistance rather than unquestionable truth.
4. **Accessible interaction** — critical actions should remain understandable and usable across devices and accessibility settings.
5. **Privacy by design** — minimize unnecessary collection and provide users with control over supported local data.
6. **Testable safety behavior** — safety benchmark cases should be used to evaluate changes to triage behavior.

## Roadmap

- [ ] Production-grade authentication and authorization
- [ ] Durable database-backed storage
- [ ] Stronger medical protocol provenance and versioning
- [ ] Expanded safety benchmark coverage
- [ ] Automated regression testing for triage behavior
- [ ] Comprehensive accessibility audit
- [ ] Secure production deployment configuration
- [ ] Expanded localization and regional emergency resources
- [ ] Clinical and regulatory review before real-world medical deployment

## Contributing

Contributions are welcome when they improve reliability, accessibility, security, developer experience, or safety.

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make focused changes.
4. Run validation:
   ```bash
   npm run lint
   npm run build
   ```
5. Commit your changes with a clear message.
6. Open a pull request describing the problem, solution, testing performed, and any safety implications.

For safety-critical changes, include relevant benchmark cases or explain why existing coverage is sufficient.

## License

This project is licensed under the **Apache License 2.0**. See the `LICENSE` file for the complete license text.

## Author

**Harsh Dubey**

GitHub: [@chillingbing648-sketch](https://github.com/chillingbing648-sketch)

Repository: [SaviorAI](https://github.com/chillingbing648-sketch/SaviorAI)

---

<div align="center">
  <sub>Built with React, TypeScript, Express, Vite, and AI-assisted safety workflows.</sub>
</div>
