# Information architecture

## Public routes

- `/` — cinematic positioning, selected work, services, journal preview, proof, and hiring CTA
- `/work` — primary searchable/filterable showcase library
- `/work/[project-slug]` — reusable project case-study template
- `/services` and `/services/[service-slug]` — service discovery and conversion
- `/about`, `/journal`, `/journal/[slug]`, `/showreel`, `/resume` — professional evaluation material, studio writing, and public resources
- `/contact`, `/start-a-project` — short and guided inquiry paths
- `/privacy`, `/terms`, not-found — trust and legal support

## Owner routes

- `/admin` — authenticated overview
- `/admin/projects` — project visibility and publication management
- `/admin/journal` — protected publishing portal for creative news, tips, build notes, public files, draft/publish state, and audit-backed archiving
- `/admin/showreel` — current reel preview, direct video replacement, poster URL, and original-media restoration
- `/admin/media` — signed Cloudinary upload and media library management
- `/admin/testimonials` — approved feedback and client media management
- `/admin/inquiries` — durable inquiry review
- `/admin/settings` — deployment and brand readiness

Primary navigation keeps Work first. Every major route includes a direct hiring action and returns to related work.
