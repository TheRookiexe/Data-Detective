# Architecture & Design Decisions

This document records significant architectural decisions made during the development of Data Detective.

The goal is to capture not only **what** decisions were made, but also **why** they were made and what alternatives were considered.

---

# ADR-001: Separate Frontend and Backend

**Status:** Accepted

## Decision

The project uses separate `frontend/` and `backend/` directories instead of embedding HTML templates inside the backend.

## Rationale

Separating the frontend and backend creates a cleaner architecture and allows each layer to evolve independently.

Benefits include:

* Better separation of concerns
* Easier migration to frameworks such as React in the future
* Backend APIs remain usable by multiple clients
* Cleaner project organization

## Alternatives Considered

* FastAPI templates (Jinja2)
* Traditional Flask-style templates

These approaches were rejected because they tightly couple presentation and backend logic.

---

# ADR-002: API-First Architecture

**Status:** Accepted

## Decision

All application functionality is exposed through REST APIs.

The frontend communicates exclusively with the backend through HTTP requests.

## Rationale

An API-first architecture makes the backend reusable by different clients including:

* Web applications
* Mobile applications
* Future frontend frameworks
* External integrations

It also encourages better separation between business logic and presentation.

---

# ADR-003: Modular Analysis Engine

**Status:** Accepted

## Decision

The analysis engine is composed of multiple independent analyzers.

Each analyzer is responsible for one aspect of dataset understanding.

Examples include:

* Overview
* Data Quality
* Visualizations
* Findings
* Recommendations

## Rationale

This modular design allows new analyzers to be added without significantly modifying existing ones.

It also improves readability, testing, and maintainability.

---

# ADR-004: Thin API Layer

**Status:** Accepted

## Decision

API endpoints should remain lightweight.

Their responsibilities are limited to:

* Receiving requests
* Validating input
* Calling the analysis engine
* Returning responses

Business logic should never live inside API endpoints.

## Rationale

Keeping endpoints thin improves maintainability and prevents business logic from being duplicated across routes.

---

# ADR-005: Static Frontend with FastAPI

**Status:** Accepted

## Decision

The frontend is served as static files by FastAPI during development.

## Rationale

This approach keeps the development workflow simple while maintaining a clean separation between frontend and backend.

The architecture also allows the frontend to be replaced by a dedicated framework in the future without major backend changes.

---

# ADR-006: Reserve `/api` for Backend Endpoints

**Status:** Accepted

## Decision

All backend endpoints are placed under the `/api` prefix.

Examples:

```text id="ajd8tu"
GET  /api/health

POST /api/analyze
```

## Rationale

Using a dedicated API namespace prevents conflicts with frontend routes and clearly distinguishes application pages from backend services.

---

# ADR-007: Keep the Architecture Simple

**Status:** Accepted

## Decision

Additional layers, folders, and abstractions will only be introduced when they solve a real problem.

Examples of structures intentionally omitted at the current stage include:

* Repository layer
* Service layer
* Controller layer

## Rationale

Premature abstraction increases complexity without providing immediate value.

The project will evolve organically as new requirements emerge.

---

# Decision-Making Principles

Future architectural decisions should follow these principles:

1. Prefer clarity over cleverness.
2. Keep modules focused on a single responsibility.
3. Avoid unnecessary abstractions.
4. Design for maintainability before optimization.
5. Document important decisions as they are made.

---

# Living Document

This document is expected to evolve throughout the lifetime of the project.

Whenever a significant architectural decision is made, a new ADR (Architecture Decision Record) should be added rather than modifying previous decisions.

This preserves the reasoning behind the project's evolution over time.
