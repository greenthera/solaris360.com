import { useEffect, useState } from 'react'
import { wa } from '../../content/company'

/**
 * Floating WhatsApp button, bottom-right. Appears after scrolling ~400px.
 * `message` lets pages pass a context-aware pre-fill (e.g. product name).
 */
export function WhatsAppFab({ message }: { message: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 400)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <a
      href={wa(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Solaris360 on WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      className={`group fixed bottom-5 right-5 z-50 flex items-center rounded-full bg-[#25D366] p-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:pr-4 focus-visible:scale-105 focus-visible:pr-4 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] motion-reduce:hidden"
          style={{ animation: 'fab-ring 2.4s ease-out infinite' }}
          aria-hidden="true"
        />
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="relative" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.7 15L2 21.8l4.9-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.3.3c-.2.2-.3.4-.2.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1c.2-.2.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.9-.1 1.4Z" />
        </svg>
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-600 opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-32 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-32 group-focus-visible:opacity-100">
        Chat with us
      </span>
    </a>
  )
}
