# Performance

- Server-render core navigation, headings, and portfolio content.
- Load GSAP only in the interactive client boundary and clean every context.
- Project artwork uses CSS composition and fixed aspect ratios, avoiding layout shifts and heavy placeholder media.
- Defer video until a visitor requests playback; never autoplay sound.
- Keep fonts system/local-first and avoid remote font requests.
- Use route-level code splitting provided by the App Router.
- Use no global unthrottled scroll or pointer listeners.
- Reduced-motion and low-data modes remove optional motion and previews.

Budgets: no horizontal overflow at 320px, responsive interaction under 200ms on ordinary hardware, and a compact initial client bundle.

