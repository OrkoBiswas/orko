# Database schema

Cloudflare D1/SQLite is the production persistence layer because it is native to the hosting target and avoids an unreliable external-database dependency.

## Implemented core tables

- `inquiries` — contact and guided-brief submissions; indexed by status and creation time
- `projects` — admin-managed publication metadata and ordering; unique slug
- `audit_logs` — owner mutations with actor, action, entity, and timestamp
- `rate_limits` — privacy-minimized hashed request bucket and rolling count

Schema initialization uses idempotent prepared statements, one statement per call, followed by `PRAGMA optimize`. IDs are random UUIDs; public inquiry references are separate non-sequential values.

The broader content model in the master brief can be added as normalized tables without breaking public routes because presentation reads through server-side repository functions.

