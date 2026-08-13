# TraceForge

TraceForge is an open-source, auditable AI framework for turning industrial field evidence into structured, reviewable decisions. It is purpose-built for Ontario’s mining, advanced manufacturing, construction, and agri-food sectors.

> **Design principle:** an AI output is not an operational decision until its context, evidence, confidence, rationale, and human-review status are visible.

## What is in this repository?

The project includes a public-facing web showcase, a typed server-side inference procedure, a persisted audit registry, sector-specific evaluation criteria, a low-confidence human-review queue, and an evaluation scorecard. The inference layer requests structured JSON from a server-side LLM integration and stores the complete decision trace in the database.

## Architecture

1. A **sector context** selects prompt templates and evaluation criteria for Mining, Advanced Manufacturing, Construction, or Agri-Food.
2. The **inference procedure** requests structured output from the model: signal, confidence, observable reasoning steps, and recommended action.
3. A **policy gate** routes results below the 75% confidence threshold to `needs-review`.
4. The **audit registry** stores input, output, confidence, reasoning, action, status, and timestamps.
5. The **review workflow** supports approve, reject, and annotate actions, each recorded in `review_actions`.
6. The **scorecard** summarizes confidence distribution, accuracy proxy, review rate, approval rate, and sector coverage.

## Grant alignment

TraceForge is designed as an evidence-bearing prototype for future conversations with programs including **FedDev RAII Pillar 1: AI Productization and Commercialization**, **FedDev RAII Pillar 2: AI Adoption**, **NRC IRAP AI Assist**, and **OCI CIT**. The product thesis is intentionally aligned with industrial deployment, responsible GenAI adoption, testing and validation, commercialization readiness, and Ontario’s critical industrial sectors.

Program availability, eligibility, eligible costs, and intake status change over time. Applicants must confirm current requirements directly with the relevant agency. Current research notes and official source links are maintained in `ontario_ai_grant_findings.md`.

## Quick start

```bash
git clone https://github.com/your-org/traceforge.git
cd traceforge
pnpm install
pnpm dev
```

Run validation with:

```bash
pnpm check
pnpm test
```

The platform requires the project’s managed database and built-in server-side AI environment. Do not expose server-side AI credentials in the browser or commit local environment files.

## Responsible-use boundaries

TraceForge is a research and productization framework, not a substitute for qualified safety, engineering, food-safety, or regulatory judgment. The demo uses conservative recommendations and makes uncertainty visible. Production deployments should add sector-specific validation datasets, calibration studies, access controls, incident response, privacy safeguards, and domain-expert sign-off before consequential use.

## License

MIT. Add an explicit license file before public release if this repository is opened to external contributors.
