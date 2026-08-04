# Backend

The backend powers the analysis engine of **Data Detective**.

It is responsible for processing datasets, running analyzers, and exposing REST APIs consumed by the frontend.

---

# Technology

* Python
* FastAPI
* Uvicorn

Future additions include:

* Pandas
* NumPy
* Plotly

---

# Directory Structure

```text
backend/

app/
├── api/
├── analyzers/
├── config/
├── engine/
├── schemas/
├── utils/
└── main.py
```

---

# Directory Responsibilities

## api/

Contains API endpoints.

Endpoints should remain lightweight and primarily:

* Validate requests
* Call the analysis engine
* Return responses

Business logic should not be implemented here.

---

## engine/

Coordinates the execution of analyzers.

The engine combines the outputs from multiple analyzers into a single response for the frontend.

---

## analyzers/

Contains independent analysis modules.

Each analyzer focuses on one aspect of understanding a dataset.

Examples include:

* Dataset overview
* Data quality
* Visualizations
* Findings
* Recommendations

---

## schemas/

Contains Pydantic request and response models.

---

## config/

Stores application configuration and constants.

---

## utils/

Shared helper functions used across multiple modules.

---

# Running the Backend

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Start the development server:

```bash
uvicorn backend.app.main:app --reload
```

---

# API Documentation

Swagger UI

```text
http://127.0.0.1:8000/docs
```

ReDoc

```text
http://127.0.0.1:8000/redoc
```

---

# Development Principles

* Keep endpoints thin.
* Keep analyzers independent.
* Prefer composition over large monolithic classes.
* Avoid unnecessary abstractions.
* Follow the project's Architecture Decision Records (ADRs).

---

# Current Status

✅ FastAPI application initialized

✅ API routing established

✅ Frontend integration complete

🚧 Analysis engine under development
