# Project File Usage Guide

The table below maps every tracked file in the repository to its purpose to help you navigate the project quickly. Folder rows summarize the contents beneath them.

| Path | Purpose |
| --- | --- |
| `bun.lockb` | Bun package lock produced for dependency resolution (kept alongside npm for compatibility). |
| `components.json` | shadcn/ui component registry describing generated UI primitives. |
| `eslint.config.js` | Flat ESLint configuration shared across the Vite + React project. |
| `index.html` | Vite entry HTML file mounting the React application. |
| `package.json` | NPM manifest defining dependencies, scripts, and project metadata. |
| `postcss.config.js` | PostCSS setup used by Tailwind during builds. |
| `README.md` | High-level project overview, workflows, and setup instructions. |
| `tailwind.config.ts` | Tailwind CSS configuration plus custom theme tokens. |
| `tsconfig.app.json` | TypeScript compiler options scoped to the React app source. |
| `tsconfig.json` | Root TypeScript config extending base settings for tooling. |
| `tsconfig.node.json` | TypeScript config for Node-based tooling (tests, scripts). |
| `vite.config.ts` | Vite build and dev server configuration. |
| `workflow.md` | Development workflow notes and historical context. |
| `public/robots.txt` | Robots exclusion file served statically. |
| `src/App.css` | Legacy/global styles for the App component (currently minimal). |
| `src/App.tsx` | Vite scaffold entry (unused in favor of page routing, kept for reference). |
| `src/index.css` | Global Tailwind imports and base styles. |
| `src/main.tsx` | React entry point bootstrapping the `Index` page into the DOM. |
| `src/vite-env.d.ts` | Vite-specific TypeScript declarations. |
| `src/components/AnalyzeView.tsx` | Primary resume vs. job analysis workflow UI, handling uploads and invoking Supabase. |
| `src/components/AuthForm.tsx` | Authentication form handling demo credentials and onboarding. |
| `src/components/ComparisonTable.tsx` | Renders per-skill comparison rows in a sortable, styled table. |
| `src/components/Header.tsx` | Top navigation bar controlling view switching and logout. |
| `src/components/HistoryView.tsx` | Displays past analysis history with expandable details and deletion controls. |
| `src/components/JobSuggestionsView.tsx` | Resume-only job recommendation experience with history management. |
| `src/components/ResultsDisplay.tsx` | Post-analysis summary cards, recommendations, and comparison shortcuts. |
| `src/components/ui/*` | shadcn/ui primitive components (buttons, cards, dialogs, etc.) reused across the UI. |
| `src/hooks/use-mobile.tsx` | Hook detecting viewport breakpoints for responsive behavior. |
| `src/hooks/use-toast.ts` | Toast helper hook wrapping shadcn/sonner notifications. |
| `src/integrations/supabase/client.ts` | Supabase browser client initialization with project keys. |
| `src/integrations/supabase/types.ts` | Generated Supabase database types for strongly typed queries. |
| `src/lib/utils.ts` | Shared utility helpers (`cn`, formatting helpers) used across components. |
| `src/pages/ComparisonPage.tsx` | Dedicated page (legacy) for presenting comparison data. |
| `src/pages/Index.tsx` | Root page managing authentication gating and view selection. |
| `src/pages/NotFound.tsx` | 404 fallback route. |
| `src/pages/RecommendationsPage.tsx` | Legacy recommendations UI (superseded by new flows). |
| `src/types/index.ts` | Shared TypeScript interfaces (users, analysis results, job suggestions). |
| `src/utils/comparisonBuilder.ts` | Builds normalized comparison rows for the table view. |
| `src/utils/customSkillExtractor.ts` | Client-side skill extraction helpers (alternate/legacy usage). |
| `src/utils/jobRecommender.ts` | Legacy job recommender logic (kept for experimentation). |
| `src/utils/pdfParser.ts` | Client-side PDF parsing utilities for resume/JD uploads. |
| `src/utils/skillMatcher.ts` | Legacy skill matching algorithms (reference implementation). |
| `src/utils/storage.ts` | Local/session storage helpers for analyses, job suggestions, and users. |
| `supabase/config.toml` | Supabase CLI configuration for local development. |
| `supabase/functions/analyze-resume/index.ts` | Edge function scoring resume vs JD matches and returning analysis results. |
| `supabase/functions/recommend-job/index.ts` | Edge function generating resume-based job recommendations. |
