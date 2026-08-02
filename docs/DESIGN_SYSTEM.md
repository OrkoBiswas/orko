# Design system

## Direction

An editorial motion studio rather than a freelancer template: carbon-black canvas, warm paper text, high-visibility acid chartreuse, fine rules, oversized typography, and media tiles that feel like art-direction contact sheets.

## Tokens

- Canvas: `#090a08`; surface: `#11130f`; paper: `#f2f0e9`
- Accent: `#c9ff43`; signal orange: `#ff6b35`; quiet ink: `#a6aa9e`
- Display: modern variable grotesk (`Aptos Display` / `Segoe UI Variable Display` fallbacks) with a restrained editorial serif accent; interface/body: precise grotesk sans
- Radius: restrained 2–18px; cards avoid generic pill-heavy SaaS styling
- Spacing: fluid 4px base with viewport-scaled section rhythm
- Layout: full-bleed section backgrounds with a 1760px content ceiling and fluid 14–72px page gutters, so compositions use large displays without crowding small screens

## Components

Wordmark, utility nav, availability chip, kinetic headline, project tile, filter rail, editorial list, service index, proof strip, process timeline, modal reel, multi-step brief, field system, notice, footer, and owner tables.

Project showcases use a framed editorial system: a category-and-count toolbar, three balanced feature rows with one-pixel joins, neutral-grey demo frames, integrated metadata, visible interaction cues, and resilient tablet/mobile stacking. Scroll motion uses restrained reveal, stagger, and scrubbed depth cues with a complete reduced-motion fallback.

Showcase titles use a compact standard scale so video, motion, graphic-design, bundle, and case-study entries share one hierarchy. Fine-pointer devices receive an acid-green custom cursor with contextual Open/Select states; touch devices and editable controls retain native behavior.

The showcase media wall is format-aware. Saved project frames map to landscape/HD (16:9), vertical short (9:16), square (1:1), poster/portrait (4:5), or banner (21:9), and a dense measured grid recalculates row spans as the viewport changes. Titles sit above the metadata safety area rather than touching the lower edge.

Focus outlines always use the accent token. Minimum targets are 44px. Information is never encoded by color alone.
