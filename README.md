# Orko Biswas — Portfolio & Hiring Website

A cinematic, conversion-focused portfolio for Orko Biswas: video editor, 2D motion artist, and graphic designer. The public site prioritizes a deep, searchable work library; the server layer stores inquiries and portfolio records in Cloudflare D1; and the owner area uses ChatGPT-hosted sign-in.

## Local development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

The public experience works with seeded portfolio content. Durable inquiry and admin data require the `DB` D1 binding declared in `.openai/hosting.json`. See `docs/DEPLOYMENT.md` and `.env.example` for optional notification and owner-allowlist settings.

## Architecture

- Next-compatible App Router on Vinext and Cloudflare Workers
- TypeScript, CSS design tokens, GSAP motion, Zod validation
- D1/SQLite persistence through parameterized statements
- Public portfolio routes plus SIWC-protected owner routes
- Accessible, responsive, reduced-motion and low-data modes

