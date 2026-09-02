# Data Detective API Documentation

This document describes the REST API exposed by the Data Detective backend.

Data Detective follows an **API-first architecture**, where backend functionality is exposed through HTTP endpoints under the `/api` namespace.

The API provides a simple interface between the frontend and the modular analysis engine.

---

# Base URL

## Local Development

When running the backend locally:

```text
http://127.0.0.1:8000
```

API namespace:

```text
http://127.0.0.1:8000/api
```

## AWS Deployment

The application can also be run as a Docker container on **AWS ECS with AWS Fargate**.

The deployed base URL depends on the public IP assigned to the running Fargate task:

```text
http://<PUBLIC_IP>:8000
```

API namespace:

```text
http://<PUBLIC_IP>:8000/api
```

The public IP can change when the Fargate task is stopped and started again.

---

# API Design Principles

The API follows these principles:

- REST-style endpoints
- JSON responses
- Stateless communication
- Clear separation between frontend and backend
- Thin API layer
- Modular analysis through the analysis engine
- Consistent structured responses
- Single analysis entry point for dataset processing

The API layer is intentionally kept lightweight. It handles the HTTP request and passes the dataset to the analysis engine rather than containing the analysis logic itself.

---

# Endpoints

The current API exposes two endpoints:

```text
GET  /api/health
POST /api/analyze
```

---

# Health Check

## Request

```http
GET /api/health
```

## Description

Returns the current health status of the backend service.

This endpoint is useful for:

- Verifying that the backend is running
- Development testing
- Checking a deployed application
- Frontend health checks
- Basic deployment verification

---

## Response

### Status Code

```text
200 OK
```

### Response Body

```json
{
    "status": "healthy",
    "service": "Data Detective API"
}
```

---

# Analyze Dataset

## Request

```http
POST /api/analyze
```

## Description

Accepts a CSV dataset, loads it into a Pandas DataFrame, runs the Data Detective analysis pipeline, and returns a structured JSON response.

This is the primary application endpoint.

The endpoint itself does not perform the individual analysis operations. Instead, it passes the loaded DataFrame to the analysis engine, which coordinates the modular analyzers.

---

# Request Format

The endpoint accepts the dataset as a multipart form-data file.

```text
Content-Type: multipart/form-data
```

The uploaded dataset must be provided through the `file` field.

## Example using cURL

```bash
curl -X POST "http://127.0.0.1:8000/api/analyze" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@dataset.csv"
```

For a deployed instance, replace the local base URL with the public address of the running application.

---

# Analysis Pipeline

The `/api/analyze` endpoint follows this workflow:

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

The analysis engine is responsible for coordinating the individual analyzers and combining their results into a single response.

This structure allows individual analyzers to evolve independently without requiring major changes to the API layer.

---

# Response Structure

A successful analysis response contains five major sections:

```json
{
    "overview": {},
    "quality": {},
    "findings": {},
    "recommendations": {},
    "visualizations": {}
}
```

Each section represents the output of a corresponding analyzer.

The exact values depend on the uploaded dataset.

---

# Overview

The Overview Analyzer provides basic information about the uploaded dataset.

## Example

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

## Current Information

The Overview Analyzer provides:

- Filename
- Number of rows
- Number of columns
- Column names
- Basic Pandas data types

---

# Quality

The Quality Analyzer evaluates basic dataset quality characteristics.

## Example

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

## Current Information

The Quality Analyzer provides:

- Missing-value count per column
- Missing-value percentage per column
- Duplicate-row count
- Dataset memory usage
- Dataset completeness

## Dataset Completeness

Dataset completeness represents the percentage of rows containing **no missing values**.

For example:

```text
Dataset completeness: 86.39%
```

means that 86.39% of the dataset's rows contain no missing values across their columns.

This definition should be communicated clearly to users so that the metric is transparent.

---

# Findings

The Findings Analyzer converts information from the analysis results into human-readable observations.

## Example

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

The `insights` array contains human-readable observations intended for presentation to users.

The `data` object contains structured values used by the analysis pipeline and frontend.

Keeping these values structured allows downstream components to reuse information without unnecessarily recalculating it.

---

# Recommendations

The Recommendation Analyzer uses information from the dataset quality and findings analysis to provide actionable suggestions.

## Example

```json
{
    "recommendations": {
        "suggestions": [
            "Review the missing values across the dataset, particularly in the Rating column.",
            "Review the duplicated rows and remove them if they represent repeated records."
        ]
    }
}
```

## Current Focus

Recommendations currently focus on:

- Missing values
- Duplicate rows
- Dataset completeness

The analyzer does **not** automatically modify or clean the dataset.

Its purpose is to inform the user about potential actions they may want to take.

---

# Visualizations

The Visualization Analyzer determines what type of visualization may be appropriate for individual columns.

It currently provides visualization metadata rather than rendering charts itself.

## Example

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

## Current Visualization Classifications

The analyzer can currently identify:

- Histograms for numeric columns
- Bar charts for low-cardinality non-numeric columns
- High-cardinality columns
- Identifier columns

The Visualization Analyzer only determines the appropriate visualization metadata.

Actual chart rendering is handled by the frontend.

---

# Complete Response Example

A complete analysis response follows this general structure:

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

The current API is primarily designed around the successful CSV analysis workflow.

File validation and more detailed error handling can be expanded as the application evolves.

Potential error cases include:

- Missing upload files
- Invalid file types
- Empty datasets
- Malformed CSV files
- Dataset processing failures

The exact error response structure may evolve as the API matures.

---

# Interactive API Documentation

FastAPI automatically generates interactive API documentation for the application.

## Swagger UI

Local development:

```text
http://127.0.0.1:8000/docs
```

For a deployed application:

```text
http://<PUBLIC_IP>:8000/docs
```

Swagger UI allows developers to:

- Explore available endpoints
- Upload datasets
- Execute requests
- Inspect request parameters
- Inspect responses
- Test the analysis pipeline

---

## ReDoc

Local development:

```text
http://127.0.0.1:8000/redoc
```

For a deployed application:

```text
http://<PUBLIC_IP>:8000/redoc
```

ReDoc provides a documentation-focused view of the API.

---

# Deployment

The backend is containerized using Docker.

The Docker image can be run locally and is also used for the AWS deployment.

The current AWS deployment uses:

```text
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
Data Detective API
```

The Docker image is stored in an Amazon ECR repository and deployed as an ECS Fargate task.

The application listens on port `8000`.

The current deployment does not use a load balancer or persistent application storage.

---

# Authentication

Authentication is **not implemented** in the current MVP.

The API is currently intended for development, demonstration, and dataset analysis.

Authentication and authorization may be introduced in a future version if features such as user accounts, saved analyses, or other protected resources are added.

---

# API Versioning

The current API is an early development version.

```text
API Version: v0.1.0
```

A formal API versioning strategy may be introduced if the API becomes externally consumed or develops multiple incompatible versions.

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

These are **future possibilities only** and are not currently implemented.

New endpoints should only be introduced when the corresponding application features are actually required.

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

The same containerized API can be run locally or deployed through AWS ECS with Fargate.