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
  assert.match(schema, /logoHeight/);
  assert.doesNotMatch(schema, /showHeaderName/);
  assert.match(settings, /SEO, AEO & GEO/);
  assert.match(settings, /Google Tag Manager/);
  assert.match(layout, /ProfessionalService/);
  assert.match(layout, /googletagmanager/);
  assert.doesNotMatch(layout, /<head>/);
  assert.match(robots, /searchIndexing/);
  assert.match(llms, /Verified public profiles/);
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
  assert.match(nextConfig, /img-src[^;]+https:\/\/res\.cloudinary\.com/);
  assert.match(nextConfig, /media-src[^;]+https:\/\/res\.cloudinary\.com/);
  assert.match(nextConfig, /connect-src[^;]+https:\/\/api\.cloudinary\.com/);
});

test("project galleries are validated, owner-uploaded, and publicly rendered", async () => {
  const [contentModel, projectEditor, projectPage, workLibrary] = await Promise.all([
    readFile(new URL("lib/project-content.ts", root), "utf8"),
    readFile(new URL("components/AdminProjectEditor.tsx", root), "utf8"),
    readFile(new URL("app/work/[project-slug]/page.tsx", root), "utf8"),
    readFile(new URL("components/WorkLibrary.tsx", root), "utf8"),
  ]);
  assert.match(contentModel, /gallery: z\.array\(galleryMediaSchema\)\.max\(24\)/);
  assert.match(contentModel, /title: z\.string\(\).*default\(""\)/);
  assert.match(contentModel, /year: z\.number\(\).*nullable\(\)\.default\(null\)/);
  assert.match(projectEditor, /accept="image\/\*,video\/\*" multiple/);
  assert.match(projectEditor, /\/api\/admin\/media\/signature/);
  assert.match(projectEditor, /Set as cover/);
  assert.match(projectEditor, /Work title/);
  assert.match(projectEditor, /Client/);
  assert.match(projectEditor, /Industry/);
  assert.match(projectPage, /case-gallery/);
  assert.match(projectPage, /<ProjectMedia/);
  assert.match(workLibrary, /discipline/);
  assert.match(workLibrary, /workDisciplines/);
});
