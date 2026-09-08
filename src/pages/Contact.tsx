import { useState } from 'react'
import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/site-overview-dusk.webp'
import { PageHero, Section } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { company, wa } from '../content/company'

const interests = [
  'Rooftop solar for my home',
  'Solar for my business / factory',
  'Shadow analysis / stability certificate',
  'Solar equipment supply',
  'Something else',
]

export default function Contact() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState(interests[0])
  const [message, setMessage] = useState('')

  const waHref = wa(
    [
      `Hi Solaris360,`,
      name && `My name is ${name}.`,
      `I'm interested in: ${interest}.`,
      message && `Message: ${message}`,
      phone && `You can reach me on ${phone}.`,
    ]
      .filter(Boolean)
      .join('\n'),
  )

  return (
    <>
      <Seo
        title="Contact Us"
        description="Contact Solaris360 for a solar estimate. Office at Palladium, VIP Road, Vesu, Surat. Call +91 (999) 811-7531 or message on WhatsApp."
        path="/contact/"
      />
      <PageHero image={pageHeroImg}
        eyebrow="Get a quote"
        title="How can we help?"
        intro="We strive to be in constant communication with our customers until the job is done. Use the form for an estimate, or call us with any questions about solar power or solar installation at your home or business. We look forward to serving you."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal
            as="form"
            className="space-y-5 border border-white/10 bg-navy p-6"
          >
            <p className="text-sm text-muted">
              This form doesn’t send anything to a server - it opens WhatsApp with your details filled
              in, so you can review and send.
            </p>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-white/15 bg-ink px-3 py-2 text-paper"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                className="w-full border border-white/15 bg-ink px-3 py-2 text-paper"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">I’m interested in</span>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full border border-white/15 bg-ink px-3 py-2 text-paper"
              >
                {interests.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full border border-white/15 bg-ink px-3 py-2 text-paper"
              />
            </label>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
              Continue on WhatsApp
            </a>
          </Reveal>

          <Reveal className="space-y-6 text-sm">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Office</p>
              <p className="mt-2 text-muted">{company.officeAddress}</p>
              <a
                href={company.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-orange underline"
              >
                Get directions ↗
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Phone</p>
              <p className="mt-2">
                <a href={`tel:${company.phone.mainDigits}`} className="text-muted hover:text-paper">
                  {company.phone.main}
                </a>
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Email</p>
              <p className="mt-2">
                <a href={`mailto:${company.email.general}`} className="text-muted hover:text-paper">
                  {company.email.general}
                </a>
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Hours</p>
              <p className="mt-2 text-muted">{company.hours.display}</p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
