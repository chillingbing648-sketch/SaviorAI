# SaviorAI Documentation

This folder contains the engineering documentation for SaviorAI.

SaviorAI is an experimental AI-assisted injury assessment and safety-guidance platform. The application combines a React frontend, an Express API, deterministic safety logic, structured protocols and Google Gemini-assisted reasoning.

## Documentation Map

| Document | Purpose | Status |
|---|---|---|
| [`../README.md`](../README.md) | Product overview, setup, architecture, API surface and roadmap | Current |
| `ARCHITECTURE.md` | Target application and safety-engine architecture | Planned |
| `SAFETY.md` | Safety-engine rules, validation boundaries and benchmark philosophy | Planned |
| `API.md` | API contracts and request/response conventions | Planned |
| `DATABASE.md` | Planned PostgreSQL schema and persistence model | Planned |
| `TESTING.md` | Unit, integration, E2E and safety-regression strategy | Planned |
| `SECURITY.md` | Authentication, authorization, API hardening and privacy controls | Planned |
| `DEPLOYMENT.md` | Local, staging and production deployment workflow | Planned |

## Current System

```text
React UI
   │
   ▼
Express API
   │
   ▼
Safety Pipeline
   ├── deterministic safety checks
   ├── protocol matching
   ├── Gemini-assisted reasoning
   └── safety / escalation validation
   │
   ▼
Triage Guidance
```

## Target System

```text
src/
├── app/
├── features/
│   ├── assessment/
│   ├── emergency/
│   ├── injury-watch/
│   ├── facilities/
│   ├── reports/
│   └── admin/
├── components/ui/
├── domain/
│   ├── triage/
│   ├── protocols/
│   ├── injuries/
│   └── safety/
├── services/
│   ├── api/
│   ├── ai/
│   └── location/
└── lib/

server/
├── routes/
├── controllers/
├── services/
├── middleware/
├── safety/
│   ├── redFlagEngine.ts
│   ├── triageEngine.ts
│   ├── protocolEngine.ts
│   ├── safetyValidator.ts
│   └── escalationEngine.ts
└── infrastructure/
```

## Safety Boundary

The most important architectural rule is:

```text
User Input
    ↓
Deterministic Safety Checks
    ↓
AI Assistance
    ↓
Safety Validation
    ↓
Escalation Policy
    ↓
Final User Guidance
```

AI output must not bypass the safety validation layer.

Critical red flags should be handled by deterministic safety logic and should be able to override an AI result when necessary.

## Current Engineering Limitations

The repository is an MVP and should not be represented as production-ready clinical software. Important current limitations include:

- The main safety implementation is concentrated in `server/safetyPipeline.ts`.
- `AssessWizard.tsx` is a large frontend component and should be decomposed.
- Protocol and audit stores are currently in memory.
- Authentication and RBAC are not implemented.
- Facility information is based on repository data and approximate distance calculations.
- Automated safety regression coverage needs to be expanded.
- Production observability is not yet implemented.

These limitations are tracked in the root README roadmap.

## Documentation Rules

When adding a new major subsystem:

1. Document its responsibility.
2. Document its inputs and outputs.
3. Document important failure modes.
4. Add tests before calling the subsystem production-ready.
5. Update the architecture diagram when boundaries change.
6. Never document experimental behavior as clinically validated behavior.

## Source of Truth

The code in the repository is the source of truth for current behavior. Documentation should describe what the code actually does and clearly label planned architecture separately from implemented functionality.
