# Golf Swing

AI-powered golf swing analysis app.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini (`@google/genai` SDK)
- **Deployment**: Vercel

## Project Structure

```
src/
  app/          # Next.js App Router pages and layouts
    api/        # API routes (Route Handlers)
    globals.css # Global styles (Tailwind import)
    layout.tsx  # Root layout
    page.tsx    # Home page
```

## Commands

```sh
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Conventions

- Use the `@/*` path alias for imports from `src/`
- Server Components by default; add `"use client"` only when needed
- API routes go in `src/app/api/`
- Environment variables: access via `process.env` in server code
  - `GEMINI_API_KEY` — Google Gemini API key (set in Vercel)
