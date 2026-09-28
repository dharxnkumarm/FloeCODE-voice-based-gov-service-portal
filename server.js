/**
 * FlowCODE - Local Static HTTP Server & API Runner
 * Simple, zero-dependency Node.js ESM web server with Vercel API emulation.
 * Run using: node server.js
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);

  // Handle /api/* serverless endpoints
  if (urlObj.pathname.startsWith('/api')) {
    let route = urlObj.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
    if (!route) route = 'index';
    const apiFile = path.join(__dirname, 'api', `${route}.js`);

    if (fs.existsSync(apiFile)) {
      let rawBody = '';
      req.on('data', chunk => { rawBody += chunk; });
      req.on('end', async () => {
        try {
          const mod = await import(`file://${apiFile}`);
          const handler = mod.default;

          req.query = Object.fromEntries(urlObj.searchParams);
          req.body = rawBody;
          try { req.body = JSON.parse(rawBody); } catch (_) {}

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(data, null, 2));
          };

          await handler(req, res);
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  // Handle static file serving
  let safePath = decodeURI(urlObj.pathname);
  if (safePath === '/') {
    safePath = '/index.html';
  }

  // Support clean URLs (e.g. /login -> /login.html)
  let filePath = path.join(__dirname, safePath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>The requested file does not exist.</p><p><a href="/">Return to Home</a></p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.message}`);
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`FlowCODE Web & API Server running at: http://localhost:${PORT}/`);
  console.log(`API Endpoints available:`);
  console.log(` - http://localhost:${PORT}/api`);
  console.log(` - http://localhost:${PORT}/api/services`);
  console.log(` - http://localhost:${PORT}/api/status?appNumber=APP1001`);
  console.log(` - http://localhost:${PORT}/api/auth`);
  console.log(` - http://localhost:${PORT}/api/contact`);
});
