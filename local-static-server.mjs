import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("dist");
const port = Number(process.argv[2] || 4174);
const basePath = "/tunik/";

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function assetPath(url) {
  const pathname = decodeURIComponent(new URL(url, "http://local").pathname);
  const relativePath = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  const candidate = resolve(root, normalize(relativePath).replace(/^[/\\]+/, ""));
  return candidate.startsWith(root) ? candidate : join(root, "index.html");
}

async function send(res, filePath) {
  const body = await readFile(filePath);
  res.writeHead(200, {
    "content-type": types[extname(filePath)] || "application/octet-stream",
    "cache-control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable",
  });
  res.end(body);
}

createServer(async (req, res) => {
  try {
    let filePath = assetPath(req.url || "/");
    const info = await stat(filePath).catch(() => null);

    if (!info || info.isDirectory()) {
      filePath = join(root, "index.html");
    }

    await send(res, filePath);
  } catch {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Server error");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Static site available at http://127.0.0.1:${port}`);
});
