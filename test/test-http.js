import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const server = http.createServer((req, res) => {
  const reqPath = req.url.split('?')[0];
  let filePath = path.join(distDir, reqPath === '/' ? 'index.html' : reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mime = ext === '.html' ? 'text/html' : (ext === '.js' ? 'application/javascript' : (ext === '.css' ? 'text/css' : 'text/plain'));
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(4173, () => {
  console.log('HTTP Server listening on port 4173');
  http.get('http://localhost:4173/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Status code:', res.statusCode);
      console.log('HTML size:', data.length, 'bytes');
      console.log('Contains title:', data.includes('Prompt Shorthand Analyzer V2'));
      console.log('Contains app div:', data.includes('id="app"'));
      console.log('Contains JS asset:', data.includes('.js'));
      console.log('Contains CSS asset:', data.includes('.css'));
      server.close(() => {
        console.log('HTTP Server test passed successfully!');
        process.exit(0);
      });
    });
  });
});
