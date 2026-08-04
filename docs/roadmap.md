# Data Detective Roadmap

This roadmap outlines the planned evolution of Data Detective.

The project follows an **MVP-first** approach, focusing on delivering a functional product before expanding features.

---

# Guiding Principles

* Build one complete feature at a time.
* Keep the architecture simple.
* Prioritize usability over feature count.
* Avoid premature optimization.
* Refactor only when necessary.

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
* [x] Initial project documentation

---

# Phase 2 — MVP 🚧

**Status:** In Progress

The objective of this phase is to create the first fully working version of Data Detective.

## Upload Pipeline

* [ ] CSV file upload
* [ ] File validation
* [ ] Dataset loading using Pandas

---

## Analysis Engine

* [ ] Overview Analyzer
* [ ] Data Quality Analyzer
* [ ] Findings Analyzer
* [ ] Recommendation Analyzer
* [ ] Visualization Analyzer

---

## Dashboard

* [ ] Summary page
* [ ] Scrollable dashboard
* [ ] Left navigation sidebar
* [ ] Interactive sections

---

## Frontend

* [ ] Upload dialog
* [ ] Loading state
* [ ] Error handling
* [ ] Responsive layout

---

# Phase 3 — Improvements

After the MVP is complete, the focus shifts toward improving the overall user experience.

## Planned Features

* [ ] Additional visualizations
* [ ] Report export
* [ ] Better filtering
* [ ] Performance improvements
* [ ] Improved accessibility
* [ ] Enhanced UI polish

---

# Phase 4 — Advanced Features

Once the application has matured, more advanced capabilities can be explored.

## Potential Features

* [ ] AI-generated insights
* [ ] Natural language explanations
* [ ] Conversational dataset exploration
* [ ] User accounts
* [ ] Saved analyses
* [ ] Background processing
* [ ] Database support

These features are intentionally excluded from the MVP to maintain focus on the core experience.

---

# Current Milestone

**Current Objective**

Build a complete end-to-end analysis pipeline.

```text
Upload CSV
      │
      ▼
Read Dataset
      │
      ▼
Run Analysis Engine
      │
      ▼
Return JSON
      │
      ▼
Display Summary Dashboard
```

Achieving this milestone will establish the foundation upon which all future analyzers and visualizations will be built.

---

# Future Ideas

The following ideas may be explored in the future if they align with the project's goals.

* Plugin-based analyzers
* Multiple dataset support
* Time-series analysis
* Geospatial data analysis
* Machine learning insights
* Dataset comparison
* Collaborative workspaces
* Cloud deployment

These ideas are intentionally kept separate from the roadmap to avoid distracting from the MVP.

---

# Roadmap Philosophy

Data Detective is developed incrementally.

Every phase should result in a usable improvement rather than a partially completed collection of features.

The primary objective is to maintain a stable, maintainable codebase while continuously increasing the value delivered to users.
