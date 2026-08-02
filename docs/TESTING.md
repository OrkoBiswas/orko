# Testing strategy

## Automated

- Unit coverage: inquiry validation, filtering, slugs, authorization helpers, and status transitions
- Integration coverage: rendered public HTML, inquiry API success/error paths with a D1-compatible stub, and protected mutation rejection
- Production compilation: Vinext/Cloudflare Worker build

## Manual release matrix

Check 320×568, 390×844, 768×1024, 1024×768, 1440×900, and 1920×1080. Validate keyboard order, mobile menu, search/filter combinations, showreel dialog, both inquiry paths, no-data results, reduced motion, 200% zoom, error recovery, and owner sign-in behavior.

External email delivery is marked unverified until provider credentials are available; database persistence is validated separately.

