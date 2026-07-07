const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const indexPath = path.join(dist, 'index.html');

const html = fs.readFileSync(indexPath, 'utf8');
const scriptMatch = html.match(/<script[^>]+src="\.\/([^"]+\.js)"[^>]*><\/script>/);
const styleMatch = html.match(/<link[^>]+href="\.\/([^"]+\.css)"[^>]*>/);

if (!scriptMatch || !styleMatch) {
  throw new Error('Cannot find built JS/CSS assets in dist/index.html');
}

const script = fs.readFileSync(path.join(dist, scriptMatch[1]), 'utf8');
const style = fs.readFileSync(path.join(dist, styleMatch[1]), 'utf8');

const standalone = html
  .replace(styleMatch[0], `<style>\n${style}\n</style>`)
  .replace(scriptMatch[0], '')
  .replace('</body>', `<script>\n${script}\n</script>\n  </body>`);

fs.writeFileSync(path.join(dist, 'standalone.html'), standalone, 'utf8');
console.log('Generated dist/standalone.html');
