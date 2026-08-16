# Data Detective API Documentation

This document describes the REST API exposed by the Data Detective backend.

The application follows an **API-first architecture**, where backend functionality is exposed through HTTP endpoints under the `/api` namespace.

---

# Base URL

During development:

```text
http://127.0.0.1:8000
```

API namespace:

```text
http://127.0.0.1:8000/api
```

---

# API Design Principles

The API follows these principles:

* REST-style endpoints
* JSON responses
* Stateless communication
* Clear separation between frontend and backend
* Thin API layer
* Modular analysis through the analysis engine
* Consistent structured responses

---

# Endpoints

## Health Check

### Request

```http
GET /api/health
```

### Description

Returns the current health status of the backend service.

This endpoint is useful for:

* Verifying that the server is running
* Development testing
* Frontend health checks
* Future deployment health checks

---

### Response

**Status Code**

```text
200 OK
```

**Response Body**

```json
{
    "status": "healthy",
    "service": "Data Detective API"
}
```

---

# Analyze Dataset

### Request

```http
POST /api/analyze
```

### Description

Accepts a CSV dataset, loads it into a Pandas DataFrame, runs the analysis pipeline, and returns a structured analysis response.

The endpoint acts as the primary entry point for dataset analysis.

---

## Request

The endpoint accepts the dataset as a multipart form-data file.

Example:

```text
Content-Type: multipart/form-data
```

The uploaded file is provided through the `file` field.

### Example using cURL

```bash
curl -X POST "http://127.0.0.1:8000/api/analyze" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@dataset.csv"
```

---

# Analysis Pipeline

The `/api/analyze` endpoint passes the dataset through the analysis engine.

```text
Uploaded CSV
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
Combined JSON Response
```

The analysis engine is responsible for coordinating the individual analyzers and combining their results.

---

# Response Structure

A successful analysis response is structured into five major sections:

```json
{
    "overview": {},
    "quality": {},
    "findings": {},
    "recommendations": {},
    "visualizations": {}
}
```

Each section represents one analyzer.

---

# Overview

The Overview Analyzer provides basic information about the dataset.

### Example

```json
{
    "overview": {
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
                "column": "App",
                "data_type": "str"
            },
            {
                "column": "Rating",
                "data_type": "float64"
            }
        ]
    }
}
```

### Current information

The Overview Analyzer provides:

* Filename
* Number of rows
* Number of columns
* Column names
* Basic Pandas data types

---

# Quality

The Quality Analyzer evaluates basic dataset quality.

### Example

```json
{
    "quality": {
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
}
```

### Current information

The Quality Analyzer provides:

* Missing-value count per column
* Missing-value percentage per column
* Duplicate-row count
* Dataset memory usage
* Dataset completeness

### Dataset Completeness

Dataset completeness represents the percentage of rows containing **no missing values**.

For example:

```text
Dataset completeness: 86.39%
```

means that 86.39% of the dataset's rows contain no missing values across their columns.

The frontend should make this definition visible to users to maintain transparency about how the metric is calculated.

---

# Findings

The Findings Analyzer converts analysis results into human-readable observations.

### Example

```json
{
    "findings": {
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
}
```

The `insights` array is intended for user-facing information.

The `data` object contains structured values that can be reused by downstream analyzers and the frontend.

This avoids unnecessary recalculation of information that has already been determined by the analysis pipeline.

---

# Recommendations

The Recommendation Analyzer uses information from the Quality Analyzer and Findings Analyzer to provide actionable suggestions.

### Example

```json
{
    "recommendations": {
        "suggestions": [
            "Review the 1477 missing values across the dataset, particularly in the Rating column.",
            "Review the 483 duplicated rows and remove them if they represent repeated records."
        ]
    }
}
```

Recommendations currently focus on:

* Missing values
* Duplicate rows
* Dataset completeness

The analyzer does not automatically modify or clean the dataset.

Its purpose is to inform the user about potential actions they may want to take.

---

# Visualizations

The Visualization Analyzer determines what type of visualization may be appropriate for individual columns.

It currently provides visualization metadata rather than rendering charts itself.

### Example

```json
{
    "visualizations": {
        "numeric_columns": [
            "BTC_NEWS_SEARCH"
        ],
        "non_numeric_columns": [
            "MONTH"
        ],
        "vis": [
            {
                "column": "MONTH",
                "unique_values": 12,
                "type": "bar"
            },
            {
                "column": "BTC_NEWS_SEARCH",
                "unique_values": 120,
                "type": "histogram"
            }
        ]
    }
}
```

### Current visualization classifications

The analyzer can currently identify:

* Histograms for numeric columns
* Bar charts for low-cardinality non-numeric columns
* High-cardinality columns
* Identifier columns

The frontend is responsible for turning this metadata into actual visualizations.

---

# Complete Response Example

A complete analysis response follows this structure:

```json
{
    "overview": {
        "filename": "apps.csv",
        "rows": 10841,
        "columns": 12,
        "column_names": [],
        "data_types": []
    },
    "quality": {
        "missing_values": [],
        "duplicated_rows": 483,
        "memory_usage_mb": 60.12,
        "dataset_completeness": 86.39
    },
    "findings": {
        "insights": [],
        "data": {}
    },
    "recommendations": {
        "suggestions": []
    },
    "visualizations": {
        "numeric_columns": [],
        "non_numeric_columns": [],
        "vis": []
    }
}
```

The exact contents depend on the uploaded dataset.

---

# Error Handling

Error handling will be expanded as file validation and frontend integration are developed.

The API should return appropriate HTTP status codes and meaningful error messages for cases such as:

* Invalid file types
* Missing upload files
* Empty datasets
* Malformed CSV files
* Dataset processing failures

The exact error response structure may evolve as the API matures.

---

# Interactive Documentation

FastAPI automatically generates interactive API documentation.

## Swagger UI

```text
http://127.0.0.1:8000/docs
```

Swagger UI allows developers to:

* Explore endpoints
* Upload datasets
* Execute requests
* Inspect request parameters
* Inspect responses
* Test the analysis pipeline

---

## ReDoc

```text
http://127.0.0.1:8000/redoc
```

ReDoc provides a documentation-focused view of the API.

---

# Authentication

Authentication is **not implemented** in the MVP.

The current application is intended for local development and analysis.

Authentication and authorization may be introduced in future versions if features such as user accounts, saved analyses, or cloud deployment are added.

---

# API Versioning

The current API is an early development version.

```text
API Version: v0.1.0
```

A formal versioning strategy will be introduced if and when the API becomes externally consumed.

---

# Current API Surface

The current backend exposes:

```text
GET  /api/health
POST /api/analyze
```

The `/api/analyze` endpoint is the primary application endpoint.

---

# Future API Expansion

Potential future endpoints may include:

```text
GET  /api/version
GET  /api/report/{id}
POST /api/export
GET  /api/history
```

These are future possibilities rather than currently implemented endpoints.

They should only be introduced when the corresponding application features are actually required.

---

# Summary

The Data Detective API provides a lightweight interface between the frontend and the modular backend analysis system.

The current workflow is:

```text
CSV Upload
     │
     ▼
POST /api/analyze
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
Frontend
```

The API is intentionally kept simple during the MVP phase.

The primary goal is to provide a stable interface for the frontend while allowing the analysis engine and individual analyzers to evolve independently.