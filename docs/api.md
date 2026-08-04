# Data Detective API Documentation

This document describes the REST API exposed by the Data Detective backend.

The application follows an **API-first architecture**, where all backend functionality is accessible through HTTP endpoints under the `/api` namespace.

---

# Base URL

During development:

```text
http://127.0.0.1:8000
```

API endpoints:

```text
http://127.0.0.1:8000/api
```

---

# API Design Principles

The API follows these principles:

* REST-style endpoints
* JSON request and response bodies
* Stateless communication
* Clear separation between frontend and backend
* Consistent response formats

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

* Verifying the server is running
* Development testing
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

# Planned Endpoints

The following endpoints will be implemented during MVP development.

---

## Analyze Dataset

### Request

```http
POST /api/analyze
```

### Purpose

Accept a dataset upload, execute the analysis pipeline, and return a structured analysis response.

**Status**

🚧 Planned

---

## API Version

### Request

```http
GET /api/version
```

### Purpose

Return the current API version.

**Status**

📋 Planned

---

# Response Format

Future endpoints will follow a consistent JSON response structure.

### Success Response

```json
{
    "success": true,
    "data": {}
}
```

### Error Response

```json
{
    "success": false,
    "error": {
        "message": "Description of the error"
    }
}
```

Maintaining a consistent response structure simplifies frontend development and improves error handling.

---

# Interactive Documentation

FastAPI automatically generates interactive API documentation.

## Swagger UI

```text
http://127.0.0.1:8000/docs
```

Allows developers to:

* Explore endpoints
* Execute requests
* View schemas
* Inspect responses

---

## ReDoc

```text
http://127.0.0.1:8000/redoc
```

Provides a clean, documentation-focused view of the API.

---

# Authentication

Authentication is **not implemented** in the MVP.

Since the application is currently intended for local development, all endpoints are publicly accessible.

Authentication and authorization may be introduced in future versions if user accounts or cloud deployment are added.

---

# Versioning

The initial release targets:

```text
API Version: v0.1.0
```

Versioning strategies will be revisited as the public API expands.

---

# Future API Expansion

Potential future endpoints include:

```text
POST /api/analyze
GET  /api/version
GET  /api/report/{id}
POST /api/export
GET  /api/history
```

These endpoints are placeholders and may evolve as the project grows.

---

# Summary

The Data Detective API is intentionally lightweight during the MVP phase.

The primary objective is to provide a stable interface between the frontend and backend while keeping the architecture simple and easy to extend.
