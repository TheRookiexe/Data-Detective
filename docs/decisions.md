# Architecture & Design Decisions

This document records significant architectural and design decisions made during the development of Data Detective.

The goal is to capture not only **what** decisions were made, but also **why** they were made and what alternatives were considered.

---

# ADR-001: Separate Frontend and Backend

**Status:** Accepted

## Decision

The project uses separate `frontend/` and `backend/` directories instead of embedding the frontend directly inside backend templates.

The frontend is responsible for presentation and user interaction, while the backend provides the API and performs dataset analysis.

## Rationale

Separating the frontend and backend creates a cleaner architecture and allows each layer to evolve independently.

Benefits include:

- Better separation of concerns
- Cleaner project organization
- Backend APIs remain usable by multiple clients
- Easier future migration to a frontend framework
- Clear separation between presentation and analysis logic

## Alternatives Considered

- FastAPI templates using Jinja2
- Traditional server-rendered templates

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

- Web applications
- Mobile applications
- Future frontend frameworks
- External integrations

It also establishes a clear boundary between presentation and analysis logic.

The completed MVP uses this separation between the frontend interface and the FastAPI analysis API.

---

# ADR-003: Modular Analysis Engine

**Status:** Accepted

## Decision

Dataset analysis is divided into multiple specialized analyzers coordinated by a central analysis engine.

The completed MVP includes:

- Overview Analyzer
- Quality Analyzer
- Findings Analyzer
- Recommendation Analyzer
- Visualization Analyzer

The analysis engine is responsible for orchestrating these analyzers and combining their results into the final analysis response.

## Rationale

A modular analysis architecture makes each part of the analysis easier to understand, test, modify, and extend.

For example, visualization logic can evolve independently from data-quality analysis.

New analyzers can also be introduced without turning a single analysis module into a large collection of unrelated responsibilities.

---

# ADR-004: Single Analysis Endpoint

**Status:** Accepted

## Decision

All dataset analysis is exposed through a single endpoint:

    POST /api/analyze

The endpoint accepts the uploaded dataset and passes it to the analysis engine.

The engine coordinates the individual analyzers and returns a combined response.

## Rationale

The user should not need to make separate API requests for:

    Overview
    Quality
    Findings
    Recommendations
    Visualizations

These analyses are parts of the same dataset-analysis workflow.

A single endpoint keeps the public API simple while allowing the internal architecture to remain modular.

## Alternatives Considered

Separate endpoints such as:

    POST /api/overview
    POST /api/quality
    POST /api/findings
    POST /api/recommendations
    POST /api/visualizations

This was not selected for the MVP because it would require multiple requests for a single analysis operation and unnecessarily expose internal analyzer boundaries through the public API.

The analyzers remain separate internally even though they share one public analysis endpoint.

---

# ADR-005: Thin API Layer

**Status:** Accepted

## Decision

API routes remain lightweight.

The API layer is responsible for:

- Receiving requests
- Handling uploaded files
- Preparing the dataset
- Calling the analysis engine
- Returning the result

Analysis logic remains outside the API layer.

## Rationale

Keeping API routes thin prevents analysis logic from becoming tightly coupled to HTTP handling.

The `/api/analyze` route reads the uploaded CSV into a Pandas DataFrame and passes it to the analysis engine rather than performing individual quality, findings, or visualization calculations itself.

This keeps the analysis engine reusable and easier to test independently.

---

# ADR-006: Static Frontend with FastAPI

**Status:** Accepted

## Decision

The completed MVP uses a static frontend consisting of:

- HTML
- CSS
- Vanilla JavaScript
- Static assets

The frontend is served by the FastAPI application as part of the deployed application.

## Rationale

This keeps the MVP simple while still providing a complete user-facing application.

Using vanilla JavaScript avoids introducing framework complexity when the current requirements can be satisfied with standard browser technologies.

The frontend can later be replaced or migrated to a dedicated framework without requiring the analysis architecture to be redesigned.

---

# ADR-007: Reserve `/api` for Backend Endpoints

**Status:** Accepted

## Decision

Backend API endpoints use the `/api` prefix.

Current endpoints include:

    GET  /api/health
    POST /api/analyze

## Rationale

A dedicated API namespace clearly separates backend services from frontend resources and reduces the possibility of route conflicts.

It also provides a consistent boundary for future API expansion.

---

# ADR-008: Keep the Architecture Simple

**Status:** Accepted

## Decision

Additional layers, folders, classes, and abstractions should only be introduced when they solve a real problem.

Structures intentionally avoided at the current stage include:

- Repository layer
- Unnecessary service abstractions
- Controller layer
- Unnecessary utility abstractions
- Additional API layers

## Rationale

Data Detective is an MVP, and the completed implementation demonstrates that the current modular structure is sufficient for its requirements.

Premature abstraction would increase complexity without providing meaningful benefits.

The architecture should evolve naturally as the project gains requirements.

---

# ADR-009: Reuse Analyzer Results

**Status:** Accepted

## Decision

When one analyzer calculates information that another analyzer requires, the existing result should be reused instead of recalculating the same information.

For example, the Findings Analyzer returns both human-readable insights and structured data:

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

The Recommendation Analyzer can consume structured analysis results instead of independently recalculating information already produced by the analysis pipeline.

## Rationale

Reusing calculated results:

- Avoids duplicated logic
- Keeps calculations centralized
- Reduces the possibility of inconsistent results
- Makes dependencies between analyzers explicit

This becomes increasingly useful as the number of analyzers grows.

---

# ADR-010: Separate Findings from Recommendations

**Status:** Accepted

## Decision

Findings and recommendations are treated as separate stages of analysis.

**Findings describe what was detected in the dataset.**

**Recommendations suggest what the user could consider doing about those findings.**

For example:

    Finding:
    Rating column has the highest missing-value rate at 13.6%.

    Recommendation:
    Review the missing values across the dataset, particularly in the Rating column.

## Rationale

Separating these responsibilities keeps the analysis easier to understand and allows the recommendation system to become more sophisticated independently of the underlying findings.

Future recommendations can use additional context without changing how basic findings are calculated.

---

# ADR-011: Visualization Analyzer Provides Visualization Suggestions

**Status:** Accepted

## Decision

The Visualization Analyzer determines what type of visualization may be appropriate for a column.

It provides visualization metadata to the frontend rather than generating the actual charts inside the analysis engine.

Current decisions include:

    Numeric column
        → Histogram

    Low-cardinality non-numeric column
        → Bar chart

    High-cardinality non-numeric column
        → High-cardinality indicator

    Numeric identifier column
        → Identifier

The frontend uses this metadata when presenting visualization-related results to the user.

## Rationale

The analyzer should determine **what visualization makes sense**, while the frontend determines **how that visualization is presented**.

This keeps data-analysis logic separate from presentation logic.

It also allows the frontend visualization implementation to change without requiring changes to the underlying analysis rules.

---

# ADR-012: Identifier Detection Based on Column Names

**Status:** Accepted

## Decision

The initial Visualization Analyzer uses column-name patterns to identify likely identifier columns.

Examples include:

    id
    parent_id
    user_id

Column names are inspected for identifier-like tokens such as `id`.

## Rationale

Identifier columns generally should not be treated like ordinary numeric variables.

For example, a column containing:

    1
    2
    3
    4
    5
    ...

may technically be numeric but does not necessarily represent a measurable quantity for which a histogram would provide meaningful insight.

This heuristic is intentionally simple for the MVP.

## Limitations

Column-name detection is not a complete semantic data-type detection system.

A future version may use additional information such as:

- Uniqueness ratio
- Cardinality
- Value distribution
- Data patterns
- Column semantics

These improvements are intentionally deferred.

---

# ADR-013: Reuse Existing Structural Dataset Information

**Status:** Accepted

## Decision

Analyzers should reuse structural information that has already been calculated by the analysis pipeline instead of independently duplicating the same basic detection logic.

For example, the Overview Analyzer provides basic column data types that can be used by visualization analysis.

## Rationale

Reusing existing structural information:

- Avoids duplicated type-detection logic
- Keeps analyzer responsibilities clear
- Establishes a consistent source for basic dataset information
- Allows specialized analyzers to focus on their own responsibilities

The Overview Analyzer focuses on structural information, while the Visualization Analyzer focuses on visualization-specific decisions.

---

# ADR-014: Dataset Completeness Definition

**Status:** Accepted

## Decision

Dataset completeness is defined as the percentage of rows that contain **no missing values in any column**.

For example, if a dataset contains 100 rows and 10 rows contain at least one missing value:

    Dataset completeness = 90%

## Rationale

This provides a simple dataset-level measure that complements the per-column missing-value analysis.

The metric also provides useful context for the Findings and Recommendation analyzers.

## Transparency

The frontend should explain this definition to users when displaying dataset completeness.

Completeness does not mean that every individual column is 100% complete.

It represents the percentage of rows that contain no missing values anywhere in the dataset.

---

# ADR-015: Keep Data Cleaning Outside the Current MVP

**Status:** Accepted

## Decision

The completed MVP focuses on detecting and reporting data-quality issues rather than automatically cleaning the dataset.

The current system identifies issues such as:

- Missing values
- Duplicate rows
- Dataset completeness

Recommendations can suggest actions, but the system does not automatically modify the user's dataset.

## Rationale

Automatic cleaning introduces additional decisions and risks.

For example, a missing value could potentially be handled by:

- Removing the row
- Removing the column
- Filling with the mean
- Filling with the median
- Filling with the mode
- Using domain-specific logic

The correct choice depends on the dataset and intended use.

Therefore, the MVP focuses on transparency and recommendations rather than automatically making those decisions.

---

# ADR-016: Defer Advanced Data Cleaning Detection

**Status:** Accepted

## Decision

Detection of values such as:

- Placeholder strings
- Blank strings
- `-`
- `(X)`
- Other dataset-specific filler values

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

    The dataset has moderate completeness, with 86.39% of rows containing no missing values.

    483 duplicate rows were detected.

    Rating column has the highest missing-value rate at 13.6%.

    3 of 12 columns are numeric (25.0%).

The analyzer also returns structured data for reuse by other parts of the analysis pipeline.

## Rationale

Raw metrics are useful for applications, but users should not have to interpret every number themselves.

Human-readable findings make the output more understandable while structured data preserves machine-readable information for downstream processing.

---

# ADR-018: Containerized Deployment

**Status:** Accepted

## Decision

The Data Detective application is packaged as a Docker container.

The same containerized application is used for local testing and cloud deployment.

The completed AWS deployment uses:

    Docker
       │
       ▼
    Amazon ECR
       │
       ▼
    Amazon ECS
       │
       ▼
    AWS Fargate

The container packages the FastAPI backend, frontend, and required Python dependencies into a single deployable image.

## Rationale

Containerization provides a consistent application environment between development and deployment.

It simplifies deployment by packaging the application and its dependencies into a single image.

Using the same image for local testing and AWS deployment reduces environment-specific differences and makes the deployment process reproducible.

---

# ADR-019: AWS ECS with Fargate for MVP Deployment

**Status:** Accepted

## Decision

The completed MVP is deployed on AWS using Amazon ECS with AWS Fargate.

The application runs as a Fargate task using the Docker image stored in Amazon ECR.

The deployment uses:

- Amazon ECR for container image storage
- Amazon ECS for container orchestration
- AWS Fargate for container execution
- AWS IAM for required execution permissions

The current deployment uses a public IP for direct access to the running application rather than introducing a load balancer.

## Rationale

ECS with Fargate provides a practical way to demonstrate the containerized MVP on AWS without managing virtual machines.

It also demonstrates familiarity with:

- Containerized application deployment
- Amazon ECR
- ECS task definitions
- Fargate
- IAM execution roles
- AWS networking

The architecture intentionally avoids additional infrastructure that is not required by the current MVP.

## Alternatives Considered

### Amazon EC2

Running the application directly on an EC2 instance would introduce server management responsibilities that are unnecessary for the current MVP.

### Application Load Balancer

An Application Load Balancer could provide a stable HTTP endpoint and additional routing capabilities, but it was not required for the current demonstration deployment.

The current architecture therefore uses direct access to the Fargate task.

---

# ADR-020: Keep the AWS Demonstration Environment Minimal

**Status:** Accepted

## Decision

The AWS deployment intentionally uses only the infrastructure required to demonstrate the completed Data Detective MVP.

The current deployment does not introduce services such as:

- Amazon S3
- Amazon OpenSearch Service
- Amazon ElastiCache/Redis
- Amazon SNS
- Amazon SQS
- Application Load Balancer
- Database services

unless a future feature creates a concrete requirement for them.

The Fargate service is kept stopped when the live deployment is not required for testing or demonstration.

## Rationale

The project should demonstrate appropriate architectural decision-making rather than adding cloud services simply because they are available or suggested as possible technologies.

Keeping the infrastructure minimal:

- Reduces unnecessary complexity
- Reduces unnecessary resource usage
- Keeps the MVP architecture understandable
- Makes the deployment easier to maintain
- Keeps infrastructure proportional to the project's current requirements

Future services can be introduced when they solve an actual application problem.

---

# ADR-021: No Automatic Data Persistence in the MVP

**Status:** Accepted

## Decision

The MVP processes uploaded CSV datasets for analysis without introducing a persistent dataset-storage layer.

The analysis is performed during the request and the resulting structured response is returned to the client.

Persistent storage is not required for the current analysis workflow.

## Rationale

The MVP does not currently require users to create accounts, save previous analyses, or maintain a dataset history.

Adding a database or object-storage layer at this stage would introduce additional infrastructure without solving a current requirement.

Persistent dataset management can be considered later if features such as saved analyses, user accounts, or dataset history are introduced.

---

# ADR-022: Deployment Documentation Reflects Verified Infrastructure

**Status:** Accepted

## Decision

Deployment documentation records infrastructure that has actually been implemented and verified rather than documenting AWS services merely as future possibilities.

The current verified deployment path is:

    Docker
       │
       ▼
    Amazon ECR
       │
       ▼
    Amazon ECS
       │
       ▼
    AWS Fargate
       │
       ▼
    Data Detective

The live deployment was tested through the application's web interface and FastAPI documentation endpoints.

## Rationale

Documentation should represent the actual architecture of the project.

This prevents the project from appearing to use cloud services that were never implemented and makes the architecture easier to explain during demonstrations and interviews.

Future infrastructure should be documented as a proposed decision only after it becomes an actual project requirement or implementation.

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
9. Keep infrastructure proportional to actual requirements.
10. Document significant architectural decisions as they are made.
11. Distinguish implemented architecture from future possibilities.
12. Prefer verified implementation over theoretical infrastructure.

---

# Living Document

This document is expected to evolve throughout the lifetime of the project.

Whenever a significant architectural decision is made, a new ADR should be added rather than silently changing the reasoning behind an existing decision.

This preserves the reasoning behind the project's evolution and provides a historical record of why the architecture looks the way it does.

Future deployment decisions, including additional hosting platforms such as Render, should be documented after they have been implemented and verified.