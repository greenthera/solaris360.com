import 'vanilla-cookieconsent/dist/cookieconsent.css'

// Keep consent styling immediate, while the UI module loads independently of
// React hydration. Consent defaults are already queued in index.html.
let consent: Promise<typeof import('./cookieConsentRuntime')> | undefined
function loadConsent() {
  return consent ??= import('./cookieConsentRuntime').then(async (runtime) => {
    await runtime.initCookieConsent()
    return runtime
  })
}

export const initCookieConsent = () => { void loadConsent() }
export const showCookiePreferences = () => {
  void loadConsent().then((runtime) => runtime.showCookiePreferences())
}
