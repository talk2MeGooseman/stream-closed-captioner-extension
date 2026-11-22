#!/usr/bin/env node
// Checks a built extension bundle (default: ./dist) against Twitch's hosted
// Extension rules before it's zipped for upload:
//   https://dev.twitch.tv/docs/extensions/guidelines-and-policies (2.5, 2.6)
//   https://dev.twitch.tv/docs/extensions#restrictions-on-content (CSP)
//   https://dev.twitch.tv/docs/extensions/life-cycle (version assets ZIP)
//
// Pure Node (no shell tools), so it runs the same on Windows, macOS and CI.
// Usage: node scripts/check-bundle.mjs [distDir]

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'

const distDir = resolve(process.argv[2] ?? 'dist')

// The Extension Helper is the only script Twitch serves from outside the bundle.
const ALLOWED_EXTERNAL_SCRIPTS = [
  'https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js',
]

// The ZIP may only hold assets the Extension needs to run.
const ALLOWED_EXTENSIONS = new Set([
  '.html', '.js', '.css', '.json',
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp3', '.ogg', '.wav', '.mp4', '.webm',
])

// Not a Twitch limit: a sanity warning, since a bundle this large usually
// means something got bundled by mistake (and viewers download all of it).
const WARN_TOTAL_BYTES = 10 * 1024 * 1024

const errors = []
const warnings = []

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

let files
try {
  files = walk(distDir)
} catch {
  console.error(`check-bundle: ${distDir} not found. Run "yarn build" first.`)
  process.exit(1)
}

let totalBytes = 0

for (const file of files) {
  const rel = relative(distDir, file).split('\\').join('/')
  const ext = extname(file).toLowerCase()
  totalBytes += statSync(file).size

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    errors.push(`${rel}: file type "${ext || '(none)'}" is not an Extension asset`)
    continue
  }

  if (ext === '.html') checkHtml(rel, readFileSync(file, 'utf8'))
  if (ext === '.js') checkJs(rel, readFileSync(file, 'utf8'))
  if (ext === '.css') checkCss(rel, readFileSync(file, 'utf8'))
}

function checkHtml(rel, html) {
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attrs, body] = match
    const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]

    if (!src) {
      // CSP: no inline scripts without a nonce/hash, and we can't add either.
      if (body.trim()) errors.push(`${rel}: inline <script> (blocked by Twitch CSP)`)
      continue
    }

    if (/^(https?:)?\/\//i.test(src) && !ALLOWED_EXTERNAL_SCRIPTS.includes(src)) {
      errors.push(`${rel}: external script ${src} (only the Extension Helper may load from outside the bundle)`)
    }
  }

  if (/<iframe\b/i.test(html)) errors.push(`${rel}: <iframe> (frame-src is blocked)`)
  if (/\son[a-z]+\s*=\s*["']/i.test(html)) errors.push(`${rel}: inline event handler attribute (blocked by Twitch CSP)`)
  if (!html.includes(ALLOWED_EXTERNAL_SCRIPTS[0])) {
    warnings.push(`${rel}: does not load the Twitch Extension Helper`)
  }
}

function checkJs(rel, js) {
  // Guideline 2.6: eval-using code must not be combined into minified files.
  if (/(^|[^.\w$])eval\s*\(/.test(js)) errors.push(`${rel}: uses eval()`)
  if (/\bnew\s+Function\s*\(/.test(js)) errors.push(`${rel}: uses new Function()`)
  if (/\/\/# sourceMappingURL=/.test(js)) warnings.push(`${rel}: references a source map that is not shipped`)
}

function checkCss(rel, css) {
  // Fonts must be local files or Google Fonts; base64 data: fonts violate CSP.
  if (/url\(\s*["']?data:(font|application\/(x-)?font)/i.test(css)) {
    errors.push(`${rel}: inlined data: font (font-src blocks data: URIs)`)
  }
  for (const match of css.matchAll(/url\(\s*["']?(https?:\/\/[^"')]+)/gi)) {
    if (!/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(match[1])) {
      errors.push(`${rel}: remote asset ${match[1]} (only bundled files or Google Fonts)`)
    }
  }
}

if (totalBytes > WARN_TOTAL_BYTES) {
  warnings.push(`bundle is ${(totalBytes / 1024 / 1024).toFixed(1)} MB; check for accidentally bundled assets`)
}

for (const warning of warnings) console.warn(`warning: ${warning}`)

if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`)
  console.error(`\ncheck-bundle: ${errors.length} problem(s) would fail Twitch review.`)
  process.exit(1)
}

console.log(
  `check-bundle: ${files.length} files, ${(totalBytes / 1024).toFixed(0)} KB — OK for Twitch upload`,
)
