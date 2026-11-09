const fs = require("fs");
const path = require("path");

const API_URL = process.env.API_BASE_URL || "http://localhost:3000";
const srcDir = __dirname;
const outDir = path.join(__dirname, "build");

// Clean and recreate output directory
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// Copy and substitute placeholder in index.html
let html = fs.readFileSync(path.join(srcDir, "index.html"), "utf8");
html = html.replace(/__API_BASE_URL__/g, API_URL);
fs.writeFileSync(path.join(outDir, "index.html"), html);

// Copy other static assets
const assets = ["style.css", "app.js"];
for (const file of assets) {
  const src = path.join(srcDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outDir, file));
  }
}

console.log(`Build complete. API_BASE_URL = ${API_URL}`);