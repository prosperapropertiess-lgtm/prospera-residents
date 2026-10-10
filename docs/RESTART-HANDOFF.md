# Prospera Rent restart handoff

Updated October 10, 2026 after the implementation session.

## Project and current brief

Work in `/Users/jaizonebin/prospera-residents`.
Read `docs/prospera-rent-blueprint.md`, applicable AGENTS.md, and relevant
installed Next.js docs before changes. The blueprint was replaced with the
user's newer `Downloads/prospera-rent-website-blueprint (2).md`.

**The primary action is Find my next home**, for current and future renters.
The homepage starts the preference flow with Soon, In 1–3 months, In 3–6
months, or Later / unsure. Property browsing is secondary. The user explicitly
asked for a visually outstanding site, debugging tests, and a push to Vercel.
The user clarified that “reset” referred to their usage limit, not undoing
work. Publication is authorized after validation; do not ask again.

## Implemented locally

- Existing logo, Outfit/Inter font assets, palette and Ebin portrait retained.
- Designed homepage at `/rent`, shared responsive navigation/footer, reduced
  motion, architectural illustration and a six-step preference flow.
- Filtered inventory, property detail routes, gallery, explicit cost/feature
  unknowns, viewing/enquiry form and contextual failure/leased states.
- Supabase authenticated save/edit/pause/close/reactivate endpoints and UI.
  Email magic-link confirmation protects profile access. Local drafts remain
  separate from confirmed saves.
- Six task-based guides, a cost worksheet, downloadable/printable checklists,
  help page, and managed versus placement-only resident support routing.
- Server validation, public field allowlisting, security response headers,
  core logic/API tests, and a generated-page/internal-link check.
- Migration prepared at `supabase/migrations/20261010_rent_searches.sql`.

## Critical remaining operational work

This is **not a fully verified live service**. See README.md for exact setup.
The migration has not been applied. Live saves/lead insertion, two-user RLS,
Supabase email delivery/redirect configuration and inventory access have not
been verified. Personalised alert delivery has no dispatcher or operating
review workflow yet; the UI explicitly says it is not active. Do not claim
alerts are sending, match review is operating or a viewing is confirmed.

The main site's `/api/listings/rental-alert` ignores its database upsert error,
so it was deliberately not reused as a successful subscription endpoint.
The existing `is_managed` property flag is set by default on published listings;
it is not proof that Prospera manages the tenancy. The new detail page asks
renters to confirm the service arrangement.

## Environment, tests and deployment

The user supplied the real project URL and anon key. They were stored in the
ignored `.env.local` with restricted file permissions. Never print them or
commit `.env` files. There is no service-role key in this app.

Local production builds pass after removing the unnecessary Tailwind loader
and adding the required Suspense boundaries for this Next.js version.
Lint and local logic/API tests pass. Tests use only fixtures and mock network
responses, never real prospect messages. Browser review could not run:
Chromium was blocked by macOS sandbox `bootstrap_check_in ... Permission
denied (1100)`, and a local Next server was blocked with `listen EPERM`.

Network is restricted in this session: Supabase DNS lookup reports ENOTFOUND;
GitHub access reports `Could not resolve host: github.com`. A successful build
is not evidence of a successful deployment. Check Git history/status and the
latest final response for whether a commit or push succeeded.

Remote: `https://github.com/prosperapropertiess-lgtm/prospera-residents.git`.
Branch: `main`. Linked Vercel project: `prospera-residents`; intended domain
from the original repository: `residents.prosperaproperties.co`.
This is independent of the main owner website. A push triggers publication.

## Preserve user-created files

The original worktree had uncommitted `.gitignore` edits plus `.claude-flow/`,
`.claude/`, `.mcp.json`, `.swarm/`, `CLAUDE.md`, docs and `ruvector.db`.
Preserve those files. Runtime databases and swarm artifacts are ignored.
Do not include the user's unrelated agent configuration in the site commit.
Ruflo tools were not exposed in this session. No subagents were spawned.

## Next actions

1. Run `npm run lint`, `npm test`, `npm run build`, and
   `node scripts/check-build.mjs` after changes.
2. In an environment that permits it, perform real browser checks at small
   phone/tablet/desktop sizes, 200% text, keyboard and reduced motion. Verify
   successful and failing submission paths, gallery controls, and filter return.
3. Complete the backend setup above, using admin operations only in the trusted
   backend/shared Supabase project. Do not add privileged keys to this app.
4. Review/stage only site changes, commit and push to origin/main. Verify the
   Vercel deployment and live URL. User authorization to publish already exists.
