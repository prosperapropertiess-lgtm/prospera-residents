# Prospera Residents

A fresh rebuild of the resident/tenant-facing portal for Prospera Properties,
deployed independently at `residents.prosperaproperties.co`.

## Why a separate project

The main site (`prospera-website`) already has a working tenant portal at
`/tenants/[token]` (maintenance requests, documents, messages, payments,
schedule) — this project is a ground-up rebuild of that experience, kept in
its own repo and its own Vercel deployment on purpose, so work here can't
affect the main site no matter what happens. Same reasoning as why
`Rentified-APP` (the native app) is its own separate rebuild rather than
living inside `prospera-website`.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS. Supabase for data — **not yet
provisioned**; this needs its own Supabase project (separate from the main
site's, same pattern as `Rentified-APP`), or an explicit decision to share
the main site's project if real-time data parity with existing tenants turns
out to matter more than isolation.

## Reference, not a dependency

For design consistency, the resident experience should feel like the same
company as `prospera-website` — navy `#1F2F3A` / burgundy `#8B2030` / warm
background `#F7F5F2` palette, same fonts (Outfit for headings, Inter for
body). See that repo's `CLAUDE.md` for the full design system. Don't import
code from it directly; this project is deliberately standalone.

## Deployment

- Domain: `residents.prosperaproperties.co`, pointed at this project's own
  Vercel deployment (`prospera-residents`).
- Not linked to the main `prospera-website` Vercel project or its env vars.
