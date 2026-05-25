# AK Group of Real Estate

Premium cinematic luxury real estate website. React+Vite frontend, Supabase backend (PostgreSQL + Auth), deployable on Vercel.

## Run & Operate

- `pnpm --filter @workspace/ak-realestate run dev` — frontend dev server
- `pnpm --filter @workspace/ak-realestate run typecheck` — type check
- Required env (prefix `VITE_`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Without env vars, app runs in demo mode with hardcoded properties

## Stack

- React 18 + Vite + TypeScript + Tailwind CSS
- Framer Motion (animations), Lenis (smooth scroll), Embla Carousel
- Supabase JS client (DB + Auth — no separate API server needed)
- shadcn/ui components
- wouter (client-side routing)
- Vercel (static SPA deploy via `vercel.json` rewrites)

## Where things live

- `artifacts/ak-realestate/src/`
  - `lib/supabase.ts` — Supabase client + all query helpers + demo data fallback
  - `lib/types.ts` — TypeScript types (Property, SiteSettings, etc.)
  - `pages/Home.tsx` — home page (all sections)
  - `pages/PropertyDetail.tsx` — `/property/:slug` — image/video slider + attributes
  - `pages/Admin.tsx` — `/admin` — protected dashboard (Properties, Contacts, Settings)
  - `pages/AdminLogin.tsx` — `/admin/login` — Supabase email/password auth
  - `components/admin/PropertyForm.tsx` — create/edit form with images, YouTube, attributes
  - `components/PropertySection.tsx` — carousel pulling from Supabase
  - `components/ContactSection.tsx` — contact form → Supabase
- `artifacts/ak-realestate/vercel.json` — SPA rewrite rules
- `artifacts/ak-realestate/.env.example` — env var template

## Architecture decisions

- **Supabase replaces Express API**: No separate API server needed for Vercel — all DB calls go directly through the Supabase JS client from the browser, secured by Row Level Security (public read, authenticated write)
- **Demo mode**: When `VITE_SUPABASE_URL` is missing, app loads with hardcoded demo properties instead of crashing
- **Flexible property attributes**: Stored as `jsonb` array of `{label, value}` — fully configurable per-property in admin panel
- **Custom status**: Property status is free-text (not enum) — admin can type anything: "For Sale", "High Demand", "Under Construction", etc.
- **YouTube embed**: Extracted from any youtube.com/youtu.be URL, embedded as last slide in property gallery using youtube-nocookie.com

## Supabase Schema (run in SQL editor)

```sql
create table properties (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  location text not null,
  price text not null,
  status text not null default 'Available',
  description text,
  images text[] default '{}',
  youtube_url text,
  is_featured boolean default true,
  attributes jsonb default '[]'::jsonb,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table contacts (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  message text,
  created_at timestamptz default now()
);

create table site_settings (
  id integer primary key default 1,
  phone text default '',
  email text default '',
  whatsapp text default '',
  office_address text default '',
  constraint single_row check (id = 1)
);

alter table properties enable row level security;
alter table contacts enable row level security;
alter table site_settings enable row level security;

create policy "Public read" on properties for select using (true);
create policy "Admin write" on properties for all using (auth.role() = 'authenticated');
create policy "Public insert" on contacts for insert with check (true);
create policy "Admin read contacts" on contacts for select using (auth.role() = 'authenticated');
create policy "Public read settings" on site_settings for select using (true);
create policy "Admin write settings" on site_settings for all using (auth.role() = 'authenticated');

insert into site_settings (id, phone, email, whatsapp, office_address)
values (1, '+91 98765 43210', 'luxury@akgroup.com', '919876543210', 'Chennai, Tamil Nadu')
on conflict (id) do nothing;
```

## User preferences

- Dark matte black (#0a0a0a) + metallic orange (primary) palette only
- Playfair Display (serif) for headings, Inter for body
- No emojis in code or UI
- `ease` in Framer Motion Variants needs `as [number, number, number, number]` cast for cubic bezier arrays
- NEVER use `import React from "react"` — Vite JSX transform handles it

## Gotchas

- Supabase RLS must be configured correctly — public read, authenticated write
- Admin auth uses Supabase email/password — create user in Supabase dashboard → Authentication → Users
- `whatsapp` field in site_settings should be digits only with country code (e.g. `919876543210`)
- Contact form uses `first_name`/`last_name` (snake_case) to match Supabase column names
