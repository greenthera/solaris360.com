import { useMemo, useState } from 'react'
import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/hero-substation-dusk.webp'
import { PageHero, Section } from '../components/ui/primitives'
import { Field } from '../components/emi/Field'
import { BalanceChart } from '../components/emi/BalanceChart'
import { simpleEmi, advancedEmi } from '../lib/emi'
import { downloadEmiPdf, downloadSimpleEmiPdf } from '../lib/emiPdf'
import { inr } from '../lib/format'
import { wa, waMsg } from '../content/company'

type Mode = 'simple' | 'advanced'

export default function EmiCalculator() {
  const [mode, setMode] = useState<Mode>('simple')

  return (
    <>
      <Seo
        title="Solar Loan EMI Calculator"
        description="Estimate the monthly EMI on a rooftop solar system - a simple 20% down / flat-rate estimate, or an advanced reducing-balance schedule with processing fee, GST and subsidy prepayment."
        path="/emi-calculator/"
      />
      <PageHero
        image={pageHeroImg}
        eyebrow="Knowledge Center"
        title="Solar loan EMI calculator"
        intro="Work out what a rooftop system costs per month against the electricity bill it replaces. Indicative only - the final EMI depends on your lender's policies, processing fees and charges."
      />

      <Section paper>
        <div className="mb-8 inline-flex border border-navy/15 p-1">
          {(['simple', 'advanced'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`px-5 py-2 font-display text-sm font-600 capitalize transition-colors ${
                mode === m ? 'bg-navy text-paper' : 'text-navy'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {mode === 'simple' ? <SimpleCalc /> : <AdvancedCalc />}
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ */

function SimpleCalc() {
  const [price, setPrice] = useState(400000)
  const [months, setMonths] = useState(60)
  const [pdfBusy, setPdfBusy] = useState(false)

  const r = useMemo(() => simpleEmi({ price, months }), [price, months])

  const downloadPdf = async () => {
    setPdfBusy(true)
    try {
      await downloadSimpleEmiPdf({ price, months }, r)
    } finally {
      setPdfBusy(false)
    }
  }

  const rows: [string, string][] = [
    ['Down payment (20%)', inr(r.downPayment)],
    ['Loan amount (80%)', inr(r.loanAmount)],
    ['Flat interest rate', '9% p.a.'],
    ['Total interest', inr(r.totalInterest)],
    ['Total payment', inr(r.totalPayment)],
  ]

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      <form className="space-y-6 border border-navy/15 bg-white p-6">
        <Field
          label="Solar system price (incl. GST)"
          value={price}
          onChange={setPrice}
          min={150000}
          max={2000000}
          step={10000}
          format={inr}
        />
        <Field label="Tenure" value={months} onChange={setMonths} min={12} max={84} step={6} suffix="months" />
        <p className="border-t border-navy/10 pt-4 text-xs text-ash">
          Matches the model used by common solar-loan calculators: 20% down payment, 80% financed at
          a flat 9% p.a.
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
            waMsg.emi(`System ${inr(price)}, ${months} months → EMI approx ${inr(r.monthlyEmi)}.`),
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
  )
}

/* ------------------------------------------------------------------ */

function AdvancedCalc() {
  const [assetPrice, setAssetPrice] = useState(400000)
  const [loanAmount, setLoanAmount] = useState(320000)
  const [flatRatePct, setFlatRatePct] = useState(9)
  const [months, setMonths] = useState(60)
  const [processingFeePct, setProcessingFeePct] = useState(2)
  const [advanceEmiMonths, setAdvanceEmiMonths] = useState(3)
  const [useSubsidy, setUseSubsidy] = useState(true)
  const [subsidy, setSubsidy] = useState(78000)
  const [subsidyMonth, setSubsidyMonth] = useState(3)

  const res = useMemo(
    () =>
      advancedEmi({
        assetPrice,
        loanAmount: Math.min(loanAmount, assetPrice),
        months,
        flatRatePct,
        processingFeePct,
        advanceEmiMonths,
        subsidy: useSubsidy ? subsidy : 0,
        subsidyMonth: useSubsidy ? subsidyMonth : 0,
      }),
    [assetPrice, loanAmount, months, flatRatePct, processingFeePct, advanceEmiMonths, useSubsidy, subsidy, subsidyMonth],
  )

  const summary: [string, string][] = [
    ['Reducing rate p.a.', `${res.reducingRatePct.toFixed(2)}%`],
    ['EMI', inr(res.emi)],
    ...(res.emiAfterSubsidy ? ([['EMI after subsidy', inr(res.emiAfterSubsidy)]] as [string, string][]) : []),
    ['Total interest', inr(res.totalInterest)],
    ['Total payment', inr(res.totalPayment)],
    ['Processing fee', `${inr(res.processingFee)} + ${inr(res.processingFeeGst)} GST`],
    ['Stamp fee', inr(res.stampFee)],
    ['Margin money (down payment)', inr(res.marginMoney)],
    ['Advance EMI payable', inr(res.advancePayable)],
    ['Outlay at disbursal', inr(res.disbursalOutlay)],
  ]

  const downloadCsv = () => {
    const head = 'Month,Opening,EMI,Interest,Principal,Closing,Note\n'
    const body = res.rows
      .map((r) =>
        [r.month, r.opening, r.emi, r.interest, r.principal, r.closing, r.note ?? '']
          .map((v) => (typeof v === 'number' ? Math.round(v) : `"${v}"`))
          .join(','),
      )
      .join('\n')
    const blob = new Blob([head + body], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'solaris360-emi-schedule.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const [pdfBusy, setPdfBusy] = useState(false)
  const downloadPdf = async () => {
    setPdfBusy(true)
    try {
      await downloadEmiPdf(
        {
          assetPrice,
          loanAmount: Math.min(loanAmount, assetPrice),
          flatRatePct,
          months,
          processingFeePct,
          advanceEmiMonths,
          useSubsidy,
          subsidy,
          subsidyMonth,
        },
        res,
      )
    } finally {
      setPdfBusy(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <form className="grid gap-5 border border-navy/15 bg-white p-6 sm:grid-cols-2">
          <Field label="Asset price ₹" value={assetPrice} onChange={setAssetPrice} min={150000} max={3000000} step={10000} />
          <Field label="Loan amount ₹" value={loanAmount} onChange={setLoanAmount} min={50000} max={assetPrice} step={10000} />
          <Field label="Flat interest % p.a." value={flatRatePct} onChange={setFlatRatePct} min={5} max={18} step={0.25} />
          <Field label="Tenor (months)" value={months} onChange={setMonths} min={12} max={120} step={6} />
          <Field label="Processing fee %" value={processingFeePct} onChange={setProcessingFeePct} min={0} max={5} step={0.25} />
          <Field label="Advance EMI (months)" value={advanceEmiMonths} onChange={setAdvanceEmiMonths} min={0} max={6} step={1} />
          <label className="col-span-full flex items-center gap-2 text-sm text-navy">
            <input type="checkbox" checked={useSubsidy} onChange={(e) => setUseSubsidy(e.target.checked)} className="accent-orange" />
            Apply subsidy prepayment (PM Surya Ghar)
          </label>
          {useSubsidy && (
            <>
              <Field label="Subsidy amount ₹" value={subsidy} onChange={setSubsidy} min={0} max={200000} step={1000} />
              <Field label="Subsidy paid in month" value={subsidyMonth} onChange={setSubsidyMonth} min={1} max={Math.min(months, 12)} step={1} />
            </>
          )}
        </form>

        <div className="border border-navy/15 bg-navy p-6 text-paper">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Monthly EMI</p>
          <p className="mt-1 font-mono text-4xl tabular-nums text-orange">{inr(res.emi)}</p>
          <dl className="mt-6 divide-y divide-white/10 border-t border-white/10">
            {summary.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2 text-sm">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-mono tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border border-navy/15 bg-white p-6">
        <h2 className="font-display text-lg font-700 text-navy">Balance over the term</h2>
        <div className="mt-4">
          <BalanceChart rows={res.rows} />
        </div>
      </div>

      <div className="border border-navy/15 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-700 text-navy">Amortisation schedule</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={downloadCsv} className="btn btn-dark">
              Download CSV
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={pdfBusy}
              className="btn btn-dark disabled:opacity-60"
            >
              {pdfBusy ? 'Preparing PDF…' : 'Download PDF'}
            </button>
          </div>
        </div>
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
              {res.rows.map((r) => (
                <tr key={r.month} className="border-b border-navy/5 [&_td]:px-2 [&_td]:py-1.5">
                  <td className="text-left">{r.month}</td>
                  <td>{inr(r.opening)}</td>
                  <td>{inr(r.emi)}</td>
                  <td>{inr(r.interest)}</td>
                  <td>{inr(r.principal)}</td>
                  <td>{inr(r.closing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ash">
          Flat rate is converted to an equivalent reducing-balance rate for the schedule. Figures are
          subject to change based on the date of loan disbursement.
        </p>
      </div>

      <a
        href={wa(waMsg.emi(`Asset ${inr(assetPrice)}, loan ${inr(loanAmount)}, ${months} months → EMI approx ${inr(res.emi)}.`))}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
      >
        Discuss financing on WhatsApp
      </a>
    </div>
  )
}
