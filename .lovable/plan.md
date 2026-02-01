
# Grant Hunter Pro - Perplexity Integration Plan

## Overview
Transform Grant Hunter Pro from a landing page into a fully functional grant discovery and application platform powered by Perplexity's AI search capabilities.

---

## What This Integration Will Enable

**Real-Time Grant Search**
- Search across grant databases using AI-powered web search
- Get grounded, citation-backed results from actual funding sources
- Filter by funding amount, deadline, eligibility, and more

**AI-Powered Grant Writing**
- Generate grant proposals based on opportunity requirements
- Optimize applications using Perplexity's reasoning capabilities
- Real-time feedback and improvement suggestions

**Complete Workflow**
- Discover → Analyze → Write → Submit (all in one platform)

---

## Implementation Steps

### Step 1: Enable Backend Infrastructure
First, we need to enable Lovable Cloud to support edge functions and the Perplexity integration. This provides:
- Serverless edge functions for API calls
- Secure secrets management for API keys
- Database for storing grant opportunities and applications

### Step 2: Connect Perplexity
Link your Perplexity API connection to this project. You already have Perplexity connections available in your workspace.

### Step 3: Create Edge Functions

**Grant Search Function (`perplexity-search`)**
- Searches for grant opportunities using Perplexity's grounded search
- Returns structured results with sources and citations
- Supports filtering by domain, date, and keywords

**Grant Analysis Function (`perplexity-analyze`)**
- Deep-dive analysis of specific grant opportunities
- Extracts requirements, deadlines, and eligibility criteria
- Generates match scores based on company profile

**Grant Writing Function (`perplexity-write`)**
- AI-assisted proposal generation
- Tailored to specific grant requirements
- Iterative refinement with real-time feedback

### Step 4: Build the Application Interface

**New Pages**

| Page | Purpose |
|------|---------|
| `/search` | Grant discovery with AI-powered search |
| `/opportunities` | Saved opportunities and pipeline tracking |
| `/write/:id` | Grant application workspace |
| `/dashboard` | Personal dashboard with metrics |

**New Components**

| Component | Description |
|-----------|-------------|
| `GrantSearchBar` | AI search input with filters |
| `GrantResultCard` | Display search results with citations |
| `OpportunityDetail` | Full grant details and requirements |
| `ApplicationEditor` | Rich text editor for writing grants |
| `AIAssistantPanel` | Perplexity-powered writing assistant |
| `PipelineBoard` | Kanban-style opportunity tracker |

### Step 5: Connect Landing Page CTAs
Update the existing buttons to navigate to the new functional pages:
- "Start Hunting Grants" → `/search`
- "Activate System Now" → `/search`
- Dashboard preview → `/dashboard`

---

## Technical Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  Search Page    │  Opportunities  │  Application Editor │
│  - GrantSearchBar   - PipelineBoard    - ApplicationEditor
│  - GrantResultCard  - OpportunityDetail - AIAssistantPanel
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│               Supabase Edge Functions                    │
├─────────────────────────────────────────────────────────┤
│  perplexity-search  │  perplexity-analyze  │  perplexity-write
│  - Web search       │  - Deep analysis     │  - Proposal generation
│  - Structured output│  - Requirement extract│  - Iterative refinement
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                   Perplexity API                         │
├─────────────────────────────────────────────────────────┤
│  sonar-pro model for multi-step reasoning with citations │
└─────────────────────────────────────────────────────────┘
```

---

## Data Models

**Opportunities Table**
- id, title, agency, amount, deadline
- description, requirements, eligibility
- source_url, match_score, status
- created_at, updated_at

**Applications Table**
- id, opportunity_id, user_id
- content (JSON for sections)
- status (draft, submitted, awarded)
- ai_feedback, score_estimate
- created_at, submitted_at

**Search History Table**
- id, query, filters, results_count
- created_at

---

## Key Features by Priority

**Phase 1 (Core Search)**
- Grant search with Perplexity
- Results display with citations
- Save opportunities to pipeline

**Phase 2 (Application Writing)**
- AI-powered proposal editor
- Section-by-section assistance
- Requirement checklist

**Phase 3 (Advanced Features)**
- Match scoring algorithm
- Deadline notifications
- Export/submit functionality

---

## Prerequisites Before Implementation

1. **Enable Lovable Cloud** - Required for edge functions
2. **Connect Perplexity** - Link your existing connection to this project

---

## Estimated Scope

| Category | Items |
|----------|-------|
| Edge Functions | 3 functions |
| New Pages | 4 pages |
| New Components | 10+ components |
| Database Tables | 3 tables |

This is a significant feature set. I recommend implementing in phases, starting with the core search functionality.
