import heroBg from '../assets/solaris-india-industrial.webp'
import heroBgMedium from '../assets/solaris-india-industrial-1200.webp'
import heroBgSmall from '../assets/solaris-india-industrial-800.webp'
import heroAvif from '../assets/solaris-india-industrial.avif'
import heroAvifSmall from '../assets/solaris-india-industrial-800.avif'
import heroAvifMedium from '../assets/solaris-india-industrial-1200.avif'
import heroMobile from '../assets/hero-mobile.avif'
import heroTablet from '../assets/hero-tablet.avif'
import heroTabletWebp from '../assets/hero-tablet.webp'
import heroMobileWebp from '../assets/hero-mobile.webp'

export const heroBgUrl = heroBg
export const heroBgSrcSet = `${heroBgSmall} 800w, ${heroBgMedium} 1200w, ${heroBg} 1536w`
export const heroBgAvifSrcSet = `${heroAvifSmall} 800w, ${heroAvifMedium} 1200w, ${heroAvif} 1536w`
export const heroTabletUrl = heroTablet
export const heroTabletWebpUrl = heroTabletWebp
export const heroMobileUrl = heroMobile
export const heroMobileWebpUrl = heroMobileWebp
// Mutually exclusive preloads match the picture sources, avoiding fallback downloads.
export const heroImagePreloads = [
  { src: heroMobile, type: 'image/avif', media: '(max-width: 600px)' },
  { src: heroTablet, type: 'image/avif', media: '(min-width: 601px) and (max-width: 1023px)' },
  { src: heroAvif, srcSet: heroBgAvifSrcSet, sizes: '100vw', type: 'image/avif', media: '(min-width: 1024px)' },
]
