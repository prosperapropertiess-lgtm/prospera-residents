# Prospera Rent

Renter-facing Next.js application for Prospera Properties, in the independent
`prospera-residents` Vercel project. The owner website and private resident
portal remain in `prospera-website`.

## Run and verify

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
node scripts/check-build.mjs
```

The test loader uses `node:module.registerHooks` (Node 22.15+). The local checks
were run with Node 26. Vercel should use a Next.js-supported Node version.

## Routes

- `/` redirects to `/rent`, the home-finding homepage.
- `/alerts` offers six guided preference steps and contact-confirmed search management.
- `/alerts?manage=1` opens secure sign-in for an existing search.
- `/listings` stores filters in the URL. `/listings/[slug]` also resolves legacy IDs.
- `/guide` and six task-based guides offer ungated practical information.
- `/tools` offers a monthly cost worksheet and viewing/move-in checklists.
- `/help` routes questions to the existing leads queue when RLS permits inserts.
- `/tenants` explains the existing managed and placement-only support routes.

## Brand

Uses the existing Prospera logo, Ebin's existing portrait, navy `#1F2F3A`,
burgundy `#8B2030`, warm background `#F7F5F2`, neutral `#D8D2C8`, and the
existing Outfit / Inter font assets. The architectural homepage illustration
is decorative; it is not a photograph or representation of inventory.

## Backend setup still required before calling the full service operational

1. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   in `.env.local` and the **prospera-residents** Vercel project. Local
   environment files are ignored. Never add a service-role key here.
2. Verify anonymous read access to the selected public `properties` columns,
   and anonymous insert access to the existing `leads` table. Do not open
   renter/lead SELECT access. Inventory reuses the existing site's published
   inventory criteria; `is_managed` is a publication flag, not proof of the
   ongoing service arrangement.
3. Review and apply `supabase/migrations/20261010_rent_searches.sql` to the
   existing shared project. This adds new tables only. It has **not** been
   applied by this build. RLS restricts each renter to their own search.
4. Configure Supabase email authentication, approved redirect URLs for
   `/alerts?review=1` and `/alerts?manage=1` on the production origin and local
   development origin, and a production-capable mail sender. Use the standard
   magic-link template. Confirm delivery and sign-in with an owned test inbox.
5. Run two-user RLS checks: one renter must not read or update the other
   renter's search. Confirm saves, updates, pause/close, reactivation, and
   expiry handling against the real project.
6. Assign an operator to the existing leads queue. Verify a real enquiry
   appears there, and establish the actual response/update process. The new
   app acknowledges a successful database insert; it does not promise an
   email receipt, automatic appointment, or response deadline.
7. Configure and validate the manually reviewed matching and email-delivery
   workflow in the trusted backend before enabling personalised alerts. The
   migration includes restricted review/delivery tables with per-home
   deduplication, but **no dispatcher is deployed**. The UI explicitly says
   personalised email delivery is not active. It does not collect a newsletter
   opt-in or claim alerts are being sent.

Useful official setup references:
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/docs/guides/database/postgres/row-level-security

## Information and privacy rules

Only explicitly selected public listing fields are returned. Missing values
remain unknown. A listing date is not an availability verification date, and
an earlier available home is not assumed to be held for a later move.
Required features are strict; preferred features only order qualifying homes.
No screening information or application documents are requested.

Search preferences remain a browser draft until the authenticated database
save succeeds. The worksheet is stored locally only when requested. Failed
saves retain entered values and never display a fabricated success.

## Validation and publication status

The build, lint and automated local tests pass. Tests use local fixtures and
mocked network responses; they do not create live leads, profiles or emails.
Live Supabase access, two-user RLS, mail delivery, and browser interaction
remain unverified because this execution sandbox blocks network DNS, local
listening ports and Chromium's required macOS process registration.

A push to the configured Git remote is expected to trigger Vercel deployment.
A GitHub connectivity check failed with `Could not resolve host: github.com`.
Do not describe the site as deployed without a successful push and a Vercel
production check. Review the backend setup above and perform a mobile/desktop,
keyboard, reduced-motion and enlarged-text browser review before a full launch.
