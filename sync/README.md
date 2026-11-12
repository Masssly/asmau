# Recording sync (optional, live)

`worker.js` is a small Cloudflare Worker that stores parents' **already
encrypted** recordings in the `asmau` R2 bucket, so a parent who chooses to can
record once and hear it on every device. Parents who don't choose it are
unaffected: recording on each device keeps working with no sign-in.

Browser side: `shared/sync.js` and the panel in `tools/record-voice`.
Deployed at `https://asmau-sync.mohammed-sadat-abdulai.workers.dev`.

## Deploy (needs a Cloudflare API token, or `wrangler login`)

    cd sync
    npx wrangler login
    npx wrangler deploy

This prints a `https://asmau-sync.<your-subdomain>.workers.dev` address.
No secret is needed: access is by a secret family id the browser derives.

## Before switching it on for families

- `privacy.html` already describes it; keep it in step with any change here.
- Per family: 25 MB total, 5 MB per file (`FREE_LIMIT`, `MAX` in `worker.js`). A
  paid size can later come from `limitFor()` (for example a KV entry per family).
  Requests: 120 a minute per code and 300 per network address (`wrangler.toml`).
  Cloudflare's limiter is approximate and per location, so it stops a runaway
  device but not a determined flood; add a Cloudflare WAF rule if that matters.
- Retention: a daily job (03:17 UTC) deletes a family unused for 365 days.
  "Used" = any request with the code (a marker object `_active/<family>`,
  refreshed at most once a day). `purgeInactive()` in `worker.js`.
- Decide retention: delete a family's data after N months of no use.
- The family code cannot be recovered if lost (said in the panel and the privacy note).
