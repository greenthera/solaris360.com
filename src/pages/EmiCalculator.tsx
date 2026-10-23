import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-india-consultation.webp'
import { PageHero, Section } from '../components/ui/primitives'
import { Field } from '../components/emi/Field'
import { BalanceChart } from '../components/emi/BalanceChart'
import { LeadFields } from '../components/ui/LeadFields'
import { calcEmi } from '../lib/emi'
import { submitLead, validateLead, type LeadContact, type LeadErrors } from '../lib/leads'
import { inr } from '../lib/format'
import { wa, waMsg } from '../content/company'

export default function EmiCalculator() {
  const [price, setPrice] = useState(400000)
  const [months, setMonths] = useState(60)
  const [ratePct, setRatePct] = useState(9)
  const [contact, setContact] = useState<LeadContact>({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState<LeadErrors>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const r = useMemo(() => calcEmi({ price, months, ratePct }), [price, months, ratePct])
  const interestShare = r.totalPayment > 0 ? r.totalInterest / r.totalPayment : 0

  // name + phone are required to get the report; the lead goes to the shared Google Form
  const generateReport = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateLead(contact)
    setErrors(errs)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus(),
      )
      return
    }
    setBusy(true)
    setDone(false)
    try {
      await submitLead({
        ...contact,
        source: 'EMI calculator',
        details: `System price ${inr(price)} | ${months} months | ${ratePct}% p.a. | Monthly EMI ${inr(r.monthlyEmi)} | Total interest ${inr(r.totalInterest)} | Total payment ${inr(r.totalPayment)}`,
      })
      const { downloadEmiPdf } = await import('../lib/emiPdf')
      await downloadEmiPdf({ price, months, ratePct }, r, contact)
      setDone(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo
        title="Solar Loan EMI Calculator"
        description="Estimate the monthly EMI on a rooftop solar system from its price, loan tenure and interest rate - with total interest and total payment."
        path="/emi-calculator/"
      />
      <PageHero
        image={pageHeroImg}
        eyebrow="Knowledge Center"
        title="Solar loan EMI calculator"
        intro="Work out what a rooftop system costs per month against the electricity bill it replaces. Indicative only - the final EMI depends on your lender's policies, processing fees and charges."
      />

      <Section paper>
        {/* one card, three steps in order: who it's for -> the loan -> get the report */}
        <form
          ref={formRef}
          onSubmit={generateReport}
          noValidate
          className="border border-navy/15 bg-white shadow-[0_1px_0_rgba(23,22,63,0.04)]"
        >
          <Step n={1} title="Your details" className="border-b border-navy/10">
            <LeadFields
              value={contact}
              onChange={setContact}
              errors={errors}
              className="grid gap-4 md:grid-cols-3"
            />
          </Step>

          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <Step n={2} title="Loan details" className="border-b border-navy/10 lg:border-b-0">
              <div className="space-y-7">
                <Field
                  label="Solar system price (incl. GST)"
                  value={price}
                  onChange={setPrice}
                  min={150000}
                  max={3000000}
                  step={10000}
                  format={inr}
                />
                <Field label="Months" value={months} onChange={setMonths} min={12} max={120} step={6} suffix="months" />
                <Field
                  label="Interest"
                  value={ratePct}
                  onChange={setRatePct}
                  min={5}
                  max={18}
                  step={0.25}
                  suffix="% p.a."
                />
              </div>
            </Step>

            {/* the result - updates live as the sliders move */}
            <div className="flex flex-col justify-center bg-navy p-6 text-paper sm:p-8" aria-live="polite">
              <p className="text-sm text-muted">Monthly EMI</p>
              <p className="mt-1 font-display text-5xl font-700 tabular-nums tracking-tight text-orange sm:text-6xl">
                {inr(r.monthlyEmi)}
              </p>
              <p className="mt-2 text-sm text-muted">
                for {months} months at {ratePct}% a year
              </p>

              {/* where the money goes: principal vs interest */}
              <div className="mt-8 flex h-3 overflow-hidden" role="img" aria-label={`Interest is ${Math.round(interestShare * 100)}% of the total payment`}>
                <span className="bg-orange" style={{ width: `${(1 - interestShare) * 100}%` }} />
                <span className="bg-paper/35" style={{ width: `${interestShare * 100}%` }} />
              </div>
              <dl className="mt-4 space-y-2.5 text-sm">
                <Row swatch="bg-orange" label="Principal" value={inr(price)} />
                <Row swatch="bg-paper/35" label="Total interest" value={inr(r.totalInterest)} />
                <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                  <dt className="text-paper">Total payment</dt>
                  <dd className="font-display text-lg font-600 tabular-nums">{inr(r.totalPayment)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <Step n={3} title="Get your report" className="border-t border-navy/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <button type="submit" disabled={busy} className="btn btn-primary whitespace-nowrap disabled:opacity-60">
                  {busy ? 'Preparing report…' : 'Generate report'}
                </button>
                <p className="max-w-md text-sm text-ash">
                  Get a PDF with your EMI, graph and full schedule. We use your details only to contact
                  you about solar financing. <Link to="/privacy/" className="text-navy underline">Privacy Policy</Link>
                </p>
              </div>
              <a
                href={wa(
                  waMsg.emi(
                    `System ${inr(price)}, ${months} months at ${ratePct}% p.a. → EMI approx ${inr(r.monthlyEmi)}.`,
                  ),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn whitespace-nowrap border-navy/25 text-navy hover:border-orange hover:text-navy"
              >
                Discuss on WhatsApp
              </a>
            </div>
            <p role="status" className="mt-3 text-sm text-navy empty:hidden">
              {done ? 'Report downloaded. Our team will call you about financing.' : ''}
            </p>
          </Step>
        </form>

        {/* graph and schedule side by side on wide screens, same height */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="border border-navy/15 bg-white p-6">
            <h2 className="font-display text-lg font-700 text-navy">Balance over the term</h2>
            <p className="mt-1 text-sm text-ash">What you still owe at the start of each month.</p>
            <div className="mt-5">
              <BalanceChart rows={r.rows} />
            </div>
          </section>

          <section className="flex flex-col border border-navy/15 bg-white p-6">
            <h2 className="font-display text-lg font-700 text-navy">Month-by-month schedule</h2>
            <p className="mt-1 text-sm text-ash">How each EMI splits into interest and principal.</p>
            <div className="mt-5 -mx-6 max-h-[22rem] flex-1 overflow-auto px-6 lg:max-h-none lg:basis-0">
              <table className="w-full min-w-[30rem] text-right font-mono text-xs tabular-nums text-navy">
                <thead className="sticky top-0 bg-white text-ash">
                  <tr className="border-b border-navy/15 [&_th]:px-2 [&_th]:py-2 [&_th]:font-400">
                    <th className="text-left">Month</th>
                    <th>Opening</th>
                    <th>EMI</th>
                    <th>Interest</th>
                    <th>Principal</th>
                    <th>Closing</th>
                  </tr>
                </thead>
                <tbody>
                  {r.rows.map((row) => (
                    <tr key={row.month} className="border-b border-navy/5 [&_td]:px-2 [&_td]:py-1.5">
                      <td className="text-left">{row.month}</td>
                      <td>{inr(row.opening)}</td>
                      <td>{inr(row.emi)}</td>
                      <td>{inr(row.interest)}</td>
                      <td>{inr(row.principal)}</td>
                      <td>{inr(row.closing)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </Section>
    </>
  )
}

/** One numbered step of the calculator card - the steps really are a sequence. */
function Step({ n, title, className = '', children }: { n: number; title: string; className?: string; children: ReactNode }) {
  return (
    <fieldset className={`min-w-0 p-6 sm:p-8 ${className}`}>
      <legend className="sr-only">{title}</legend>
      <div className="mb-5 flex items-center gap-3" aria-hidden="true">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-navy font-display text-sm font-700 text-paper">
          {n}
        </span>
        <span className="font-display text-base font-700 text-navy">{title}</span>
      </div>
      {children}
    </fieldset>
  )
}

function Row({ swatch, label, value }: { swatch: string; label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="flex items-center gap-2 text-muted">
        <span className={`inline-block h-2.5 w-2.5 ${swatch}`} aria-hidden="true" />
        {label}
      </dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}
