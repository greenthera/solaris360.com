/**
 * Cookie consent banner (vanilla-cookieconsent v3) wired to Google Consent Mode.
 * index.html sets every consent type to "denied" before GTM loads; this pushes the
 * visitor's choice to the dataLayer. Client-only - started from main.tsx.
 */
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

const PRIVACY_URL = `${import.meta.env.BASE_URL}privacy/`

// gtag must push the `arguments` object itself, not an array
const gtag: (...args: unknown[]) => void = function () {
  const w = window as unknown as { dataLayer: unknown[] }
  w.dataLayer = w.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments)
}

function updateGoogleConsent() {
  const analytics = CookieConsent.acceptedCategory('analytics')
  const marketing = CookieConsent.acceptedCategory('marketing')

  gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
  })
}

/** Open the preferences modal (footer "Cookie settings"). */
export const showCookiePreferences = () => CookieConsent.showPreferences()

export function initCookieConsent() {
  // dark site - use the library's dark theme, recoloured in globals.css
  document.documentElement.classList.add('cc--darkmode')

  CookieConsent.run({
    // Re-ask users if categories or policy change (bump this number)
    revision: 1,

    cookie: {
      name: 'cc_cookie',
      expiresAfterDays: 182, // ~6 months
    },

    guiOptions: {
      consentModal: {
        layout: 'box inline',
        position: 'bottom right',
        equalWeightButtons: true,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
      },
    },

    categories: {
      necessary: { enabled: true, readOnly: true },

      analytics: {
        // delete these cookies automatically if consent is withdrawn
        autoClear: {
          cookies: [
            { name: /^_ga/ }, // GA4 (_ga, _ga_XXXX)
            { name: '_gid' },
            { name: /^_clck/ }, // Clarity
            { name: /^_clsk/ }, // Clarity
            { name: 'CLID' }, // Clarity
          ],
        },
      },

      marketing: {},
    },

    // first visit, every return visit, and when preferences change
    onFirstConsent: updateGoogleConsent,
    onConsent: updateGoogleConsent,
    onChange: updateGoogleConsent,

    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'We use cookies',
            description: `We use cookies to understand how visitors use our site and to improve it. You can accept all, reject non-essential cookies, or choose your own settings. Read our <a href="${PRIVACY_URL}" class="cc__link">Privacy Policy</a>.`,
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Manage preferences',
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'How we use cookies',
                description:
                  'Choose which cookies you allow. You can change this at any time from the Cookie settings link in the footer.',
              },
              {
                title: 'Strictly necessary',
                description: 'Required for the site to function. These cannot be turned off.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytics',
                description:
                  'Help us understand site usage through Google Analytics and Microsoft Clarity (page views, session recordings, heatmaps).',
                linkedCategory: 'analytics',
              },
              {
                title: 'Marketing',
                description: 'Used for advertising and remarketing.',
                linkedCategory: 'marketing',
              },
            ],
          },
        },
      },
    },
  })
}
