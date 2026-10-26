export const subsidyPage = {
  path: '/gujarat-solar-subsidy-calculator/',
  title: 'Gujarat Solar Subsidy Calculator 2026',
  description: 'Estimate PM Surya Ghar central subsidy, Gujarat state top-up and your rooftop solar cost. Compare General and SC/ST contributions and download a personalized report.',
  policyDate: '22 October 2026',
  reviewedDate: '26 October 2026',
}
export const subsidyFaq = [
  {
    "q": "What happens if my system is larger than 2.18 kWp?",
    "a": "The Gujarat top-up does not apply and only the central PM Surya Ghar subsidy is paid — up to ₹78,000 for 3 kW or more. The calculator shows this automatically."
  },
  {
    "q": "Can I get the Gujarat top-up if I already have solar?",
    "a": "Yes, as long as your existing capacity plus the new system stays within 2.18 kWp. Enter the existing capacity in the calculator and it checks the limit for you."
  },
  {
    "q": "What is different for General and SC/ST households?",
    "a": "Both categories get the same benchmark and central subsidy, but SC/ST households contribute 5% of the benchmark instead of 10%. The state covers the difference, so its share is higher."
  },
  {
    "q": "Can I change the rates?",
    "a": "Yes. Open 'Advanced rates' to change the benchmark, central subsidy, contribution percentages and capacity limit, then use 'Reset to default rates' to go back."
  },
  {
    "q": "Is this calculator free, and what happens to my details?",
    "a": "Yes, the calculator is free to use without registration. Calculations run in your browser. To download the PDF, enter your name, valid Indian mobile number and email address. We record your contact details and estimate so Solaris360 can follow up about your solar enquiry."
  },
  {
    "q": "Is a state top-up paid in addition to the central subsidy?",
    "a": "Where a state runs a top-up, it is paid in addition to the central PM Surya Ghar subsidy, usually through the same application. Each state has its own conditions on system size, category and timing, which are listed on its page."
  },
  {
    "q": "Is the subsidy based on my actual quotation?",
    "a": "The central subsidy is a fixed amount per kW, not a share of your bill. Some state schemes work from a benchmark cost instead of the actual quotation. Either way, anything you pay above the benchmark or the subsidy-eligible cost is yours to bear."
  },
  {
    "q": "How up to date are these figures?",
    "a": "They follow the central scheme and each state's announced top-up as reported when this page was last updated. State amounts change with budgets and government orders, so treat the result as an estimate and confirm the final figure with the National Portal and your DISCOM before you sign with a vendor."
  }
]
export const subsidySources = [
  { label: 'MNRE residential CFA guidelines (official copy hosted by MGVCL)', url: 'https://www.mgvcl.com/Upload/solarpower/2024/MNRE%20OPERATIONAL%20GUIDELINE%20CFA%2007-06-24.pdf' },
  { label: 'National Portal for PM Surya Ghar', url: 'https://pmsuryaghar.gov.in/' },
  { label: '22 October 2026 Gujarat announcement coverage', url: 'https://www.energetica-india.net/news/gujarat-announces-additional-state-subsidy-for-rts-up-to-2-18-kwp-under-pm-surya-ghar' },
]

export const subsidyApplicationSteps = [
  "Register on the National Portal for Rooftop Solar (pmsuryaghar.gov.in) with your state, DISCOM and electricity consumer number.",
  "Apply for rooftop solar, then wait for feasibility approval from your DISCOM.",
  "Get the system installed by a vendor registered on the portal, and submit the plant details.",
  "Apply for net metering and complete the DISCOM inspection and commissioning.",
  "Upload your bank account details and a cancelled cheque so the subsidy can be credited."
]
export const subsidyUsageSteps = [
  "Set the capacity of the system you plan to install, in kWp (DC) — the number on your vendor's quotation.",
  "Enter your vendor's quotation if you have one, otherwise leave it blank and the calculator uses a typical cost per kW.",
  "Open 'Advanced rates' if a rate has changed since this page was updated — every figure recalculates instantly.",
  "Add an electricity rate to see the yearly bill saving and a simple payback period.",
  "Download the result as a PDF after entering your name, phone number and email address. The report includes your contact details, calculation results, rates and eligibility assumptions."
]
export const subsidyGuideCopy = {
  "calculation": [
    "Benchmark cost is ₹50,000 per kW for the first 2 kW and ₹45,000 per kW above that. The state subsidy is the benchmark cost, minus the central subsidy, minus your own contribution of 10% of the benchmark (5% for SC/ST). Because the subsidy is fixed by the benchmark, not by the vendor's bill, any quotation above the benchmark is paid by you.",
    "At 2.18 kWp the benchmark is ₹1,08,100 and the central subsidy ₹63,240. A General household gets ₹34,050 from the state and pays ₹10,810; an SC/ST household gets ₹39,455 and pays ₹5,405."
  ],
  "eligibility": [
    "Residential consumer.",
    "Total capacity up to 2.18 kWp (DC).",
    "System commissioned on or after 22 October 2026.",
    "If you already have solar of X kWp, the new Y kWp qualifies only while X + Y stays within 2.18 kWp.",
    "Beneficiaries cannot add more rooftop capacity for three years from installation.",
    "Paid by DBT through the DISCOMs, with GUVNL as the nodal agency."
  ],
  "central": [
    "PM Surya Ghar: Muft Bijli Yojana pays a Central Financial Assistance (CFA) on residential rooftop solar. It is ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW, so a 1 kW system gets ₹30,000, 2 kW gets ₹60,000 and 3 kW or more gets the maximum ₹78,000. Nothing is paid for capacity above 3 kW.",
    "North-Eastern states, Uttarakhand, Himachal Pradesh, Jammu & Kashmir, Ladakh and the island territories are special-category regions with a 10% higher rate — ₹33,000 per kW for the first 2 kW and ₹19,800 for the third — which makes the 3 kW maximum ₹85,800.",
    "The central subsidy needs a registered vendor, modules made with domestically produced cells, and a net meter. You apply on the National Portal for Rooftop Solar (pmsuryaghar.gov.in) and the subsidy is paid into your bank account after the system is inspected and commissioned. As published, the scheme is scheduled to run until 31 March 2027."
  ],
  "exclusions": "The calculator does not check whether your roof, DISCOM or consumer category qualifies, and it cannot see local rules such as feeder-level capacity limits. GST, structure upgrades, meter charges and loan interest are not modelled. The payback figure is a simple, undegraded estimate that assumes about 1,400 units a year per kW — real generation depends on your location, shading and tilt."
}
