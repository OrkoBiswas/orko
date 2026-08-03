# Content model

Brand configuration contains identity, role, biography, location, availability, contact links, calls to action, accent, and résumé/showreel settings.

Projects contain opaque ID, slug, title, index, category, services, industry, year, client label, featured order, accent, summary, challenge, concept, approach, deliverables, tools, responsive frame ratio, generated-art style, optional secure media URL/type/description, publication status, and timestamps. New projects start as drafts. Deletion sets an internal deleted state so public queries omit the record while audit and content history remain recoverable.

Cloudinary assets are external media records tagged for the portfolio workspace. The dashboard exposes only their public ID, secure delivery URL, type, format, size, dimensions, duration, and created timestamp. Provider credentials and signatures are not content fields.

Services contain slug, promise, problem set, deliverables, ideal clients, process, timeline, pricing mode, FAQ, and related project slugs.

Inquiries contain reference, pathway, identity/contact fields, selections, project details, consent timestamp, status, private notes, created timestamp, update timestamp, and spam metadata. No portfolio performance claim is displayed unless marked verified.
