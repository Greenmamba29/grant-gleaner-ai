

# Autonomous Grant Intelligence System (AGIS) - Implementation Plan

## Overview

Transform Grant Hunter Pro from a manual search tool into a fully autonomous grant intelligence platform with:
- **Push-based discovery**: Daily automated scans across multiple grant APIs
- **AI qualification engine**: Auto-scoring using your Go/No-Go matrix
- **HITL approval workflow**: In-app approval dashboard with action buttons
- **Team builder**: LinkedIn-alternative integrations for finding credentialed partners
- **Grant writing acceleration**: Template-based proposal generation

---

## Current State Analysis

| Component | Status |
|-----------|--------|
| Perplexity Search | Working (edge function deployed) |
| Database | Empty (no tables defined) |
| Authentication | Not implemented |
| Scheduled Jobs | Not implemented |
| HITL Interface | Not implemented |
| LinkedIn Integration | Not implemented |

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA INGESTION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Scheduled Edge Function: grant-scanner] - Runs Daily at 6 AM UTC          │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Grants.gov  │  │ Perplexity  │  │ OpenGrants  │  │ RSS Feeds   │        │
│  │    API      │  │   sonar     │  │    API      │  │ (EU/World)  │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         └─────────────────┴─────────────────┴─────────────────┘              │
│                                    │                                         │
│                                    ▼                                         │
│                    ┌───────────────────────────────┐                         │
│                    │  Raw Opportunities Queue      │                         │
│                    │  (opportunities_raw table)    │                         │
│                    └───────────────┬───────────────┘                         │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      QUALIFICATION ENGINE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Edge Function: qualify-opportunity]                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Lovable AI (Gemini 3 Flash) - Go/No-Go Scoring                     │    │
│  │                                                                      │    │
│  │  Input: Raw opportunity + Company Profile + Scoring Matrix           │    │
│  │  Output: { score: 0-100, category, matchReasons[], risks[] }        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                     │                                        │
│                                     ▼                                        │
│         ┌───────────────────────────┬───────────────────────────┐           │
│         │                           │                           │           │
│    Score > 85                  Score 55-84                 Score < 55       │
│         │                           │                           │           │
│         ▼                           ▼                           ▼           │
│  ┌─────────────┐           ┌─────────────┐           ┌─────────────┐       │
│  │ Priority A  │           │ Priority B  │           │  Archive    │       │
│  │ HITL Alert  │           │ Weekly List │           │  (No-Go)    │       │
│  └─────────────┘           └─────────────┘           └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HITL APPROVAL DASHBOARD                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Frontend: /dashboard/inbox]                                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  🚨 HIGH-VALUE OPPORTUNITY DETECTED                                  │    │
│  │                                                                      │    │
│  │  Title: DOE Battery Recycling Workforce Development                  │    │
│  │  Score: 92/100 | Deadline: 45 days | Amount: $50M                   │    │
│  │                                                                      │    │
│  │  Match Reasons:                                                      │    │
│  │  ✓ Lithium recycling (primary keyword)                              │    │
│  │  ✓ Workforce development (autism employment angle)                  │    │
│  │  ✓ Underserved communities (bonus points)                           │    │
│  │                                                                      │    │
│  │  [✅ APPROVE & DRAFT]  [🔍 FIND TEAM]  [⏰ SNOOZE]  [❌ REJECT]      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                          ┌──────────┴──────────┐
                          ▼                      ▼
┌────────────────────────────────┐  ┌────────────────────────────────────────┐
│    GRANT WRITING ENGINE        │  │      TEAM BUILDER                       │
├────────────────────────────────┤  ├────────────────────────────────────────┤
│  [Edge: perplexity-write]      │  │  [Edge: find-team-members]              │
│                                │  │                                         │
│  Templates:                    │  │  APIs:                                  │
│  - Specific Aims               │  │  - Scrapin.io (LinkedIn proxy)          │
│  - Budget Justification        │  │  - People Data Labs                     │
│  - Logic Model                 │  │  - PhantomBuster                        │
│  - Narrative sections          │  │                                         │
│                                │  │  Finds: "autism specialist" +           │
│                                │  │  "lithium chemist" + "water expert"     │
└────────────────────────────────┘  └────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Database Schema & Core Infrastructure

Create the foundation tables and types for the entire system.

**Tables to Create:**

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `company_profiles` | Your organization's capabilities matrix | sectors, keywords, team_credentials, cost_share_capacity |
| `opportunities_raw` | Incoming grant data (pre-scoring) | source, external_id, title, agency, amount, deadline, raw_data |
| `opportunities_scored` | Qualified opportunities with scores | opportunity_id, score, category, match_reasons, risks, status |
| `applications` | Grant applications in progress | opportunity_id, status, content_sections, team_members |
| `team_candidates` | Potential partners/collaborators | name, linkedin_url, skills, email, match_score |
| `search_history` | Audit trail of all searches | query, filters, results_count, timestamp |
| `api_configs` | External API credentials and settings | api_name, endpoint, is_active, last_sync |

**Key Columns for Scoring Matrix:**

```text
opportunities_scored:
├── strategic_fit_score (0-40)
├── win_probability_score (0-30)
├── resource_efficiency_score (0-20)
├── strategic_value_score (0-10)
├── bonus_points (0-25)
├── capacity_penalty (-15 to 0)
├── total_score (calculated)
├── decision ("priority_a" | "priority_b" | "conditional" | "no_go")
└── hitl_status ("pending" | "approved" | "rejected" | "snoozed")
```

---

### Phase 2: Grant Scanner Edge Function

**New Edge Function: `grant-scanner`**

Runs on a schedule (daily) and aggregates opportunities from multiple sources:

**Source 1: Perplexity Search (Already Implemented)**
- Enhance with intersectional keywords: `"lithium recycling" OR "autism employment" OR "clean water" OR "underserved education"`

**Source 2: Grants.gov API**
- Endpoint: `https://api.simpler.grants.gov/v1/opportunities/search`
- Keywords: Battery, circular economy, STEM education, disability, water treatment
- Requires: API key (will request via secrets tool)

**Source 3: RSS Aggregation**
- EU Funding & Tenders Portal
- Devex (international development)
- World Bank Procurement

**Workflow:**
1. Fetch new opportunities from all sources
2. Deduplicate by title + agency
3. Insert into `opportunities_raw` table
4. Trigger qualification engine

---

### Phase 3: AI Qualification Engine

**New Edge Function: `qualify-opportunity`**

Uses Lovable AI (Gemini 3 Flash) to score each opportunity against your profile.

**System Prompt (Go/No-Go Matrix):**

```text
You are the Grant Qualification Engine for an organization focused on:
- Lithium recycling & critical minerals (primary)
- Autism-inclusive employment & education technology
- Clean water infrastructure for underserved communities
- Carbon neutrality & circular economy

SCORING MATRIX:
A. Strategic Fit (40 points max)
   - Technical Alignment (0-15): 15=Lithium recycling, 10=Critical minerals/water, 5=General STEM
   - Social Impact Alignment (0-15): 15=Autism employment + underserved, 10=Disability/education
   - Geographic Priority (0-10): 10=USA/EU priority regions, 5=Eligible but not priority

B. Win Probability (30 points max)
   - Competition Density (0-10): 10=<50 apps (niche), 5=50-200, 0=>200
   - Differentiation Potential (0-10): 10=Unique autism-lithium angle, 5=Tech only
   - Track Record Match (0-10): Based on prior wins with funder type

C. Resource Efficiency (20 points max)
   - Cost-Benefit Ratio (0-10): Award size vs effort required
   - Cost-Share Leverage (0-10): 10=Industry partner committed, 5=In-kind only

D. Strategic Value (10 points max)
   - Partnership Access (0-5): Opens door to major partners
   - Future Pipeline (0-5): Phase 1 of multi-phase program

BONUSES:
+20 if intersectionality matches (social-tech hybrid)
+10 if award >$5M AND cost-share <25%
-15 if >3 other proposals due within 30 days

DECISION THRESHOLDS:
85-100: priority_a (immediate action)
70-84: priority_b (weekly review)
55-69: conditional (only if 60% content recyclable)
<55: no_go (archive)

Return JSON: { score, strategic_fit, win_probability, resource_efficiency, 
               strategic_value, bonus, penalty, decision, match_reasons[], risks[] }
```

---

### Phase 4: HITL Dashboard & Notifications

**New Pages:**

| Route | Purpose |
|-------|---------|
| `/dashboard` | Overview with metrics, pending actions, pipeline |
| `/dashboard/inbox` | HITL approval queue for high-scoring opportunities |
| `/dashboard/pipeline` | Kanban board for approved opportunities |
| `/opportunities/:id` | Detailed view with scoring breakdown |

**HITL Actions:**

| Button | Action Triggered |
|--------|-----------------|
| ✅ Approve & Draft | Move to pipeline, trigger `perplexity-write` for initial sections |
| 🔍 Find Team | Trigger `find-team-members` with required credentials |
| ⏰ Snooze | Set reminder for 24h/7d |
| ❌ Reject | Archive with rejection reason |

**Notification System:**
- In-app toast notifications for Priority A opportunities
- Email digest (optional, future phase)
- Dashboard badge showing pending actions count

---

### Phase 5: Team Builder Integration

**New Edge Function: `find-team-members`**

Since LinkedIn's native API restricts profile searches, we'll use alternative providers:

**Option A: Scrapin.io (Recommended)**
- Cost: ~$1,000/year for credits
- Capability: Real-time LinkedIn profile data
- Use case: Find "autism employment specialist" + "lithium chemist"

**Option B: People Data Labs**
- Cost: $499+/month
- Capability: 1.5B person records, skills matching
- Use case: Find experts by credentials without LinkedIn

**Workflow:**
1. User clicks "Find Team" on an opportunity
2. System extracts required credentials from grant requirements
3. API searches for matching professionals
4. Results stored in `team_candidates` table
5. User can view profiles and initiate outreach

---

### Phase 6: Grant Writing Assistant

**Enhanced Edge Function: `perplexity-write`**

Template-based grant section generation using Perplexity for research + Lovable AI for structuring.

**Templates to Implement:**

| Section | Template Variables |
|---------|-------------------|
| Specific Aims | {problem_statement}, {innovation}, {aims[]}, {outcomes} |
| Budget Justification | {personnel[]}, {equipment[]}, {travel[]}, {subawards[]} |
| Logic Model | {inputs[]}, {activities[]}, {outputs[]}, {outcomes[]}, {impact[]} |
| Narrative | {urgency}, {capacity}, {innovation}, {team}, {timeline} |

**User Flow:**
1. User approves opportunity in HITL dashboard
2. System creates application record with empty sections
3. User navigates to `/write/:applicationId`
4. Each section has "AI Draft" button
5. AI generates content using template + opportunity details + company profile
6. User reviews, edits, exports

---

## API Master Reference

| API | Type | Auth | Rate Limit | Cost | Coverage | Team Building |
|-----|------|------|------------|------|----------|--------------|
| **Perplexity** | REST | API Key | 50/min | Connected | Global search | No |
| **Grants.gov** | REST | X-API-Key | 1,000/day | Free | USA Federal | No |
| **Lovable AI** | REST | Auto | Per-workspace | Included | AI scoring | No |
| **Scrapin.io** | REST | Bearer | Pay-per-credit | ~$1K/yr | LinkedIn profiles | Yes |
| **People Data Labs** | REST | API Key | 1K/mo free | $499+/mo | Global professionals | Yes |
| **PhantomBuster** | No-code | Cookie | Plan-based | $56+/mo | LinkedIn + outreach | Yes |

---

## Files to Create/Modify

**New Edge Functions:**
- `supabase/functions/grant-scanner/index.ts` - Daily aggregation
- `supabase/functions/qualify-opportunity/index.ts` - AI scoring
- `supabase/functions/find-team-members/index.ts` - Team search
- `supabase/functions/perplexity-write/index.ts` - Grant writing

**New Frontend Pages:**
- `src/pages/Dashboard.tsx` - Main dashboard
- `src/pages/DashboardInbox.tsx` - HITL approval queue
- `src/pages/DashboardPipeline.tsx` - Kanban board
- `src/pages/OpportunityDetail.tsx` - Detailed scoring view
- `src/pages/ApplicationWrite.tsx` - Grant writing workspace

**New Components:**
- `src/components/dashboard/OpportunityCard.tsx` - Scored opportunity card
- `src/components/dashboard/HITLActions.tsx` - Approval buttons
- `src/components/dashboard/ScoreBreakdown.tsx` - Visual scoring matrix
- `src/components/dashboard/TeamCandidateCard.tsx` - Team member display
- `src/components/writing/SectionEditor.tsx` - Grant section editor
- `src/components/writing/AIAssistant.tsx` - Writing assistant panel

**New API Layer:**
- `src/lib/api/opportunities.ts` - Opportunity CRUD
- `src/lib/api/applications.ts` - Application CRUD
- `src/lib/api/team.ts` - Team search

---

## Secrets Required

| Secret Name | Source | Purpose |
|-------------|--------|---------|
| PERPLEXITY_API_KEY | Already connected | Grant search |
| GRANTS_GOV_API_KEY | User provides | Federal grants API |
| SCRAPIN_API_KEY | User provides (optional) | LinkedIn alternative |
| PDL_API_KEY | User provides (optional) | People Data Labs |

---

## Recommended Implementation Order

1. **Database schema** - Create all tables with proper RLS
2. **Company profile setup** - UI to define your organization's capabilities
3. **Grant scanner + qualification** - Automated discovery with scoring
4. **HITL dashboard** - Approval interface with action buttons
5. **Grant writing** - Template-based proposal generation
6. **Team builder** - Optional LinkedIn alternative integration

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Daily new opportunities surfaced | 20-50 |
| Score accuracy (user validation) | >85% agreement |
| HITL response time | <24 hours for Priority A |
| Grant drafting time reduction | 60% faster than manual |
| Win rate improvement | 2x industry average (15% → 30%) |

