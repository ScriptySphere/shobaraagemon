// Builds /post/<code>/index.html for every entry in links.json.
// Runs automatically in GitHub Actions. No dependencies.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "post");
const CODE_RE = /^[a-z0-9][a-z0-9_-]*$/;

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "config.json"), "utf8"));
const SITE = cfg.site.replace(/\/+$/, "");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const absImage = (img) =>
  /^https?:\/\//i.test(img) ? img : SITE + (img.startsWith("/") ? "" : "/") + img;

let links;
try {
  links = JSON.parse(fs.readFileSync(path.join(ROOT, "links.json"), "utf8"));
  if (!Array.isArray(links)) throw new Error("links.json must be an array");
} catch (e) {
  console.error("Could not read links.json:", e.message);
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const seen = new Set();
let errors = 0;

links.forEach((l, i) => {
  const code = String(l.code || "").trim();
  const url = String(l.url || "").trim();
  if (!CODE_RE.test(code)) { console.error(`#${i + 1}: invalid code "${code}"`); errors++; return; }
  if (!/^https?:\/\//i.test(url)) { console.error(`#${i + 1} (${code}): url must start with http(s)://`); errors++; return; }
  if (seen.has(code)) { console.error(`#${i + 1}: duplicate code "${code}"`); errors++; return; }
  seen.add(code);

  const title = esc(l.title || cfg.defaultTitle);
  const desc = esc(l.description || cfg.defaultDescription);
  const image = esc(absImage(l.image || cfg.defaultImage));
  const shortUrl = esc(`${SITE}/post/${code}`);
  const target = esc(url);
  const jsTarget = JSON.stringify(url).replace(/</g, "\\u003c");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.siteName)}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${shortUrl}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image}">
<link rel="canonical" href="${shortUrl}">
<script>location.replace(${jsTarget});</script>
<noscript><meta http-equiv="refresh" content="0;url=${target}"></noscript>
<style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;color:#333;background:#f7f9fa}a{color:#0e6b73}</style>
</head>
<body><p>Redirecting...<br><a href="${target}">Click here if you are not redirected</a></p></body>
</html>
`;
  fs.mkdirSync(path.join(OUT, code), { recursive: true });
  fs.writeFileSync(path.join(OUT, code, "index.html"), html);
  console.log(`OK /post/${code} -> ${url}`);
});

fs.writeFileSync(path.join(OUT, "index.html"),
  `<!DOCTYPE html><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=/"><a href="/">Home</a>`);

if (errors) { console.error(`${errors} error(s) in links.json`); process.exit(1); }
console.log(`Done: ${seen.size} link(s).`);
