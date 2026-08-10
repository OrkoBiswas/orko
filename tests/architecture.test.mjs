import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("backend keeps persistence, validation, auth, and rate limiting server-side", async () => {
  const [route, repository, admin] = await Promise.all([
    readFile(new URL("app/api/inquiries/route.ts", root), "utf8"),
    readFile(new URL("db/repository.ts", root), "utf8"),
    readFile(new URL("lib/admin.ts", root), "utf8"),
  ]);
  assert.match(route, /inquirySchema\.safeParse/);
  assert.match(route, /consumeRateLimit/);
  assert.match(repository, /prepare\(/);
  assert.match(repository, /audit_logs/);
  assert.match(admin, /HMAC/);
  assert.match(admin, /httpOnly|ADMIN_COOKIE/);
  assert.doesNotMatch(admin, /requireChatGPTUser|getChatGPTUser/);
  assert.doesNotMatch(repository, /localStorage|sessionStorage/);
});

test("required project documentation exists", async () => {
  const files = ["PRODUCT_REQUIREMENTS.md", "INFORMATION_ARCHITECTURE.md", "DESIGN_SYSTEM.md", "ANIMATION_SYSTEM.md", "CONTENT_MODEL.md", "DATABASE_SCHEMA.md", "ACCESSIBILITY.md", "PERFORMANCE.md", "SEO.md", "SECURITY.md", "DEPLOYMENT.md", "TESTING.md", "IMPLEMENTATION_STATUS.md"];
  for (const file of files) {
    const contents = await readFile(new URL(`docs/${file}`, root), "utf8");
    assert.ok(contents.length > 200, `${file} should contain substantive guidance`);
  }
});

test("growth metadata and profile controls remain owner-managed and server-rendered", async () => {
  const [schema, settings, layout, robots, llms] = await Promise.all([
    readFile(new URL("lib/site-content.ts", root), "utf8"),
    readFile(new URL("components/AdminGrowthSettings.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/robots.ts", root), "utf8"),
    readFile(new URL("app/llms.txt/route.ts", root), "utf8"),
  ]);
  assert.match(schema, /gtmContainerId/);
  assert.match(schema, /profileLinks/);
  assert.match(schema, /logoWidth: z\.number\(\)\.int\(\)\.min\(20\)\.max\(200\)/);
  assert.doesNotMatch(schema, /logoHeight/);
  assert.doesNotMatch(schema, /showHeaderName/);
  assert.match(settings, /SEO, AEO & GEO/);
  assert.match(settings, /Google Tag Manager/);
  assert.match(layout, /ProfessionalService/);
  assert.match(layout, /googletagmanager/);
  assert.doesNotMatch(layout, /<head>/);
  assert.match(robots, /searchIndexing/);
  assert.match(llms, /Verified public profiles/);
});

test("dashboard mutations use one accessible global notification system", async () => {
  const [frame, notifications] = await Promise.all([
    readFile(new URL("components/AppFrame.tsx", root), "utf8"),
    readFile(new URL("components/AdminNotificationCenter.tsx", root), "utf8"),
  ]);
  assert.match(frame, /<AdminNotificationCenter/);
  assert.match(notifications, /aria-live/);
  assert.match(notifications, /\/api\/admin\/media\/signature/);
  assert.match(notifications, /Change not saved/);
});

test("Cloudinary signatures and destructive media controls stay owner-only and server-side", async () => {
  const [cloudinary, signatureRoute, mediaRoute, mediaClient] = await Promise.all([
    readFile(new URL("lib/cloudinary.ts", root), "utf8"),
    readFile(new URL("app/api/admin/media/signature/route.ts", root), "utf8"),
    readFile(new URL("app/api/admin/media/route.ts", root), "utf8"),
    readFile(new URL("components/AdminMediaLibrary.tsx", root), "utf8"),
  ]);
  assert.match(cloudinary, /CLOUDINARY_API_SECRET/);
  assert.match(cloudinary, /apiSecret/);
  assert.match(signatureRoute, /getOwner/);
  assert.match(signatureRoute, /requireSameOrigin/);
  assert.match(mediaRoute, /getOwner/);
  assert.match(mediaRoute, /requireSameOrigin/);
  assert.doesNotMatch(mediaClient, /CLOUDINARY_API_SECRET|process\.env/);
});

test("testimonial media is validated, owner-managed, and rendered accessibly", async () => {
  const [contentModel, adminForm, carousel, nextConfig] = await Promise.all([
    readFile(new URL("lib/site-content.ts", root), "utf8"),
    readFile(new URL("components/AdminTestimonialsForm.tsx", root), "utf8"),
    readFile(new URL("components/TestimonialCarousel.tsx", root), "utf8"),
    readFile(new URL("next.config.ts", root), "utf8"),
  ]);
  assert.match(contentModel, /mediaType: z\.enum\(\["none", "image", "video"\]\)/);
  assert.match(contentModel, /mediaUrl: optionalUrl/);
  assert.match(adminForm, /\/api\/admin\/media\/signature/);
  assert.match(adminForm, /accept="image\/\*,video\/\*"/);
  assert.match(adminForm, /await persist\(nextContent\)/);
  assert.match(carousel, /resolveMediaType/);
  assert.match(carousel, /aria-label=\{testimonial\.mediaAlt/);
  assert.match(carousel, /<video/);
  assert.match(carousel, /autoPlay=\{active && !reducedMotion\}/);
  assert.match(carousel, /muted=\{muted\}/);
  assert.match(carousel, /loop/);
  assert.match(carousel, /testimonial-video-sound/);
  assert.match(carousel, /onMouseLeave=\{muteVideo\}/);
  assert.match(nextConfig, /img-src[^;]+https:\/\/res\.cloudinary\.com/);
  assert.match(nextConfig, /media-src[^;]+https:\/\/res\.cloudinary\.com/);
  assert.match(nextConfig, /connect-src[^;]+https:\/\/api\.cloudinary\.com/);
});

test("project presentations are validated, owner-built, cover-free, and publicly rendered", async () => {
  const [contentModel, projectEditor, projectBuilder, projectPage, presentation, workLibrary] = await Promise.all([
    readFile(new URL("lib/project-content.ts", root), "utf8"),
    readFile(new URL("components/AdminProjectEditor.tsx", root), "utf8"),
    readFile(new URL("components/AdminProjectContentBuilder.tsx", root), "utf8"),
    readFile(new URL("app/work/[project-slug]/page.tsx", root), "utf8"),
    readFile(new URL("components/ProjectPresentation.tsx", root), "utf8"),
    readFile(new URL("components/WorkLibrary.tsx", root), "utf8"),
  ]);
  assert.match(contentModel, /gallery: z\.array\(galleryMediaSchema\)\.max\(24\)/);
  assert.match(contentModel, /contentBlocks: z\.array\(contentBlockSchema\)\.max\(60\)/);
  assert.match(contentModel, /presentation: presentationSchema\.default/);
  assert.match(projectBuilder, /\/api\/admin\/media\/signature/);
  assert.match(projectBuilder, /Photo Grid/);
  assert.match(projectBuilder, /Video \/ Audio/);
  assert.match(projectBuilder, /Attach assets/);
  assert.match(projectEditor, /Category thumbnails are managed separately from the Projects dashboard/);
  assert.doesNotMatch(projectEditor, /<strong>Category thumbnail<\/strong>|Secure thumbnail URL|Upload thumbnail/);
  assert.match(projectPage, /<ProjectPresentation project=\{project\}/);
  assert.doesNotMatch(projectPage, /case-art|case-gallery/);
  assert.match(presentation, /item\.url !== project\.mediaUrl/);
  assert.match(presentation, /<ProjectMedia/);
  assert.match(workLibrary, /discipline/);
  assert.match(workLibrary, /workDisciplines/);
});

test("category thumbnails are independently owner-managed and durably rendered", async () => {
  const [contentModel, manager, route, repository, migration, adminProjects, home, showcase, artwork] = await Promise.all([
    readFile(new URL("lib/category-content.ts", root), "utf8"),
    readFile(new URL("components/AdminCategoryThumbnail.tsx", root), "utf8"),
    readFile(new URL("app/api/admin/categories/[slug]/thumbnail/route.ts", root), "utf8"),
    readFile(new URL("db/repository.ts", root), "utf8"),
    readFile(new URL("drizzle/0004_category_thumbnails.sql", root), "utf8"),
    readFile(new URL("app/admin/projects/page.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("components/ShowcaseGrid.tsx", root), "utf8"),
    readFile(new URL("components/ProjectArtwork.tsx", root), "utf8"),
  ]);
  assert.match(contentModel, /categoryThumbnailSchema/);
  assert.match(contentModel, /hostname === "res\.cloudinary\.com"/);
  assert.match(manager, /\/api\/admin\/media\/signature/);
  assert.match(manager, /accept="image\/\*,video\/\*"/);
  assert.match(manager, /Attach thumbnail/);
  assert.match(manager, /placeholder="https:\/\/res\.cloudinary\.com\/…"/);
  assert.match(manager, /async function saveUrl/);
  assert.match(manager, /Use URL/);
  assert.match(manager, /Category thumbnail removed/);
  assert.match(route, /getOwner/);
  assert.match(route, /requireSameOrigin/);
  assert.match(route, /categoryThumbnailSchema\.safeParse/);
  assert.match(repository, /CREATE TABLE IF NOT EXISTS category_thumbnails/);
  assert.match(repository, /category\.thumbnail\.updated/);
  assert.match(migration, /CREATE TABLE `category_thumbnails`/);
  assert.match(adminProjects, /<AdminCategoryThumbnail/);
  assert.match(home, /listCategoryThumbnails/);
  assert.match(showcase, /category\.thumbnail \? <ProjectMedia/);
  assert.match(artwork, /ignoreMedia/);
});

test("showreel replacement is owner-managed, signed, and rendered from durable content", async () => {
  const [contentModel, manager, route, home, showreel] = await Promise.all([
    readFile(new URL("lib/site-content.ts", root), "utf8"),
    readFile(new URL("components/AdminShowreelManager.tsx", root), "utf8"),
    readFile(new URL("app/api/admin/showreel/route.ts", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("components/ShowreelLoop.tsx", root), "utf8"),
  ]);
  assert.match(contentModel, /showreelVideoUrl: optionalAssetUrl/);
  assert.match(contentModel, /showreelPosterUrl: optionalAssetUrl/);
  assert.match(manager, /\/api\/admin\/media\/signature/);
  assert.match(manager, /video\/upload/);
  assert.match(manager, /accept="video\/mp4,video\/webm,video\/quicktime,video\/\*"/);
  assert.match(manager, /await persist\(next/);
  assert.match(route, /getOwner/);
  assert.match(route, /requireSameOrigin/);
  assert.match(route, /getSiteContent/);
  assert.match(route, /updateSiteContent/);
  assert.match(home, /videoUrl=\{brand\.showreelVideoUrl\}/);
  assert.match(showreel, /posterUrl \|\| undefined/);
});

test("responsive comfort system protects public and owner layouts down to 320px", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.match(css, /Responsive comfort system/);
  assert.match(css, /touch-action: manipulation/);
  assert.match(css, /--mobile-step-height: 150px/);
  assert.match(css, /@media \(max-width: 360px\)/);
  assert.match(css, /\.admin-mobile-nav a \{ min-width: 68px; min-height: 50px; \}/);
  assert.match(css, /\.hero-light-rays \{ display: none; \}/);
  assert.match(css, /@media \(max-width: 1024px\) and \(max-height: 620px\)/);
});

test("shared footer gives every viewport a clear and accessible hiring path", async () => {
  const [footer, portfolio, css] = await Promise.all([
    readFile(new URL("components/SiteFooter.tsx", root), "utf8"),
    readFile(new URL("lib/portfolio.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);
  assert.match(footer, /aria-labelledby="footer-heading"/);
  assert.match(footer, /aria-label="Footer navigation"/);
  assert.match(footer, /href="\/start-a-project"/);
  assert.match(footer, /mailto:/);
  assert.doesNotMatch(footer, /href="\/admin"/);
  assert.match(portfolio, /export const footerContent/);
  assert.match(css, /Modern responsive site footer/);
  assert.match(css, /@media \(max-width: 420px\)/);
  assert.match(css, /footer-project-link::before \{ animation: none; \}/);
});

test("work archive and global collaboration close stay simple, client-focused, and responsive", async () => {
  const [workPage, library, projectCard, frame, collaboration, css] = await Promise.all([
    readFile(new URL("app/work/page.tsx", root), "utf8"),
    readFile(new URL("components/WorkLibrary.tsx", root), "utf8"),
    readFile(new URL("components/ProjectCard.tsx", root), "utf8"),
    readFile(new URL("components/AppFrame.tsx", root), "utf8"),
    readFile(new URL("components/CtaBand.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);
  assert.match(workPage, /work-gallery-hero/);
  assert.match(workPage, /work-gallery-categories/);
  assert.match(workPage, /projectMatchesShowcaseCategory/);
  assert.match(workPage, /Discuss your project/);
  assert.match(library, /All projects/);
  assert.match(library, /className="project-library is-grid"/);
  assert.match(library, /<ProjectCard project=\{project\}[^>]+clean/);
  assert.doesNotMatch(library, /Grid2X2|Editorial list view|ResizeObserver/);
  assert.match(projectCard, /hideLabels/);
  assert.match(projectCard, /work-card-info/);
  assert.match(frame, /<CtaBand \/>/);
  assert.match(collaboration, /aria-labelledby="collaboration-heading"/);
  assert.match(collaboration, /cta-band-steps/);
  assert.match(collaboration, /Start your project/);
  assert.match(collaboration, /Send a quick message/);
  assert.match(css, /Editorial Work gallery: open media, quiet information, no thumbnail labels/);
  assert.match(css, /Compact collaboration close shared by every public page/);
  assert.match(css, /\.work-card-media \.project-art\.is-label-free::after/);
  assert.match(css, /\.work-collection \.project-library\.is-grid \{/);
  assert.match(css, /@media \(max-width: 700px\)/);
});

test("owner portrait and owner-created category portfolio stay secure, durable, and label-free", async () => {
  const [contentModel, editor, experience, showcase, artwork, home, portfolio, categoryPage, adminProjects, projectEditor, resetMigration, css] = await Promise.all([
    readFile(new URL("lib/site-content.ts", root), "utf8"),
    readFile(new URL("components/AdminContentForm.tsx", root), "utf8"),
    readFile(new URL("components/ExperienceSection.tsx", root), "utf8"),
    readFile(new URL("components/ShowcaseGrid.tsx", root), "utf8"),
    readFile(new URL("components/ProjectArtwork.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("lib/portfolio.ts", root), "utf8"),
    readFile(new URL("app/work/category/[category-slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/admin/projects/page.tsx", root), "utf8"),
    readFile(new URL("components/AdminProjectEditor.tsx", root), "utf8"),
    readFile(new URL("drizzle/0003_reset_project_library.sql", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);
  assert.match(contentModel, /profileImageUrl: optionalAssetUrl/);
  assert.match(contentModel, /profileImageAlt: optionalTextField/);
  assert.match(editor, /\/api\/admin\/media\/signature/);
  assert.match(editor, /accept="image\/\*"/);
  assert.match(editor, /Save public content to publish it/);
  assert.match(experience, /experience-portrait/);
  assert.match(experience, /profileImageAlt/);
  assert.match(showcase, /hideLabels/);
  assert.match(showcase, /\/work\/category\//);
  assert.match(showcase, /workCount/);
  assert.doesNotMatch(showcase, /Client|Industry|Year|project\.summary/);
  assert.match(artwork, /!hideLabels/);
  assert.match(home, /showcaseCategories\.length > 0/);
  assert.match(portfolio, /export const projects: Project\[\] = \[\]/);
  assert.match(portfolio, /export const showcaseCategories: ShowcaseCategoryDefinition\[\] = \[\]/);
  assert.match(portfolio, /deriveShowcaseCategories/);
  assert.match(portfolio, /categorySlug/);
  assert.doesNotMatch(portfolio, /Book Cover Design|Brand Identity Design|Banner & Poster Design/);
  assert.match(portfolio, /projectMatchesShowcaseCategory/);
  assert.match(portfolio, /galleryItemMatchesShowcaseCategory/);
  assert.match(portfolio, /projectCategoryWorkCount/);
  assert.match(categoryPage, /category-work-grid/);
  assert.match(categoryPage, /ProjectMedia/);
  assert.match(categoryPage, /className="category-work-card-link"/);
  assert.match(categoryPage, /className="category-work-open"/);
  assert.match(categoryPage, /href=\{`\/work\/\$\{project\.slug\}`\}/);
  assert.match(adminProjects, /admin-category-grid/);
  assert.match(adminProjects, /admin\/projects\/new\?category=/);
  assert.match(adminProjects, /Categories appear automatically/);
  assert.match(projectEditor, /placeholder="e\.g\. Brand Identity"/);
  assert.doesNotMatch(projectEditor, /CategoryOptions|<select required value=\{project\.category\}/);
  assert.match(projectEditor, /admin-project-composer/);
  assert.match(projectEditor, /admin-simple-settings/);
  assert.match(projectEditor, /Public category/);
  assert.match(projectEditor, /contentBlocks/);
  assert.doesNotMatch(home, /featured chapters|Browse category showreels/);
  assert.match(resetMigration, /DELETE FROM `project_content`/);
  assert.match(resetMigration, /DELETE FROM `projects`/);
  assert.match(resetMigration, /manual-reset-2026-08-10/);
  assert.match(css, /\.process-focus li,[\s\S]*white-space: nowrap/);
  assert.match(css, /Behance-inspired category library/);
  assert.match(css, /Viewport-fit project presentation/);
  assert.match(css, /max-height: min\(78svh, 880px\)/);
  assert.match(css, /\.project-detail-page \.project-intro h1/);
});
