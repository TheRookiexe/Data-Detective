# Data Detective Roadmap

This roadmap outlines the planned evolution of Data Detective.

The project follows an **MVP-first** approach, focusing on delivering a complete and useful product before expanding into more advanced features.

---

# Guiding Principles

- Build one complete feature at a time.
- Keep the architecture simple.
- Prioritize usability over feature count.
- Avoid premature optimization.
- Refactor when there is a clear benefit.
- Keep advanced features outside the MVP until the core workflow is stable.
- Prefer modular improvements that can be added without redesigning the existing architecture.
- Keep infrastructure proportional to the needs of the project.
- Deploy only the infrastructure required for the current application.

---

# Phase 1 — Foundation ✅

**Status:** Completed

## Goals

- [x] Project planning
- [x] Repository structure
- [x] FastAPI setup
- [x] Frontend setup
- [x] API-first architecture
- [x] Static frontend integration
- [x] Health endpoint
- [x] Analysis engine structure
- [x] Initial project documentation
- [x] Architecture documentation
- [x] Architecture decision records

---

# Phase 2 — Backend Analysis MVP ✅

**Status:** Completed

The backend analysis pipeline forms the core of Data Detective.

The backend accepts a CSV dataset, processes it using Pandas, passes it through the modular analysis engine, and returns a structured result through a single API endpoint.

---

## Dataset Upload & Processing

- [x] CSV dataset loading
- [x] Pandas DataFrame integration
- [x] Dataset passed through the analysis engine
- [x] File handling through the API
- [x] Basic dataset processing

Advanced file validation and more sophisticated validation rules remain future improvements.

---

## Analysis Engine

- [x] Central analysis engine
- [x] Single `/api/analyze` endpoint
- [x] Analyzer orchestration
- [x] Combined JSON response

---

## Overview Analyzer

- [x] Filename detection
- [x] Row count
- [x] Column count
- [x] Column names
- [x] Basic column data types

---

## Quality Analyzer

- [x] Missing-value detection
- [x] Missing-value percentage per column
- [x] Duplicate-row detection
- [x] Dataset memory usage
- [x] Dataset completeness calculation
- [x] Structured quality output

Dataset completeness currently represents the percentage of rows containing no missing values across the dataset.

---

## Findings Analyzer

- [x] Dataset completeness finding
- [x] Duplicate-row finding
- [x] Highest missing-value finding
- [x] Numeric-column distribution
- [x] Human-readable insights
- [x] Structured findings data for downstream analyzers

The structured findings data allows other analyzers to reuse calculated information instead of performing the same calculations again.

---

## Recommendation Analyzer

- [x] Missing-value recommendations
- [x] Duplicate-row recommendations
- [x] Dataset-completeness recommendations
- [x] Recommendation threshold logic
- [x] Findings data reuse

Recommendations focus on identifying issues and suggesting that the user review them rather than automatically modifying the dataset.

---

## Visualization Analyzer

- [x] Numeric-column detection
- [x] Non-numeric-column detection
- [x] Unique-value counting
- [x] Histogram suggestions
- [x] Bar-chart suggestions
- [x] High-cardinality detection
- [x] Basic identifier detection
- [x] Structured visualization metadata

The Visualization Analyzer determines what visualization may be appropriate and provides metadata that the frontend can use for visualization rendering.

---

# Phase 3 — Frontend MVP ✅

**Status:** Completed

The frontend was completed and integrated with the backend analysis pipeline to provide the complete user-facing Data Detective workflow.

---

## Upload Experience

- [x] Dataset upload interface
- [x] Upload dialog
- [x] Loading state
- [x] Error state
- [x] Successful upload state

---

## Dashboard

- [x] Dataset summary section
- [x] Overview section
- [x] Data quality section
- [x] Findings section
- [x] Recommendations section
- [x] Visualizations section
- [x] Scrollable dashboard
- [x] Left navigation/sidebar
- [x] Interactive sections

---

## Visualization Rendering

- [x] Render histogram visualizations
- [x] Render bar-chart visualizations
- [x] Handle high-cardinality columns appropriately
- [x] Display identifier columns without misleading charts
- [x] Connect visualization metadata from the backend to frontend rendering

---

## Frontend Integration

- [x] Connect upload form to `/api/analyze`
- [x] Parse analysis response
- [x] Display structured analyzer results
- [x] Display dataset completeness explanation
- [x] Display findings and recommendations
- [x] Handle API errors gracefully

---

## Responsive UI

- [x] Desktop layout
- [x] Responsive interface
- [x] Usable dashboard navigation
- [x] UI polish appropriate for the MVP

---

# Phase 4 — MVP Integration & Verification ✅

**Status:** Completed

The individual backend and frontend components were integrated and verified as a complete end-to-end application.

## End-to-End Workflow

- [x] Upload CSV dataset
- [x] Send dataset to backend
- [x] Read dataset using Pandas
- [x] Run analysis engine
- [x] Execute all analyzers
- [x] Return structured JSON
- [x] Process response in frontend
- [x] Display analysis results
- [x] Display findings
- [x] Display recommendations
- [x] Display visualizations
- [x] Handle application errors
- [x] Verify complete user workflow

The completed workflow is:

    Upload CSV
         │
         ▼
    FastAPI API
         │
         ▼
    Pandas DataFrame
         │
         ▼
    Analysis Engine
         │
         ├── Overview
         ├── Quality
         ├── Findings
         ├── Recommendations
         └── Visualizations
         │
         ▼
    Structured JSON
         │
         ▼
    Frontend Dashboard
         │
         ▼
    User Understands Their Dataset

At this stage, the core Data Detective MVP is complete.

---

# Phase 5 — Containerization & AWS Deployment ✅

**Status:** Completed

The completed MVP was containerized and deployed to AWS as a live demonstration environment.

## Containerization

- [x] Dockerfile
- [x] Docker image build
- [x] Local container testing
- [x] Frontend and backend packaged together
- [x] Application tested inside Docker

## AWS Deployment

- [x] AWS ECR repository
- [x] Docker image pushed to ECR
- [x] ECS cluster
- [x] ECS task definition
- [x] Fargate deployment
- [x] IAM execution role
- [x] Public application access
- [x] API documentation accessible through deployed application
- [x] Live deployment verification

The AWS deployment provides a live environment for demonstration and testing.

To avoid unnecessary AWS usage, the Fargate service should remain stopped when the application is not being demonstrated or tested.

No additional AWS infrastructure is required for the current MVP.

---

# Phase 6 — Additional Deployment & Hosting

**Status:** Next

The next deployment objective is to host Data Detective on Render in addition to the existing AWS deployment.

## Render Deployment

- [ ] Prepare the Docker deployment for Render
- [ ] Configure the application to use Render's runtime port
- [ ] Deploy the application
- [ ] Verify the frontend
- [ ] Verify `/api/health`
- [ ] Verify `/api/analyze`
- [ ] Test CSV upload and complete analysis workflow
- [ ] Verify Swagger documentation
- [ ] Document the Render deployment

Render will provide an additional hosting environment for the completed MVP.

The deployment should remain consistent with the existing containerized architecture.

---

# Phase 7 — Improvements

**Status:** Planned

After the MVP and deployment work are complete, the focus shifts toward improving the quality, usability, and usefulness of the existing analysis.

## Data Analysis Improvements

- [ ] More sophisticated data-type detection
- [ ] Categorical data detection
- [ ] Better identifier detection
- [ ] Improved high-cardinality detection
- [ ] Outlier detection
- [ ] Additional statistical analysis
- [ ] Additional visualization types

---

## Data Quality Improvements

- [ ] Detect blank values
- [ ] Detect placeholder values
- [ ] Detect common filler values such as `-`
- [ ] Detect dataset-specific missing-value representations
- [ ] Improve quality scoring
- [ ] More detailed data-cleaning recommendations

These features are intentionally deferred until after the MVP.

---

## User Experience Improvements

- [ ] Improved dashboard navigation
- [ ] Better visualization interactions
- [ ] Improved accessibility
- [ ] Better error messages
- [ ] Loading and progress feedback
- [ ] UI performance improvements
- [ ] Enhanced visual polish

---

## Export & Sharing

- [ ] Export analysis report
- [ ] PDF report generation
- [ ] CSV/JSON analysis export
- [ ] Shareable analysis results

---

# Phase 8 — Advanced Features

**Status:** Future

Once the core application is stable, more advanced capabilities can be explored.

## AI-Assisted Analysis

- [ ] AI-generated insights
- [ ] Natural-language dataset explanations
- [ ] AI-assisted recommendations
- [ ] Conversational dataset exploration

---

## Dataset Management

- [ ] User accounts
- [ ] Saved analyses
- [ ] Dataset history
- [ ] Dataset comparison
- [ ] Multiple dataset support

---

## Infrastructure

- [ ] Background processing
- [ ] Database integration
- [ ] Caching
- [ ] Scalable deployment
- [ ] Cloud-based processing

These features are intentionally excluded from the MVP.

---

# Future Ideas

The following ideas may be explored in the future if they align with the project's goals:

- Plugin-based analyzers
- Time-series analysis
- Geospatial data analysis
- Machine-learning-specific analysis
- Automated data-cleaning pipelines
- Collaborative workspaces
- Advanced dataset comparison
- Additional cloud deployment options
- External data-source integrations

These ideas are intentionally kept separate from the active roadmap to avoid distracting from the completed MVP and current deployment work.

---

# Current Milestone

**Current Objective: Deploy and verify the completed MVP on Render**

The Data Detective MVP is complete.

The current application workflow is:

    CSV
     │
     ▼
    Pandas DataFrame
     │
     ▼
    Analysis Engine
     │
     ├── Overview
     ├── Quality
     ├── Findings
     ├── Recommendations
     └── Visualizations
     │
     ▼
    Structured JSON
     │
     ▼
    Frontend Dashboard
     │
     ▼
    User Understanding

The application has also been:

- Containerized with Docker
- Tested locally in Docker
- Pushed to Amazon ECR
- Deployed using Amazon ECS and AWS Fargate
- Verified through the live AWS deployment

The next objective is to deploy the same completed application to Render and verify that the full workflow operates correctly there.

---

# Roadmap Philosophy

Data Detective is developed incrementally.

Each phase should result in a meaningful improvement rather than a partially completed collection of unrelated features.

The MVP prioritizes the complete workflow:

    Upload
       ↓
    Analyze
       ↓
    Understand
       ↓
    Act

The core MVP is now complete.

Future development should focus on improving the existing experience, expanding analysis capabilities, and introducing advanced features only when they provide a clear benefit.

The architecture is intentionally modular so that future capabilities can be added without requiring a complete redesign of the existing system.

Infrastructure should also remain proportional to the project's needs. Additional cloud services should only be introduced when they provide a clear benefit to the application.