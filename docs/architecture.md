# Data Detective Architecture

## Overview

Data Detective follows a **frontend-backend separation** with an **API-first architecture**.

The frontend is responsible for presenting information and handling user interactions, while the backend is responsible for processing datasets and exposing analysis results through REST APIs.

The backend uses a **modular analysis architecture**, where individual analyzers are responsible for specific aspects of dataset analysis. An analysis engine orchestrates these analyzers and combines their results into a single response.

This separation keeps the layers independent and allows individual parts of the application to evolve without tightly coupling implementation details.

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
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
        API Endpoints                Static Files
              │
              ▼
       Analysis Engine
              │
       ┌──────┼──────────┬────────────┬──────────────┐
       ▼      ▼          ▼            ▼              ▼
   Overview Quality  Findings  Recommendations Visualization
   Analyzer Analyzer Analyzer    Analyzer          Analyzer
       │      │          │            │              │
       └──────┴──────────┴────────────┴──────────────┘
                            │
                            ▼
                       JSON Response
                            │
                            ▼
                     Frontend Dashboard
```

---

# Request Flow

## Frontend Request

The frontend is served by the FastAPI application.

```text
Browser
    │
    ▼
GET /
    │
    ▼
FastAPI
    │
    ▼
frontend/index.html
    │
    ├── CSS
    └── JavaScript
```

## Analysis Request

Dataset analysis follows a single API endpoint.

```text
User uploads dataset
        │
        ▼
POST /api/analyze
        │
        ▼
API Route
        │
        ▼
Read uploaded CSV
        │
        ▼
Pandas DataFrame
        │
        ▼
Analysis Engine
        │
        ├── Overview Analyzer
        ├── Quality Analyzer
        ├── Findings Analyzer
        ├── Recommendation Analyzer
        └── Visualization Analyzer
        │
        ▼
Combined Analysis Result
        │
        ▼
JSON Response
        │
        ▼
Frontend Dashboard
```

---

# Backend Architecture

The backend is organized into separate layers:

```text
backend/app/

├── api/
├── analyzers/
├── config/
├── engine/
├── schemas/
├── utils/
└── main.py
```

Each layer has a specific responsibility.

---

## api/

```text
backend/app/api/
```

The API layer contains the application's REST endpoints.

Current API routes include:

```text
GET  /api/health
POST /api/analyze
```

The API layer should remain thin and primarily:

* Receive requests
* Handle uploaded files
* Perform basic request-level validation
* Pass data to the analysis engine
* Return the analysis result

Analysis and business logic should not be implemented directly inside the API routes.

---

## engine/

```text
backend/app/engine/
```

The analysis engine acts as the **orchestrator** for the analysis process.

Its responsibility is to:

* Receive the prepared dataset
* Run the required analyzers
* Pass analyzer results to analyzers that depend on previous results
* Combine the individual results
* Return the final structured analysis

The engine can be thought of as the **conductor of an orchestra** rather than the musician playing every instrument.

The engine coordinates the analyzers, while the analyzers contain the actual analysis logic.

---

## analyzers/

```text
backend/app/analyzers/
```

Each analyzer is responsible for one specific aspect of dataset analysis.

Current analyzers are:

* Overview Analyzer
* Quality Analyzer
* Findings Analyzer
* Recommendation Analyzer
* Visualization Analyzer

---

### Overview Analyzer

The Overview Analyzer provides basic structural information about the dataset.

It currently analyzes:

* Number of rows
* Number of columns
* Column names
* Column data types

Example:

```json
{
    "filename": "apps.csv",
    "rows": 10841,
    "columns": 12,
    "column_names": [
        "App",
        "Category",
        "Rating"
    ],
    "data_types": [
        {
            "column": "Rating",
            "data_type": "float64"
        }
    ]
}
```

The overview information can also be consumed by other analyzers.

For example, the Visualization Analyzer uses the detected data types when deciding what type of visualization may be appropriate for a column.

---

### Quality Analyzer

The Quality Analyzer evaluates the basic quality and completeness of the dataset.

It currently checks:

* Missing values per column
* Missing-value percentage per column
* Duplicate rows
* Dataset memory usage
* Dataset completeness

Dataset completeness represents the percentage of rows containing **no missing values across any column**.

The calculation uses the same general `NaN`-based missing-value logic used by the missing-value analysis.

The frontend should explain this definition to users so that the meaning of the completeness percentage remains transparent.

Example:

```json
{
    "missing_values": [
        {
            "column": "Rating",
            "missing": 1474,
            "percentage": 13.6
        }
    ],
    "duplicated_rows": 483,
    "memory_usage_mb": 60.12,
    "dataset_completeness": 86.39
}
```

---

### Findings Analyzer

The Findings Analyzer converts raw analysis results into human-readable observations about the dataset.

It currently produces findings related to:

* Dataset completeness
* Duplicate rows
* Highest missing-value percentage
* Numeric-column distribution

The analyzer also returns structured data containing the values used to generate these findings.

This allows later analyzers, particularly the Recommendation Analyzer, to reuse calculated information instead of recalculating the same values.

Example:

```json
{
    "insights": [
        "The dataset has moderate completeness, with 86.39% of rows containing no missing values.",
        "483 duplicate rows were detected.",
        "Rating column has the highest missing-value rate at 13.6%.",
        "3 of 12 columns are numeric (25.0%)."
    ],
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

The structured `data` section is intended for internal reuse, while `insights` is intended for presentation to the user.

---

### Recommendation Analyzer

The Recommendation Analyzer uses the results of the quality and findings analysis to generate actionable suggestions.

Current recommendations include suggestions related to:

* Missing values
* Duplicate rows
* Dataset completeness

For example:

```text
Review the 1477 missing values across the dataset,
particularly in the Rating column.

Review the 483 duplicated rows and remove them
if they represent repeated records.
```

Recommendations are intentionally kept separate from findings.

**Findings describe what was detected.**

**Recommendations suggest what the user could consider doing about it.**

This separation allows the recommendation system to become more sophisticated later without changing the underlying quality analysis.

---

### Visualization Analyzer

The Visualization Analyzer determines what types of visualizations may be appropriate for individual columns.

It currently considers:

* Numeric columns
* Non-numeric columns
* Unique-value counts
* Potential identifier columns
* High-cardinality columns

Current visualization decisions include:

| Column characteristic | Suggested visualization |
|---|---|
| Numeric column | Histogram |
| Low-cardinality non-numeric column | Bar chart |
| High-cardinality non-numeric column | High-cardinality indicator |
| Numeric identifier column | Identifier |

Identifier detection currently uses column naming patterns such as `id` or `parent_id`.

The analyzer currently returns visualization metadata rather than generating the actual charts.

This keeps visualization **analysis and recommendation** separate from frontend rendering.

---

## schemas/

```text
backend/app/schemas/
```

Contains Pydantic models for API request and response schemas.

Schemas provide a dedicated location for API validation and response contracts as the project grows.

They are intentionally kept separate from the analysis logic.

---

## config/

```text
backend/app/config/
```

Contains application configuration, constants, and future settings.

Configuration should be moved here when values need to be shared or managed centrally.

---

## utils/

```text
backend/app/utils/
```

Contains helper functions that are genuinely reusable across multiple parts of the backend.

Utility functions should only be placed here when they have a clear shared purpose.

---

# Analyzer Dependencies

Not every analyzer operates independently.

Some analyzers consume the results produced by other analyzers.

The current dependency flow is approximately:

```text
                    DataFrame
                        │
                        ▼
                    Overview
                        │
                        ▼
                     Quality
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
          Findings        Visualization
              │
              ▼
       Recommendations
```

For example:

* Findings uses Overview and Quality results.
* Recommendations uses Quality and Findings results.
* Visualization uses the dataset together with Overview information.

The analysis engine is responsible for coordinating these dependencies.

---

# Single Analysis Endpoint

All analysis functionality is exposed through:

```text
POST /api/analyze
```

The endpoint accepts an uploaded CSV dataset and returns the combined analysis.

The response is structured into analyzer-specific sections:

```json
{
    "overview": {},
    "quality": {},
    "findings": {},
    "recommendations": {},
    "visualizations": {}
}
```

This approach keeps the external API simple while allowing the internal analysis system to remain modular.

New analyzers can be added to the analysis engine without requiring a new public API endpoint for every analyzer.

---

# Frontend Architecture

```text
frontend/

├── assets/
├── components/
├── css/
├── js/
└── index.html
```

The frontend is responsible for presenting analysis results and handling user interaction.

---

## index.html

The main entry point for the frontend application.

It provides the basic page structure and loads the required CSS and JavaScript.

---

## css/

Contains application styling.

```text
frontend/css/
```

The CSS layer controls the visual appearance of the dashboard.

---

## js/

Contains frontend application logic.

```text
frontend/js/
```

The JavaScript layer is responsible for:

* Uploading datasets
* Communicating with the API
* Receiving analysis results
* Updating the interface
* Handling user interactions

---

## components/

Contains reusable frontend components.

```text
frontend/components/
```

This directory may initially remain lightweight.

Reusable components should be introduced when they naturally emerge from the frontend rather than creating abstractions prematurely.

---

## assets/

Contains static frontend resources.

```text
frontend/assets/
```

Current asset categories include:

* Fonts
* Icons
* Images

---

# Data Flow

The complete current analysis flow can be represented as:

```text
CSV Upload
    │
    ▼
FastAPI /api/analyze
    │
    ▼
Pandas DataFrame
    │
    ▼
Analysis Engine
    │
    ├──────────────────────┐
    ▼                      ▼
Overview                Quality
    │                      │
    └──────────┬───────────┘
               ▼
           Findings
               │
        ┌──────┴───────┐
        ▼              ▼
Recommendations   Visualizations
        │              │
        └──────┬───────┘
               ▼
        Combined JSON
               │
               ▼
       Frontend Dashboard
```

---

# API Design Principles

All backend API endpoints are grouped under:

```text
/api
```

Current endpoints:

```text
GET  /api/health
POST /api/analyze
```

Keeping API endpoints under `/api` provides a clear boundary between backend API functionality and frontend resources.

---

# Design Principles

## 1. Single Responsibility

Each module and analyzer should have one clear purpose.

For example:

* Quality analyzes dataset quality.
* Findings interprets analysis results.
* Recommendations suggests possible actions.
* Visualization determines suitable visualization types.

---

## 2. Separation of Concerns

Frontend, API, engine, and analyzer responsibilities remain separate.

The frontend should not perform backend analysis, and the API layer should not contain the actual analysis logic.

---

## 3. API First

The backend should be usable by clients other than the current frontend.

Potential future clients may include:

* React applications
* Mobile applications
* External integrations
* Other data-analysis interfaces

---

## 4. Modular Analysis

Each analyzer should focus on one aspect of dataset analysis.

New analysis capabilities should preferably be introduced as new modules rather than making one analyzer increasingly large.

This allows Data Detective to grow incrementally.

---

## 5. Reuse Calculated Results

When an analyzer has already calculated information that another analyzer needs, the existing result should be reused instead of duplicating the calculation.

For example:

```text
Quality
   │
   ▼
Findings
   │
   ▼
Recommendations
```

Findings can expose structured data that Recommendations can consume directly.

This reduces duplicated logic and keeps calculations centralized.

---

## 6. Keep It Simple

Avoid introducing additional abstractions until they solve a real problem.

Folders, classes, utilities, and abstractions should exist because they are needed, not simply because they are common in project templates.

---

## 7. Presentation and Analysis Should Remain Separate

Analyzers should provide structured analysis results and metadata.

The frontend should be responsible for deciding how those results are presented visually.

For example, the Visualization Analyzer can determine:

```text
Rating → histogram
Category → bar chart
id → identifier
```

while the frontend is responsible for actually rendering the corresponding visualization.

---

# Current MVP Scope

The current architecture is intentionally focused on the MVP.

The primary goal is to provide a structured analysis of an uploaded CSV dataset through a single API request.

Current analysis capabilities include:

* Dataset overview
* Data quality analysis
* Human-readable findings
* Basic recommendations
* Visualization suggestions

More advanced functionality is intentionally deferred until the core workflow is stable.

---

# Future Architecture

The architecture is designed to support future improvements without requiring a complete redesign.

Possible future enhancements include:

* More advanced data-quality detection
* Categorical and semantic data-type detection
* More sophisticated visualization selection
* Statistical analysis
* Outlier detection
* Data cleaning recommendations
* Report generation
* Database integration
* User authentication
* Background task processing
* AI-powered insights

These features should be added incrementally as independent modules or extensions where appropriate.

The modular analyzer architecture makes it possible to introduce these capabilities without changing the fundamental API structure.

---

# Summary

Data Detective is built around a lightweight, modular architecture that separates:

```text
Frontend
    │
    ▼
API
    │
    ▼
Analysis Engine
    │
    ▼
Individual Analyzers
```

The API provides a simple entry point for dataset analysis, while the analysis engine coordinates specialized analyzers.

The current architecture prioritizes:

* Clarity
* Separation of concerns
* Modularity
* Reusability
* Incremental development
* Simplicity

The goal is to build a system that is useful in its current MVP form while leaving enough structure for more advanced data-analysis capabilities to be added later.