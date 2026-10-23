import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/layout/Seo'
import { PageHero } from '../components/ui/primitives'
import pageHeroImg from '../assets/solaris-india-residential.webp'
import { LeadFields } from '../components/ui/LeadFields'
import { RoiField } from '../components/roi/RoiField'
import { RoiChart } from '../components/roi/RoiChart'
import { calcRoi, decodeRoiShare, encodeRoiShare, roiLimits, validRoiInput, type RoiInput } from '../lib/roi'
import { defaultRoiInput, defaultRoiSettings } from '../lib/roiDefaults'
import { submitLead, validateLead, type LeadContact, type LeadErrors } from '../lib/leads'
import t from '../content/roi/copy.json'
import '../styles/roi.css'

export default function RoiCalculator() {
  const [settings, setSettings] = useState({ ...defaultRoiSettings })
  const [inputs, setInputs] = useState<RoiInput>(() => defaultRoiInput(defaultRoiSettings))
  const [contact, setContact] = useState<LeadContact>({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState<LeadErrors>({})
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const result = validRoiInput(inputs) ? calcRoi(inputs) : null
  const fmt = (n: number, digits = 0) => n.toLocaleString(t.locale, { maximumFractionDigits: digits, minimumFractionDigits: digits })
  const money = (n: number) => `${settings.currencySymbol}${fmt(n)}`

  // Restore shared calculation parameters after hydration; no settings or language storage.
  useEffect(() => {
    const applyShare = () => {
      const shared = decodeRoiShare(window.location.hash)
      if (shared) {
        setSettings({ ...defaultRoiSettings, currency: shared.currency, currencySymbol: shared.symbol })
        setInputs(shared.input)
      } else if (window.location.hash.startsWith('#share=')) {
        setNotice('This shared calculator link is invalid. Default inputs have been loaded.')
      }
    }
    const frame = requestAnimationFrame(applyShare)
    window.addEventListener('hashchange', applyShare)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', applyShare) }
  }, [])

  const update = (key: keyof RoiInput, value: number) => {
    setInputs(old => ({ ...old, [key]: value, ...(key === 'systemSize' ? { systemCost: value * settings.defaultCostPerKW } : {}) }))
    setNotice(''); setShareUrl('')
  }
  const numeric = (key: keyof RoiInput, label: string, suffix: string, hint: string, step: number, prefix?: string) => <RoiField
    key={key} label={label} value={inputs[key]} onChange={n => update(key, n)} min={roiLimits[key][0]} max={roiLimits[key][1]}
    suffix={suffix} hint={hint} step={step} prefix={prefix} integer={key === 'systemLifetime'} />

  const generateReport = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateLead(contact); setErrors(errs); setNotice('')
    if (Object.keys(errs).length || !result) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus())
      return
    }
    // Snapshot the visible estimate so edits during an async download cannot alter its lead record.
    const snapshot = { inputs, result, contact: { ...contact }, currency: settings.currency }
    setBusy(true)
    try {
      const { downloadRoiPdf } = await import('../lib/roiPdf')
      await submitLead({ ...snapshot.contact, source: 'ROI calculator', details: `System ${inputs.systemSize} kWp | Cost ${money(inputs.systemCost)} | Annual generation ${fmt(result.annualGeneration)} kWh | Annual savings ${money(result.annualSavings)} | Payback ${Number.isFinite(result.paybackPeriod) ? result.paybackPeriod.toFixed(1) + ' years' : 'Not reached'} | Lifetime ${inputs.systemLifetime} years | Net profit ${money(result.netProfit)} | ROI ${fmt(result.roi)}% | Assumptions ${JSON.stringify(inputs)}` })
      await downloadRoiPdf(snapshot.inputs, snapshot.result, snapshot.contact, snapshot.currency)
      setNotice('Report downloaded. Our team will contact you about solar.')
    } catch { setNotice('The report could not be downloaded. Please try again.') }
    finally { setBusy(false) }
  }
  const share = async () => {
    if (!result) return
    const url = `${window.location.origin}${window.location.pathname}#share=${encodeRoiShare(inputs, settings.currency, settings.currencySymbol)}`
    try { await navigator.clipboard.writeText(url); setNotice(t.calc.linkCopied) }
    catch { setShareUrl(url); setNotice('Copy the link below to share this estimate.') }
  }
  return <>
    <Seo title="Solar ROI Calculator" description="Calculate solar generation, annual savings, payback, lifetime returns and CO2 reduction. Download your personalized Solaris360 ROI report." path="/roi-calculator/" />
    <PageHero
      image={pageHeroImg}
      eyebrow="Knowledge Center"
      title={t.calc.title}
      intro="See how a rooftop solar system can reduce your electricity bills. Estimate annual savings, payback and lifetime returns. Indicative only - actual generation and savings depend on your site, electricity tariffs and system performance."
    />
    <div className="roi-workspace">
      <div className="roi-main">
        <div className="roi-page-heading"><p>{t.calc.subtitle}</p></div>
        <form ref={formRef} onSubmit={generateReport} noValidate className="roi-calculator-grid">
          <div className="roi-controls">
            <section className="roi-card"><h2><b className="roi-step">1</b>{t.calc.customerInfo}</h2><LeadFields value={contact} onChange={v => { setContact(v); setNotice('') }} errors={errors} /></section>
            <section className="roi-card"><h2><b className="roi-step">2</b>{t.calc.systemParams}</h2><div className="roi-field-stack">
              {numeric('systemSize', t.calc.systemSize, 'kWp', t.calc.tooltipSystemSize, 0.5)}
              {numeric('systemCost', t.calc.systemCost, '', t.calc.tooltipSystemCost, 100, settings.currencySymbol)}
              <RoiField label={t.calc.costPerKw} value={Math.round(inputs.systemCost / inputs.systemSize)} onChange={n => update('systemCost', n * inputs.systemSize)} min={0} max={1e12 / (inputs.systemSize || 1)} prefix={settings.currencySymbol} suffix="/kW" step={50} hint={t.calc.tooltipCostPerKw} />
              {numeric('electricityPrice', t.calc.electricityPrice, '/kWh', t.calc.tooltipElectricityPrice, 0.01, settings.currencySymbol)}
              {numeric('exportTariff', t.calc.exportTariff, '/kWh', t.calc.tooltipExportTariff, 0.01, settings.currencySymbol)}
              {numeric('selfConsumption', t.calc.selfConsumption, '%', t.calc.tooltipSelfConsumption, 5)}
            </div></section>
            <details className="roi-card roi-advanced"><summary><b className="roi-step roi-step-blue">3</b>{t.calc.advancedSettings}</summary><div className="roi-field-stack">
              {numeric('specificYield', t.calc.specificYield, 'kWh/kWp/yr', t.calc.tooltipSpecificYield, 50)}
              {numeric('degradationRate', t.calc.panelDegradation, '% / yr', t.calc.tooltipDegradation, 0.1)}
              {numeric('electricityInflation', t.calc.electricityInflation, '% / yr', t.calc.tooltipInflation, 0.5)}
              {numeric('systemLifetime', t.calc.systemLifetime, t.common.years, t.calc.tooltipLifetime, 1)}
            </div></details>
            <div className="roi-actions"><button type="button" className="roi-button" onClick={() => { setSettings({ ...defaultRoiSettings }); setInputs(defaultRoiInput(defaultRoiSettings)); setNotice(''); setShareUrl(''); window.history.replaceState(null, '', window.location.pathname + window.location.search) }}>{t.calc.resetInputs}</button><button type="button" className="roi-button" disabled={!result || busy} onClick={share}>{t.calc.shareLink}</button><button type="submit" className="roi-button roi-primary" disabled={!result || busy}>{busy ? t.calc.generatingPdf : t.calc.exportPDF}</button></div>
            <p className="roi-note">Get a PDF with your results, graph and yearly schedule. We use your details only to contact you about solar. <Link to="/privacy/">Privacy Policy</Link></p>
            {shareUrl && <label className="roi-field">Share link<input readOnly value={shareUrl} onFocus={e => e.target.select()} /></label>}
            <p role="status" className="roi-notice">{notice}</p>
          </div>
          <div className="roi-results">
            {result ? <>
              <div className="roi-metrics" aria-live="polite">
                <Metric label={t.calc.annualGeneration} value={`${fmt(result.annualGeneration)} kWh`} sub={t.calc.year1Output} kind="sun" color="amber" />
                <Metric label={t.calc.annualSavings} value={money(result.annualSavings)} sub={t.calc.year1Savings} kind="bolt" color="blue" />
                <Metric label={t.calc.paybackPeriod} value={Number.isFinite(result.paybackPeriod) ? `${fmt(result.paybackPeriod, 1)} ${t.calc.yr}` : '—'} sub={t.calc.simplePayback} kind="clock" color="purple" />
                <Metric label={t.calc.totalSavings} value={money(result.totalSavings)} sub={t.calc.overYears.replace('{years}', String(inputs.systemLifetime))} kind="trend" color="amber" />
                <Metric label={t.calc.netProfit} value={money(result.netProfit)} sub={t.calc.afterSystemCost} kind="money" color={result.netProfit >= 0 ? 'green' : 'red'} />
                <Metric label={t.calc.roiPercent} value={inputs.systemCost > 0 ? `${fmt(result.roi)}%` : '—'} sub={t.calc.returnOnInvestment} kind="trend" color={result.roi >= 0 ? 'green' : 'red'} />
              </div>
              <div className="roi-co2"><MetricIcon kind="leaf" /><div><strong>{t.calc.co2Reduction}: {fmt(result.co2Reduction, 1)} {t.common.tonnes}</strong><p>{t.calc.co2Trees.replace('{years}', String(inputs.systemLifetime)).replace('{trees}', fmt(Math.round(result.co2Reduction * 45)))}</p></div></div>
              <section className="roi-card"><h2>{t.calc.cumulativeSavings}</h2><RoiChart result={result} cost={inputs.systemCost} money={money} yearLabel={t.calc.yr} breakEvenLabel={t.calc.breakEvenYear} /><p className="roi-note">{t.calc.netCol.replace('{symbol}', settings.currencySymbol)} · {t.calc.breakEven}: {money(0)}{!result.breakEvenYear ? ' · Not reached within the system lifetime.' : ''}</p></section>
              <section className="roi-card roi-table-card"><h2>{t.calc.yearlyBreakdown}</h2><div className="roi-table-scroll" tabIndex={0} role="region" aria-label={t.calc.yearlyBreakdown}><table><thead><tr><th>{t.calc.yearCol}</th><th>{t.calc.generationCol}</th><th>{t.calc.savingsCol.replace('{symbol}', settings.currencySymbol)}</th><th>{t.calc.netCol.replace('{symbol}', settings.currencySymbol)}</th></tr></thead><tbody>{result.rows.map(row => <tr key={row.year}><th scope="row">{row.year}</th><td>{fmt(row.generation)}</td><td>{fmt(row.savings)}</td><td className={row.netPosition >= 0 ? 'roi-positive' : 'roi-negative'}>{row.netPosition >= 0 ? '+' : ''}{fmt(row.netPosition)}</td></tr>)}</tbody></table></div></section>
            </> : <div className="roi-card" role="status">Please correct the highlighted inputs to calculate your solar return.</div>}
          </div>
        </form>
      </div>
    </div>
  </>
}

function Metric({ label, value, sub, kind, color }: { label: string; value: string; sub: string; kind: string; color: string }) {
  return <div className="roi-card roi-metric"><span className={`roi-metric-icon roi-${color}`}><MetricIcon kind={kind} /></span><h2>{label}</h2><p className="roi-metric-value">{value}</p><p className="roi-metric-sub">{sub}</p></div>
}
function MetricIcon({ kind }: { kind: string }) {
  const paths: Record<string, React.ReactNode> = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 10-12h-7z" />, clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l4 2" /></>,
    trend: <path d="m3 17 6-6 4 4 8-10m-6 0h6v6" />, money: <><path d="M12 2v20m5-16H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8H6" /></>,
    leaf: <><path d="M20 3c1 7-1 15-9 15-8 0-9-12 0-12 4 0 7-1 9-3ZM4 21c1-6 6-8 11-11" /></>,
  }
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind] ?? paths.sun}</svg>
}
