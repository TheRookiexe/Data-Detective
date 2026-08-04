# Frontend

The frontend provides the user interface for **Data Detective**.

Its primary responsibility is to present analysis results in a clean and intuitive way while communicating with the backend exclusively through REST APIs.

---

# Technology

Current stack:

* HTML5
* CSS3
* Vanilla JavaScript

Future possibilities:

* React
* TypeScript

The current architecture is intentionally framework-independent to keep the MVP lightweight.

---

# Directory Structure

```text
frontend/

assets/
components/
css/
js/
index.html
```

---

# Directory Responsibilities

## assets/

Stores static resources such as:

* Images
* Icons
* Fonts

---

## css/

Contains application styling.

---

## js/

Contains frontend application logic including:

* API communication
* Event handling
* UI updates

---

## components/

Reserved for reusable UI components as the interface grows.

---

# Communication with the Backend

The frontend communicates only through REST endpoints.

Example:

```text
POST /api/analyze
```

No business logic should be duplicated on the frontend.

The backend remains the source of truth for all analysis.

---

# Design Philosophy

The interface should prioritize:

* Clarity
* Simplicity
* Readability
* Progressive disclosure of information

The goal is to help users understand their datasets rather than overwhelm them with charts and statistics.

---

# Current UI Vision

The MVP interface consists of:

* Landing page
* Upload dialog
* Summary page
* Scrollable dashboard
* Lightweight left sidebar navigation

---

# Development Principles

* Keep JavaScript modular.
* Separate presentation from API communication.
* Avoid unnecessary dependencies.
* Build reusable UI components when patterns emerge.
* Optimize for readability before optimization.

---

# Current Status

✅ Frontend structure created

✅ Static asset serving configured

✅ Backend communication established

🚧 Dashboard implementation in progress
