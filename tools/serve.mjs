// Lokální náhled public/ s čistými URL jako Cloudflare Pages (/a/b → a/b.html, /a/ → a/index.html).
// Použití: node tools/serve.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const port = Number(process.argv[2] || process.env.PORT || 8788);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png' };

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const tries = url.endsWith('/') ? [url + 'index.html'] : [url, url + '.html', url + '/index.html'];
  for (const t of tries) {
    const f = path.join(PUB, t);
    if (!f.startsWith(PUB)) break;
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      if (t === url + '/index.html') { res.writeHead(308, { Location: url + '/' }); return res.end(); }
      res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
      return fs.createReadStream(f).pipe(res);
    }
  }
  res.writeHead(404, { 'Content-Type': types['.html'] });
  fs.createReadStream(path.join(PUB, '404.html')).on('error', () => res.end('404')).pipe(res);
}).listen(port, () => console.log(`MCnet náhled: http://localhost:${port}/`));
