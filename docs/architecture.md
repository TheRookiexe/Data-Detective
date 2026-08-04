# Data Detective Architecture

## Overview

Data Detective follows a **frontend-backend separation** with an **API-first architecture**.

The frontend is responsible for presenting information and handling user interactions, while the backend is responsible for processing datasets and exposing analysis results through REST APIs.

This separation keeps both layers independent and allows either side to evolve without tightly coupling implementation details.

---

# High-Level Architecture

```text
                Browser
                    │
                    ▼
       HTML • CSS • JavaScript
                    │
                    ▼
              FastAPI Backend
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
     API Endpoints      Static Files
          │
          ▼
     Analysis Engine
          │
          ▼
     Individual Analyzers
```

---

# Request Flow

## Frontend Request

```text
Browser
    │
GET /
    │
    ▼
FastAPI
    │
    ▼
frontend/index.html
    │
    ▼
Browser loads CSS and JavaScript
```

---

## Analysis Request

```text
User uploads dataset
        │
        ▼
POST /api/analyze
        │
        ▼
FastAPI
        │
        ▼
Analysis Engine
        │
        ▼
Analyzers
        │
        ▼
JSON Response
        │
        ▼
Frontend Dashboard
```

---

# Backend Structure

```text
backend/app/

api/
analyzers/
config/
engine/
schemas/
utils/
```

## Responsibilities

### api/

Contains REST API endpoints.

The API layer should remain thin and primarily:

* Receive requests
* Validate input
* Call the analysis engine
* Return responses

Business logic should not live here.

---

### engine/

Acts as the orchestrator.

The engine coordinates all analyzers and combines their outputs into a single response.

Think of it as the conductor of an orchestra rather than the musician playing every instrument.

---

### analyzers/

Each analyzer has a single responsibility.

Current analyzers include:

* Overview Analyzer
* Quality Analyzer
* Visualization Analyzer
* Findings Analyzer
* Recommendation Analyzer

New analyzers should be added without requiring changes to existing analyzers whenever possible.

---

### schemas/

Contains Pydantic request and response models.

This keeps API validation separate from business logic.

---

### config/

Stores application configuration, constants, and future settings.

---

### utils/

Contains helper functions shared across multiple modules.

Utility functions should only be placed here if they are genuinely reusable.

---

# Frontend Structure

```text
frontend/

assets/
css/
js/
components/
index.html
```

## Responsibilities

### assets/

Static resources such as:

* Images
* Icons
* Fonts

---

### css/

Application styling.

---

### js/

Frontend application logic.

Responsible for:

* API communication
* UI updates
* Event handling

---

### components/

Reusable frontend components.

This directory may initially remain empty until reusable UI pieces naturally emerge.

---

# API Design Principles

All backend endpoints live under:

```text
/api
```

Examples:

```text
GET  /api/health

POST /api/analyze
```

Keeping API endpoints grouped under `/api` avoids conflicts with frontend routes and creates a clear separation of responsibilities.

---

# Design Principles

The project follows these guiding principles:

## 1. Single Responsibility

Each module should have one clear purpose.

---

## 2. Separation of Concerns

Frontend, API, and analysis logic remain independent.

---

## 3. API First

The backend should be usable by any client, not only the current frontend.

Future clients may include:

* React
* Mobile applications
* External integrations

---

## 4. Modular Analysis

Each analyzer should work independently and contribute one aspect of the overall analysis.

---

## 5. Keep It Simple

Avoid introducing additional abstractions until they solve a real problem.

Folders and classes should exist because they are needed, not because they appear in common project templates.

---

# Future Architecture

The current architecture is intentionally lightweight.

Future enhancements may include:

* Database integration
* User authentication
* Background task processing
* Report generation
* AI-powered insight generation

These additions should extend the existing architecture rather than require a redesign.

---

# Summary

Data Detective is designed around a modular architecture that emphasizes clarity, maintainability, and incremental growth.

The focus is on building small, well-defined components that work together to provide users with a structured understanding of their data.
