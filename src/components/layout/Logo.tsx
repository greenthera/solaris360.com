import logoLight from '../../assets/logo-light.png'

/**
 * Solaris360 brand wordmark. Uses the light (knockout) artwork so it reads on
 * the dark header/footer; the sun keeps its orange.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoLight}
      alt="Solaris360"
      width={1128}
      height={232}
      decoding="async"
      className={['w-auto', className ?? 'h-7'].filter(Boolean).join(' ')}
    />
  )
}
