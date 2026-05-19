# L1 Training MCQ Practice

Interactive MCQ practice app for the Capgemini L1 training curriculum — **13 phases** (546 questions) + **3 comprehensive timed tests** (180 questions).

**Repository:** [github.com/ydvdhrj/capgemini_l1_mcq_practice](https://github.com/ydvdhrj/capgemini_l1_mcq_practice)

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- **Python 3** (recommended) *or* **Node.js** — to run a local web server

> This app loads questions with `fetch()`. Opening `index.html` directly (`file://`) will **not** work. You must serve the folder over HTTP.

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/ydvdhrj/capgemini_l1_mcq_practice.git
cd capgemini_l1_mcq_practice
```

### 2. Start a local server

**Option A — Python (simplest)**

```bash
python3 -m http.server 8080
```

**Option B — Node.js**

```bash
npx --yes serve -p 8080
```

### 3. Open in the browser

Go to: **http://localhost:8080**

You should see **Comprehensive Tests** at the top and **Topic Phases** below.

### 4. Stop the server

Press `Ctrl + C` in the terminal where the server is running.

---

## How to use the app

### Topic phases (42 MCQs each, untimed)

1. Pick a **phase** under Topic Phases.
2. Answer all questions, then click **Submit Phase**.
3. Review score and explanations (green = correct, red = wrong).

### Comprehensive tests (60 MCQs, 1 hour)

1. Click a test card — read the **toughness** screen (difficulty mix is shown before you start).
2. Click **Start Test (1 Hour)** — the timer begins immediately.
3. Answer all **60** questions across six areas (10 each):
   - Core Java · DBMS · Java Backend · Docker · Angular · Software Development
4. Click **Submit Test** or wait for **auto-submit** when time reaches 0:00.
5. Review score, time used, and breakdown by difficulty (easy / medium / hard).

| Test | Toughness | Difficulty mix |
|------|-----------|----------------|
| **Test 1** | Mixed | 20 Easy · 25 Medium · 15 Hard |
| **Test 2** | Intermediate → Advanced | 28 Medium · 32 Hard (no easy) |
| **Test 3** | Advanced / Challenge | 12 Medium · 48 Hard (no easy) |

Progress is saved in the browser (`localStorage`).

## Phases

| Track | Phases | Topics |
|-------|--------|--------|
| **Core Java** | 1–3 | Foundations, OOP, advanced Java (collections, streams, threads) |
| **DBMS** | 4–5 | SQL basics, joins, normalization, procedures/triggers |
| **Java Backend** | 6–9 | JUnit/Mockito, Hibernate, Spring MVC, Boot, Security, Cloud |
| **Angular** | 10–12 | Web/TS basics, Angular components/forms, routing/HTTP/JWT |
| **DevOps** | 13 | Docker, Git, architecture |

## Project structure

```
index.html              # App entry point
css/app.css             # Styles
js/app.js               # Quiz logic (no answers until submit)
js/phases-config.js     # Phase metadata
data/phase-01.json      # Phase banks (phase-01 … phase-13)
data/test-01.json       # Comprehensive tests (test-01 … test-03)
js/tests-config.js      # Test metadata & toughness labels
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page / questions not loading | Use `http://localhost:8080`, not `file://` |
| `python3: command not found` | Install Python 3 or use the Node.js option above |
| Port 8080 already in use | Use another port, e.g. `python3 -m http.server 3000` and open `http://localhost:3000` |

## Regenerating questions (optional)

Python scripts to extend or regenerate some phases:

- `scripts/generate-phases-06-09.py`
- `scripts/generate-phases-10-13.py`

```bash
python3 scripts/generate-phases-10-13.py
```

## License

Use and share freely for L1 training practice.
