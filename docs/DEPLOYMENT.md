# Deployment

The project targets OpenAI Sites on Cloudflare Workers. `.openai/hosting.json` declares the logical `DB` D1 binding; the hosting layer provisions and injects the real database.

## Optional hosted values

- `OWNER_EMAILS` — comma-separated identities allowed into owner routes; if empty, any authenticated site owner can enter during initial setup
- `RESEND_API_KEY`, `INQUIRY_NOTIFICATION_TO`, and a provider-verified `INQUIRY_FROM_EMAIL` — optional email adapter values
- `NEXT_PUBLIC_SITE_URL` — optional canonical override

Deploy only after lint, typecheck, tests, and the production build pass. Backups should export D1 data on a schedule appropriate to inquiry retention. Configure a privacy policy before collecting live visitor data.
