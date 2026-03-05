# 🌿 Rayeva AI — Sustainable Commerce Platform

> AI-powered modules for sustainable commerce: automated impact reporting and intelligent customer support, built with production-ready architecture.

---

# 🚀 Live Demo
View the deployed application here: https://rayeva.vercel.app/

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Implemented Modules](#-implemented-modules)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [AI Prompt Design](#-ai-prompt-design)
- [Outlined Modules (Architecture Only)](#-outlined-modules-architecture-only)
- [Setup & Installation](#-setup--installation)
- [API Endpoints](#-api-endpoints)
- [Technical Requirements Checklist](#-technical-requirements-checklist)

---

## 🧭 Project Overview

**Rayeva AI** is a full-stack sustainable commerce demo platform that integrates AI directly into business workflows. The platform sells eco-friendly products (bamboo toothbrushes, steel bottles, compostable cutlery, recycled notebooks) and uses AI to:

1. **Automatically calculate and narrate** the environmental impact of every order (Module 3)
2. **Provide intelligent customer support** via a chat bot that answers order queries, handles returns/refunds, and escalates critical issues (Module 4)

The project demonstrates clean separation between AI logic, business rules, and data layers — following production-grade patterns.

### Modules Implemented

| Module | Status |
|--------|--------|
| Module 3 — AI Impact Reporting Generator | ✅ Fully Implemented |
| Module 4 — AI Customer Support Bot | ✅ Fully Implemented |
| Module 1 — AI Auto-Category & Tag Generator | 📐 Architecture Outlined |
| Module 2 — AI B2B Proposal Generator | 📐 Architecture Outlined |

---

## ✅ Implemented Modules

### Module 3: AI Impact Reporting Generator

This module calculates the environmental impact of each order and generates a human-readable sustainability summary using Google Gemini AI.

#### How It Works

```
Order Placed → orderController.js
  ↓
  Attach per-product impact data (plastic saved, carbon saved, locally sourced)
  ↓
  impactService.js → impactCalculator.js (business logic)
  ↓
  Compute totals: plastic_saved_kg, carbon_saved_kg, locally_sourced_count
  ↓
  aiService.js → Gemini API (generates human-readable impact statement)
  ↓
  Store structured impact_data + AI impact_statement in Order document
```

#### Key Components

| File | Role |
|------|------|
| `business/impactCalculator.js` | Pure business logic — aggregates per-item impact metrics (plastic grams, carbon grams, locally sourced count) across all order items and converts to kg |
| `services/impactService.js` | Service layer — bridges controller to business logic via `buildImpactData()` |
| `services/aiService.js` | AI layer — sends structured impact data to Gemini with a sustainability-expert system prompt; returns a concise 2–3 sentence impact summary |
| `controllers/orderController.js` | HTTP handler — orchestrates the full order pipeline: enriches items with catalog impact data → computes totals → generates AI summary → saves to MongoDB |
| `models/Order.js` | Data layer — Mongoose schema with embedded `impact_data` (plastic_saved_kg, carbon_saved_kg, locally_sourced_count) and `impact_statement` fields |

#### Structured Output Example

```json
{
  "orderId": "665a1b...",
  "total_amount": 799,
  "impact_data": {
    "plastic_saved_kg": 0.52,
    "carbon_saved_kg": 1.25,
    "locally_sourced_count": 3
  },
  "impact_statement": "Your order saved 520g of plastic from entering landfills and avoided 1.25kg of carbon emissions. 3 of your items were sourced locally, further reducing transport footprint!",
  "status": "placed"
}
```

---

### Module 4: AI Customer Support Bot

An intelligent chat bot that classifies user intent via keyword matching, answers order queries using real database data, handles returns/refunds with policy-based responses, escalates critical issues, and logs all conversations.

#### How It Works

```
User sends message → chatController.js
  ↓
  chatService.js
  ├── intentClassifier.js → classify intent (order_query | refund_request | return_request | escalation | general_support)
  ├── shouldEscalate() → flag for human handoff if refund/escalation
  ├── Fetch real order data from MongoDB
  └── For general/order queries → aiService.js → Gemini API (context-aware reply)
  ↓
  Log conversation in ChatLog (user msg + bot reply + intent)
  ↓
  Return { chatId, botReply, intent, escalated }
```

#### Intent Classification (Rule-Based)

The `intentClassifier.js` uses keyword-matching to classify intents *before* calling the AI, ensuring deterministic routing for critical flows:

| Intent | Trigger Keywords | Response Strategy |
|--------|-----------------|-------------------|
| `refund_request` | "refund", "money back" | Canned policy reply + auto-escalate |
| `return_request` | "return", "exchange" | Canned policy reply |
| `escalation` | "complaint", "angry", "terrible", "bad service" | Canned empathy reply + auto-escalate |
| `order_query` | "order", "status", "tracking" | AI-generated reply with real order data |
| `general_support` | (default fallback) | AI-generated reply with order context |

#### Escalation Logic

`shouldEscalate()` triggers a human handoff flag when:
- Intent is `refund_request` or `escalation`
- Message contains escalation keywords regardless of classified intent

This ensures sensitive issues are never left to AI alone.

#### Key Components

| File | Role |
|------|------|
| `business/intentClassifier.js` | Rule-based intent classification + escalation detection — no AI dependency for routing |
| `services/chatService.js` | Core orchestrator — classifies intent, fetches orders, routes to canned or AI responses, manages ChatLog persistence |
| `services/aiService.js` | AI layer — `generateChatReply()` sends a context-rich prompt to Gemini with the user's recent orders, focused order ID, and classified intent |
| `controllers/chatController.js` | HTTP handler — handles POST `/message` and GET `/:id` for chat history |
| `models/ChatLog.js` | Data layer — stores conversation threads with sender, text, intent, timestamp per message; tracks escalation status |

#### Conversation Logging

Every chat interaction is persisted in MongoDB via the `ChatLog` model:

```json
{
  "_id": "chat_abc123",
  "orderId": "order_xyz789",
  "escalated": true,
  "messages": [
    { "sender": "user", "text": "Where is my order?", "intent": "order_query", "timestamp": "..." },
    { "sender": "bot", "text": "Your most recent order (...df2a) with 3× Bamboo Toothbrush is currently in 'placed' status.", "intent": "order_query", "timestamp": "..." }
  ]
}
```

---

## 🏗 Architecture Overview

The application follows a **layered architecture** with clean separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                 │
│  HomePage · CartPage · OrderConfirmationPage · SupportChat  │
│                    API Client (Axios)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (REST)
┌──────────────────────────▼──────────────────────────────────┐
│                   BACKEND (Express.js)                      │
│                                                             │
│  Routes Layer        → orderRoutes.js, chatRoutes.js        │
│  Controller Layer    → orderController.js, chatController.js│
│  Service Layer       → impactService.js, chatService.js,    │
│                        aiService.js                         │
│  Business Logic      → impactCalculator.js,                 │
│                        intentClassifier.js                  │
│  Data/Model Layer    → Order.js, Product.js, ChatLog.js,    │
│                        AILog.js                             │
└──────────┬───────────────────────────────────┬──────────────┘
           │                                   │
   ┌───────▼───────┐                  ┌────────▼────────┐
   │   MongoDB     │                  │  Google Gemini  │
   │  (Mongoose)   │                  │   (REST API)    │
   └───────────────┘                  └─────────────────┘
```

### Layer Responsibilities

| Layer | Purpose | AI Dependency |
|-------|---------|---------------|
| **Routes** | URL mapping → controller functions | None |
| **Controllers** | Request validation, response formatting, orchestration | None |
| **Services** | Business workflow coordination, AI integration | `aiService.js` only |
| **Business Logic** | Pure deterministic rules (impact math, intent classification) | None |
| **Models** | MongoDB schemas and data persistence | None |
| **AI Service** | Gemini API communication, prompt construction, response logging | Yes (Gemini) |

> **Design Principle:** AI is isolated to the service layer. Business logic (impact calculations, intent classification) runs deterministically without any AI dependency. This means the app functions correctly even if the AI API is down — it gracefully falls back to computed data only.

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, React Router v6, Vite, TailwindCSS |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB with Mongoose ODM |
| **AI Model** | Google Gemini 1.5 Flash (via REST API) |
| **HTTP Client** | Axios (frontend ↔ backend, backend ↔ Gemini) |
| **Dev Tooling** | Nodemon (backend hot-reload), Vite (frontend HMR) |

---

## 📂 Folder Structure

```
rayeva-ai/
├── .env.backend.example          # Environment variable template
├── backend/
│   ├── .env                      # Environment variables (gitignored)
│   ├── server.js                 # Entry point — MongoDB connection + Express listener
│   ├── package.json
│   └── src/
│       ├── app.js                # Express app config, CORS, route mounting
│       ├── routes/
│       │   ├── orderRoutes.js    # GET /, POST /, GET /:id
│       │   └── chatRoutes.js     # POST /message, GET /:id
│       ├── controllers/
│       │   ├── orderController.js  # placeOrder, getOrderById, listOrders
│       │   └── chatController.js   # handleMessage, getChatById
│       ├── services/
│       │   ├── aiService.js        # Gemini API wrapper + prompt builder + logging
│       │   ├── chatService.js      # Chat orchestration (intent → response → persist)
│       │   └── impactService.js    # Impact data builder (service wrapper)
│       ├── business/
│       │   ├── impactCalculator.js # Pure function: order items → impact metrics
│       │   └── intentClassifier.js # Keyword-based intent classification + escalation
│       └── models/
│           ├── Order.js            # Order schema with impact_data & impact_statement
│           ├── Product.js          # Product schema (name, price, sustainability attrs)
│           ├── ChatLog.js          # Chat conversation log with messages array
│           └── AILog.js            # Prompt + response audit log
├── frontend/
│   ├── package.json
│   └── src/
│       ├── main.jsx              # React entry point with BrowserRouter + CartProvider
│       ├── App.jsx               # App shell (nav, routing, footer)
│       ├── index.css             # Global styles + TailwindCSS config
│       ├── api/
│       │   └── client.js         # Axios instance (base URL config)
│       ├── state/
│       │   └── CartContext.jsx    # React Context for shopping cart state
│       ├── pages/
│       │   ├── HomePage.jsx       # Product catalog + add-to-cart
│       │   ├── CartPage.jsx       # Cart view + place order
│       │   ├── OrderConfirmationPage.jsx  # Order details + impact report display
│       │   └── SupportChatPage.jsx        # AI chat interface with sidebar
│       └── components/
│           └── ...               # Shared UI components
```

---

## 🧠 AI Prompt Design

The AI integration uses **Google Gemini 1.5 Flash** via direct REST API calls (no SDK dependency). All prompts follow a structured `system + user` message pattern.

### Prompt Architecture

```
┌─────────────────────────────────┐
│  System Prompt (Role & Rules)   │  ← Sets persona, tone, output constraints
├─────────────────────────────────┤
│  User Prompt (Data + Task)      │  ← Injects real business data + specific instruction
└─────────────────────────────────┘
          ↓
    Gemini API Call
          ↓
    Response logged to AILog
```

### Impact Summary Prompt (`generateImpactSummary`)

| Component | Content |
|-----------|---------|
| **System** | *"You are a sustainability expert. Produce a concise, motivational sustainability impact summary for an order."* |
| **User** | Injects the computed `impact_data` JSON (plastic_saved_kg, carbon_saved_kg, locally_sourced_count) and asks for a 2–3 sentence human-readable summary |
| **Design choice** | The AI receives **pre-computed numbers**, not raw order data. This ensures the AI narrates verified metrics rather than inventing its own calculations |

### Chat Reply Prompt (`generateChatReply`)

| Component | Content |
|-----------|---------|
| **System** | *"You are a friendly customer support assistant for a sustainable commerce startup. Be concise, clear, and empathetic."* |
| **User** | Includes: (1) the user's message, (2) the classified intent from `intentClassifier`, (3) a JSON dump of up to 10 recent orders with product details, quantities, statuses, and short IDs, (4) an optional focused order ID |
| **Design choice** | The AI receives **real database data** (actual orders, prices, product names, statuses) so it can give grounded, factual answers. Intent is pre-classified using deterministic rules, and the AI uses it as guidance — not the sole decider |

### Prompt + Response Logging

Every AI call is logged to the `AILog` MongoDB collection:

```json
{
  "module_name": "impact_summary" | "support_chat",
  "prompt": "SYSTEM: You are a sustainability expert...\n\nUSER: Generate a...",
  "response": "Your order saved 520g of plastic...",
  "createdAt": "2025-03-05T12:00:00Z"
}
```

This provides a full audit trail for debugging, evaluation, and prompt iteration.

### Graceful Degradation

The `aiService.js` handles failures at every level:
- **No API key** → returns a placeholder message, logs it
- **API rate limit / error** → returns a fallback message, logs the failure
- **Empty response** → catches and returns a "no content" message

The application never crashes due to AI unavailability.

---

## 📐 Outlined Modules (Architecture Only)

### Module 1: AI Auto-Category & Tag Generator

**Purpose:** Automatically categorize products, suggest sub-categories, generate SEO tags, and apply sustainability filters when a new product is added to the catalog.

#### Proposed Architecture

```
POST /api/products (with name + description)
       ↓
  productController.js
       ↓
  categoryService.js → aiService.js (new function: generateCategoryTags)
       ↓
  Gemini Prompt:
    System: "You are an e-commerce catalog expert specializing in sustainable products."
    User: "Given this product: {name, description}, return JSON with:
           primary_category, sub_category, seo_tags (5-10),
           sustainability_filters (plastic-free, compostable, vegan, recycled, etc.)"
       ↓
  Parse structured JSON → validate against predefined category list
       ↓
  Store in Product document (new fields: category, sub_category, seo_tags, sustainability_filters)
```

#### Proposed Data Model Extension

```javascript
// Product.js — new fields
category: { type: String, enum: ["Home & Kitchen", "Personal Care", "Office", ...] },
sub_category: String,
seo_tags: [String],
sustainability_filters: [{ type: String, enum: ["plastic-free", "compostable", "vegan", "recycled", "biodegradable", "organic"] }]
```

---

### Module 2: AI B2B Proposal Generator

**Purpose:** Generate a structured B2B procurement proposal with a sustainable product mix, budget allocation, cost breakdown, and impact positioning — all within a given budget limit.

#### Proposed Architecture

```
POST /api/proposals { client_name, budget_limit, preferences }
       ↓
  proposalController.js
       ↓
  proposalService.js → fetch Product catalog from DB
       ↓
  aiService.js (new function: generateB2BProposal)
       ↓
  Gemini Prompt:
    System: "You are a B2B sustainable procurement advisor."
    User: "Given budget: ₹{budget_limit}, available products: {catalog JSON},
           client preferences: {preferences}.
           Return JSON with: recommended_products (with quantities + unit prices),
           budget_allocation, cost_breakdown, impact_positioning_summary."
       ↓
  Parse + validate (total cost ≤ budget_limit)
       ↓
  Store in new Proposal model → return structured JSON
```

#### Proposed Data Model

```javascript
// models/Proposal.js
{
  client_name: String,
  budget_limit: Number,
  recommended_products: [{ product_id, name, quantity, unit_price, line_total }],
  budget_allocation: { products: Number, shipping: Number, buffer: Number },
  total_cost: Number,
  impact_summary: String,   // AI-generated positioning text
  created_at: Date
}
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB (Atlas or local)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rayeva-ai.git
cd rayeva-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (use `.env.backend.example` as reference):

```env
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/sustainable-commerce
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
FRONTEND_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` and the backend on `http://localhost:4000`.

### 4. Verify

- Visit `http://localhost:4000/health` — should return `{ "status": "ok" }`
- Visit `http://localhost:5173` — the storefront UI should load

---

## 📡 API Endpoints

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | List 10 most recent orders |
| `POST` | `/api/orders` | Place a new order (triggers impact calculation + AI summary) |
| `GET` | `/api/orders/:id` | Get a specific order by ID |

### Chat (AI Support)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat/message` | Send a message, receive AI bot reply + intent classification |
| `GET` | `/api/chat/:id` | Retrieve full chat history by chat ID |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |

---

## ✅ Technical Requirements Checklist

| Requirement | Implementation |
|-------------|---------------|
| **Structured JSON outputs** | All API responses return structured JSON (impact_data, chat responses with intent/escalation fields) |
| **Prompt + response logging** | Every Gemini call is logged to `AILog` collection with module_name, prompt, and response |
| **Environment-based API key management** | `GEMINI_API_KEY`, `MONGODB_URI`, etc. loaded via `dotenv` from `.env` file |
| **Clear separation of AI and business logic** | Business rules in `business/` (pure functions), AI in `services/aiService.js`, controllers handle HTTP only |
| **Error handling and validation** | Input validation in controllers, try-catch with graceful fallbacks in AI service, escalation safety net in chat |

---

## 📄 License

This project was built as part of the **Rayeva AI Systems Assignment** for the Full Stack / AI Intern role.

## 👨‍💻 Developer
Name: Nikunj Bhardwaj

Email: bhardwajrana123@gmail.com

GitHub: https://github.com/nikunjbhardwaj

