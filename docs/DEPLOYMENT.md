# Deployment

The project targets OpenAI Sites on Cloudflare Workers. `.openai/hosting.json` declares the logical `DB` D1 binding; the hosting layer provisions and injects the real database.

## Optional hosted values

- `ADMIN_USERNAME` — private administrator username
- `ADMIN_PASSWORD` — private administrator password stored as a secret
- `ADMIN_SESSION_SECRET` — random signing key of at least 32 characters stored as a secret
- `RESEND_API_KEY`, `INQUIRY_NOTIFICATION_TO`, and a provider-verified `INQUIRY_FROM_EMAIL` — optional email adapter values
- `NEXT_PUBLIC_SITE_URL` — optional canonical override

Deploy only after lint, typecheck, tests, and the production build pass. Backups should export D1 data on a schedule appropriate to inquiry retention. Configure a privacy policy before collecting live visitor data.
