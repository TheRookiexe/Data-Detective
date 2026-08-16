# Data Detective Roadmap

This roadmap outlines the planned evolution of Data Detective.

The project follows an **MVP-first** approach, focusing on delivering a complete and useful product before expanding into more advanced features.

---

# Guiding Principles

* Build one complete feature at a time.
* Keep the architecture simple.
* Prioritize usability over feature count.
* Avoid premature optimization.
* Refactor when there is a clear benefit.
* Keep advanced features outside the MVP until the core workflow is stable.
* Prefer modular improvements that can be added without redesigning the existing architecture.

---

# Phase 1 — Foundation ✅

**Status:** Completed

## Goals

* [x] Project planning
* [x] Repository structure
* [x] FastAPI setup
* [x] Frontend setup
* [x] API-first architecture
* [x] Static frontend integration
* [x] Health endpoint
* [x] Analysis engine structure
* [x] Initial project documentation
* [x] Architecture documentation
* [x] Architecture decision records

---

# Phase 2 — Backend Analysis MVP 🚧

**Status:** Analysis pipeline completed; frontend integration in progress

The backend analysis pipeline is the core of the Data Detective MVP.

The goal is to accept a CSV dataset, analyze it through the modular analysis engine, and return a structured result through a single API endpoint.

---

## Dataset Upload & Processing

* [x] CSV dataset loading
* [x] Pandas DataFrame integration
* [x] Dataset passed through the analysis engine
* [ ] File validation
* [ ] Improved error handling for invalid files
* [ ] File-size validation

---

## Analysis Engine

* [x] Central analysis engine
* [x] Single `/api/analyze` endpoint
* [x] Analyzer orchestration
* [x] Combined JSON response

---

## Overview Analyzer

* [x] Filename detection
* [x] Row count
* [x] Column count
* [x] Column names
* [x] Basic column data types

---

## Quality Analyzer

* [x] Missing-value detection
* [x] Missing-value percentage per column
* [x] Duplicate-row detection
* [x] Dataset memory usage
* [x] Dataset completeness calculation
* [x] Structured quality output

Dataset completeness currently represents the percentage of rows containing no missing values across the dataset.

The frontend should explain this definition when displaying the metric.

---

## Findings Analyzer

* [x] Dataset completeness finding
* [x] Duplicate-row finding
* [x] Highest missing-value finding
* [x] Numeric-column distribution
* [x] Human-readable insights
* [x] Structured findings data for downstream analyzers

The structured findings data allows other analyzers to reuse calculated information instead of performing the same calculations again.

---

## Recommendation Analyzer

* [x] Missing-value recommendations
* [x] Duplicate-row recommendations
* [x] Dataset-completeness recommendations
* [x] Recommendation threshold logic
* [x] Findings data reuse

Recommendations currently focus on identifying issues and suggesting that the user review them rather than automatically modifying the dataset.

---

## Visualization Analyzer

* [x] Numeric-column detection
* [x] Non-numeric-column detection
* [x] Unique-value counting
* [x] Histogram suggestions
* [x] Bar-chart suggestions
* [x] High-cardinality detection
* [x] Basic identifier detection
* [x] Structured visualization metadata

The Visualization Analyzer currently determines what visualization may be appropriate rather than rendering the visualization itself.

---

# Phase 3 — Frontend MVP 🚧

**Status:** In Progress

The next major milestone is connecting the completed analysis pipeline to the frontend and turning the backend output into a usable dashboard.

---

## Upload Experience

* [ ] Dataset upload interface
* [ ] Upload dialog
* [ ] File validation feedback
* [ ] Loading state
* [ ] Error state
* [ ] Successful upload state

---

## Dashboard

* [ ] Dataset summary section
* [ ] Overview section
* [ ] Data quality section
* [ ] Findings section
* [ ] Recommendations section
* [ ] Visualizations section
* [ ] Scrollable dashboard
* [ ] Left navigation/sidebar
* [ ] Interactive sections

---

## Visualization Rendering

* [ ] Render histogram suggestions
* [ ] Render bar-chart suggestions
* [ ] Handle high-cardinality columns appropriately
* [ ] Display identifier columns without misleading charts
* [ ] Connect visualization metadata from the backend to frontend rendering

---

## Frontend Integration

* [ ] Connect upload form to `/api/analyze`
* [ ] Parse analysis response
* [ ] Display structured analyzer results
* [ ] Display dataset completeness explanation
* [ ] Display findings and recommendations
* [ ] Handle API errors gracefully

---

## Responsive UI

* [ ] Desktop layout
* [ ] Tablet layout
* [ ] Mobile layout
* [ ] Accessibility improvements
* [ ] UI polish

---

# Phase 4 — MVP Completion

**Status:** Planned

The objective of this phase is to complete the first usable end-to-end version of Data Detective.

The target workflow is:

```text
Upload CSV
      │
      ▼
Validate File
      │
      ▼
Read Dataset
      │
      ▼
Run Analysis Engine
      │
      ├── Overview
      ├── Quality
      ├── Findings
      ├── Recommendations
      └── Visualizations
      │
      ▼
Return Structured JSON
      │
      ▼
Frontend Dashboard
      │
      ▼
User Understands Their Dataset
```

## MVP Completion Checklist

* [ ] Upload a CSV dataset
* [ ] Validate the uploaded file
* [ ] Analyze the dataset
* [ ] Display overview information
* [ ] Display data-quality information
* [ ] Display human-readable findings
* [ ] Display recommendations
* [ ] Display appropriate visualizations
* [ ] Handle errors gracefully
* [ ] Provide a usable responsive interface
* [ ] Finalize MVP documentation

---

# Phase 5 — Improvements

**Status:** Planned

After the MVP is complete, the focus shifts toward improving the quality, usability, and usefulness of the existing analysis.

## Data Analysis Improvements

* [ ] More sophisticated data-type detection
* [ ] Categorical data detection
* [ ] Better identifier detection
* [ ] Improved high-cardinality detection
* [ ] Outlier detection
* [ ] Additional statistical analysis
* [ ] Additional visualization types

---

## Data Quality Improvements

* [ ] Detect blank values
* [ ] Detect placeholder values
* [ ] Detect common filler values such as `-`
* [ ] Detect dataset-specific missing-value representations
* [ ] Improve quality scoring
* [ ] More detailed data-cleaning recommendations

These features are intentionally deferred until after the MVP.

---

## User Experience Improvements

* [ ] Improved dashboard navigation
* [ ] Better visualization interactions
* [ ] Improved accessibility
* [ ] Better error messages
* [ ] Loading and progress feedback
* [ ] UI performance improvements
* [ ] Enhanced visual polish

---

## Export & Sharing

* [ ] Export analysis report
* [ ] PDF report generation
* [ ] CSV/JSON analysis export
* [ ] Shareable analysis results

---

# Phase 6 — Advanced Features

**Status:** Future

Once the core application is stable, more advanced capabilities can be explored.

## AI-Assisted Analysis

* [ ] AI-generated insights
* [ ] Natural-language dataset explanations
* [ ] AI-assisted recommendations
* [ ] Conversational dataset exploration

---

## Dataset Management

* [ ] User accounts
* [ ] Saved analyses
* [ ] Dataset history
* [ ] Dataset comparison
* [ ] Multiple dataset support

---

## Infrastructure

* [ ] Background processing
* [ ] Database integration
* [ ] Caching
* [ ] Scalable deployment
* [ ] Cloud-based processing

These features are intentionally excluded from the MVP.

---

# Future Ideas

The following ideas may be explored in the future if they align with the project's goals:

* Plugin-based analyzers
* Time-series analysis
* Geospatial data analysis
* Machine-learning-specific analysis
* Automated data-cleaning pipelines
* Collaborative workspaces
* Advanced dataset comparison
* Cloud deployment
* External data-source integrations

These ideas are intentionally kept separate from the active roadmap to avoid distracting from the MVP.

---

# Current Milestone

**Current Objective: Complete the Frontend MVP**

The backend analysis pipeline is now established:

```text
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
```

The next milestone is to turn this backend output into the actual user-facing Data Detective experience:

```text
Structured JSON
      │
      ▼
Frontend
      │
      ├── Summary
      ├── Quality
      ├── Findings
      ├── Recommendations
      └── Visualizations
      │
      ▼
User Understanding
```

---

# Roadmap Philosophy

Data Detective is developed incrementally.

Each phase should result in a meaningful improvement rather than a partially completed collection of unrelated features.

The MVP prioritizes the complete workflow:

```text
Upload
   ↓
Analyze
   ↓
Understand
   ↓
Act
```

Advanced functionality should only be introduced once the core workflow is stable and useful.

The architecture is intentionally modular so that future capabilities can be added without requiring a complete redesign of the existing system.