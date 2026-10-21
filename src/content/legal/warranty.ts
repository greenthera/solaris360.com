import type { LegalDoc } from './types'

/**
 * NEW page. Every figure below already appears on the current solaris360.com
 * (EPC Services, System Features, About). Nothing is
 * promised here that isn't already published - see the spec §7.4.
 */
export const warranty: LegalDoc = {
  title: 'Warranty',
  intro: [
    'Solaris360 delivers rooftop solar as an EPC contractor: we design, supply, install and commission the system, then support it. The cover below combines the manufacturers’ product warranties on the equipment we supply with our own workmanship and service warranty on the installation.',
    'This page summarises the terms already stated across our EPC Services and System Features pages. Exact terms are confirmed in your project proposal and the manufacturer documentation handed over at commissioning.',
  ],
  sections: [
    {
      heading: 'Solar modules (panels)',
      body: [
        '- Performance warranty: 25 years (linear output warranty from the module manufacturer).',
        '- Product warranty: 10 years against manufacturing defects.',
        '- Certification: IEC 61215, IEC 61730, IEC 62804, IEC 61701.',
      ],
    },
    {
      heading: 'Inverter',
      body: [
        'Our System Features page lists a 10-year inverter warranty; our EPC Services page describes a 5-year standard manufacturer’s warranty with extended options. The applicable term depends on the inverter model and any extended-warranty purchased, and is confirmed in your proposal.',
        '- In-built Wi-Fi monitoring and in-built DC SPD (surge) protection.',
        '- Remote monitoring free for up to 25 years (model dependent).',
        '- Certification: IEC 60068, IEC 61683, IEC 60529; IEC certification as per MNRE.',
      ],
    },
    {
      heading: 'Plant service warranty (workmanship)',
      body: [
        '- 5 years service warranty on the installation, covering structural and electrical workmanship.',
        '- Toll-free inverter support, 24 × 7.',
        '- Web monitoring included.',
        'The mounting structure is galvanized / hot-dipped MS section, sized for a longer service life.',
      ],
    },
    {
      heading: 'What the workmanship warranty does not cover',
      body: [
        '- Damage from misuse, unauthorised modification or third-party work on the system.',
        '- Consumable cleaning items (mops, brushes, sprinklers, nano-coating) - these carry their own manufacturer terms.',
        '- Events outside our control such as storm, lightning, flood, fire, earthquake, landslide, or damage by animals or anti-social elements. These are the risks covered by a Solar Plant Insurance policy - ask us about arranging cover for your plant.',
        '- Loss of generation caused by grid outages, DISCOM constraints or shading that develops after installation (new construction, tree growth).',
      ],
    },
    {
      heading: 'How to make a claim',
      body: [
        'Message us on WhatsApp at +91 (999) 811-7531 or email info@solaris360.com with your project name, the equipment concerned, and photos of the issue. For inverter faults you can also use the manufacturer’s 24 × 7 toll-free line printed on the unit.',
        'For any equipment we supply and deliver as part of a project, the Return & Cancellation policy applies alongside this warranty.',
      ],
    },
  ],
}
