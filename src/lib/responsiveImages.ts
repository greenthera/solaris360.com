import dimensions from '../assets/image-dimensions.json'

// Eager URL imports are build metadata: they don't download image data.
const images = import.meta.glob<string>(
  ['../assets/solaris-*.webp', '../assets/solaris-*.avif'],
  { eager: true, query: '?url', import: 'default' },
)

const intrinsicSizes = new Map<string, { width: number; height: number }>()
const webpSources = new Map<string, string>()
const avifSources = new Map<string, string>()
for (const [name, { width, height }] of Object.entries(dimensions)) {
  const path = `../assets/${name}`
  const original = images[path]
  if (!original) continue
  intrinsicSizes.set(original, { width, height })
  const sizes = [480, 800, 1200, 1440].filter((size) => size < width)
  for (const [extension, sources] of [['webp', webpSources], ['avif', avifSources]] as const) {
    const candidates = sizes.flatMap((size) => {
      const url = images[path.replace('.webp', `-${size}.${extension}`)]
      return url ? [`${url} ${size}w`] : []
    })
    const full = images[path.replace('.webp', `.${extension}`)]
    if (full) candidates.push(`${full} ${width}w`)
    if (candidates.length) sources.set(original, candidates.join(', '))
  }
}

export const responsiveImageSrcSet = (src: string) => webpSources.get(src)
export const responsiveAvifSrcSet = (src: string) => avifSources.get(src)

/** Actual source dimensions; parent containers still control the intended crop. */
export const responsiveImageDimensions = (src: string) => intrinsicSizes.get(src) ?? {}
