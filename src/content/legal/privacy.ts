import type { LegalDoc } from './types'

/**
 * From /privacy-policy-2/ (spelling only lightly corrected). The cookie sections
 * are rewritten to match the consent banner (src/lib/cookieConsent.ts) - keep the
 * two in sync, and bump the banner's `revision` when categories change.
 */
export const privacy: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'Last updated: October 21, 2026',
  intro: [
    'At SOLARIS 360, accessible from www.solaris360.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains the types of information that is collected and recorded by SOLARIS 360 and how we use it.',
    'This Privacy Policy applies only to our online activities and is valid for visitors to our website with regard to the information that they share and/or that we collect on SOLARIS 360. This policy is not applicable to any information collected offline or via channels other than this website.',
    'By using our website, you agree to this Privacy Policy. Non-essential cookies (analytics and marketing) are only used if you allow them through our cookie banner - see “Cookies” below.',
  ],
  sections: [
    {
      heading: 'Information we collect',
      body: [
        'The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.',
        'If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.',
        'When you register for an account, we may ask for your contact information, including name, company name, address, email address, and telephone number.',
      ],
    },
    {
      heading: 'How we use your information',
      body: [
        'We use the information we collect in various ways, including to:',
        '- Provide, operate, and maintain our website',
        '- Improve, personalize, and expand our website',
        '- Understand and analyze how you use our website',
        '- Develop new products, services, features, and functionality',
        '- Communicate with you, either directly or through one of our partners, including for customer service, updates and other information relating to the website, and for marketing and promotional purposes',
        '- Send you emails',
        '- Find and prevent fraud',
      ],
    },
    {
      heading: 'Log Files',
      body: [
        'SOLARIS 360 follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any personally identifiable information. The purpose is for analyzing trends, administering the site, tracking users’ movement on the website, and gathering demographic information.',
      ],
    },
    {
      heading: 'Cookies',
      body: [
        'Cookies are small text files stored in your browser. SOLARIS 360 uses them to remember your cookie choice and, only if you allow it, to understand how visitors use the website and to support advertising.',
        'When you first visit, a cookie banner lets you accept all cookies, reject all non-essential cookies, or choose by category. Until you make a choice, only strictly necessary cookies are used, and our analytics and marketing tags run in a “denied” state through Google Consent Mode, which means they do not set cookies.',
        'Our tags are managed through Google Tag Manager, which loads them according to the choice you make.',
      ],
    },
    {
      heading: 'Cookies we use',
      body: [
        'Strictly necessary (always on):',
        '- cc_cookie - remembers your cookie preferences. Expires after 6 months.',
        'Analytics (only with your consent):',
        '- Google Analytics 4: _ga and _ga_<ID> - distinguish visitors and sessions so we can count page views and see which pages are used. Expire after up to 2 years.',
        '- Microsoft Clarity: _clck (1 year), _clsk (1 day) and CLID (1 year) - page usage, heatmaps and session recordings that help us improve the website.',
        'Marketing (only with your consent):',
        '- Advertising and remarketing cookies set by Google, described under “Google DoubleClick DART Cookie” and “Advertising Partners” below.',
        'Google Analytics and Microsoft Clarity process this data on our behalf. You can read how they handle it in the Google Privacy Policy (https://policies.google.com/privacy) and the Microsoft Privacy Statement (https://privacy.microsoft.com/privacystatement).',
      ],
    },
    {
      heading: 'Changing or withdrawing your consent',
      body: [
        'You can change your choice at any time using the “Cookie settings” link at the bottom of every page. If you withdraw consent for analytics, the analytics cookies listed above are deleted from your browser. If we add new types of cookies, we will ask for your consent again.',
        'You can also block or delete cookies through your browser settings. Blocking strictly necessary cookies means the website cannot remember your cookie choice.',
      ],
    },
    {
      heading: 'Google DoubleClick DART Cookie',
      body: [
        'These cookies are only used if you accept Marketing cookies. Google is one of the third-party vendors on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based on their visits to this and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at https://policies.google.com/technologies/ads.',
      ],
    },
    {
      heading: 'Advertising Partners',
      body: [
        'Some advertisers on our site may use cookies and web beacons, only if you accept Marketing cookies. Our advertising partner is Google. Each of our advertising partners has its own Privacy Policy for its policies on user data.',
        'Third-party ad servers or ad networks use technologies like cookies, JavaScript, or web beacons in their advertisements and links that appear on SOLARIS 360, which are sent directly to your browser. They automatically receive your IP address when this occurs. Note that SOLARIS 360 has no access to or control over these cookies.',
      ],
    },
    {
      heading: 'Third-Party Privacy Policies',
      body: [
        'SOLARIS 360’s Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information, including their practices and instructions about how to opt out of certain options. You can also disable cookies through your individual browser options.',
      ],
    },
    {
      heading: 'Children’s Information',
      body: [
        'Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.',
        'SOLARIS 360 does not knowingly collect any personally identifiable information from children under the age of 13. If you think that your child provided this kind of information on our website, please contact us immediately and we will do our best to promptly remove such information from our records.',
      ],
    },
    {
      heading: 'Changes to this Privacy Policy',
      body: [
        'We reserve the right, at our sole discretion, to modify or replace this privacy policy at any time. If a revision is material, we will make reasonable efforts to provide at least 30 days’ notice prior to any new terms taking effect. You are advised to refer to this page for the most current version.',
      ],
    },
    {
      heading: 'Contact Us',
      body: ['If you have any questions about this Privacy Policy, you can contact us by email: info@solaris360.com'],
    },
  ],
}
