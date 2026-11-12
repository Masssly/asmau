# Recording sync (optional, not live yet)

`worker.js` is a small Cloudflare Worker that stores parents' **already
encrypted** recordings in the `asmau` R2 bucket, so a parent who chooses to can
record once and hear it on every device. Parents who don't choose it are
unaffected: recording on each device keeps working with no sign-in.

Not yet built: the browser side (derive the family id and key from the family
code, encrypt, upload and download in `tools/record-voice`). The Worker is
deployed first so the address exists.

## Deploy (needs your Cloudflare login)

    cd sync
    npx wrangler login
    npx wrangler deploy

This prints a `https://asmau-sync.<your-subdomain>.workers.dev` address.
No secret is needed: access is by a secret family id the browser derives.

## Before switching it on for families

- Update `privacy.html` (what is stored, where, how long, how to delete).
- Add a rate limit and a size cap per family (Cloudflare rules or Durable
  Object); the Worker only caps a single file at 5 MB.
- Decide retention: delete a family's data after N months of no use.
- The family code cannot be recovered if lost; say so in the interface.
