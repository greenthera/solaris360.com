// URL imports don't fetch the files. The browser downloads only its selected size.
const images = import.meta.glob<string>(
  ['../assets/solaris-square-*.webp', '../assets/solaris-india-*.webp'],
  { eager: true, query: '?url', import: 'default' },
)

const sources = new Map<string, string>()
for (const [path, url] of Object.entries(images)) {
  if (/-\d+\.webp$/.test(path)) continue
  const small = images[path.replace('.webp', '-480.webp')]
  const medium = images[path.replace('.webp', '-800.webp')]
  if (small && medium) {
    sources.set(url, `${small} 480w, ${medium} 800w, ${url} ${path.includes('square-') ? 1254 : 1536}w`)
  }
}

/** Keep the full-size src as a fallback and for the original-image lightbox. */
export const responsiveImageSrcSet = (src: string) => sources.get(src)
