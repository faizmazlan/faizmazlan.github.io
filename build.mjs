import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs';
import { join } from 'path';

const DIST = 'dist';

// Clean and create dist
mkdirSync(DIST, { recursive: true });
mkdirSync(join(DIST, 'css'), { recursive: true });
mkdirSync(join(DIST, 'assets'), { recursive: true });

// 1. Bundle & minify JS (all modules into one file)
await esbuild.build({
  entryPoints: ['js/app.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  outfile: join(DIST, 'js/app.min.js'),
});

// 2. Concatenate & minify CSS
const cssFiles = [
  'css/variables.css',
  'css/reset.css',
  'css/base.css',
  'css/components.css',
  'css/sections.css',
  'css/animations.css',
  'css/responsive.css',
];

const combinedCss = cssFiles.map(f => readFileSync(f, 'utf8')).join('\n');
const cssResult = await esbuild.transform(combinedCss, {
  loader: 'css',
  minify: true,
});
writeFileSync(join(DIST, 'css/styles.min.css'), cssResult.code);

// 3. Copy and patch index.html — replace multiple CSS/JS references with minified versions
let html = readFileSync('index.html', 'utf8');

// Replace all individual CSS links with single minified one
const cssLinkPattern = /\s*<link rel="stylesheet" href="css\/[\w.-]+\.css">\n?/g;
let firstCssReplaced = false;
html = html.replace(cssLinkPattern, (match) => {
  if (!firstCssReplaced) {
    firstCssReplaced = true;
    return '  <link rel="stylesheet" href="css/styles.min.css">\n';
  }
  return '';
});

// Replace module script with minified IIFE
html = html.replace(
  '<script type="module" src="js/app.js"></script>',
  '<script src="js/app.min.js" defer></script>'
);

writeFileSync(join(DIST, 'index.html'), html);

// 4. Copy assets
cpSync('assets', join(DIST, 'assets'), { recursive: true });

// 5. Copy resume.pdf if it exists
if (existsSync('resume.pdf')) {
  cpSync('resume.pdf', join(DIST, 'resume.pdf'));
}

// 6. Copy CV PDF if it exists
if (existsSync('faizmazlan.cv.pdf')) {
  cpSync('faizmazlan.cv.pdf', join(DIST, 'faizmazlan.cv.pdf'));
}

console.log('✅ Build complete → dist/');
console.log('   js/app.min.js  — bundled & minified JS');
console.log('   css/styles.min.css — concatenated & minified CSS');
console.log('   index.html — patched references');
