# 🕵️ Data Detective

> **Understand. Discover. Decide.**

Data Detective is a full-stack data understanding application that helps users quickly explore unfamiliar datasets through automated analysis, meaningful findings, recommendations, and visualization suggestions.

Instead of manually inspecting rows and columns, users can upload a dataset and receive a structured analysis that highlights its structure, data quality, potential issues, and useful directions for further exploration.

The goal is not to replace a data analyst, but to reduce the time and effort required to understand a new dataset.

---

## ✨ Features

### Current

* ✅ FastAPI backend
* ✅ Vanilla JavaScript frontend foundation
* ✅ API-first architecture
* ✅ Interactive API documentation with Swagger & ReDoc
* ✅ Modular analysis engine
* ✅ Overview analysis
* ✅ Data quality analysis
* ✅ Automated findings
* ✅ Data-driven recommendations
* ✅ Visualization suggestions
* ✅ Structured JSON analysis response
* ✅ Clean separation between frontend and backend
* ✅ Project architecture and design documentation

### In Progress

* 🚧 Dataset upload interface
* 🚧 Frontend dashboard
* 🚧 Rendering analysis results
* 🚧 Interactive visualization rendering
* 🚧 Frontend error handling
* 🚧 Responsive UI

### Future

* Exportable analysis reports
* Advanced data-quality detection
* Additional visualizations
* AI-assisted insights
* Natural-language dataset explanations
* Conversational dataset exploration

---

## 🧠 How It Works

A dataset is processed through a modular analysis pipeline:

```text
CSV Dataset
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
Structured JSON
     │
     ▼
Frontend Dashboard
```

Each analyzer focuses on a specific aspect of understanding the dataset.

This modular design allows new analysis capabilities to be added without redesigning the entire system.

---

## 🔎 Current Analysis

### Overview

Provides basic information about the dataset:

* Filename
* Number of rows
* Number of columns
* Column names
* Basic data types

### Data Quality

Evaluates basic dataset quality:

* Missing values
* Missing-value percentages
* Duplicate rows
* Dataset memory usage
* Dataset completeness

### Findings

Converts analysis results into human-readable observations such as:

* Dataset completeness
* Duplicate-row detection
* Highest missing-value rate
* Numeric-column distribution

Findings also expose structured data that can be reused by other parts of the analysis pipeline.

### Recommendations

Generates actionable suggestions based on detected issues.

For example:

```text
Review the 1477 missing values across the dataset,
particularly in the Rating column.

Review the 483 duplicated rows and remove them
if they represent repeated records.
```

The recommendation system currently informs the user rather than automatically modifying the dataset.

### Visualizations

The Visualization Analyzer determines what type of visualization may be appropriate for individual columns.

Current classifications include:

* Histograms for numeric columns
* Bar charts for low-cardinality non-numeric columns
* High-cardinality columns
* Identifier columns

The backend currently provides visualization metadata. Actual chart rendering will be handled by the frontend.

---

## 🏗️ Project Architecture

```text
                    Browser
                       │
                       ▼
              HTML • CSS • JavaScript
                       │
                       ▼
                FastAPI Backend
                       │
                       ▼
                Analysis Engine
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      Overview      Quality      Findings
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
                  Recommendations    Visualizations
                          │                 │
                          └────────┬────────┘
                                   ▼
                            Structured JSON
```

Data Detective follows an **API-first architecture** with a clear separation between the frontend, API layer, analysis engine, and individual analyzers.

---

## 🛠️ Tech Stack

### Backend

* Python
* FastAPI
* Uvicorn
* Pandas

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Development

* Git
* GitHub
* Swagger UI
* ReDoc

---

## 📂 Project Structure

```text
data-detective/

├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── analyzers/
│   │   ├── config/
│   │   ├── engine/
│   │   ├── schemas/
│   │   └── utils/
│   │
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
│   └── sample/
│
├── docs/
│   ├── api.md
│   ├── architecture.md
│   ├── decisions.md
│   └── roadmap.md
│
├── tests/
│   ├── backend/
│   └── frontend/
│
└── README.md
```

### Folder Responsibilities

| Folder | Responsibility |
| --- | --- |
| `backend/` | FastAPI application and analysis pipeline |
| `backend/app/api/` | API routes and endpoints |
| `backend/app/analyzers/` | Individual dataset analyzers |
| `backend/app/engine/` | Analysis orchestration |
| `backend/app/config/` | Application configuration |
| `backend/app/schemas/` | API schemas |
| `backend/app/utils/` | Reusable utility functions |
| `frontend/` | User interface and client-side logic |
| `datasets/` | Sample datasets used for development and testing |
| `docs/` | Architecture, API, roadmap, and design documentation |
| `tests/` | Backend and frontend tests |

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone git@github.com:TheRookiexe/Data-Detective.git

cd Data-Detective
```

### Create a virtual environment

```bash
python3 -m venv .venv
```

### Activate the virtual environment

#### Linux / macOS

```bash
source .venv/bin/activate
```

#### Windows

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

The application will be available at:

```text
http://127.0.0.1:8000
```

---

## 📡 API

### Health Check

```http
GET /api/health
```

### Analyze Dataset

```http
POST /api/analyze
```

The `/api/analyze` endpoint accepts a CSV file and runs the complete analysis pipeline.

Interactive API documentation is available through FastAPI:

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

For detailed API documentation, see:

```text
docs/api.md
```

---

## 📊 Example Analysis Response

A successful analysis produces a structured response containing the results of all analyzers:

```json
{
    "overview": {},
    "quality": {},
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

The exact results depend on the uploaded dataset.

---

## 📌 Current Progress

### Backend Analysis Pipeline

* [x] Project planning
* [x] Repository structure
* [x] FastAPI setup
* [x] API routing
* [x] Health endpoint
* [x] Analysis engine
* [x] Overview Analyzer
* [x] Quality Analyzer
* [x] Findings Analyzer
* [x] Recommendation Analyzer
* [x] Visualization Analyzer
* [x] Structured analysis response
* [x] Backend documentation

### Frontend

* [x] Frontend structure
* [x] Static frontend integration
* [ ] Dataset upload interface
* [ ] API integration
* [ ] Dashboard
* [ ] Findings display
* [ ] Recommendations display
* [ ] Visualization rendering
* [ ] Responsive UI

---

## 🗺️ Roadmap

### Phase 1 — Foundation

Completed.

### Phase 2 — Backend Analysis MVP

Completed.

The modular analysis pipeline is now capable of processing datasets and generating structured analysis results.

### Phase 3 — Frontend MVP

Current focus.

* Dataset upload
* API integration
* Dashboard
* Analysis result presentation
* Visualization rendering
* Error handling
* Responsive UI

### Phase 4 — Improvements

* Additional visualizations
* Advanced data-quality detection
* Better filtering
* Report export
* Accessibility improvements
* UI polish

### Phase 5 — Advanced Features

* AI-generated insights
* Natural-language explanations
* Conversational dataset exploration
* User accounts
* Saved analyses
* Background processing
* Database support

For the detailed roadmap, see:

```text
docs/roadmap.md
```

---

## 📚 Documentation

Detailed project documentation is available in the `docs/` directory.

| Document | Description |
| --- | --- |
| `architecture.md` | System architecture and component responsibilities |
| `decisions.md` | Important architectural and design decisions |
| `roadmap.md` | Project milestones and future development |
| `api.md` | REST API documentation |

---

## 🤝 Contributing

Data Detective is currently under active development.

Suggestions, discussions, and improvements are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes.
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Project Philosophy

Data Detective is built around one simple idea:

> **Help users understand their data before asking them to analyze it.**

Rather than overwhelming users with dozens of charts and statistics, the application focuses on presenting useful information in a clear, structured, and approachable way.

The project is intentionally being developed incrementally, with a simple modular architecture that can grow as new requirements emerge.