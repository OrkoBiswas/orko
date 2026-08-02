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
  assert.match(admin, /requireChatGPTUser/);
  assert.doesNotMatch(repository, /localStorage|sessionStorage/);
});

test("required project documentation exists", async () => {
  const files = ["PRODUCT_REQUIREMENTS.md", "INFORMATION_ARCHITECTURE.md", "DESIGN_SYSTEM.md", "ANIMATION_SYSTEM.md", "CONTENT_MODEL.md", "DATABASE_SCHEMA.md", "ACCESSIBILITY.md", "PERFORMANCE.md", "SEO.md", "SECURITY.md", "DEPLOYMENT.md", "TESTING.md", "IMPLEMENTATION_STATUS.md"];
  for (const file of files) {
    const contents = await readFile(new URL(`docs/${file}`, root), "utf8");
    assert.ok(contents.length > 200, `${file} should contain substantive guidance`);
  }
});
