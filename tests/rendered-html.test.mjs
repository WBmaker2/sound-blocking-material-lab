import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the educational app shell and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /<title>소리 차단 재료 연구소<\/title>/i);
  assert.match(html, /소리가 지나가는 길과 줄어드는 조건을 비교해요/);
  assert.match(html, /연구 시작/);
  assert.match(html, /업데이트 내역/);
  assert.match(html, /http:\/\/localhost\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("removes starter-only preview code and keeps the social card", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<SoundLabApp \/>/);
  assert.match(layout, /lang="ko"/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/og.png", import.meta.url));
  assert.deepEqual(
    await readdir(new URL("../app/_sites-preview", import.meta.url)),
    [],
  );
  await access(new URL("../public/favicon.svg", import.meta.url));
  assert.equal(root.protocol, "file:");
});
