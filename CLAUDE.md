@AGENTS.md

# Awakening Journal (觉醒日志)

A Next.js app for personal awakening journaling with dopamine-driven micro-interactions.

## Data Persistence

Current: **local filesystem** (`data/journal/*.md`) — works with `npm run dev`.

Vercel Serverless functions cannot persist `fs.writeFileSync`. Migration path:

- **Short-term**: Run locally, commit journal files via git
- **Mid-term**: Swap API layer to Vercel Blob Storage or Upstash Redis
- **Long-term**: Migrate to PlanetScale (MySQL) or Supabase (PostgreSQL)

## Tech Stack

- Next.js 16 + React 19 + TypeScript 5
- Tailwind CSS v4 (CSS-first config, `@theme` directives)
- `gray-matter` for frontmatter parsing
- `react-markdown` + `remark-gfm` for MD rendering
- `date-fns` for date utilities
- `lucide-react` for icons

## Key Conventions

- All data-read functions (`getAllJournalMetas`, `getSiteMeta`, etc.) use `fs` and must run in Server Components or API routes — never in Client Components
- Dark mode uses `.dark` class on `<html>`, toggled by `ThemeProvider` (reads `localStorage` key `awakening-theme`)
- Tailwind theme tokens are defined in both `tailwind.config.ts` (for IDE IntelliSense) and `globals.css` `@theme` block (for actual CSS generation in v4)
