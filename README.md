# Jev & GPT-6 Luna Decisions Playground

An interactive benchmarking playground designed to evaluate and compare decision-making capabilities between **TypeSafe Jev** (`typesafe/jev-1.13`) and **OpenAI GPT-6 Luna Decisions** (`openai/gpt-6-luna-decisions`) using OpenRouter's native Alpha Decisions API.

---

## Overview

This project benchmarks deterministic, structured decision engines against multimodal decision systems:

- **TypeSafe Jev (`typesafe/jev-1.13`)**: A deterministic, schema-constrained decision engine optimized for structured text, intent parsing, semantic classification, and DOM metadata. Runs natively on TypeSafe infrastructure.
- **OpenAI GPT-6 Luna Decisions (`openai/gpt-6-luna-decisions`)**: An advanced multimodal decision engine capable of high-dimensional visual reasoning, OCR tag reading, and complex multimodal criteria evaluation.

---

## Features

- **Native OpenRouter Decisions API Integration**: Direct calls to `https://openrouter.ai/api/alpha/decisions` — no chat completions bloat, no forced JSON prompting, and zero router forwarding.
- **Mathematical Probabilities & Confidence**: Displays real probability distributions and confidence scores directly from the engines.
- **Positive & Negative Benchmark Suites**:
  - **Language Detection & Dialect Recognition** (Colloquial Indonesian, English).
  - **Medical & Dietary Constraint Filtering** (Reflux-safe drink selection).
  - **Decoy Discrimination & Price Evaluation** (Lowest snack price tag reading).
  - **Intent & Billing Dispute Resolution** (Refund vs. cancel mapping).
  - **Modality Boundary Stress-Testing** (Non-vision constraint testing on images).
- **Raw Telemetry Inspector**: Modal to inspect live raw response payloads, token consumption, cost, latency, provider attribution, and probability breakdowns.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite + Oxlint
- **Styling**: Tailwind CSS
- **Icons & Animation**: Lucide React, Canvas Confetti
- **API**: OpenRouter Alpha Decisions API (`/api/alpha/decisions`)

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/barrey/jev-luna-demo.git
cd jev-luna-demo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Edit `.env` and insert your OpenRouter API key:

```env
VITE_JEV_API_KEY=your_openrouter_api_key_here
VITE_GPT6_LUNA_DECISIONS=your_openrouter_api_key_here
```

> **Note**: You can generate API keys at [openrouter.ai/keys](https://openrouter.ai/keys).

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

---

## Project Structure

```text
jev-luna-demo/
├── public/
│   └── assets/           # Static benchmark images (animals, drinks, resto, snacks)
├── src/
│   ├── data/
│   │   └── scenarios.ts  # Benchmark suites and candidate option definitions
│   ├── services/
│   │   └── openrouter.ts # Native OpenRouter Decisions API client
│   ├── App.tsx           # Benchmark Wizard UI & Telemetry Modal
│   ├── main.tsx          # App entry point
│   └── index.css         # Styling
├── .env.example          # Template environment file
├── package.json
└── README.md
```

---

## License

MIT License. Created for AI Decision Engine benchmarking demonstrations.
