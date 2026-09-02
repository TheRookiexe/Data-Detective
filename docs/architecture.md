# Data Detective Architecture

## Overview

Data Detective follows a **frontend-backend separation** with an **API-first architecture**.

The frontend is responsible for presenting information and handling user interactions, while the backend is responsible for processing datasets and exposing analysis results through REST APIs.

The backend uses a **modular analysis architecture**, where individual analyzers are responsible for specific aspects of dataset analysis. An analysis engine orchestrates these analyzers and combines their results into a single response.

This separation keeps the layers independent and allows individual parts of the application to evolve without tightly coupling their implementation details.

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
              │                           │
              ▼                           │
       Analysis Engine                    │
              │                           │
      ┌───────┼────────────┬──────────────┼──────────────┐
      ▼       ▼            ▼              ▼              ▼
   Overview Quality    Findings   Recommendations  Visualization
   Analyzer Analyzer   Analyzer      Analyzer         Analyzer
      │       │            │              │              │
      └───────┴────────────┴──────────────┴──────────────┘
                              │
                              ▼
                       Combined JSON
                              │
                              ▼
                     Frontend Dashboard
```

The backend serves both the frontend application and the REST API.

The analysis engine coordinates the individual analyzers and produces a combined response for the frontend.

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

The FastAPI application serves the frontend files while also exposing the backend API.

---

## Analysis Request

Dataset analysis follows a single API endpoint:

```text
User selects CSV
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

The API route is responsible for receiving the uploaded file and preparing the DataFrame.

The analysis engine then coordinates the analysis process.

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

- Receive requests
- Handle uploaded files
- Pass prepared data to the analysis engine
- Return the analysis result

The actual analysis logic should remain inside the analysis engine and analyzers rather than being implemented directly inside the API routes.

---

## engine/

```text
backend/app/engine/
```

The analysis engine acts as the **orchestrator** for the analysis process.

Its responsibility is to:

- Receive the prepared dataset
- Run the required analyzers
- Pass analyzer results to analyzers that depend on previous results
- Combine the individual results
- Return the final structured analysis

The engine can be thought of as the **conductor of an orchestra** rather than the musician playing every instrument.

The engine coordinates the analyzers, while the analyzers contain the actual analysis logic.

---

## analyzers/

```text
backend/app/analyzers/
```

Each analyzer is responsible for one specific aspect of dataset analysis.

Current analyzers are:

- Overview Analyzer
- Quality Analyzer
- Findings Analyzer
- Recommendation Analyzer
- Visualization Analyzer

---

### Overview Analyzer

The Overview Analyzer provides basic structural information about the dataset.

It currently analyzes:

- Number of rows
- Number of columns
- Column names
- Column data types

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

The overview information can also be consumed by other analyzers when required.

For example, visualization analysis can use detected data types when deciding what type of visualization may be appropriate for a column.

---

### Quality Analyzer

The Quality Analyzer evaluates the basic quality and completeness of the dataset.

It currently checks:

- Missing values per column
- Missing-value percentage per column
- Duplicate rows
- Dataset memory usage
- Dataset completeness

Dataset completeness represents the percentage of rows containing **no missing values across any column**.

For example:

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

The completeness metric is calculated from the dataset's missing-value information and should be clearly explained to users.

---

### Findings Analyzer

The Findings Analyzer converts analysis results into human-readable observations about the dataset.

It currently produces findings related to:

- Dataset completeness
- Duplicate rows
- Highest missing-value percentage
- Numeric-column distribution

The analyzer also returns structured data containing the values used to generate these findings.

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

The structured `data` section is intended for reuse by other parts of the analysis pipeline, while `insights` contains user-facing observations.

This avoids unnecessary recalculation of values that have already been determined by earlier analysis.

---

### Recommendation Analyzer

The Recommendation Analyzer uses the results of the quality and findings analysis to generate actionable suggestions.

Current recommendations include suggestions related to:

- Missing values
- Duplicate rows
- Dataset completeness

For example:

```text
Review the missing values across the dataset,
particularly in the Rating column.

Review the duplicated rows and remove them
if they represent repeated records.
```

Recommendations are intentionally kept separate from findings.

**Findings describe what was detected.**

**Recommendations suggest what the user could consider doing about it.**

The analyzer does not automatically modify or clean the dataset.

---

### Visualization Analyzer

The Visualization Analyzer determines what types of visualizations may be appropriate for individual columns.

It currently considers:

- Numeric columns
- Non-numeric columns
- Unique-value counts
- Potential identifier columns
- High-cardinality columns

Current visualization decisions include:

| Column characteristic | Suggested visualization |
|---|---|
| Numeric column | Histogram |
| Low-cardinality non-numeric column | Bar chart |
| High-cardinality non-numeric column | High-cardinality indicator |
| Numeric identifier column | Identifier |

Identifier detection currently uses column naming patterns such as `id` or `parent_id`.

The analyzer returns visualization metadata rather than generating the actual charts.

The frontend is responsible for rendering visualizations based on this metadata.

---

## schemas/

```text
backend/app/schemas/
```

Contains Pydantic models used for API schemas and structured data contracts.

Schemas provide a dedicated location for request and response models as the project grows.

They are kept separate from the analysis logic.

---

## config/

```text
backend/app/config/
```

Contains application configuration, constants, and related settings.

Configuration values that need to be shared or managed centrally can be placed here.

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

Some analyzers consume results produced by other analyzers.

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
                   ┌────────┴────────┐
                   ▼                 ▼
                Findings      Visualization
                   │
                   ▼
             Recommendations
```

Examples:

- Findings uses information from Overview and Quality.
- Recommendations uses information from Quality and Findings.
- Visualization uses the dataset together with available structural information.

The analysis engine is responsible for coordinating these dependencies.

---

# Single Analysis Endpoint

All dataset analysis functionality is exposed through:

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

This keeps the external API simple while allowing the internal analysis system to remain modular.

New analyzers can be added to the analysis engine without requiring a new public API endpoint for every analyzer.

---

# Frontend Architecture

The frontend is organized separately from the backend:

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

```text
frontend/css/
```

Contains application styling.

The CSS layer controls the visual appearance of the Data Detective dashboard.

---

## js/

```text
frontend/js/
```

Contains frontend application logic.

The JavaScript layer is responsible for:

- Handling dataset selection
- Uploading datasets to the API
- Receiving analysis results
- Updating the interface
- Handling user interactions

---

## components/

```text
frontend/components/
```

Contains reusable frontend components where applicable.

This directory should remain lightweight and should only gain additional abstractions when they provide a clear benefit.

---

## assets/

```text
frontend/assets/
```

Contains static frontend resources such as:

- Fonts
- Icons
- Images

---

# Data Flow

The complete analysis flow can be represented as:

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
    ├───────────────┐
    ▼               ▼
 Overview         Quality
    │               │
    └───────┬───────┘
            ▼
         Findings
            │
       ┌────┴─────┐
       ▼          ▼
Recommendations  Visualizations
       │          │
       └────┬─────┘
            ▼
     Combined JSON
            │
            ▼
    Frontend Dashboard
```

The analysis engine keeps the individual analysis responsibilities separate while producing one structured response for the frontend.

---

# API Boundary

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

# Deployment Architecture

The application is containerized using Docker.

The current AWS deployment follows this structure:

```text
Data Detective Application
          │
          ▼
        Docker
          │
          ▼
   Amazon ECR Repository
          │
          ▼
     Amazon ECS
          │
          ▼
      AWS Fargate
          │
          ▼
   Running Application
```

The same Docker image can be used for local testing and deployment.

The current deployment uses ECS with Fargate and does not require a separate backend server installation.

---

# Design Principles

## 1. Single Responsibility

Each module and analyzer should have one clear purpose.

For example:

- Quality analyzes dataset quality.
- Findings interprets analysis results.
- Recommendations suggests possible actions.
- Visualization determines suitable visualization types.

---

## 2. Separation of Concerns

Frontend, API, engine, and analyzer responsibilities remain separate.

The frontend should not perform backend analysis, and the API layer should not contain the actual analysis logic.

---

## 3. API First

The backend exposes its functionality through a defined API rather than tightly coupling analysis logic to the current frontend.

This makes it possible for other clients to consume the backend in the future.

Potential future clients could include:

- React applications
- Mobile applications
- External integrations
- Other data-analysis interfaces

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

## 7. Keep Analysis and Presentation Separate

Analyzers should provide structured analysis results and visualization metadata.

The frontend should decide how those results are presented to the user.

For example:

```text
Rating    → histogram
Category  → bar chart
id        → identifier
```

The Visualization Analyzer determines the appropriate classification, while the frontend is responsible for rendering the visualization.

---

# Current MVP Scope

The current architecture is intentionally focused on the MVP.

The primary goal is to provide a structured analysis of an uploaded CSV dataset through a single API request.

Current analysis capabilities include:

- Dataset overview
- Data quality analysis
- Human-readable findings
- Basic recommendations
- Visualization suggestions

More advanced functionality is intentionally deferred until the core workflow is stable.

---

# Future Architecture

The architecture is designed to support future improvements without requiring a complete redesign.

Possible future enhancements include:

- More advanced data-quality detection
- Categorical and semantic data-type detection
- More sophisticated visualization selection
- Statistical analysis
- Outlier detection
- Data cleaning recommendations
- Report generation
- Database integration
- User authentication
- Background task processing
- AI-powered insights

These features should be added incrementally as independent modules or extensions where appropriate.

The modular analyzer architecture makes it possible to introduce new capabilities without changing the fundamental API structure.

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

- Clarity
- Separation of concerns
- Modularity
- Reusability
- Incremental development
- Simplicity

The goal is to provide a useful MVP while maintaining enough structure for more advanced data-analysis capabilities to be added later.