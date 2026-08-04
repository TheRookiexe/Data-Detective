# 🕵️ Data Detective

> **Understand. Discover. Decide.**

Data Detective is a full-stack data understanding application that helps users quickly explore unfamiliar datasets through automated analysis, interactive visualizations, and meaningful insights.

Instead of manually inspecting rows and columns, users can upload a dataset and receive a structured overview that highlights data quality, important patterns, statistical summaries, and recommendations for further exploration.

The goal is not to replace a data analyst, but to dramatically reduce the time required to understand a new dataset.

---

## ✨ Features

### Current

* ✅ FastAPI backend
* ✅ Vanilla JavaScript frontend
* ✅ API-first architecture
* ✅ Interactive API documentation (Swagger & ReDoc)
* ✅ Modular analysis engine architecture
* ✅ Clean separation between frontend and backend

### Planned

* CSV dataset upload
* Automated dataset summary
* Data quality assessment
* Statistical overview
* Interactive visualizations
* Key findings generation
* Recommendations for further exploration
* Exportable analysis reports

---

## 🏗️ Project Architecture

```
Browser
    │
    ▼
Frontend (HTML • CSS • JavaScript)
    │
    ▼
FastAPI Backend
    │
    ▼
Analysis Engine
    │
    ▼
Analyzers
 ├── Overview
 ├── Data Quality
 ├── Visualizations
 ├── Findings
 └── Recommendations
```

The application follows an **API-first architecture**, allowing the frontend and backend to evolve independently.

---

## 🛠️ Tech Stack

### Backend

* FastAPI
* Uvicorn
* Python

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Data Analysis *(Planned)*

* Pandas
* NumPy

### Visualization *(Planned)*

* Plotly

---

## 📂 Project Structure

```
data-detective/

├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── analyzers/
│   │   ├── config/
│   │   ├── engine/
│   │   ├── schemas/
│   │   └── utils/
│   └── requirements.txt
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── components/
│   └── index.html
│
├── datasets/
├── docs/
├── tests/
│
└── README.md
```

### Folder Responsibilities

| Folder      | Responsibility                                                 |
| ----------- | -------------------------------------------------------------- |
| `backend/`  | FastAPI application and analysis engine                        |
| `frontend/` | User interface and client-side logic                           |
| `datasets/` | Sample datasets used for development and testing               |
| `docs/`     | Architecture, API documentation, roadmap, and design decisions |
| `tests/`    | Unit and integration tests                                     |

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone <repository-url>

cd data-detective
```

### Create a virtual environment

```bash
python3 -m venv .venv
```

### Activate the virtual environment

**Linux / macOS**

```bash
source .venv/bin/activate
```

**Windows**

```powershell
.venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r backend/requirements.txt
```

### Start the development server

```bash
uvicorn backend.app.main:app --reload
```

Open your browser:

```
http://127.0.0.1:8000
```

API Documentation:

```
http://127.0.0.1:8000/docs
```

ReDoc:

```
http://127.0.0.1:8000/redoc
```

---

## 📌 Current Progress

* [x] Project planning
* [x] Repository structure
* [x] FastAPI setup
* [x] Frontend integration
* [x] API routing
* [ ] Dataset upload
* [ ] Analysis engine
* [ ] Summary page
* [ ] Dashboard
* [ ] Visualizations

---

## 🗺️ Roadmap

### Phase 1 — MVP

* Dataset upload
* Automated dataset summary
* Data quality analysis
* Statistical overview
* Dashboard

### Phase 2

* Rich visualizations
* Exportable reports
* Improved UI/UX

### Phase 3

* React frontend
* Advanced filtering
* Performance optimizations

### Phase 4

* AI-powered insights
* Natural language dataset explanations
* Conversational data exploration

---

## 🤝 Contributing

This project is currently under active development.

Suggestions, discussions, and improvements are always welcome.

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Project Philosophy

Data Detective is designed around one simple idea:

> **Help users understand their data before asking them to analyze it.**

Rather than overwhelming users with dozens of charts and statistics, the application focuses on presenting the most valuable insights in a clear, structured, and approachable way.
