# AK Group of Real Estate

A premium cinematic luxury real estate website for AK Group, a Tamil Nadu-based real estate developer. Features a matte-black / metallic-orange dark palette, Framer Motion animations, Canvas 2D particle field, Lenis smooth scroll, and a fully-wired Express + PostgreSQL backend with admin panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/ak-realestate run dev` — run the frontend (port varies, proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Lenis, shadcn/ui, Embla Carousel
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)
- Build: esbuild (CJS bundle)

## Where things live

- Frontend: `artifacts/ak-realestate/src/`
  - `components/` — NavBar, HeroSection, PropertySection, AboutSection, LogoShowcase, ContactSection, Footer, SectionDivider, ParticleCanvas
  - `pages/Home.tsx` — main page composition
  - `pages/Admin.tsx` — hidden admin panel at /admin
- Backend: `artifacts/api-server/src/routes/`
  - `properties.ts` — GET /api/properties, /api/properties/featured, /api/properties/:slug, /api/search
  - `contact.ts` — POST /api/contact
  - `admin.ts` — GET/POST/PATCH/DELETE /api/admin/properties, GET /api/admin/contacts
  - `settings.ts` — GET/PATCH /api/settings
- DB schema: `lib/db/src/schema/` (properties, contacts, site_settings tables)
- OpenAPI spec: `lib/api-spec/openapi.yaml` (source of truth for API contract)
- Generated hooks: `lib/api-client-react/` (do not edit manually — run codegen)
- Generated Zod: `lib/api-zod/` (do not edit manually — run codegen)
- Logo: `artifacts/ak-realestate/public/ak-logo.png`

## Architecture decisions

- Contract-first API: OpenAPI spec drives Orval codegen for React Query hooks + Zod schemas used in both frontend and backend
- Canvas 2D particle system instead of Three.js/WebGL (WebGL unavailable in sandboxed Replit preview)
- Lenis smooth scroll initialized in App.tsx at root level
- Admin panel is a hidden route (/admin) — no nav link — for internal property/contact/settings management
- ContactSection and PropertySection pull live data from API; settings (address, phone, WhatsApp) are editable via Admin

## Product

- Hero section: word-by-word cinematic title reveal with particle canvas background and Chennai skyline SVG
- Properties: Embla carousel of featured listings fetched live from DB, with status badges and hover effects
- About: animated counters (years, projects, sq.ft, families) and four brand pillars
- Logo showcase: breathing logo animation with multi-layer glow
- Contact: form wired to /api/contact (saves to DB), WhatsApp link, live office info from settings
- Admin (/admin): manage properties (list/create/delete), view contact submissions, update site settings

## User preferences

- Dark matte black (#0a0a0a) + metallic orange (primary) palette only
- Playfair Display (serif) for headings, Inter for body
- No emojis anywhere in code or UI
- WebGL not available — Canvas 2D only

## Gotchas

- NEVER use `import React from "react"` — Vite JSX transform handles it; unused imports cause TS errors
- SiLinkedin2 does not exist in react-icons/si — use Lucide's `Linkedin` instead
- `ease` in Framer Motion `Variants` needs `as [number, number, number, number]` type assertion for cubic bezier arrays
- api-server is a compiled esbuild bundle — must restart workflow after route changes
- Codegen must be re-run after any openapi.yaml changes: `pnpm --filter @workspace/api-spec run codegen`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
