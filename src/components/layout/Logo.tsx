// 320px WebP (2x the largest display size, h-8 ≈ 156px wide); logo-light.png is the master
import logoLight from '../../assets/logo-light.webp'
import logoAvif from '../../assets/logo-light.avif'

/**
 * Solaris360 brand wordmark. Uses the light (knockout) artwork so it reads on
 * the dark header/footer; the sun keeps its orange.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={logoAvif} />
      <img
        src={logoLight}
        alt="Solaris360"
        width={320}
        height={66}
        decoding="async"
        className={['w-auto', className ?? 'h-7'].filter(Boolean).join(' ')}
      />
    </picture>
  )
}
