import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/layout/Seo'
import { PageHero, Section } from '../components/ui/primitives'
import { LeadFields } from '../components/ui/LeadFields'
import { Accordion } from '../components/ui/Accordion'
import { Field } from '../components/emi/Field'
import { SubsidyChart } from '../components/subsidy/SubsidyChart'
import { calculatorLd } from '../lib/schema'
import { inr } from '../lib/format'
import { submitLead, validateLead, type LeadContact, type LeadErrors } from '../lib/leads'
import { calcSubsidy, defaultSubsidyInput, defaultSubsidyRates, subsidyRateFields, validSubsidyInput, type SubsidyInput, type SubsidyRates } from '../lib/subsidy'
import { subsidyApplicationSteps, subsidyFaq, subsidyGuideCopy, subsidyPage, subsidySources, subsidyUsageSteps } from '../content/subsidy'
import pageHeroImg from '../assets/solaris-india-residential.webp'
import '../styles/subsidy.css'

export default function GujaratSolarSubsidyCalculator() {
  const [input, setInput] = useState<SubsidyInput>({ ...defaultSubsidyInput })
  const [rates, setRates] = useState<SubsidyRates>({ ...defaultSubsidyRates })
  const [contact, setContact] = useState<LeadContact>({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState<LeadErrors>({})
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const result = validSubsidyInput(input, rates) ? calcSubsidy(input, rates) : null
  const update = <K extends keyof SubsidyInput>(key: K, value: SubsidyInput[K]) => {
    setInput(old => ({ ...old, [key]: value })); setNotice('')
  }
  const report = async (event: FormEvent) => {
    event.preventDefault(); setNotice('')
    const validation = validateLead(contact, { requireEmail: true }); setErrors(validation)
    if (!result || Object.keys(validation).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setBusy(true)
    const snapshot = { input: { ...input }, rates: { ...rates }, result, contact: { ...contact } }
    try {
      const { downloadSubsidyPdf } = await import('../lib/subsidyPdf')
      await submitLead({ ...snapshot.contact, source: 'Gujarat solar subsidy calculator', details: [
        `New capacity: ${snapshot.input.capacity} kWp`, `Existing capacity: ${snapshot.input.existingCapacity} kWp`,
        `Cost basis: ${inr(snapshot.result.costBasis)} (${snapshot.input.quotation === null ? 'benchmark' : 'quotation'})`,
        `Central subsidy: ${inr(snapshot.result.central)}`, `Gujarat subsidy: ${inr(snapshot.result.state)}`,
        `Total subsidy: ${inr(snapshot.result.totalSubsidy)}`, `Estimated customer payment: ${inr(snapshot.result.youPay)}`,
        `Annual savings: ${inr(snapshot.result.annualSavings)}`, `Rate basis: ${snapshot.result.customized ? 'Custom scenario' : 'Published default assumptions'}`,
      ].join('\n') })
      await downloadSubsidyPdf(snapshot.input, snapshot.rates, snapshot.result, snapshot.contact)
      setNotice('Your subsidy estimate has been downloaded. Our team can follow up about your solar enquiry.')
    } catch { setNotice('We could not prepare the report. Please try again.') }
    finally { setBusy(false) }
  }
  const reset = () => { setInput({ ...defaultSubsidyInput }); setRates({ ...defaultSubsidyRates }); setNotice('') }
  const breakdown = result ? [
    ['New system capacity', `${input.capacity} kWp`], ['Existing solar capacity', `${input.existingCapacity} kWp`],
    ['Combined capacity', `${result.totalCapacity} kWp`], ['Benchmark cost', inr(result.benchmark)],
    [input.quotation === null ? 'Cost basis (benchmark)' : 'Vendor quotation', inr(result.costBasis)],
    ['Central subsidy', inr(result.central)], ['Gujarat subsidy', inr(result.state)], ['Total subsidy', inr(result.totalSubsidy)],
    [`Benchmark contribution (${input.category === 'scst' ? 'SC / ST' : 'General'})`, result.stateEligible ? inr(result.consumerContribution) : 'Not applicable'],
    ['Quotation above benchmark', inr(result.extraOverBenchmark)], ['You pay after estimated subsidy', inr(result.youPay)],
    ['Yearly generation (≈1,400 units/kWp)', `${result.annualGeneration.toLocaleString('en-IN')} units`],
    [`Yearly bill saving at ₹${input.tariff}/unit`, inr(result.annualSavings)],
    ['Simple payback', result.paybackYears === null ? 'Not available at ₹0/unit' : `${result.paybackYears.toFixed(1)} years`],
  ] : []
  return <>
    <Seo title={subsidyPage.title} description={subsidyPage.description} path={subsidyPage.path}
      jsonLd={[calculatorLd('Gujarat Solar Subsidy Calculator', subsidyPage.path, subsidyPage.description), {
        '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: subsidyFaq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }]} />
    <PageHero image={pageHeroImg} eyebrow="Knowledge Center" title="Gujarat solar subsidy calculator"
      intro="Estimate your PM Surya Ghar central subsidy, Gujarat state top-up and what you pay for rooftop solar. Includes the Gujarat framework announced on 22 October 2026." />
    <div className="subsidy-workspace">
      <div className="container-x py-10 md:py-14">
        <div className="subsidy-intro"><div><p className="subsidy-eyebrow">A clearer cost before you go solar</p><h2>Work out your subsidy</h2><p>Adjust the system size and see your estimate instantly. Use a vendor quotation if you have one.</p></div><button type="button" className="subsidy-button" onClick={reset}>Reset calculator</button></div>
        <form ref={formRef} onSubmit={report} noValidate className="subsidy-grid">
          <div className="subsidy-controls">
            <section className="subsidy-card"><h2><span className="subsidy-step">1</span>System details</h2><div className="subsidy-fields">
              <Field label="New system capacity (DC)" value={input.capacity} onChange={v => update('capacity', v)} min={0.5} max={10} step={0.01} suffix="kWp" />
              <fieldset className="subsidy-category"><legend>Consumer category</legend><div role="group" aria-label="Consumer category">{(['general', 'scst'] as const).map(category => <button key={category} type="button" aria-pressed={input.category === category} onClick={() => update('category', category)}>{category === 'general' ? 'General' : 'SC / ST'}</button>)}</div></fieldset>
              <Field label="Solar already installed" value={input.existingCapacity} onChange={v => update('existingCapacity', v)} min={0} max={5} step={0.01} suffix="kWp" />
              {input.existingCapacity > 0 && <label className="subsidy-check"><input type="checkbox" checked={input.existingCentralAid} onChange={e => update('existingCentralAid', e.target.checked)} />The existing system received central subsidy</label>}
              <label className="subsidy-field">Vendor quotation (₹) <span>(optional)</span><input className="subsidy-input" type="number" aria-label="Vendor quotation" inputMode="decimal" min={1} max={100000000} step="any" value={input.quotation === null ? '' : Number.isFinite(input.quotation) ? input.quotation : ''} placeholder="Leave blank to use the benchmark" aria-invalid={input.quotation !== null && (!Number.isFinite(input.quotation) || input.quotation < 1 || input.quotation > 100000000) || undefined} aria-describedby="subsidy-quotation-note" onChange={e => update('quotation', e.target.value === '' ? null : Number(e.target.value))}/></label>
              <p id="subsidy-quotation-note" className="subsidy-note">A quotation above the benchmark increases the amount you pay. Include all quoted charges you want to account for.</p>
              <Field label="Your electricity rate (for payback)" value={input.tariff} onChange={v => update('tariff', v)} min={0} max={15} step={0.5} suffix="₹/unit" />
            </div></section>
            <section className="subsidy-card"><h2>Eligibility assumptions</h2><div className="subsidy-fields">
              <label className="subsidy-check"><input type="checkbox" checked={input.residential} onChange={e => update('residential', e.target.checked)} />Residential electricity consumer in Gujarat</label>
              <label className="subsidy-check"><input type="checkbox" checked={input.commissionedAfterPolicy} onChange={e => update('commissionedAfterPolicy', e.target.checked)} />Commissioned on/after 22 October 2026, or installation is planned</label>
            </div><p className="subsidy-note">Capacity checks do not establish final eligibility. Your DISCOM confirms the application, prior assistance and payable subsidy.</p></section>
            <details className="subsidy-card subsidy-advanced"><summary>Advanced rates</summary><div className="subsidy-advanced-grid">{subsidyRateFields.map(({ key, label, max, step, suffix }) => {
              const invalid = !Number.isFinite(rates[key]) || rates[key] < 0 || rates[key] > max
              return <label key={key} className="subsidy-field">{label} <span>({suffix})</span><input className="subsidy-input" type="number" aria-label={label} min={0} max={max} step={step} value={Number.isFinite(rates[key]) ? rates[key] : ''} aria-invalid={invalid || undefined} onChange={e => { setRates(old => ({ ...old, [key]: e.target.value === '' ? NaN : Number(e.target.value) })); setNotice('') }}/>{invalid && <span>Enter a value between 0 and {max}.</span>}</label>
            })}</div><button type="button" className="subsidy-button" onClick={() => { setRates({ ...defaultSubsidyRates }); setNotice('') }}>Reset to default rates</button></details>
          </div>
          <div className="subsidy-results">
            {result ? <>
              <section className="subsidy-card"><div className="subsidy-stats" aria-live="polite">
                <Stat label="Central subsidy" value={inr(result.central)} note="PM Surya Ghar"/>
                <Stat label="Gujarat subsidy" value={inr(result.state)} note={result.stateEligible ? 'Estimated top-up' : 'Not included'} />
                <Stat label="You pay" value={inr(result.youPay)} note={`Total subsidy ${inr(result.totalSubsidy)}`} accent />
              </div><SubsidyChart result={result}/><p className="subsidy-note">{input.quotation === null ? 'Uses benchmark cost, not a vendor quotation.' : `Uses your quotation of ${inr(input.quotation)}.`} Subsidy is an estimate, subject to approval.</p></section>
              {result.notices.length > 0 && <div className="subsidy-alert" role="status">{result.notices.map(note => <p key={note}>{note}</p>)}</div>}
              <details className="subsidy-card subsidy-breakdown" open><summary>Full breakdown</summary><div className="subsidy-table-scroll" tabIndex={0} role="region" aria-label="Subsidy estimate breakdown"><table><thead><tr><th scope="col">Item</th><th scope="col">Amount</th></tr></thead><tbody>{breakdown.map(([label, amount]) => <tr key={label}><th scope="row">{label}</th><td>{amount}</td></tr>)}</tbody></table></div></details>
            </> : <div className="subsidy-alert" role="status">Please correct the highlighted values to calculate your subsidy and enable your report download.</div>}
            <section className="subsidy-card"><h2><span className="subsidy-step">2</span>Get your personalized report</h2><p className="subsidy-report-copy">Enter your name, phone number and email to download a PDF with your estimate, rates and eligibility assumptions.</p>
              <LeadFields value={contact} onChange={v => { setContact(v); setNotice('') }} errors={errors} emailRequired className="grid gap-4 sm:grid-cols-2 [&>div:last-child]:sm:col-span-2"/>
              <div className="subsidy-download"><button type="submit" disabled={busy || !result} className="btn btn-primary disabled:opacity-60">{busy ? 'Preparing report…' : 'Download subsidy estimate (PDF)'}</button><p className="subsidy-note">We record your contact details and estimate so our team can follow up about solar. <Link to="/privacy/">Privacy Policy</Link></p></div>
              <p role="status" className="subsidy-status">{notice}</p>
            </section>
          </div>
        </form>
      </div>
    </div>
    <Section className="subsidy-guidance"><div>
      <section><h2>How the Gujarat subsidy is calculated</h2>
        {subsidyGuideCopy.calculation.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>

    </div>
    <section className="subsidy-examples"><h2>Worked examples</h2><p>New residential installations, no existing capacity, default rates and benchmark cost. All amounts below are estimates; quotations and eligibility can change the final payment.</p>
      <div className="subsidy-examples-scroll" role="region" aria-label="Worked subsidy examples" tabIndex={0}><table><caption>Estimated assistance and customer payment at default rates</caption><thead><tr><th scope="col">New capacity</th><th scope="col">Category</th><th scope="col">Benchmark</th><th scope="col">Central subsidy</th><th scope="col">Gujarat top-up</th><th scope="col">You pay</th></tr></thead><tbody>{workedExamples.map(({ capacity, category, result: example }) => <tr key={`${capacity}-${category}`}><th scope="row">{capacity} kWp</th><td>{category === 'scst' ? 'SC / ST' : 'General'}</td><td>{inr(example.benchmark)}</td><td>{inr(example.central)}</td><td>{inr(example.state)}</td><td>{inr(example.youPay)}</td></tr>)}</tbody></table></div>
      <p>The 3 kWp example receives no state top-up because it exceeds the 2.18 kWp combined-capacity limit. For a 2 kWp General system quoted at ₹1,20,000, the estimated ₹90,000 total assistance leaves ₹30,000 to pay.</p>
    </section>
    <div className="subsidy-guide subsidy-guide-row">
      <section><h2>Eligibility for the Gujarat top-up</h2><ul>{subsidyGuideCopy.eligibility.map(condition => <li key={condition}>{condition}</li>)}</ul></section>
      <section><h2>The central subsidy under PM Surya Ghar</h2>{subsidyGuideCopy.central.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>
      <section><h2>How to apply</h2><ol>{subsidyApplicationSteps.map(step => <li key={step}>{step}</li>)}</ol><a className="btn btn-ghost mt-6" href="https://pmsuryaghar.gov.in/" target="_blank" rel="noopener noreferrer">Visit the official National Portal</a><p>This calculator does not submit a subsidy application. <Link to="/contact/">Contact Solaris360</Link> to discuss your roof, electricity bill and quotation.</p></section>
      <section><h2>How to use this calculator</h2><ol>{subsidyUsageSteps.map(step => <li key={step}>{step}</li>)}</ol><p>Changing Advanced rates marks the result as a custom scenario. The examples on this page always use default rates.</p></section>
      <section><h2>What this estimate does not cover</h2><p>{subsidyGuideCopy.exclusions}</p></section>
    </div></Section>
    <Section paper className="subsidy-faq-section"><div className="subsidy-faq-header"><p className="subsidy-eyebrow">Your questions, answered</p><h2>Frequently asked questions</h2><p>Understand eligibility, subsidy amounts and your personalized report.</p></div><div className="subsidy-faq"><Accordion headingLevel={3} items={subsidyFaq}/></div><div className="subsidy-source-note"><p>Gujarat framework announced {subsidyPage.policyDate}. Assumptions reviewed {subsidyPage.reviewedDate}. State estimates follow the reported 22 October framework. Confirm the latest notified rules with your DISCOM before committing to an installation.</p><ul className="mt-3 flex flex-col gap-2">{subsidySources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-navy underline">{source.label}</a></li>)}</ul></div></Section>
    <Section><div className="subsidy-guidance"><h2>Related tools</h2><p>Continue planning your rooftop solar investment with our calculators.</p><div className="subsidy-guide mt-6">
      <Link className="subsidy-tool" to="/roi-calculator/"><h3>Solar ROI Calculator</h3><p>Explore annual generation, savings, lifetime returns, payback and CO₂ reduction.</p><span>Calculate solar ROI →</span></Link>
      <Link className="subsidy-tool" to="/emi-calculator/"><h3>Solar EMI Calculator</h3><p>Estimate monthly payments, total interest and the repayment schedule for your solar loan.</p><span>Calculate loan EMI →</span></Link>
    </div><p>Enter the appropriate net installation cost or loan amount in each tool. Subsidy results are not automatically transferred.</p></div></Section>
  </>
}
function Stat({ label, value, note, accent = false }: { label: string; value: string; note: string; accent?: boolean }) {
  return <div className={`subsidy-stat${accent ? ' subsidy-stat-accent' : ''}`}><h3>{label}</h3><p>{value}</p><span>{note}</span></div>
}

// Keep published examples tied to the calculator model, independently of live custom inputs.
const workedExamples = ([
  [1.74, 'general'], [1.74, 'scst'], [2, 'general'], [2, 'scst'],
  [2.18, 'general'], [2.18, 'scst'], [3, 'general'],
] as const).map(([capacity, category]) => ({
  capacity, category, result: calcSubsidy({ ...defaultSubsidyInput, capacity, category }),
}))
