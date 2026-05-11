# CS496 Complete Study Web App

A GitHub-ready static study website generated from the uploaded CS496 course files:

- `CS496 AI ML Agentic AI Inline Diagrams.pdf`
- `CS496 Blockchain Inline Diagrams.pdf`
- `CS496 Quantum Computing Inline Diagrams.pdf`

The app organizes the course into clean study topics with progress tracking and useful visuals from the course material.

## Features

- Responsive layout for desktop, tablet, and phone.
- Top navigation for switching between the three course modules.
- Topic cards that open one focused topic page at a time.
- Overall course progress percentage.
- Topic progress percentage based on completed concept cards.
- Checkboxes for each concept.
- Progress saved locally with `localStorage`.
- Search across topics, concepts, formulas, diagrams, tables, code, and notes.
- Dark mode with saved preference.
- Click-to-zoom visuals.
- Visuals are shown only when the related concept contains a diagram, table, formula, code, circuit, chart, architecture, workflow, or similar course visual.
- Review questions and key-point boxes per topic when available from the source material.

## How to run

No server is required.

1. Unzip the project.
2. Open `index.html` in a browser.
3. Pick a module from the top navigation.
4. Click a topic card to open that topic page.
5. Mark concepts as completed while studying.

If your browser blocks local files for any reason, run a simple local server from the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Folder structure

```text
cs496-study-webapp/
├── index.html
├── style.css
├── script.js
├── data/
│   └── courseData.js
├── assets/
│   └── pages/
│       ├── ai-ml-agentic-ai/
│       ├── blockchain/
│       └── quantum-computing/
└── README.md
```

## Content structure

The app contains:

- AI / ML / Agentic AI: extracted text and useful visuals from the AI/ML/Agentic AI inline-diagram guide.
- Blockchain: extracted text and useful visuals from the Blockchain inline-diagram guide.
- Quantum Computing: extracted text and useful visuals from the Quantum Computing inline-diagram guide.

## Notes

- Progress is stored only in the user's browser through `localStorage`; it is not uploaded anywhere.
- The app is fully static and ready to push to GitHub or host with GitHub Pages.
- Source visual files are included under `assets/pages/` to preserve diagrams, tables, formulas, circuits, code snippets, and other important visuals.
