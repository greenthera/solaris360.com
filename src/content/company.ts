/**
 * Single source of truth for company facts.
 * Every value here is taken verbatim from the current solaris360.com.
 * Where the live site is inconsistent, the discrepancy is noted - nothing invented.
 */

export const company = {
  name: 'Solaris360',
  legalName: 'SOLARIS 360',
  tagline: 'Go Green, Go Solar.',
  descriptor: 'Rooftop Solar Power EPC - Surat, Gujarat',

  /** Shown in header, footer, schema. From the current site footer. */
  displayAddress: 'GF/21, Palladium, VIP Road, Vesu, Surat – 395007',
  /** Shown on the Contact page only. From /contact-us2/. */
  officeAddress: 'FF/215, Palladium, Nr. Shyam Mandir, VIP Road, Vesu, Surat – 395007',
  /** Registered address - appears only in Terms & Conditions. */
  registeredAddress:
    '38, Shree Darshan Society, B/H St. Xavier’s School, Ghod Dod Road, Surat',

  /** Google Maps short link - used for "Get directions" and schema hasMap. */
  mapUrl: 'https://maps.app.goo.gl/ESDXaapWhdjgXwaj6',

  city: 'Surat',
  state: 'Gujarat',
  country: 'India',
  postalCode: '395007',
  geo: { lat: 21.1418, lng: 72.7717 }, // Vesu, Surat (approximate)

  phone: {
    main: '+91 (999) 811-7531',
    mainDigits: '919998117531',
    shadowStructure: '+91 99042 77712',
    shadowStructureDigits: '919904277712',
    // Return & Cancellation policy lists this - kept for that page only.
    supportLine: '917-334-8005',
  },

  email: {
    general: 'info@solaris360.com',
    service: 'service@solaris360.com', // cancellation (Return policy)
    support: 'support@solaris360.com', // returns (Return policy)
    shadowStructure: 'shadow_structure@solaris360.com',
  },

  hours: {
    display: 'Mon–Fri: 08:00 AM – 05:00 PM · Sat–Sun: Closed',
    schema: ['Mo-Fr 08:00-17:00'],
  },

  social: {
    youtube: 'https://www.youtube.com/channel/UCInkRQ7l75_8u5xVVPeFnAw',
  },

  /** Google Business reviews (snapshot from the 2026-09-09 export). */
  reviews: {
    count: 104,
    average: 4.9,
    googleUrl:
      'https://search.google.com/local/reviews?placeid=ChIJQf2x6L9P4DsR3OGAIG3Vakg&q=*&hl=en',
  },

  developer: { name: 'Shivantra', url: 'https://shivantra.com' },

  ga4: 'G-QPCP96RNWK',
  domain: 'https://www.solaris360.com',
} as const

/** Build a wa.me deep link with a pre-filled message. */
export function wa(text: string, digits: string = company.phone.mainDigits): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

/** Common pre-filled messages. */
export const waMsg = {
  quote: 'Hi Solaris360, I would like a quote to go solar.',
  bill: 'Hi Solaris360, here is my electricity bill - please send a sized proposal.',
  callback: 'Hi Solaris360, please call me back about going solar.',
  shadow: 'I am interested', // matches the current Stability Certificate page link
  emi: (summary: string) => `Hi Solaris360, I would like to discuss solar financing.\n${summary}`,
}
