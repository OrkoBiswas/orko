# Content model

The public identity also stores an optional owner portrait URL and accessible description. The file is uploaded through the authenticated signed media flow, while only its validated delivery URL is saved with the existing durable site content.

Brand configuration contains identity, role, biography, location, availability, contact links, calls to action, logo/favicon/share assets, navbar logo width from 20–200px, theme color, SEO/AEO/GEO fields, crawler controls, verification tokens, optional GTM ID, and ordered marketplace/profile links with visibility and highlight controls.

Showreel configuration stores one secure Cloudinary video URL and an optional poster URL alongside its managed public heading and introduction. Uploads publish through a dedicated owner-only mutation while the original authored reel remains available as a restore point.

Projects contain opaque ID, slug, title, index, category, services, industry, year, client label, featured order, accent, summary, challenge, concept, approach, deliverables, tools, responsive card ratio, generated-art style, and an ordered Behance-style content presentation. Project previews are derived from the first suitable image or video in that presentation, with older secure cover-media fields retained only for backward compatibility. New projects start as drafts. Deletion sets an internal deleted state so public queries omit the record while audit and content history remain recoverable.

Category thumbnails are independent owner-managed records keyed by the generated category slug. Each stores the current category label, one secure Cloudinary image or video URL, media type, accessible description, display ratio, and update timestamp. Replacing or removing a category thumbnail never changes a project presentation or deletes the original Cloudinary asset.

Cloudinary assets are external media records tagged for the portfolio workspace. The dashboard exposes only their public ID, secure delivery URL, type, format, size, dimensions, duration, and created timestamp. Provider credentials and signatures are not content fields.

Testimonials contain an approved quote, client name, optional role and company, plus an optional media type, secure image/video URL, and accessibility description. Older stored testimonials receive safe no-media defaults during parsing. The public testimonial section is omitted when the approved collection is empty.

Services contain slug, promise, problem set, deliverables, ideal clients, process, timeline, pricing mode, FAQ, and related project slugs.

Journal posts contain an opaque ID, unique URL slug, title, short introduction, category (`creative-news`, `tips-tricks`, or `build-notes`), safe plain-text body, tags, reading time, publish time, public cover URL with accessible description, featured/display controls, and a limited list of public HTTPS resources. Resources can link to owner-uploaded Cloudinary raw files, a repository, or another deliberate public destination; no local path, secret, or provider credential is ever stored or rendered.

Inquiries contain reference, pathway, identity/contact fields, selections, project details, consent timestamp, status, private notes, created timestamp, update timestamp, and spam metadata. No portfolio performance claim is displayed unless marked verified.
