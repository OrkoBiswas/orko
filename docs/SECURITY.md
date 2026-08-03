# Security

- Public payloads are validated with Zod on the server.
- D1 calls use parameterized prepared statements.
- Forms include honeypot, payload limits, consent, origin-aware handling, and privacy-minimized rate limiting.
- Error responses never return stack traces, raw database failures, or provider secrets.
- Owner pages and mutation endpoints require a valid HMAC-signed, HTTP-only administrator session. Login attempts are rate-limited with privacy-minimized fingerprints, credential comparisons avoid early-exit timing leaks, cookies use strict same-site behavior, and write requests require a matching origin.
- Administrator credentials, the session signing key, and the Cloudinary API secret are runtime secrets and never appear in the source or client bundle.
- Content, project, status, and deletion mutations produce audit records.
- Security headers and a restrictive content policy are configured at the application boundary where compatible with the host.
- External notification providers remain disabled until their credentials are configured.

Uploads are not accepted by the public form. Authenticated dashboard uploads receive short-lived server signatures, go directly to Cloudinary, and are limited to 100 MB per file in the dashboard. Cloudinary listing and deletion stay server-side. Deletion requires a same-origin owner request plus a visible confirmation, and provider errors are replaced with safe messages. Project deletion is a recoverable soft delete with an audit record.

The content security policy permits Cloudinary only on the minimum required surfaces: delivery from `res.cloudinary.com` for images and video, and authenticated dashboard upload requests to `api.cloudinary.com`. Other external image, media, and connection origins remain blocked.
