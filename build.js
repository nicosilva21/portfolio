// Scans images/ and writes photos.js so the site builds its galleries from your folders.
// Usage: node build.js
// Folders: images/featured (hero slideshow), images/portraits, images/travel, images/street
// Any new folder you add under images/ becomes a category automatically
// (add a matching filter button in index.html to show it).
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "images");
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const photos = [];

for (const dir of fs.readdirSync(root, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const files = fs.readdirSync(path.join(root, dir.name))
    .filter((f) => exts.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (const f of files) {
    const name = path.basename(f, path.extname(f)).replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
    photos.push({
      src: "images/" + dir.name + "/" + encodeURIComponent(f),
      category: dir.name,
      alt: name || dir.name,
    });
  }
}

fs.writeFileSync(path.join(__dirname, "photos.js"), "window.PHOTOS = " + JSON.stringify(photos, null, 2) + ";\n");
const counts = photos.reduce((m, p) => ((m[p.category] = (m[p.category] || 0) + 1), m), {});
console.log("Wrote photos.js:", counts);
