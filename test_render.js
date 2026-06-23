import puppeteer from 'puppeteer';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.toString()));

  await page.goto('http://127.0.0.1:8080/dist/index.html', { waitUntil: 'networkidle0' });

  console.log('Waiting for #root content...');
  await new Promise(r => setTimeout(r, 10000));
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML after 10s:', html.substring(0, 1000));

  await browser.close();
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.join(process.cwd(), urlPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8080, () => {
  run().then(() => server.close());
});
