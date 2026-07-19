# ThirdEye 👁️

> Build browser automations visually.

ThirdEye is a visual workflow automation platform focused on browser-based tasks. Drag nodes onto a canvas, connect them into workflows, and automate repetitive actions such as web scraping, price monitoring, notifications, and more.

---

## ✨ Features

- 🎨 Visual drag-and-drop workflow builder
- 🌐 Browser automation with Puppeteer
- 📄 Data extraction using CSS selectors
- 🔀 Conditional branching
- 📧 Email notifications
- 📜 Execution history & logs
- ⚡ Runtime workflow execution
- 🧩 Modular execution engines
- 🛠️ Developer-friendly architecture

---

## 🏗️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Flow
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Puppeteer Core
- Resend

---

# Project Structure

```text
thirdEye/

├── Client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.tsx
│   └── package.json
│
└── Server/
    ├── src/
    │
    ├── modules/
    │   ├── workflow/
    │   ├── execution/
    │   │   ├── Engines/
    │   │   ├── execution.controller.ts
    │   │   ├── execution.repository.ts
    │   │   ├── execution.service.ts
    │   │   └── workflow-runner.ts
    │   │
    │   └── auth/
    │
    ├── utils/
    └── index.ts
```

---

# Current Workflow Nodes

- ✅ Start
- ✅ Browser
- ✅ Extract
- ✅ Condition
- ✅ Email
- ✅ End

---

# Example Workflow

```text
Start
   │
   ▼
Browser
(Open Amazon)
   │
   ▼
Extract
(Get Price)
   │
   ▼
Condition
(price < ₹50000)
   │
   ▼
Email
(Send Notification)
   │
   ▼
End
```

---

# Execution Engine

Each node is powered by its own execution engine.

```text
StartEngine

BrowserEngine

ExtractEngine

ConditionEngine

EmailEngine

EndEngine
```

The `WorkflowRunner` executes nodes sequentially by following workflow edges while maintaining a runtime context shared between engines.

---

# Runtime Context

Every execution maintains a runtime state.

```ts
runtimeContext = {
  browser,
  page,
  variables,
  outputs,
  execution,
  workflow
}
```

Engines can read from and write to this context.

---

# Example Execution

```text
🚀 Start

↓

🌐 Browser
Opening https://amazon.in

↓

📄 Extract
Price = ₹49,999

↓

🔀 Condition
49999 < 50000

↓

📧 Email
Notification Sent

↓

🏁 End
```

---

# Roadmap

## Phase 1

- [x] Authentication
- [x] Workflow CRUD
- [x] Execution Engine
- [x] Browser Automation
- [x] Extraction
- [x] Conditions
- [x] Email Engine
- [x] Execution Logs

---

## Phase 2

- [ ] Visual Workflow Builder
- [ ] Node Inspector
- [ ] Live Execution
- [ ] Save & Load Workflows
- [ ] Keyboard Shortcuts
- [ ] Undo / Redo

---

## Phase 3

- [ ] Variables
- [ ] Expressions
- [ ] Branching
- [ ] Retry Policies
- [ ] Error Handling
- [ ] Runtime Context Improvements

---

## Phase 4

- [ ] Scheduler (Cron)
- [ ] Webhooks
- [ ] HTTP Request Node
- [ ] Delay Node
- [ ] Loop Node
- [ ] Merge Node

---

## Phase 5

- [ ] AI Workflow Generator
- [ ] AI Nodes
- [ ] Workflow Templates
- [ ] Teams & Collaboration
- [ ] Workflow Versioning
- [ ] Marketplace

---

# Getting Started

## Backend

```bash
cd Server

npm install

npm run dev
```

---

## Frontend

```bash
cd Client

npm install

npm run dev
```

---

# Environment Variables

```env
PORT=

MONGODB_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

RESEND_API_KEY=

EMAIL_FROM=

CHROME_PATH=
```

---

# Philosophy

ThirdEye is built around one idea:

> **Describe the outcome. ThirdEye builds the execution.**

Instead of writing scripts or managing APIs, users visually connect workflow nodes to automate browser tasks, monitor data, and trigger actions.

---

# License

MIT
