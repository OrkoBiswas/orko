import assert from "node:assert/strict";
import test from "node:test";

async function request(path = "/", init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html", ...(init.headers ?? {}) }, ...init }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished portfolio homepage", async () => {
  const response = await request();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Orko Biswas/);
  assert.match(html, /Visual ideas/);
  assert.match(html, /Selected creative work/);
  assert.match(html, /Featured library/);
  assert.match(html, /items in the full library/);
  assert.match(html, /About &amp; experience/);
  assert.match(html, /Independent creative practice/);
  assert.match(html, /Testimonials/);
  assert.match(html, /Real feedback/);
  assert.match(html, /ready for real client testimonials/);
  assert.match(html, /Start a project/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("about page includes the managed work history", async () => {
  const response = await request("/about");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /About me/);
  assert.match(html, /About &amp; experience/);
  assert.match(html, /Independent creative practice/);
  assert.match(html, /Bangladesh/);
});

test("work archive renders real searchable project content", async () => {
  const response = await request("/work");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Video, motion/);
  assert.match(html, /Kinetic Launch Film/);
  assert.match(html, /Abstract Index/);
  assert.match(html, /Search title, format, industry/);
});

test("inquiry endpoint rejects invalid data before persistence", async () => {
  const response = await request("/api/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ pathway: "brief", name: "", email: "bad" }),
  });
  assert.equal(response.status, 422);
  const json = await response.json();
  assert.equal(json.ok, false);
  assert.match(json.message, /review/i);
});

test("owner mutation endpoint rejects anonymous requests", async () => {
  const response = await request("/api/admin/projects/prj_kinetic_launch", {
    method: "PATCH",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ status: "draft" }),
  });
  assert.equal(response.status, 401);
  const json = await response.json();
  assert.equal(json.ok, false);
});

test("project creation rejects anonymous requests", async () => {
  const response = await request("/api/admin/projects", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({}),
  });
  assert.equal(response.status, 401);
});

test("Cloudinary upload signatures reject anonymous requests", async () => {
  const response = await request("/api/admin/media/signature", {
    method: "POST",
    headers: { accept: "application/json" },
  });
  assert.equal(response.status, 401);
});

test("unknown routes use the authored recovery state", async () => {
  const response = await request("/missing-frame");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /Lost the/);
  assert.match(html, /Work archive/);
});
