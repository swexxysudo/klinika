import { mkdir, copyFile, cp, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');
await mkdir(out, { recursive: true });
const html = await readFile(path.join(root, 'index.html'), 'utf8');
if (!html.includes('noindex, nofollow') || !html.includes('Демо-концепт, не официальный сайт, удалим по первой просьбе')) {
  throw new Error('Отсутствует маркировка демо или запрет индексации.');
}
for (const file of ['index.html', 'styles.css', 'script.js', 'robots.txt']) {
  await copyFile(path.join(root, file), path.join(out, file));
}
await cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
await writeFile(path.join(out, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
console.log('Готово: dist/ — статический сайт, без зависимостей.');
