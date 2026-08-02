# Security

- Public payloads are validated with Zod on the server.
- D1 calls use parameterized prepared statements.
- Forms include honeypot, payload limit, consent, origin-aware handling, and privacy-minimized rate limiting.
- Error responses never return stack traces or provider secrets.
- Owner pages and mutation endpoints require forwarded ChatGPT identity; an optional email allowlist narrows authorization.
- Mutations produce audit records.
- Security headers and a restrictive content policy are configured at the application boundary where compatible with the host.
- External notification providers are adapters and remain disabled until credentials are set.

Uploads are not accepted by the public form. A future media uploader must add MIME sniffing, size limits, R2 storage, and in-use deletion checks before release.

