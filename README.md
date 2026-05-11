# CS496 Study Website

A GitHub-ready static study website generated from the uploaded CS496 course files.

## Run locally

Open `index.html` in a browser. No build step, server, or external dependency is required.

## Structure

```text
index.html
style.css
script.js
assets/
  diagrams/
README.md
```

## What is included

- Top navigation with only the main topic names.
- Topic pages for Overview, Quantum Computing, AI/ML & Agentic AI, and Blockchain & Smart Contracts.
- Study-friendly explanations, definitions, formulas, examples, code snippets, diagrams, key points, and mini quizzes.
- Progress tracking per concept and per topic.
- Overall progress percentage.
- `localStorage` persistence.
- Dark mode with persistence.
- Responsive layout for desktop, tablet, and phone.
- Rendered course diagrams placed near the concepts they explain.

## Source inspection summary

- Files inspected: 30
- PowerPoint slides inspected: 411
- Word documents inspected: 8

## Source files

| File | Type | Count |
|---|---:|---:|
| _000_Quantum  AGI Computing-Course Overview.pptx | PPTX | 9 slides |
| _001_Principles and Roots of Quatum Computing.pptx | PPTX | 22 slides |
| _002_Quatum Gates and Operators Jan 2026-updated.pptx | PPTX | 40 slides |
| _003_Entanglement.-Bell States.pptx | PPTX | 24 slides |
| _004_Quantum Teleportation-2026-updated.pptx | PPTX | 12 slides |
| _005_Shor Integer Factorization Algorithm.pptx | PPTX | 11 slides |
| _006_The Quantum Fourier Transform (QFT).pptx | PPTX | 10 slides |
| _007_Grover#U2019s Algoritm-Jan 2026.pptx | PPTX | 18 slides |
| _008_Deutsch-Jozsa Algorithm-Revisited.pptx | PPTX | 16 slides |
| _009_Ripple Addaer -Quantum.pptx | PPTX | 22 slides |
| _010_Generative AI.pptx | PPTX | 27 slides |
| _011_Getting Started With LangChain.pptx | PPTX | 17 slides |
| _012_MLP-How it Works -(MultiLayer Perceptrons MLP) Example.pptx | PPTX | 23 slides |
| _013_The Context-Machine Learning - Overview.pptx | PPTX | 17 slides |
| _014_The Agentic AI  Revolution.pptx | PPTX | 20 slides |
| _015_Demo -Cognitive Loop-LangChain Comprehensive Example-2 .docx | DOCX | 1072 non-empty paragraphs |
| _016_LnagChain Multiagent.docx | DOCX | 143 non-empty paragraphs |
| _017_Autogen Single Agent Formatted.docx | DOCX | 188 non-empty paragraphs |
| _018_AutoGen MultiAgent.docx | DOCX | 188 non-empty paragraphs |
| _019_Crew Single Agent Formatted.docx | DOCX | 264 non-empty paragraphs |
| _020_CrewAI  MultiAgent.docx | DOCX | 391 non-empty paragraphs |
| _021_Blockchain Overview.pptx | PPTX | 26 slides |
| _022_Bitcoin Proof of Work Algorithm.pptx | PPTX | 13 slides |
| _023_How Bitcoin Works.pptx | PPTX | 11 slides |
| _024_Ethereum How It Works -1.pptx | PPTX | 32 slides |
| _025_Solidity By Example1.docx | DOCX | 256 non-empty paragraphs |
| _026_Ethereum Smart Contracts Practice Sheet.docx | DOCX | 97 non-empty paragraphs |
| _027Etheerim Proof of Stake.pptx | PPTX | 19 slides |
| _028_Solana - Fastest Blockchain--Prroof of History .pptx | PPTX | 11 slides |
| _029_PolkaDot  - an Emerging Blockchain Systems.pptx | PPTX | 11 slides |

## Final checks performed

- The project opens from `index.html`.
- Top navigation contains only main topic names.
- Clicking a topic shows that topic content only.
- Concept checkboxes update topic and overall progress.
- Progress and dark mode persist through `localStorage`.
- The JavaScript file parses successfully.
- Referenced images exist in `assets/diagrams/`.
