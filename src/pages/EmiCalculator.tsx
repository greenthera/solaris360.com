import { useMemo, useState } from 'react'
import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-india-consultation.webp'
import { PageHero, Section } from '../components/ui/primitives'
import { Field } from '../components/emi/Field'
import { BalanceChart } from '../components/emi/BalanceChart'
import { calcEmi } from '../lib/emi'
import { inr } from '../lib/format'
import { wa, waMsg } from '../content/company'

export default function EmiCalculator() {
  const [price, setPrice] = useState(400000)
  const [months, setMonths] = useState(60)
  const [ratePct, setRatePct] = useState(9)
  const [pdfBusy, setPdfBusy] = useState(false)

  const r = useMemo(() => calcEmi({ price, months, ratePct }), [price, months, ratePct])

  const downloadPdf = async () => {
    setPdfBusy(true)
    try {
      const { downloadEmiPdf } = await import('../lib/emiPdf')
      await downloadEmiPdf({ price, months, ratePct }, r)
    } finally {
      setPdfBusy(false)
    }
  }

  const rows: [string, string][] = [
    ['Total interest', inr(r.totalInterest)],
    ['Total payment', inr(r.totalPayment)],
  ]

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
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <form className="space-y-6 border border-navy/15 bg-white p-6">
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
            <p className="border-t border-navy/10 pt-4 text-xs text-ash">
              Standard reducing-balance EMI on the full system price.
            </p>
          </form>

          <div className="border border-navy/15 bg-navy p-6 text-paper">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Monthly EMI</p>
            <p className="mt-1 font-mono text-4xl tabular-nums text-orange">{inr(r.monthlyEmi)}</p>
            <dl className="mt-6 divide-y divide-white/10 border-t border-white/10">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-mono tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <a
              href={wa(
                waMsg.emi(
                  `System ${inr(price)}, ${months} months at ${ratePct}% p.a. → EMI approx ${inr(r.monthlyEmi)}.`,
                ),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-6 w-full"
            >
              Discuss financing on WhatsApp
            </a>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={pdfBusy}
              className="btn btn-ghost mt-3 w-full disabled:opacity-60"
            >
              {pdfBusy ? 'Preparing PDF…' : 'Download PDF'}
            </button>
          </div>
        </div>

        <div className="mt-10 border border-navy/15 bg-white p-6">
          <h2 className="font-display text-lg font-700 text-navy">Balance over the term</h2>
          <div className="mt-4">
            <BalanceChart rows={r.rows} />
          </div>
        </div>

        <div className="mt-10 border border-navy/15 bg-white p-6">
          <h2 className="font-display text-lg font-700 text-navy">Amortisation schedule</h2>
          <div className="mt-4 -mx-6 max-h-[28rem] overflow-auto px-6 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] text-right font-mono text-xs tabular-nums text-navy">
              <thead className="sticky top-0 bg-white text-ash">
                <tr className="border-b border-navy/15 [&_th]:px-2 [&_th]:py-2">
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
        </div>
      </Section>
    </>
  )
}
