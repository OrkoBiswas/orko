# Deployment

The project targets OpenAI Sites on Cloudflare Workers. `.openai/hosting.json` declares the logical `DB` D1 binding; the hosting layer provisions and injects the real database.

## Hosted values

- `ADMIN_USERNAME` — private administrator username.
- `ADMIN_PASSWORD` — private administrator password stored as a secret.
- `ADMIN_SESSION_SECRET` — random signing key of at least 32 characters stored as a secret.
- `CLOUDINARY_CLOUD_NAME` — Cloudinary account cloud name.
- `CLOUDINARY_API_KEY` — Cloudinary API key stored as a protected hosted value.
- `CLOUDINARY_API_SECRET` — Cloudinary API secret stored as a secret; never expose it through a public environment variable.
- `RESEND_API_KEY`, `INQUIRY_NOTIFICATION_TO`, and a provider-verified `INQUIRY_FROM_EMAIL` — optional email adapter values.
- `NEXT_PUBLIC_SITE_URL` — optional canonical override.

Deploy only after lint, typecheck, tests, and the production build pass. Backups should export D1 data on a schedule appropriate to inquiry retention. Configure a privacy policy before collecting live visitor data.

Cloudinary uploads use a short-lived signature created by the authenticated server route. File bytes upload directly from the owner dashboard to Cloudinary. The media library reads and deletes only tagged portfolio assets through owner-only server endpoints.
