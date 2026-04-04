<div align="center">

<img src="public/NewHashmapLogo.jpg" width="80" style="border-radius:50%" />

# Hashmap

### Master Data Structures & Algorithms — in your browser, with AI

[![Live Site](https://img.shields.io/badge/Live%20Site-hashmap-4ade80?style=for-the-badge&logo=github)](https://thirunaa.github.io/dsawebsite/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Pyodide](https://img.shields.io/badge/Python-Pyodide-ffd43b?style=for-the-badge&logo=python)](https://pyodide.org)

**75 problems · 39 lessons · 18 topics · 3 AI providers**  
No account. No setup. Just open a problem and start coding.

</div>

---

## What is Hashmap?

Hashmap is a full-featured DSA learning platform that runs entirely in your browser. Write and run Python code, get AI tutoring, step through visual algorithm walkthroughs, and solve curated LeetCode-style problems — all without installing anything.

---

## Features

### In-Browser Python IDE
- Full **Python 3.11 runtime** powered by [Pyodide](https://pyodide.org) (WebAssembly) — zero server, zero latency
- **CodeMirror 6** editor with syntax highlighting, line numbers, and auto-indent
- Code auto-saved to `localStorage` per problem — never lose your work
- Full stack traces on errors with exact line numbers
- Reset to starter template with one click

### Test Runner
- Run all test cases with a single click — results stream live as each test executes
- Failed cases auto-expand showing **Input → Expected → Your Output** side by side
- `print()` output captured separately so you can debug freely
- Live counter: `Tests (2✓ 1✗ / 3)`

### Editable Test Cases
- Edit any test case inline — tweak inputs or expected outputs
- Add custom edge cases to probe your solution further
- Delete test cases you don't need
- All changes persisted in `localStorage` per problem

### Tree Visualizer
- Automatically renders binary trees from LeetCode's `[val, null, val, ...]` array format
- Uses the same **BFS level-order layout** as LeetCode internally
- Clean in-order SVG rendering — scales to any tree depth
- Shown inline in each test case when expanded

### ✨ AI Visualizer (Signature Feature)
- Click **Visualize** on any problem → AI generates a full **step-by-step algorithm animation**
- Renders live data structures at every step: arrays, hash maps, stacks, trees, matrices, strings
- **Pointer arrows, index labels, and highlights** update frame by frame
- **Two examples per visualization** — Normal Case + Edge Case
- **Validate** button streams an AI review of the visualization for correctness
- **Keyboard navigation** (← →) for smooth step-through
- **Cached** in `localStorage` — instant re-open, one-click regenerate
- **Download as HTML** — self-contained offline file you can keep forever

### AI Assistant
- **Explain Problem** — plain-English walkthrough of what's being asked
- **Hint** — Socratic nudge toward the right approach without spoiling the solution
- **Explain Solution** — step-by-step breakdown of the hidden solution with complexity analysis
- **Ask AI about a test case** — click the bot icon on any test case after running; AI sees your exact code, input, expected output, and actual result
- **Ask AI about run output** — inline button in the Output tab for plain errors and tracebacks
- All responses **stream token-by-token** in real time (ChatGPT-style)
- Stop button to cancel mid-stream

### Multi-Provider AI
- Supports **OpenAI**, **Anthropic Claude**, and **Google Gemini**
- **Fast tier** per provider: GPT-4o mini · Claude Haiku 4.5 · Gemini 2.0 Flash
- **Best tier** per provider: GPT 5.4 High · Claude 4.6 Opus · Gemini 3.1 Pro
- Your API keys stay in `localStorage` — never sent to any server
- Priority order: Claude → GPT → Gemini (first active key used)

### Problem Library
- **75 problems** across **39 structured lessons** and **18 DSA topics**
- Full problem description, examples, constraints, and complexity analysis per problem
- Hidden Java solutions — reveal only when ready
- YouTube video walkthrough + PDF notes per lesson
- Search by title, number, or topic keyword
- Filter by topic: Array, Trees, DP, BFS, Graph, and 14 more

### Bug Report
- Built-in **Report a Bug** button in every page header
- Attach an optional screenshot — auto-compressed and delivered via [EmailJS](https://www.emailjs.com)
- No backend needed — reports sent directly from the browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 (Create React App) |
| Routing | React Router v6 (HashRouter) |
| Styling | Tailwind CSS + custom dark theme |
| Icons | Lucide React |
| Python runtime | Pyodide v0.25.1 (WebAssembly) |
| Code editor | CodeMirror 6 via `@uiw/react-codemirror` |
| AI streaming | Direct browser SSE to Anthropic / OpenAI / Gemini APIs |
| Email | EmailJS (client-side, no backend) |
| Deployment | GitHub Pages |

---

## Project Structure

```
src/
├── components/
│   ├── landing/          # Navbar, Hero, Topics grid, CTA, Footer
│   ├── library/          # ProblemList, SearchProblems, FilterProblems
│   ├── AIPanel.js        # Streaming AI chat panel
│   ├── ApiKeyModal.js    # API key + model tier selector
│   ├── BugReportModal.js # Bug report with screenshot upload
│   └── PythonEditor.js   # CodeMirror IDE + test runner + tree viz
├── hooks/
│   ├── useApiKeys.js     # localStorage key/model management
│   ├── useStreamingAI.js # SSE streaming for all 3 providers
│   └── useAIJSON.js      # Non-streaming AI call (returns JSON)
├── pages/
│   ├── HomePage.js
│   ├── TopicsPage.js
│   ├── ProblemPage.js    # 3-column layout: content | IDE | AI panel
│   ├── FeaturesPage.js   # Interactive features showcase
│   └── VisualizerPage.js # AI-generated step-by-step visualizer
├── utils/
│   └── Visualization_Prompt.md
├── data.json             # All 39 lessons with problems
└── filterData.json       # Topic → lesson ID mapping
```

---

## Run Locally

```bash
git clone https://github.com/Thirunaa/dsawebsite.git
cd dsawebsite
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Build & Deploy

```bash
npm run build     # production build
npm run deploy    # push to GitHub Pages
```

---

## API Keys (Optional)

The AI features require at least one API key. Keys are stored only in your browser's `localStorage`.

| Provider | Where to get a key |
|---|---|
| OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Anthropic | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| Google Gemini | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

Click **API Keys** in any page header to add yours.

---

<div align="center">

Made with ♥ for anyone grinding LeetCode · [Live Site →](https://thirunaa.github.io/dsawebsite/)

</div>
