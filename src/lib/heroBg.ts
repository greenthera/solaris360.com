import heroBg from '../assets/solaris-india-industrial.webp'
import heroBgSmall from '../assets/solaris-india-industrial-800.webp'

/** Resolved URL of the homepage hero background (preloaded from the Home page). */
export const heroBgUrl = heroBg
/** 800w variant for phones - the full image is 1536w / 188 KB, this one 41 KB. */
export const heroBgSrcSet = `${heroBgSmall} 800w, ${heroBg} 1536w`
