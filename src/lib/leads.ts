/**
 * Website lead capture - one shared Google Form ("Solaris360 website leads")
 * for every lead form on the site. Each submission becomes a row in the form's
 * linked Google Sheet; `source` says which form it came from.
 */

const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeI0P62c8l8dHRg78XMGYrjZ1y8kRXlI2eoNlpHBfQBUrF_Xw/formResponse'

/** Google Form question -> entry id (from the form's pre-filled link). */
const ENTRY = {
  name: 'entry.764812781',
  phone: 'entry.1409510977',
  email: 'entry.1840546608',
  source: 'entry.764862047',
  details: 'entry.958728776',
} as const

export interface LeadContact {
  name: string
  phone: string
  email: string
}

export interface Lead extends LeadContact {
  /** which form the lead came from, e.g. "EMI calculator" */
  source: string
  /** free-text summary of what they asked for */
  details: string
}

export type LeadErrors = Partial<Record<keyof LeadContact, string>>

/** Indian mobile: 10 digits starting 6-9, optionally prefixed +91 / 91 / 0. */
export function normalisePhone(phone: string): string | null {
  const digits = phone.replace(/[\s()-]/g, '').replace(/^(\+?91|0)(?=\d{10}$)/, '')
  return /^[6-9]\d{9}$/.test(digits) ? digits : null
}

/** Name and phone are required; email is optional but must look valid if given. */
export function validateLead({ name, phone, email }: LeadContact): LeadErrors {
  const errors: LeadErrors = {}
  if (name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!normalisePhone(phone)) errors.phone = 'Please enter a valid 10-digit mobile number.'
  if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = 'Please enter a valid email address, or leave it empty.'
  return errors
}

/**
 * Send a lead to the Google Form. Google doesn't allow cross-origin reads, so
 * this is a fire-and-forget `no-cors` POST: it resolves once the request has
 * gone out (or failed at the network level), never with Google's reply.
 * Also pushes a PII-free `generate_lead` event to the dataLayer for GTM / GA4.
 */
export async function submitLead(lead: Lead): Promise<void> {
  const body = new URLSearchParams({
    [ENTRY.name]: lead.name.trim(),
    [ENTRY.phone]: normalisePhone(lead.phone) ?? lead.phone.trim(),
    [ENTRY.email]: lead.email.trim(),
    [ENTRY.source]: lead.source,
    [ENTRY.details]: lead.details,
  })

  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: 'generate_lead', lead_source: lead.source })

  try {
    await fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body })
  } catch {
    // offline / blocked - the visitor still gets what they asked for
  }
}
