// Validate the deployable output, including metadata that post-processing could remove.
// Run after npm run build. Uses only Node built-ins and never contacts the live site.
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
const read = (path) => readFileSync(join(dist, path), 'utf8')
assert.ok(existsSync(join(dist, 'sitemap.xml')), 'Run npm run build first')
const decode = (value) => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x([\da-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(([, key, double, single]) => [key.toLowerCase(), decode(double ?? single)]))
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) => attributes(tag))
const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decode(url))
assert.ok(urls.length > 0, 'Sitemap must contain pages')
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs')
const origin = new URL(urls[0]).origin
const titles = new Set(), descriptions = new Set()
const robots = read('robots.txt')
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt sitemap origin mismatch')
assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots), 'robots.txt blocks the whole site')
if (existsSync(join(dist, 'CNAME'))) {
  const cname = read('CNAME').trim()
  assert.equal(new URL(origin).hostname, cname, 'CNAME and canonical domain differ')
}

for (const url of urls) {
  const parsed = new URL(url)
  assert.equal(parsed.origin, origin, `Inconsistent sitemap origin: ${url}`)
  assert.ok(!parsed.search && !parsed.hash && parsed.pathname.endsWith('/'), `Invalid sitemap URL: ${url}`)
  const html = read(join(parsed.pathname.slice(1), 'index.html'))
  const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'))
  const metas = tags(head, 'meta')
  const meta = (key) => metas.filter((m) => m.name === key || m.property === key)
  const oneMeta = (key) => {
    const entries = meta(key)
    assert.equal(entries.length, 1, `${url}: expected one ${key} tag`)
    assert.ok(entries[0].content?.trim(), `${url}: empty ${key}`)
    return entries[0].content
  }
  const title = [...head.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)]
  assert.equal(title.length, 1, `${url}: expected one title`)
  assert.ok(title[0][1].trim(), `${url}: empty title`)
  assert.ok(!titles.has(title[0][1]), `${url}: duplicate title`); titles.add(title[0][1])
  const description = oneMeta('description')
  assert.ok(!descriptions.has(description), `${url}: duplicate description`); descriptions.add(description)
  const canonical = tags(head, 'link').filter((link) => link.rel === 'canonical')
  assert.equal(canonical.length, 1, `${url}: expected one canonical`)
  assert.equal(canonical[0].href, url, `${url}: incorrect canonical`)
  assert.equal(oneMeta('og:url'), url, `${url}: incorrect Open Graph URL`)
  assert.ok(!/noindex|nofollow/i.test(oneMeta('robots')), `${url}: sitemap contains non-indexable page`)
  assert.equal(oneMeta('twitter:card'), 'summary_large_image')
  const image = oneMeta('og:image')
  assert.equal(oneMeta('twitter:image'), image)
  oneMeta('og:image:alt'); oneMeta('twitter:image:alt')
  assert.equal(oneMeta('og:image:width'), '1200'); assert.equal(oneMeta('og:image:height'), '630')
  const imageUrl = new URL(image)
  assert.equal(imageUrl.origin, origin, `${url}: share image must be hosted locally`)
  assert.ok(existsSync(join(dist, imageUrl.pathname.slice(1))), `${url}: missing social image ${image}`)
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `${url}: expected one main heading`)
  const blocks = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(([, json]) => JSON.parse(json))
  assert.ok(blocks.some((b) => b['@type'] === 'WebPage' && b.url === url), `${url}: missing WebPage structured data`)
  assert.ok(blocks.some((b) => b['@type'] === 'WebSite'), `${url}: missing WebSite structured data`)
  if (parsed.pathname !== '/') assert.ok(blocks.some((b) => b['@type'] === 'BreadcrumbList'), `${url}: missing breadcrumbs`)
  if (/\/(?:emi|roi|gujarat-solar-subsidy)-calculator\//.test(parsed.pathname)) assert.ok(blocks.some((b) => b['@type'] === 'WebApplication'), `${url}: missing calculator structured data`)
  const ratingBlocks = blocks.filter((b) => b['@id'] === `${origin}/#business` && (b.aggregateRating || b.review))
  assert.equal(ratingBlocks.length, 0, `${url}: self-serving business review markup`)
  for (const img of tags(html, 'img')) {
    assert.ok('alt' in img, `${url}: image has no alt attribute`)
    for (const src of [img.src, ...((img.srcset && !img.srcset.startsWith('data:')) ? img.srcset.split(',').map((part) => part.trim().split(/\s+/)[0]) : [])].filter(Boolean)) {
      if (src.startsWith('/') && !src.startsWith('//')) assert.ok(existsSync(join(dist, new URL(src, origin).pathname.slice(1))), `${url}: missing image ${src}`)
    }
  }
  for (const source of tags(html, 'source')) {
    if (!source.srcset || source.srcset.startsWith('data:')) continue
    for (const candidate of source.srcset.split(',')) {
      const src = candidate.trim().split(/\s+/)[0]
      if (src.startsWith('/') && !src.startsWith('//')) assert.ok(existsSync(join(dist, new URL(src, origin).pathname.slice(1))), `${url}: missing picture source ${src}`)
    }
  }
  for (const link of tags(html, 'a')) {
    if (!link.href?.startsWith('/') || link.href.startsWith('//')) continue
    const target = new URL(link.href, origin).pathname
    const file = target.endsWith('/') ? join(target.slice(1), 'index.html') : target.slice(1)
    assert.ok(existsSync(join(dist, file)), `${url}: broken internal link ${link.href}`)
  }
}
// Ensure a generated, indexable page cannot silently disappear from the sitemap.
function checkSitemapCoverage(directory = '') {
  for (const entry of readdirSync(join(dist, directory), { withFileTypes: true })) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) { checkSitemapCoverage(file); continue }
    if (entry.name !== 'index.html') continue
    const html = read(file)
    const metas = tags(html, 'meta')
    if (metas.some((m) => m['http-equiv']?.toLowerCase() === 'refresh' || (m.name === 'robots' && /noindex/i.test(m.content)))) continue
    const url = `${origin}/${directory ? directory.replaceAll('\\', '/') + '/' : ''}`
    assert.ok(urls.includes(url), `Generated page missing from sitemap: ${url}`)
  }
}
checkSitemapCoverage()
const notFound = read('404.html')
assert.ok(tags(notFound, 'meta').some((m) => m.name === 'robots' && m.content.includes('noindex')), '404 must be noindex')
assert.ok(!urls.some((url) => /\/404(?:\/|\.html)$/.test(url)), '404 must not appear in sitemap')
console.log(`SEO checks passed: ${urls.length} pages, unique metadata, canonicals, social images, JSON-LD, internal links, image sources, robots and 404.`)
