export type FAQCategory = 'savings' | 'loans' | 'shariah' | 'pension' | 'mutual-funds' | 'insurance';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  categoryLabel: string;
  question: string;
  briefAnswer: string;
  answer: string;
  bullets: string[];
  tip?: string;
  isFeatured?: boolean;
  filterTarget?: string;
}

export interface FAQCategoryInfo {
  id: 'all' | FAQCategory;
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
  colorClass: string;
  borderClass: string;
  badgeClass: string;
  quickFacts: { label: string; value: string; desc: string }[];
}

export const FAQ_CATEGORIES: FAQCategoryInfo[] = [
  {
    id: 'all',
    label: 'All Financial Queries',
    shortLabel: 'All FAQs',
    badge: 'Comprehensive',
    description: 'Explore full regulatory, interest rate, tax rebate, and compliance guidelines across all financial sectors in Bangladesh.',
    colorClass: 'bg-slate-900 text-white border-slate-900',
    borderClass: 'border-slate-300',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
    quickFacts: [
      { label: 'Banks Covered', value: '50+ Scheduled', desc: 'Central Bank Verified' },
      { label: 'Policy Benchmark', value: '10.00% Repo', desc: 'November 2026 BB Circular' },
      { label: 'Tax Rebate', value: 'Up to 15%', desc: 'NBR Section 44 Credit' }
    ]
  },
  {
    id: 'loans',
    label: 'Bank Loans & Credit Facilities',
    shortLabel: 'Bank Loans',
    badge: 'Borrowing Guide',
    description: 'Official rules on Bangladesh Bank 10.0% Repo rate, commercial lending spreads, CIB clearance, loan-to-value limits, and early settlement rights.',
    colorClass: 'bg-amber-600 text-white border-amber-600',
    borderClass: 'border-amber-300',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
    quickFacts: [
      { label: 'Policy Repo Rate', value: '10.00%', desc: 'Bangladesh Bank Benchmark' },
      { label: 'Max Debt Ratio (DBR)', value: '50% of Income', desc: 'Mandatory Central Limit' },
      { label: 'Early Settlement Cap', value: '0.5% - 1.0%', desc: 'Consumer Protection Cap' }
    ]
  },
  {
    id: 'savings',
    label: 'Savings, FDR & DPS Deposits',
    shortLabel: 'Savings & Deposits',
    badge: 'Deposit Protection',
    description: 'Compare fixed deposit (FDR) statutory tenures, monthly DPS compounding yields, government savings certificates (Sanchaypatra), and e-TIN withholding tax rates.',
    colorClass: 'bg-blue-600 text-white border-blue-600',
    borderClass: 'border-blue-300',
    badgeClass: 'bg-blue-50 text-blue-900 border-blue-200',
    quickFacts: [
      { label: 'FDR Top Yield', value: 'Up to 11.76%', desc: 'Annual Compounded' },
      { label: 'AIT with e-TIN', value: '10% Tax', desc: '15% if no e-TIN submitted' },
      { label: 'Sanchaypatra Cap', value: '৳50 Lakh Max', desc: 'Sovereign Guarantee' }
    ]
  },
  {
    id: 'shariah',
    label: 'Shariah Banking & Islamic Finance',
    shortLabel: 'Shariah Banking',
    badge: '100% Halal Certified',
    description: 'Central Shariah Board (CSBIB) certified guidelines on zero-interest (Riba-free) Mudaraba profit sharing, provisional rates, and government Sukuk bonds.',
    colorClass: 'bg-emerald-600 text-white border-emerald-600',
    borderClass: 'border-emerald-300',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    quickFacts: [
      { label: 'Interest Rate (Riba)', value: '0% Strict', desc: 'Ethical Profit-Sharing' },
      { label: 'Reserve Protection', value: 'PER / IRR Buffer', desc: 'Smooth Dividend Yields' },
      { label: 'Sovereign Sukuk', value: '8.0% - 9.5%', desc: 'Ministry of Finance Asset' }
    ]
  },
  {
    id: 'pension',
    label: 'Pension & Universal Retirement (NPS)',
    shortLabel: 'Pension Schemes',
    badge: 'Lifetime Annuity',
    description: 'Comprehensive guide to the National Universal Pension Scheme (Pragati, Surokkha, Probash, Samata), age 60 monthly payouts, and tax exemptions.',
    colorClass: 'bg-purple-600 text-white border-purple-600',
    borderClass: 'border-purple-300',
    badgeClass: 'bg-purple-50 text-purple-900 border-purple-200',
    quickFacts: [
      { label: 'Pension Eligibility', value: 'Age 18 - 50', desc: 'All Bangladeshi Citizens' },
      { label: 'Monthly Annuity', value: 'Starts at Age 60', desc: 'Lifetime Guaranteed' },
      { label: 'Pension Tax', value: '100% Tax-Free', desc: 'Zero Income Tax on Payout' }
    ]
  },
  {
    id: 'mutual-funds',
    label: 'Mutual Funds & Systematic Investment (SIP)',
    shortLabel: 'Mutual Funds',
    badge: 'BSEC Regulated',
    description: 'Professional asset management guidelines, Open-Ended vs Closed-Ended structures, NAV valuations, and tax-exempt dividend thresholds.',
    colorClass: 'bg-indigo-600 text-white border-indigo-600',
    borderClass: 'border-indigo-300',
    badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    quickFacts: [
      { label: 'SIP Entry Minimum', value: 'From ৳1,000/mo', desc: 'Automated Auto-Debit' },
      { label: 'Dividend Exemption', value: '৳50,000 Free', desc: 'Annual Tax Exemption' },
      { label: 'Asset Ring-Fencing', value: 'Bank Custodian', desc: 'BRAC / Standard Chartered' }
    ]
  },
  {
    id: 'insurance',
    label: 'Insurance Plans & Islamic Takaful',
    shortLabel: 'Insurance & Takaful',
    badge: 'IDRA Compliant',
    description: 'IDRA regulations, Claim Settlement Ratio (CSR) benchmarks, Term Life protection vs Endowment savings, and Islamic mutual solidarity (Tabarru).',
    colorClass: 'bg-rose-600 text-white border-rose-600',
    borderClass: 'border-rose-300',
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-200',
    quickFacts: [
      { label: 'Settlement Mandate', value: '90 Statutory Days', desc: 'IDRA Regulatory Rule' },
      { label: 'Top Insurer CSR', value: '88% - 95%', desc: 'Audited Claims Settled' },
      { label: 'Section 44 Rebate', value: 'Up to 10% Sum', desc: 'Direct Premium Tax Credit' }
    ]
  }
];

export const FAQS_DATA: FAQItem[] = [
  // --- 1. Savings & Deposits ---
  {
    id: 'faq-sav-1',
    category: 'savings',
    categoryLabel: 'Savings & Deposits',
    question: 'What is the key difference between FDR, DPS, and Regular Savings in Bangladesh?',
    briefAnswer: 'FDR locks in a lump sum for high guaranteed yields (up to 11.76%), DPS builds monthly compounding savings over 1–20 years, while Regular Savings offers 100% liquidity without lock-in.',
    answer: 'Each savings instrument is designed for a distinct financial objective, liquidity preference, and savings horizon in Bangladesh:',
    bullets: [
      'Regular Savings: Completely liquid with zero lock-in period. Interest accrues on daily or monthly average balance with unrestricted ATM, debit card, and NPSB transfers.',
      'Fixed Deposit (FDR): A lump-sum deposit locked for a statutory term (3 months up to 5 years). Offers maximum guaranteed yields (up to 11.76% p.a. in the current policy regime).',
      'Deposit Pension Scheme (DPS): Monthly recurring installment (from ৳500 to ৳50,000/month) that compounds monthly over 1 to 20 years, creating structured long-term wealth.'
    ],
    tip: 'Pro-Tip: For emergency funds, keep 3–6 months of living expenses in High-Yield Savings; allocate surplus lump sums to FDR and monthly income savings to DPS.',
    isFeatured: true,
    filterTarget: 'RegularSavings'
  },
  {
    id: 'faq-sav-2',
    category: 'savings',
    categoryLabel: 'Savings & Deposits',
    question: 'How do National Savings Certificates (Sanchaypatra) compare with Bank FDRs?',
    briefAnswer: 'Sanchaypatra has 100% sovereign Bangladesh Government backing with yields up to 11.76% p.a. but strict individual caps (৳50 Lakh); Bank FDRs have no investment limit and allow 90% loan liens.',
    answer: 'Both are premier fixed-income investments in Bangladesh, but serve different wealth profiles and liquidity needs:',
    bullets: [
      'Sovereign Security: Sanchaypatra (Family, 3-Month Profit, Pensioner, 5-Year Bangladesh) is backed 100% by the sovereign Government of Bangladesh with zero institutional default risk.',
      'Yield & Tiered Caps: Sanchaypatra yields up to 11.76% p.a., but enforces statutory ceilings (৳50 Lakh single / ৳1 Crore joint) and tiered lower rates for investments exceeding ৳15 Lakhs.',
      'Bank FDR Flexibility: Scheduled commercial bank FDRs have no maximum investment limits, allow loan against deposit (LAD) liens up to 90%, and support flexible 3, 6, 9, and 12-month terms.'
    ],
    tip: 'Pro-Tip: Exhaust your highest-tier Sanchaypatra quotas first, then deploy surplus funds across top AA+ rated scheduled commercial banks.',
    filterTarget: 'Sanchaypatra'
  },
  {
    id: 'faq-sav-3',
    category: 'savings',
    categoryLabel: 'Savings & Deposits',
    question: 'How does an e-TIN certificate affect withholding tax (AIT) on savings and FDR profits?',
    briefAnswer: 'Having a verified e-TIN lowers withholding tax (AIT) from 15% down to 10% on all interest earnings, saving you 33% in direct tax deductions.',
    answer: 'Submitting a valid electronic Taxpayer Identification Number (e-TIN) significantly reduces statutory taxes on bank returns:',
    bullets: [
      'Advance Income Tax (AIT): Withholding tax on bank interest/profit is strictly 10% for e-TIN holders, but increases to 15% for non-TIN holders (a 33% tax penalty).',
      'Section 44 Direct Tax Rebate: Contributions to DPS (up to ৳1,20,000 annually) qualify for a direct income tax credit of up to 15% under National Board of Revenue (NBR) rules.',
      'Automatic Branch Sync: Once your e-TIN is linked to your bank account, the discounted 10% rate applies across all current and future deposits with that institution.'
    ],
    tip: 'Pro-Tip: Toggle "With e-TIN" inside our package simulator to see the exact post-tax net payout and Section 44 annual tax savings.',
    filterTarget: 'RegularSavings'
  },

  // --- 2. Bank Loans ---
  {
    id: 'faq-loan-1',
    category: 'loans',
    categoryLabel: 'Bank Loans',
    question: 'How does the Bangladesh Bank Repo Rate (10.0%) impact loan EMIs and borrowing costs?',
    briefAnswer: 'Commercial banks benchmark retail lending rates to the BB repo policy rate (10.0%) plus a sanctioned spread (3.0%–3.75%), determining your monthly repayment obligations.',
    answer: 'In the Bangladesh Bank monetary policy, the central policy repo rate is maintained at 10.00% to curb inflation and guide commercial lending:',
    bullets: [
      'Lending Benchmarks: Most commercial banks benchmark their variable loan rates to the BB policy rate or SMART reference rates plus a sanctioned markup (typically 3.00% – 3.75%).',
      'Fixed vs Variable EMI: Fixed-rate retail loans lock in your repayment for the duration, whereas variable-rate facilities adjust periodically as central bank policy evolves.',
      'Debt-to-Income (DBR): Central bank guidelines mandate that your total monthly loan obligations (EMIs) must not exceed 50% of your verifiable net monthly income.'
    ],
    tip: 'Pro-Tip: Use our interactive Loan EMI estimator to check your monthly amortization and total payable interest across varying tenures (1 to 25 years).',
    isFeatured: true,
    filterTarget: 'Loan'
  },
  {
    id: 'faq-loan-2',
    category: 'loans',
    categoryLabel: 'Bank Loans',
    question: 'What are the required documents and CIB criteria to secure loan approval in Bangladesh?',
    briefAnswer: 'Banks require a clean Bangladesh Bank CIB report with zero overdue defaults in the past 12–24 months, 6+ months salary verification, NID, and e-TIN certificate.',
    answer: 'All scheduled commercial banks verify loan applicants through Bangladesh Bank\'s Credit Information Bureau (CIB) database:',
    bullets: [
      'Clean CIB Status: You must have zero overdue defaults, late payment flags, or unadjusted credit card debts on your CIB report within the last 12–24 months.',
      'Income Verification: Minimum 6 months salaried service confirmed via bank salary statements, or 2 years trade license with audited cash flow for self-employed/SME borrowers.',
      'Mandatory Documentation: National ID card (NID), valid e-TIN certificate, 2 passport photos, utility bill verification, and institutional guarantor / co-applicant details.'
    ],
    tip: 'Pro-Tip: Having an active e-TIN and clean CIB record qualifies you for discounted 0.5% bank processing fees compared to standard 1.0% fees.',
    filterTarget: 'Loan'
  },
  {
    id: 'faq-loan-3',
    category: 'loans',
    categoryLabel: 'Bank Loans',
    question: 'Can I make partial prepayments or early settlement on my loan? Are there penalty caps?',
    briefAnswer: 'Yes, Bangladesh Bank caps early settlement charges at 0.5%–1.0% on the remaining unsettled principal, with penalties waived for agricultural and SME borrowers.',
    answer: 'Borrowers have legal rights under Bangladesh Bank consumer credit circulars to prepay loans prior to contracted maturity:',
    bullets: [
      'Partial Prepayment: Most banks permit extra lump-sum principal payments (minimum 2–3 regular EMIs) without changing your interest rate, shortening your overall tenure.',
      'Early Settlement Fee: Capped by Bangladesh Bank guidelines at a maximum of 0.5% to 1.0% on the remaining unsettled principal balance for personal and home credit.',
      'Fee Waivers: Many institutions waive early settlement penalties entirely for agriculture (Krishi Rin), priority cottage/micro-SME, and women entrepreneur loans.'
    ],
    tip: 'Pro-Tip: Always ask your branch credit officer for an official Early Settlement Amortization Sheet before transferring funds.',
    filterTarget: 'Loan'
  },

  // --- 3. Shariah Banking ---
  {
    id: 'faq-sha-1',
    category: 'shariah',
    categoryLabel: 'Shariah Banking',
    question: 'What makes Shariah-compliant Islamic savings different from conventional banking?',
    briefAnswer: 'Islamic banking eliminates predefined interest (Riba). Deposits operate under Mudaraba profit-sharing partnerships invested only in halal, real-economy businesses audited by CSBIB.',
    answer: 'Islamic banking is fundamentally governed by divine ethical jurisprudence audited by the Central Shariah Board for Islamic Banks of Bangladesh (CSBIB):',
    bullets: [
      'Zero Riba (No Interest): Islamic accounts strictly eliminate predefined compound interest. Capital is deployed into real-economy halal manufacturing, trade, and infrastructure.',
      'Mudaraba & Wakalah: Deposits operate under Mudaraba (profit-sharing partnership) where returns are calculated from actual business profits using a declared Profit Sharing Ratio (PSR).',
      'Certified Asset Backing: Zero investments in speculative gambling (Maysir), predatory ambiguity (Gharar), alcohol, tobacco, or un-Islamic commercial enterprises.'
    ],
    tip: 'Pro-Tip: Look for the green "100% Halal / CSBIB Certified" badge in the Marketplace to explore vetted Mudaraba and Sukuk investments.',
    isFeatured: true,
    filterTarget: 'Shariah'
  },
  {
    id: 'faq-sha-2',
    category: 'shariah',
    categoryLabel: 'Shariah Banking',
    question: 'How is the Profit Sharing Ratio (PSR) and provisional profit rate determined in Mudaraba?',
    briefAnswer: 'Profits are split according to an agreed contractual ratio (e.g. 70% depositor / 30% bank) based on audited quarterly business profits, backed by a Profit Equalization Reserve (PER).',
    answer: 'Unlike conventional banks that guarantee a fixed interest rate upfront, Islamic banks announce a provisional rate and a binding contractual ratio:',
    bullets: [
      'Profit Sharing Ratio (PSR): When opening a Mudaraba deposit, you sign a binding ratio (such as 65:35 or 70:30). If the bank earns higher profits, your net return increases proportionately.',
      'Profit Equalization Reserve (PER): Islamic banks maintain a contingency reserve to smooth out profit distributions across quarters, ensuring stable competitive yields for depositors.',
      'Weightage Distribution: Long-term Mudaraba term deposits receive higher mathematical weightages (e.g., 1.25x or 1.40x) compared to daily savings accounts.'
    ],
    tip: 'Pro-Tip: In Bangladesh, top Shariah banks such as Islami Bank, Shahjalal, and Al-Arafah historically deliver actual Mudaraba yields matching or exceeding conventional FDR rates.',
    filterTarget: 'Shariah'
  },
  {
    id: 'faq-sha-3',
    category: 'shariah',
    categoryLabel: 'Shariah Banking',
    question: 'What are Islamic Sukuk bonds and how can retail investors participate in Bangladesh?',
    briefAnswer: 'Sukuk represents undivided ownership in tangible sovereign or corporate assets generating rental income (typically 8.0%–9.5% p.a.), offering an asset-backed alternative to bonds.',
    answer: 'Bangladesh Government Islamic Investment Sukuk (BGIIS) offers sovereign Shariah-compliant fixed-income investments:',
    bullets: [
      'Asset Ownership: Instead of a debt IOU, Sukuk certificates grant you proportional ownership in tangible infrastructure (such as national water supply or renewable energy projects).',
      'Semi-Annual Rental Payouts: Investors receive semi-annual rental profit distributions backed by the Ministry of Finance and Bangladesh Bank as trustee.',
      'Eligibility: Both resident Bangladeshis and Non-Resident Bangladeshis (NRBs) can participate through authorized Islamic bank branches and capital market brokerages.'
    ],
    tip: 'Pro-Tip: Sukuk returns are backed by government-owned infrastructure assets, providing premier safety alongside Shariah compliance.',
    filterTarget: 'Shariah'
  },

  // --- 4. Pension Schemes ---
  {
    id: 'faq-pen-1',
    category: 'pension',
    categoryLabel: 'Pension Schemes',
    question: 'How does the National Universal Pension Scheme (NPS) work across its 4 packages?',
    briefAnswer: 'NPS allows citizens aged 18–50 to deposit monthly into Pragati (private sector), Surokkha (informal), Probash (NRBs), or Samata (low income with 50% govt match) for lifetime monthly pensions from age 60.',
    answer: 'Administered by the National Pension Authority (NPA) under the Ministry of Finance, the Universal Pension Scheme provides lifelong retirement security:',
    bullets: [
      'Package Segmentation: Pragati (private company employees), Surokkha (farmers, freelancers, self-employed), Probash (remittance-earning expatriates), and Samata (low-income with 50% govt subsidy match).',
      'Lifetime Pension: Monthly contributions compound over 10 to 42 years. Starting at age 60, the subscriber receives a monthly annuity until death.',
      'Nominee Protection: If the pensioner passes away before age 75, their designated nominee continues receiving the full monthly pension up to age 75.'
    ],
    tip: 'Pro-Tip: Universal Pension Scheme contributions qualify for Section 44 direct tax rebates, and all retirement monthly payouts are 100% income tax-exempt.',
    isFeatured: true,
    filterTarget: 'Pension'
  },
  {
    id: 'faq-pen-2',
    category: 'pension',
    categoryLabel: 'Pension Schemes',
    question: 'Can I invest in both a Bank Pension DPS and the Government Universal Pension (NPS) simultaneously?',
    briefAnswer: 'Yes, you can hold both concurrently. Bank Pension DPS gives you a private maturity corpus, while Universal Pension provides lifelong inflation-hedged monthly annuities.',
    answer: 'There is zero legal restriction against participating in both retirement vehicles concurrently:',
    bullets: [
      'Dual Diversification: Enrolling in Government NPS provides guaranteed sovereign lifetime cashflow, while a private Bank Pension DPS (e.g. BRAC, City, DBBL) yields a substantial liquid lump-sum at maturity.',
      'Tax Rebate Synergy: Both monthly contributions are eligible for Section 44 tax credits under the National Board of Revenue (NBR) annual investment ceiling.',
      'Flexible Early Exit: Bank Pension schemes allow early encashment after 1–3 years (with premature interest rates), whereas NPS is structured specifically for long-term retirement security.'
    ],
    tip: 'Pro-Tip: Use our interactive pension calculator to model your monthly contribution vs estimated monthly pension payout at retirement.',
    filterTarget: 'Pension'
  },
  {
    id: 'faq-pen-3',
    category: 'pension',
    categoryLabel: 'Pension Schemes',
    question: 'What are the tax benefits of pension schemes in Bangladesh? Are retirement payouts taxable?',
    briefAnswer: 'All pension contributions up to ৳1,20,000 annually earn a direct 15% income tax credit under Section 44, and all retirement monthly pension payouts are 100% tax-exempt.',
    answer: 'The Bangladesh Income Tax Act 2023 provides aggressive incentives for personal retirement savings:',
    bullets: [
      'Upfront Tax Rebate: Contributions to Universal Pension Schemes and recognized provident/superannuation funds qualify for up to 15% tax rebate on total payable income tax.',
      'Tax-Free Monthly Pension: Monthly pension payouts received from the National Pension Authority (NPA) after age 60 are completely exempt from income tax.',
      'Zero AIT Deduction: Unlike regular bank savings interest which suffers 10%–15% AIT withholding, pension payouts do not incur withholding tax.'
    ],
    tip: 'Pro-Tip: Entering your monthly pension contribution in your annual NBR tax return directly reduces your final tax payment slip.',
    filterTarget: 'Pension'
  },

  // --- 5. Mutual Funds ---
  {
    id: 'faq-mf-1',
    category: 'mutual-funds',
    categoryLabel: 'Mutual Funds',
    question: 'What is the difference between Open-Ended and Closed-Ended Mutual Funds in Bangladesh?',
    briefAnswer: 'Open-ended funds can be purchased and redeemed anytime from Asset Management Companies (AMCs) at daily Net Asset Value (NAV). Closed-ended funds have fixed terms (5–10 years) and trade on DSE/CSE.',
    answer: 'Mutual funds pool savings from thousands of retail investors to invest in a professionally diversified portfolio of equities, treasury bonds, and fixed deposits:',
    bullets: [
      'Open-Ended Funds: No fixed maturity date or size limit. Investors can buy or surrender units on any banking day at the prevailing Net Asset Value (NAV) directly through the AMC or digital app.',
      'Closed-Ended Funds: Listed on the Dhaka Stock Exchange (DSE) and Chittagong Stock Exchange (CSE) with a fixed unit capital and maturity tenure (usually 10 years). Units trade at market prices which may be at a discount to NAV.',
      'Professional Management: Portfolios are steered by licensed Asset Management Companies (e.g., Shanta, IDLC, EDGE, VIPB) under strict Bangladesh Securities and Exchange Commission (BSEC) guidelines.'
    ],
    tip: 'Pro-Tip: Open-ended mutual funds provide high liquidity and are ideal for Systematic Investment Plans (SIP) with zero stockbroker commissions.',
    filterTarget: 'Mutual Fund'
  },
  {
    id: 'faq-mf-2',
    category: 'mutual-funds',
    categoryLabel: 'Mutual Funds',
    question: 'How does a Systematic Investment Plan (SIP) work in mutual funds, and what is the minimum deposit?',
    briefAnswer: 'SIP allows automated monthly investments from as low as ৳1,000/month, using Taka-Cost Averaging to buy more units when prices dip and compound wealth over time.',
    answer: 'A Systematic Investment Plan (SIP) enables disciplined, automated monthly investing without trying to time market swings:',
    bullets: [
      'Low Minimum Barrier: Most leading AMCs in Bangladesh allow starting a SIP with just ৳1,000 or ৳2,000 per month through auto-debit (BEFTN/NPSB) or bKash/Nagad.',
      'Taka-Cost Averaging: By investing a fixed amount every month, you automatically purchase more fund units when market prices drop and fewer units when prices surge, reducing average acquisition cost.',
      'Compounding Reinvestment: You can choose the Cumulative Investment Plan (CIP) option where annual cash dividends are automatically reinvested into more units to accelerate wealth creation.'
    ],
    tip: 'Pro-Tip: A 10-year monthly SIP of ৳5,000 at a historical 11% annualized return creates a corpus of approximately ৳10.8 Lakhs on a ৳6.0 Lakh principal.',
    filterTarget: 'Mutual Fund'
  },
  {
    id: 'faq-mf-3',
    category: 'mutual-funds',
    categoryLabel: 'Mutual Funds',
    question: 'Who regulates mutual funds in Bangladesh and how is investor capital kept safe?',
    briefAnswer: 'Mutual funds are strictly regulated by BSEC under the Mutual Fund Rules 2001, with independent statutory Custodians (like BRAC Bank) holding assets separately from fund managers.',
    answer: 'The mutual fund industry features a strict three-tier regulatory separation of power to protect investor money:',
    bullets: [
      'Asset Management Company (AMC): Manages investment strategies and research, but NEVER holds your money or securities in their own accounts.',
      'Independent Custodian: A licensed commercial bank (such as BRAC Bank or Standard Chartered) acts as Custodian, physically holding all cash deposits and share certificates.',
      'Independent Trustee: An autonomous legal trustee (such as Investment Corporation of Bangladesh or Bangladesh General Insurance Co.) audits daily fund valuations and enforces BSEC compliance.'
    ],
    tip: 'Pro-Tip: Even if a fund management company closes, your underlying portfolio assets remain 100% ring-fenced with the independent bank custodian.',
    filterTarget: 'Mutual Fund'
  },
  {
    id: 'faq-mf-4',
    category: 'mutual-funds',
    categoryLabel: 'Mutual Funds',
    question: 'Are dividends from mutual funds tax-exempt for individual investors in Bangladesh?',
    briefAnswer: 'Yes, dividend income from mutual funds up to ৳50,000 per tax year is completely tax-free for resident individuals, and investments qualify for Section 44 tax credits.',
    answer: 'Mutual funds offer some of the most attractive statutory tax incentives under the Bangladesh Income Tax Act:',
    bullets: [
      '৳50,000 Dividend Exemption: Any dividend income earned up to ৳50,000 per tax assessment year from mutual funds is 100% tax-free in the hands of individual taxpayers.',
      'Section 44 Investment Rebate: Purchasing units of registered open-ended and closed-ended mutual funds counts towards your statutory investment allowance for annual tax credit.',
      'Capital Gains: Long-term capital gains on redemption of mutual fund units held by individuals enjoy favorable statutory tax brackets compared to speculative trading.'
    ],
    tip: 'Pro-Tip: Opt for mutual funds when looking for an alternative to FDR that combines tax credits with potential inflation-beating capital appreciation.',
    filterTarget: 'Mutual Fund'
  },

  // --- 6. Insurance Plans ---
  {
    id: 'faq-ins-1',
    category: 'insurance',
    categoryLabel: 'Insurance Plans',
    question: 'What is the difference between Term Life Insurance and Endowment (DPS with Insurance)?',
    briefAnswer: 'Term Life offers pure risk protection with maximum coverage for minimum premium (zero maturity value); Endowment plans combine life insurance with structured savings that return a maturity sum with bonuses.',
    answer: 'Choosing between Term Life and Endowment depends on whether your priority is maximum family protection or disciplined forced savings:',
    bullets: [
      'Term Life Insurance: Provides pure financial death benefit protection. If the policyholder passes away during the term, the family receives the full sum assured (e.g. ৳50 Lakhs) for a modest annual premium (e.g. ৳12,000/yr). No maturity payout if you survive.',
      'Endowment Assurance: Combines insurance coverage with a savings bank element. You pay higher premiums, but if you survive the term, you receive the full sum assured PLUS accumulated reversionary bonuses.',
      'DPS with Insurance: Many commercial banks partner with life insurers to bundle insurance cover onto regular DPS accounts, paying out the remaining target DPS if the depositor suffers disability or demise.'
    ],
    tip: 'Pro-Tip: Financial advisors recommend taking Term Life for 10x your annual income to protect family dependents, while investing surplus savings separately in high-yield FDR, DPS, or mutual funds.',
    filterTarget: 'Insurance'
  },
  {
    id: 'faq-ins-2',
    category: 'insurance',
    categoryLabel: 'Insurance Plans',
    question: 'How does Islamic Takaful insurance operate compared to conventional insurance?',
    briefAnswer: 'Takaful operates on mutual solidarity (Ta\'awun) and voluntary donation (Tabarru). Policyholders pool contributions to assist members in distress, with underwriting surpluses redistributed to participants.',
    answer: 'Islamic Takaful eliminates the elements of interest (Riba), gambling (Maysir), and excessive uncertainty (Gharar) found in conventional insurance:',
    bullets: [
      'Tabarru (Charitable Donation): Participants contribute donations into a collective risk pool to protect each other against untimely death, disability, or critical medical crises.',
      'Surplus Sharing: Unlike conventional insurers where all underwriting profits belong strictly to the insurance company shareholders, in Takaful, excess funds are redistributed back to participants.',
      'Halal Investment Mandate: The Takaful operator invests the pool reserves only in Shariah-approved avenues (Islamic Mudaraba deposits, Sukuk bonds, and halal equities).'
    ],
    tip: 'Pro-Tip: Look for the CSBIB certified Islamic Takaful plans from leading operators such as Fareast, Islami Bank Insurance, and Prime Islami Life.',
    filterTarget: 'Insurance'
  },
  {
    id: 'faq-ins-3',
    category: 'insurance',
    categoryLabel: 'Insurance Plans',
    question: 'Can I get a Section 44 Income Tax Rebate for life and health insurance premiums in Bangladesh?',
    briefAnswer: 'Yes, life and health insurance premiums paid for yourself, spouse, and children qualify for direct Section 44 income tax credit, capped at 10% of the insured sum.',
    answer: 'Life and health insurance premiums are officially recognized allowable investments under the Bangladesh Income Tax Act:',
    bullets: [
      'Eligible Premium Allowance: Annual premiums paid on life insurance policies for yourself, your spouse, or dependent children count towards your investment tax rebate.',
      '10% Statutory Ceiling: The allowable investment for tax rebate calculation is capped at 10% of the total policy Sum Assured (to prevent short-term tax evasion).',
      'Direct Tax Deduction: Your calculated rebate directly knocks money off your final income tax liability when submitting your annual return to NBR.'
    ],
    tip: 'Pro-Tip: Submit your official annual premium receipt issued by the insurance company along with your tax return to secure your full rebate.',
    filterTarget: 'Insurance'
  },
  {
    id: 'faq-ins-4',
    category: 'insurance',
    categoryLabel: 'Insurance Plans',
    question: 'What is the Claim Settlement Ratio (CSR) and how does IDRA protect policyholders in Bangladesh?',
    briefAnswer: 'The Insurance Development and Regulatory Authority (IDRA) monitors the CSR percentage of claims paid versus filed, requiring valid documentation claims to be settled within 90 statutory days.',
    answer: 'The Insurance Development and Regulatory Authority (IDRA) enforces strict consumer protection standards across life and non-life insurers in Bangladesh:',
    bullets: [
      'Claim Settlement Ratio (CSR): Measures the percentage of death and maturity claims paid out by an insurer. Leading life insurers maintain CSRs between 85% and 95%.',
      '90-Day Settlement Mandate: IDRA rules legally mandate insurance companies to disburse claim settlements within 90 days of receiving completed claim paperwork.',
      'Policyholder Grievance Redressal: If an insurer unjustly denies or delays your claim, you can file a direct complaint with IDRA\'s central grievance cell for arbitration and penalty enforcement.'
    ],
    tip: 'Pro-Tip: Always choose insurance companies with audited CSR exceeding 85% and clean solvency margins.',
    filterTarget: 'Insurance'
  }
];
