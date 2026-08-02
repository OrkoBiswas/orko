# Animation system

## Principles

Motion guides reading, reveals hierarchy, and makes project media feel tactile. It never delays navigation or hides required information.

## Architecture

- GSAP context scopes lifecycle and cleanup inside `MotionProvider`.
- Initial hero sequence animates masks and type with short staggered timing.
- ScrollTrigger reveals selected sections and advances the process rail.
- Work filters use GSAP Flip for positional continuity.
- Pointer parallax is desktop-only and bounded to a few pixels.
- Route loading uses native instant navigation plus a brief CSS progress cue.
- Micro-interactions use CSS transitions.

## Modes

`prefers-reduced-motion` disables transforms, parallax, marquee motion, and smooth scrolling. Low-data mode suppresses decorative previews and persists only as a device preference.

