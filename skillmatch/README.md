# SkillMatcher

SkillMatcher is an AI-assisted career copilot that now ships with two complementary engines: a resume/job-description comparison workflow and a resume-only job discovery engine. The application extracts skills, highlights matches and gaps, recommends the next steps, and keeps accessible histories for future review.

## 🔍 High-Level Workflow

1. **User Authentication** – Users sign in through the in-app Auth form (credentials persisted locally for demos).
2. **Input Collection** – Candidates upload or paste:
  - Resume (`.pdf`, `.docx`, or `.txt`; documents are parsed client-side).
  - Job description (`.pdf`, `.docx`, or `.txt`).
   - Target job title (used for history metadata).
3. **Client Preprocessing** – Files are parsed, and raw text is trimmed before sending to the backend.
4. **Supabase Edge Function Invocation (Analysis)** – The frontend calls `supabase/functions/analyze-resume` with resume text, JD text, resume filename, and job title.
5. **Supabase Edge Function Invocation (Job Discovery)** – The new Get Suitable Job view calls `supabase/functions/recommend-job` with resume text and filename to compute role suggestions across technical and non-technical ladders.
6. **Skill Analysis & Recommendation Pipelines (Edge Functions)**
   - **Extraction:** Custom `CustomSkillExtractor` scans both texts against an extensive skill database plus heuristic detection.
   - **Comparison:** `CustomJobMatcher` scores similarity, classifies matches (`EXACT`, `WEAK`, `MISSING`), and builds the comparison rows.
  - **Role Suggestion:** The job discovery engine blends core vs. complementary skills to rank recommended job titles (engineering, product, design, marketing, content, customer success, and more).
  - **Response Shapes:** Analysis results include comparison tables; job suggestions return ranked recommendations with matched and missing skills.
7. **Result Persistence & Presentation**
  - **Session Storage:** Latest analysis or job recommendation is cached for immediate navigation.
  - **Local Storage:** Historic results per user are stored for the History and Job Suggestion archives.
  - **UI Rendering:** The Analyze Results screen presents summary cards; Job Suggestions highlights best-fit roles; History offers drill-down details including the full comparison table.

## 🧩 Feature Breakdown

| Feature | Description |
| --- | --- |
| Resume & JD Upload | Drag-and-drop or click-to-upload supports `.pdf`, `.docx`, and `.txt` with inline text pasting option. |
| Document Text Extraction | Client-side parsing via a utility in `src/utils/pdfParser.ts` (PDF.js + DOCX support). |
| AI-Powered Skill Extraction | Deno-based Supabase Edge Function performs canonical skill detection via regex and alias mapping. |
| Match Scoring | Calculates match percentage based on exact and fuzzy matches with configurable thresholds. |
| Comparison Table | Displays per-skill alignment (resume vs job) with status chips, category labels, and priority tags. |
| Recommendations | Generates actionable insights tailored to score bands and missing skills. |
| Analysis History | Lists prior analyses with expandable details, badge summaries, recommendations, and an embedded comparison table. |
| Get Suitable Job | Resume-only engine surfacing technical and non-technical job titles, match scores, matched/missing skills, and keeps a dedicated history. |
| Non-Technical Skill Coverage | Expanded taxonomy enables analysis for product, design, marketing, content, customer success, and coordination roles. |
| Secure Deletion | Users confirm via password before deleting single or all history entries. |
| Responsive UI | Built with shadcn/ui & Tailwind for consistent styling in both desktop & mobile contexts. |

## 🏗️ Architecture Overview

```text
┌────────────────────────────┐
│          React UI          │
│  - AnalyzeView             │
│  - JobSuggestionsView      │
│  - HistoryView             │
│  - ResultsDisplay          │
│  - Shared UI components    │
└────────────┬───────────────┘
             │ fetch (Supabase functions.invoke)
┌────────────▼───────────────┐
│    Supabase Edge Function  │
│    (supabase/functions/)   │
│      analyze-resume        │
│      recommend-job         │
│  - Skill extraction        │
│  - Match & fit scoring     │
│  - Recommendations         │
└────────────┬───────────────┘
             │ JSON response
┌────────────▼───────────────┐
│     Browser Storage        │
│  - sessionStorage (latest) │
│  - localStorage (history)  │
└────────────────────────────┘
```

### Frontend Flow Details
- **Routing:** Vite + React Router with three primary views (`Analyze`, `Jobs`, `History`).
- **State Management:** Local component state + storage utilities (`src/utils/storage.ts`).
- **Comparison Synthesis:** `src/utils/comparisonBuilder.ts` normalizes comparison rows to guarantee table data, even if the backend format evolves.
- **UI Components:** Leveraging shadcn/ui primitives (`button`, `card`, `table`, `badge`, `progress`, etc.) for consistent design.

### Backend Flow Details
- **Runtime:** Supabase Edge Functions (Deno).
- **Key Modules:**
  - `SkillDatabase`: canonical & alias mapping for hundreds of skills spanning programming, frameworks, cloud, data, product, design, marketing, content creation, customer success, and soft-skill domains.
  - `CustomSkillExtractor`: whole-word regex detection plus heuristic term inclusion.
  - `CustomJobMatcher`: string similarity scoring (via `string-similarity-js`) to classify match strength and populate comparison rows.
  - `generateRecommendations`: Crafts guidance strings based on score tiers and missing skills volume.
  - `scoreJobFit` (recommend-job): blends core vs. complementary skill coverage to rank recommended job titles—including design, content, customer-facing, and marketing roles—and surface missing competencies.
- **Response Contract:**
  ```ts
  interface AnalysisResult {
    id: string;
    timestamp: string;
    resumeFileName: string;
    jobTitle: string;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    extraSkills: string[];
    recommendations: Array<{ skill?: string; reason: string }>;
    comparison: ComparisonRow[];
  }
  ```

## 🛠️ Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React + TypeScript, Vite, shadcn/ui, Tailwind CSS, Lucide icons |
| State & Data | Browser storage (local/session), custom hooks/utilities |
| Backend | Supabase Edge Functions (Deno), `string-similarity-js` |
| Tooling | ESLint (flat config), PostCSS, Bun lockfile (project uses npm scripts), React Query foundation |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm (or Bun if you prefer; lockfile is provided)
- Supabase project (for deploying the edge function) – optional if using the hosted version.

### Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run production build
npm run build
```

- The dev server runs at `http://localhost:5173` by default.
- Supabase function invocation expects the Supabase client to be configured in `src/integrations/supabase/client.ts` (set your project URL and anon key).

### Deploying the Edge Function

```bash
# Assuming the Supabase CLI is installed and project linked
supabase functions deploy analyze-resume
supabase functions deploy recommend-job
```

## 📂 Key Directory Map

```
src/
├── components/
│   ├── AnalyzeView.tsx        # main analysis workflow UI
│   ├── JobSuggestionsView.tsx # resume-only job recommendation engine
│   ├── HistoryView.tsx        # analysis history with comparison tables
│   ├── ResultsDisplay.tsx     # summary shown post-analysis
│   └── ui/                    # shadcn-derived primitive components
├── hooks/
│   └── use-toast.ts           # toast helper hook
├── integrations/
│   └── supabase/
│       └── client.ts          # Supabase client config
├── types/
│   └── index.ts               # Shared TypeScript interfaces
├── utils/
│   ├── comparisonBuilder.ts   # Ensures comparison rows are always present
│   ├── pdfParser.ts           # PDF/DOCX parsing helper
│   ├── skillMatcher.ts        # Legacy matcher reference (kept for experimentation)
│   └── storage.ts             # localStorage + sessionStorage helpers
└── pages/
    ├── Index.tsx              # Root view with layout switching
    └── NotFound.tsx           # Fallback route

supabase/
└── functions/
    ├── analyze-resume/
    │   └── index.ts           # Edge function handling the core analysis
    └── recommend-job/
        └── index.ts           # Edge function generating resume-based job suggestions
```

## 🧪 Testing & Validation
- Run `npm run build` to ensure TypeScript types and Vite bundling succeed.
- Supabase Edge Function can be tested locally using the Supabase CLI (`supabase functions serve analyze-resume`).
- Utilize browser devtools to inspect network payloads and storage entries for debugging.

## 🗺️ Roadmap Ideas
- OAuth-based authentication & multi-user cloud sync.
- Admin dashboard for visualization of aggregate skill gaps.
- Configurable skill database for organization-specific vocabularies.
- Exportable comparison reports (PDF/CSV) for recruiters.

## 📄 License
This project currently does not declare a license. Confirm with the repository owner before distributing or deploying in production.

---

Feel free to adapt this document for presentations or technical demos. It covers the end-to-end flow, tech stack, and the reasoning behind key architectural choices so stakeholders can grasp the system quickly.
