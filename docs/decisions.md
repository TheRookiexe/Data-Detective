# Architecture & Design Decisions

This document records significant architectural and design decisions made during the development of Data Detective.

The goal is to capture not only **what** decisions were made, but also **why** they were made and what alternatives were considered.

---

# ADR-001: Separate Frontend and Backend

**Status:** Accepted

## Decision

The project uses separate `frontend/` and `backend/` directories instead of embedding the frontend directly inside backend templates.

## Rationale

Separating the frontend and backend creates a cleaner architecture and allows each layer to evolve independently.

Benefits include:

* Better separation of concerns
* Cleaner project organization
* Backend APIs remain usable by multiple clients
* Easier future migration to a frontend framework such as React

## Alternatives Considered

* FastAPI templates using Jinja2
* Traditional server-rendered templates

These approaches were not selected because they would couple the presentation layer more closely to the backend.

---

# ADR-002: API-First Architecture

**Status:** Accepted

## Decision

Data Detective uses an API-first architecture.

The frontend communicates with the backend through HTTP API requests rather than directly interacting with backend implementation details.

## Rationale

An API-first architecture keeps the backend independent from the current frontend implementation.

The same backend can potentially support:

* Web applications
* Mobile applications
* Future frontend frameworks
* External integrations

It also establishes a clear boundary between presentation and analysis logic.

---

# ADR-003: Modular Analysis Engine

**Status:** Accepted

## Decision

Dataset analysis is divided into multiple specialized analyzers coordinated by a central analysis engine.

Current analyzers include:

* Overview Analyzer
* Quality Analyzer
* Findings Analyzer
* Recommendation Analyzer
* Visualization Analyzer

The analysis engine is responsible for orchestrating these analyzers and combining their results.

## Rationale

A modular analysis architecture makes each part of the analysis easier to understand, test, modify, and extend.

For example, visualization logic can evolve independently from data-quality analysis.

New analyzers can also be introduced without turning a single analysis module into a large collection of unrelated responsibilities.

---

# ADR-004: Single Analysis Endpoint

**Status:** Accepted

## Decision

All dataset analysis is exposed through a single endpoint:

```text
POST /api/analyze
```

The endpoint accepts the uploaded dataset and passes it to the analysis engine.

The engine coordinates the individual analyzers and returns a combined response.

## Rationale

The user should not need to make separate API requests for:

```text
Overview
Quality
Findings
Recommendations
Visualizations
```

These analyses are parts of the same dataset-analysis workflow.

A single endpoint keeps the public API simple while allowing the internal architecture to remain modular.

## Alternatives Considered

Separate endpoints such as:

```text
POST /api/overview
POST /api/quality
POST /api/findings
POST /api/recommendations
POST /api/visualizations
```

This was not selected for the MVP because it would require multiple requests for a single analysis operation and unnecessarily expose internal analyzer boundaries through the public API.

The analyzers remain separate internally even though they share one public analysis endpoint.

---

# ADR-005: Thin API Layer

**Status:** Accepted

## Decision

API routes should remain lightweight.

The API layer is responsible for:

* Receiving requests
* Handling uploaded files
* Performing request-level validation
* Preparing the dataset
* Calling the analysis engine
* Returning the result

Analysis and business logic should remain outside the API layer.

## Rationale

Keeping API routes thin prevents analysis logic from becoming tightly coupled to HTTP handling.

For example, the `/api/analyze` route reads the uploaded CSV into a Pandas DataFrame and passes it to the analysis engine rather than performing individual quality, findings, or visualization calculations itself.

This keeps the analysis engine reusable and easier to test independently.

---

# ADR-006: Static Frontend with FastAPI

**Status:** Accepted

## Decision

The frontend is currently served as static files by FastAPI.

The frontend consists of:

* HTML
* CSS
* JavaScript
* Static assets

## Rationale

This keeps the MVP development workflow simple while maintaining a clear separation between frontend and backend responsibilities.

The frontend can later be replaced by a dedicated framework without requiring the analysis architecture to be redesigned.

---

# ADR-007: Reserve `/api` for Backend Endpoints

**Status:** Accepted

## Decision

Backend API endpoints use the `/api` prefix.

Current endpoints include:

```text
GET  /api/health
POST /api/analyze
```

## Rationale

A dedicated API namespace clearly separates backend services from frontend resources and reduces the possibility of route conflicts.

---

# ADR-008: Keep the Architecture Simple

**Status:** Accepted

## Decision

Additional layers, folders, classes, and abstractions should only be introduced when they solve a real problem.

Structures intentionally avoided at the current stage include:

* Repository layer
* Service layer
* Controller layer
* Unnecessary utility abstractions
* Additional API layers

## Rationale

Data Detective is currently an MVP.

Premature abstraction would increase complexity without providing meaningful benefits.

The architecture should evolve naturally as the project gains requirements.

---

# ADR-009: Reuse Analyzer Results

**Status:** Accepted

## Decision

When one analyzer calculates information that another analyzer requires, the existing result should be reused instead of recalculating the same information.

For example, the Findings Analyzer returns both human-readable insights and structured data:

```json
{
    "insights": [],
    "data": {
        "data_completeness": 86.39,
        "duplicate_rows": 483,
        "highest_missing": {
            "column": "Rating",
            "percentage": 13.6
        },
        "numeric_columns_percentage": {
            "count": 3,
            "total": 12,
            "percentage": 25
        }
    }
}
```

The Recommendation Analyzer can consume this structured data instead of independently recalculating values such as the highest missing-value column or dataset completeness.

## Rationale

Reusing calculated results:

* Avoids duplicated logic
* Keeps calculations centralized
* Reduces the possibility of inconsistent results
* Makes dependencies between analyzers explicit

This is particularly useful as the number of analyzers grows.

---

# ADR-010: Separate Findings from Recommendations

**Status:** Accepted

## Decision

Findings and recommendations are treated as separate stages of analysis.

**Findings describe what was detected in the dataset.**

**Recommendations suggest what the user could consider doing about those findings.**

For example:

```text
Finding:
Rating column has the highest missing-value rate at 13.6%.

Recommendation:
Review the missing values across the dataset, particularly in the Rating column.
```

## Rationale

Separating these responsibilities keeps the analysis easier to understand and allows the recommendation system to become more sophisticated independently of the underlying findings.

Future recommendations may consider additional context without changing how basic findings are calculated.

---

# ADR-011: Visualization Analyzer Provides Visualization Suggestions

**Status:** Accepted

## Decision

The Visualization Analyzer determines what type of visualization may be appropriate for a column.

It does not generate or render the actual charts.

Current decisions include:

```text
Numeric column
    → Histogram

Low-cardinality non-numeric column
    → Bar chart

High-cardinality non-numeric column
    → High-cardinality indicator

Numeric identifier column
    → Identifier
```

## Rationale

The analyzer should determine **what visualization makes sense**, while the frontend should determine **how that visualization is rendered**.

This keeps data-analysis logic separate from presentation logic.

It also allows the frontend visualization implementation to change without requiring changes to the underlying analysis rules.

---

# ADR-012: Identifier Detection Based on Column Names

**Status:** Accepted

## Decision

The initial Visualization Analyzer uses column-name patterns to identify likely identifier columns.

For example:

```text
id
parent_id
user_id
```

Column names are inspected for identifier-like tokens such as `id`.

## Rationale

Identifier columns generally should not be treated like ordinary numeric variables.

For example, a column containing:

```text
1
2
3
4
5
...
```

may technically be numeric but does not necessarily represent a measurable quantity for which a histogram would provide meaningful insight.

This heuristic is intentionally simple for the MVP.

## Limitations

Column-name detection is not a complete semantic data-type detection system.

A future version may use additional information such as:

* Uniqueness ratio
* Cardinality
* Value distribution
* Data patterns
* Column semantics

These improvements are intentionally deferred.

---

# ADR-013: Use Existing Overview Data Types

**Status:** Accepted

## Decision

The Visualization Analyzer uses the data types already calculated by the Overview Analyzer instead of independently determining the basic Pandas data type of every column.

## Rationale

The Overview Analyzer already provides a centralized representation of column data types.

Reusing this information:

* Avoids duplicated type-detection logic
* Keeps analyzer responsibilities clear
* Makes the Overview Analyzer the source of basic structural dataset information

The Visualization Analyzer can then focus on visualization-specific decisions.

---

# ADR-014: Dataset Completeness Definition

**Status:** Accepted

## Decision

Dataset completeness is defined as the percentage of rows that contain **no missing values in any column**.

The calculation is based on Pandas missing-value (`NaN`) detection.

For example, if a dataset contains 100 rows and 10 rows contain at least one missing value:

```text
Dataset completeness = 90%
```

## Rationale

This provides a simple dataset-level measure that complements the per-column missing-value analysis.

The metric also provides useful context for the Findings and Recommendation analyzers.

## Transparency

The frontend should explain this definition to users when displaying dataset completeness.

This is important because completeness does not mean that every individual column is 100% complete. It represents the percentage of rows that contain no missing values anywhere in the dataset.

---

# ADR-015: Keep Data Cleaning Outside the Current MVP

**Status:** Accepted

## Decision

The MVP focuses on detecting and reporting data-quality issues rather than automatically cleaning the dataset.

The current system identifies issues such as:

* Missing values
* Duplicate rows
* Dataset completeness

Recommendations can suggest actions, but the system does not automatically modify the user's dataset.

## Rationale

Automatic cleaning introduces additional decisions and risks.

For example, a missing value could potentially be handled by:

* Removing the row
* Removing the column
* Filling with the mean
* Filling with the median
* Filling with the mode
* Using domain-specific logic

The correct choice depends on the dataset and intended use.

Therefore, the MVP focuses on transparency and recommendations rather than automatically making those decisions.

---

# ADR-016: Defer Advanced Data Cleaning Detection

**Status:** Accepted

## Decision

Detection of values such as:

* Placeholder strings
* Blank strings
* `-`
* `(X)`
* Other dataset-specific filler values

is intentionally outside the current MVP scope.

## Rationale

These values can represent missing or invalid data even when they are not technically stored as `NaN`.

Detecting them reliably requires more sophisticated column-level and semantic analysis.

This capability may be added later as an extension to the modular quality-analysis architecture.

The current MVP instead focuses on standard missing-value detection provided through Pandas.

---

# ADR-017: Human-Readable Findings

**Status:** Accepted

## Decision

Findings are returned as human-readable statements rather than exposing only raw numerical metrics.

For example:

```text
The dataset has moderate completeness, with 86.39% of rows containing no missing values.

483 duplicate rows were detected.

Rating column has the highest missing-value rate at 13.6%.

3 of 12 columns are numeric (25.0%).
```

The analyzer also returns structured data internally for reuse by other analyzers.

## Rationale

Raw metrics are useful for applications, but users should not have to interpret every number themselves.

Human-readable findings make the output more understandable while the structured data preserves machine-readable information for downstream processing.

---

# Decision-Making Principles

Future architectural decisions should follow these principles:

1. Prefer clarity over cleverness.
2. Keep modules focused on a single responsibility.
3. Reuse existing calculated results where appropriate.
4. Avoid unnecessary abstractions.
5. Keep the MVP focused.
6. Separate analysis from presentation.
7. Design for maintainability before optimization.
8. Prefer incremental improvements over premature complexity.
9. Document significant architectural decisions as they are made.

---

# Living Document

This document is expected to evolve throughout the lifetime of the project.

Whenever a significant architectural decision is made, a new ADR should be added rather than silently changing the reasoning behind an existing decision.

This preserves the reasoning behind the project's evolution and provides a historical record of why the architecture looks the way it does.