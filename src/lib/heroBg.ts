import heroBg from '../assets/solaris-india-industrial.webp'
import heroBgMedium from '../assets/solaris-india-industrial-1200.webp'
import heroBgSmall from '../assets/solaris-india-industrial-800.webp'

/** Resolved URL of the homepage hero background (preloaded from the Home page). */
export const heroBgUrl = heroBg
/** Match the preload and image candidates, including high-density phone screens. */
export const heroBgSrcSet = `${heroBgSmall} 800w, ${heroBgMedium} 1200w, ${heroBg} 1536w`
