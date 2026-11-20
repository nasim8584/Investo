export type ProductType = 'Savings' | 'FDR' | 'DPS' | 'Insurance' | 'Sanchaypatra' | 'Mutual Fund' | 'Exclusive' | 'Loan' | 'Pension';
export type SafetyRating = 'Safe' | 'Moderate' | 'Risky';
export type LoanSubCategory = 'Personal' | 'Home' | 'Car' | 'SME' | 'Agriculture' | 'Corporate' | 'Education' | 'Professional' | 'Islamic' | 'Secured';
export type PensionSubCategory = 'National' | 'BankPension' | 'SeniorCitizen';

export interface FinancialProduct {
  id: string;
  bankName: string;
  productName: string;
  type: ProductType;
  interestRate: number;
  tenureMonths: number;
  minAmount: number;
  category: string;
  url?: string;
  logoUrl?: string;
  features: string[];
  safetyRating: SafetyRating;
  payoutFrequency?: string;
  compoundFrequency?: 'Daily' | 'Monthly' | 'Quarterly' | 'Annually' | 'At Maturity';
  taxApplicable?: boolean;
  earlyEncashmentPenalty?: string;
  isShariahCompliant?: boolean;
  lastUpdated?: string;
  coverageAmount?: string;
  benefitType?: string;
  schemeTarget?: string;
  liquidityTier?: string;
  dividendYieldHist?: string;
  loanSubCategory?: LoanSubCategory;
  pensionSubCategory?: PensionSubCategory;
  maxLoanLimit?: string;
  processingFee?: string;
  emiExample?: string;
  monthlyPensionBenefit?: string;
}

export interface ProductPointer {
  key: 'yield' | 'maturity' | 'interval' | 'minimum' | 'extra';
  label: string;
  value: string;
  sub?: string;
  badge?: string;
  isHighlight?: boolean;
}

export function getProductPointers(product: FinancialProduct): ProductPointer[] {
  const isShariah = product.isShariahCompliant === true;

  switch (product.type) {
    case 'Savings':
      return [
        {
          key: 'yield',
          label: isShariah ? 'Expected Profit Rate' : 'Interest Rate',
          value: `${product.interestRate}%`,
          sub: isShariah ? 'p.a. Mudaraba Weightage' : 'p.a. Daily Balance',
          badge: isShariah ? 'Halal Profit' : 'Profit',
          isHighlight: true,
        },
        {
          key: 'maturity',
          label: 'Lock-in Term',
          value: 'None (Instant)',
          sub: '24/7 ATM & NPSB',
          badge: 'Liquidity',
        },
        {
          key: 'interval',
          label: isShariah ? 'Profit Distribution' : 'Profit Credit',
          value: product.payoutFrequency || 'Monthly',
          sub: isShariah ? 'Mudaraba Account Credit' : 'Direct Account Credit',
          badge: 'Cycle',
        },
        {
          key: 'minimum',
          label: 'Min Balance',
          value: `৳${product.minAmount.toLocaleString('en-IN')}`,
          sub: isShariah ? 'Opening Halal Deposit' : 'Opening Deposit',
          badge: 'Requirement',
        },
      ];

    case 'Insurance': {
      const isHealth = product.productName.toLowerCase().includes('health') || product.productName.toLowerCase().includes('hospital');
      const isWealthLife = product.interestRate > 0;
      const isTakaful = isShariah || product.productName.toLowerCase().includes('takaful');
      return [
        {
          key: 'yield',
          label: isTakaful ? 'Takaful Cover / Surplus' : (isWealthLife ? 'Target Bonus / Yield' : 'Protection Cover'),
          value: product.coverageAmount || (isWealthLife ? `${product.interestRate}% Bonus` : isHealth ? 'Cashless Health' : 'Life Cover'),
          sub: isTakaful ? 'Mudaraba Surplus Pool' : (isWealthLife ? 'Dual Wealth + Life' : isHealth ? 'In-Patient & OPD' : 'Sum Assured Benefit'),
          badge: isTakaful ? 'Halal Takaful' : 'Coverage',
          isHighlight: true,
        },
        {
          key: 'maturity',
          label: isTakaful ? 'Takaful Horizon' : 'Policy Term',
          value: product.tenureMonths >= 12 ? `${Math.round(product.tenureMonths / 12)} Yrs` : `${product.tenureMonths} Mo`,
          sub: product.tenureMonths <= 12 ? 'Annual Renewable' : 'Coverage Horizon',
          badge: 'Term',
        },
        {
          key: 'interval',
          label: isTakaful ? 'Surplus / Settlement' : 'Claim / Settlement',
          value: product.payoutFrequency || (isTakaful ? 'At Maturity' : 'Claim Basis'),
          sub: isTakaful ? 'Participant Surplus Fund' : (isHealth ? 'Cashless Hospitalization' : 'Direct Beneficiary'),
          badge: 'Settlement',
        },
        {
          key: 'minimum',
          label: isTakaful ? 'Takaful Installment' : 'Starting Premium',
          value: `৳${product.minAmount.toLocaleString('en-IN')}${product.tenureMonths <= 12 ? '/yr' : '/mo'}`,
          sub: 'Sec 44 Tax Rebate',
          badge: 'Premium',
        },
      ];
    }

    case 'Mutual Fund':
      return [
        {
          key: 'yield',
          label: isShariah ? 'Shariah Div Yield' : 'Hist. Div Yield',
          value: `${product.interestRate}%`,
          sub: isShariah ? 'Halal Screened Equities' : 'Audited 5Y Avg',
          badge: isShariah ? 'Shariah Unit' : 'Dividend',
          isHighlight: true,
        },
        {
          key: 'maturity',
          label: 'Investment Mode',
          value: 'Monthly SIP / Lump',
          sub: '1 to 30 Yrs Horizon',
          badge: 'Flexible',
        },
        {
          key: 'interval',
          label: 'Dividend Cycle',
          value: product.payoutFrequency || 'Annually',
          sub: isShariah ? 'Halal Cash or CIP Units' : 'Cash or CIP Units',
          badge: 'Distribution',
        },
        {
          key: 'minimum',
          label: 'Min Monthly SIP',
          value: `৳${product.minAmount.toLocaleString('en-IN')}/mo`,
          sub: 'SIP or Lump-Sum',
          badge: 'Installment',
        },
      ];

    case 'Exclusive': {
      const isDouble = product.productName.toLowerCase().includes('double');
      const isKotipoti = product.productName.toLowerCase().includes('kotipoti');
      const isMillionaire = product.productName.toLowerCase().includes('millionaire');
      const targetText = product.schemeTarget || (isDouble ? 'Double Return' : isKotipoti ? '৳1 Crore Target' : isMillionaire ? '৳10 Lakh Target' : `${product.interestRate}% p.a.`);
      return [
        {
          key: 'yield',
          label: isShariah ? 'Mudaraba Target' : 'Target Multiplier',
          value: targetText,
          sub: isShariah ? 'Milestone Mudaraba Pool' : 'Milestone Corpus',
          badge: isShariah ? 'Halal Exclusive' : 'Exclusive',
          isHighlight: true,
        },
        {
          key: 'maturity',
          label: 'Goal Horizon',
          value: product.tenureMonths > 0 ? `${product.tenureMonths / 12} Yrs` : '5 - 10 Yrs',
          sub: 'Target Completion',
          badge: 'Maturity',
        },
        {
          key: 'interval',
          label: 'Deposit Mode',
          value: product.minAmount >= 50000 ? 'Lump-sum' : 'Monthly Auto-Debit',
          sub: product.payoutFrequency || 'At Maturity',
          badge: 'Mode',
        },
        {
          key: 'minimum',
          label: 'Starting Deposit',
          value: `৳${product.minAmount.toLocaleString('en-IN')}${product.minAmount < 50000 ? '/mo' : ''}`,
          sub: isShariah ? 'Halal Minimum Tier' : 'Minimum Plan Tier',
          badge: 'Commitment',
        },
      ];
    }

    case 'Sanchaypatra':
      const isSukuk = isShariah || product.productName.toLowerCase().includes('sukuk');
      return [
        {
          key: 'yield',
          label: isSukuk ? 'Sukuk Rental Yield' : 'Govt Profit Rate',
          value: `${product.interestRate}%`,
          sub: isSukuk ? 'Asset-Backed Sovereign' : 'Sovereign Guarantee',
          badge: isSukuk ? 'Govt Sukuk' : 'Zero Risk',
          isHighlight: true,
        },
        {
          key: 'maturity',
          label: isSukuk ? 'Sukuk Certificate Term' : 'Certificate Term',
          value: `${product.tenureMonths / 12} Years`,
          sub: 'Fixed Sovereign Term',
          badge: 'Tenure',
        },
        {
          key: 'interval',
          label: isSukuk ? 'Rental Disbursement' : 'Disbursement',
          value: product.payoutFrequency || (isSukuk ? 'Semi-Annually' : 'Monthly'),
          sub: 'Direct Bank BEFTN',
          badge: isSukuk ? 'Rental' : 'Coupon',
        },
        {
          key: 'minimum',
          label: isSukuk ? 'Min Sukuk Investment' : 'Purchase Limit',
          value: `৳${product.minAmount.toLocaleString('en-IN')}${isSukuk ? '' : ' Min'}`,
          sub: isSukuk ? 'Bangladesh Bank Issued' : 'Ceiling up to ৳45-50L',
          badge: isSukuk ? 'Sovereign' : 'Ceiling',
        },
      ];

    case 'DPS':
      return [
        {
          key: 'yield',
          label: isShariah ? 'Expected Profit Rate' : 'DPS Profit Rate',
          value: `${product.interestRate}%`,
          sub: isShariah ? 'Monthly Mudaraba Pool' : 'Monthly Compounding',
          badge: isShariah ? 'Halal DPS' : 'Compound',
          isHighlight: true,
        },
        {
          key: 'maturity',
          label: 'Scheme Term',
          value: product.tenureMonths > 0 ? `${product.tenureMonths / 12} Years` : '3 - 10 Yrs',
          sub: 'Maturity Horizon',
          badge: 'Tenure',
        },
        {
          key: 'interval',
          label: 'Installment Mode',
          value: 'Monthly',
          sub: 'Auto-Debit Ready',
          badge: 'Interval',
        },
        {
          key: 'minimum',
          label: isShariah ? 'Mudaraba Monthly' : 'Monthly Deposit',
          value: `৳${product.minAmount.toLocaleString('en-IN')}/mo`,
          sub: isShariah ? 'Halal Installment Tiers' : 'Flexible Tiers',
          badge: 'Installment',
        },
      ];

    case 'Loan':
      return [
        {
          key: 'yield',
          label: isShariah ? 'Profit Margin / Rate' : 'Borrowing Interest Rate',
          value: `${product.interestRate}%`,
          sub: isShariah ? 'Halal Murabaha / Ijarah' : 'SMART Benchmark + Spread',
          badge: isShariah ? 'Halal Financing' : 'Loan Rate',
          isHighlight: true,
        },
        {
          key: 'maturity',
          label: 'Max Repayment Tenure',
          value: product.tenureMonths >= 12 ? `${Math.round(product.tenureMonths / 12)} Year${product.tenureMonths > 12 ? 's' : ''}` : `${product.tenureMonths} Months`,
          sub: 'Flexible EMI Tenure',
          badge: 'Tenure',
        },
        {
          key: 'interval',
          label: 'Repayment Mode',
          value: product.payoutFrequency || 'Monthly EMI',
          sub: product.emiExample || 'Auto-Debit Ready',
          badge: 'EMI',
        },
        {
          key: 'minimum',
          label: 'Max Loan Limit',
          value: product.maxLoanLimit || `৳${product.minAmount.toLocaleString('en-IN')}`,
          sub: product.processingFee || 'Processing Fee 0.5-1%',
          badge: 'Limit',
        },
      ];

    case 'Pension': {
      const isNational = product.pensionSubCategory === 'National';
      return [
        {
          key: 'yield',
          label: isNational ? 'Monthly Pension / Return' : isShariah ? 'Expected Halal Return' : 'Retirement Yield',
          value: product.monthlyPensionBenefit || `${product.interestRate}% Return`,
          sub: isNational ? 'Universal Pension Authority' : 'Lifelong Post-60 Monthly Pension',
          badge: isNational ? 'Govt Guaranteed' : isShariah ? 'Halal Pension' : 'Retirement',
          isHighlight: true,
        },
        {
          key: 'maturity',
          label: 'Pension Eligibility Age',
          value: product.tenureMonths > 0 ? `${Math.round(product.tenureMonths / 12)} Yrs (Age 60)` : 'Age 60 Years',
          sub: 'Lifelong Pension Post-60',
          badge: 'Retirement Age',
        },
        {
          key: 'interval',
          label: 'Contribution Mode',
          value: product.payoutFrequency || 'Monthly Deposit',
          sub: 'Direct Bank / MFS Deposit',
          badge: 'Contribution',
        },
        {
          key: 'minimum',
          label: 'Monthly Contribution',
          value: `৳${product.minAmount.toLocaleString('en-IN')}/mo`,
          sub: isNational ? 'Govt Matched / Sec 44 Rebate' : 'Tax Rebate Under Sec 44',
          badge: 'Min Deposit',
        },
      ];
    }

    case 'FDR':
    default:
      return [
        {
          key: 'yield',
          label: isShariah ? 'Mudaraba Expected Yield' : 'Deposit Yield',
          value: `${product.interestRate}%`,
          sub: isShariah ? 'Weightage / PSR Basis' : 'Fixed Annual Rate',
          badge: isShariah ? 'Riba-Free' : 'Guaranteed',
          isHighlight: true,
        },
        {
          key: 'maturity',
          label: isShariah ? 'MTDR Lock-in Tenure' : 'Lock-in Tenure',
          value: product.tenureMonths >= 12 ? `${product.tenureMonths / 12} Year${product.tenureMonths > 12 ? 's' : ''}` : `${product.tenureMonths} Months`,
          sub: isShariah ? 'Fixed Term MTDR' : 'Fixed Term Deposit',
          badge: 'Maturity',
        },
        {
          key: 'interval',
          label: isShariah ? 'Profit Payout' : 'Payout Interval',
          value: product.payoutFrequency || 'At Maturity',
          sub: 'Direct Bank Transfer',
          badge: 'Frequency',
        },
        {
          key: 'minimum',
          label: isShariah ? 'Min MTDR Deposit' : 'Min Deposit',
          value: `৳${product.minAmount.toLocaleString('en-IN')}`,
          sub: isShariah ? 'Rab-ul-Mal Principal' : 'Lump-sum Principal',
          badge: 'Principal',
        },
      ];
  }
}

export const financialProducts: FinancialProduct[] = [
  {
    "id": "govt-paribar-5y",
    "bankName": "Government of Bangladesh",
    "productName": "Paribar Sanchaypatra",
    "type": "Sanchaypatra",
    "interestRate": 11.52,
    "tenureMonths": 60,
    "minAmount": 10000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bangladesh.gov.bd&sz=128",
    "safetyRating": "Safe",
    "isShariahCompliant": false,
    "taxApplicable": true,
    "earlyEncashmentPenalty": "2% principal",
    "payoutFrequency": "Monthly",
    "features": [
      "Highest government security",
      "Monthly profit credit to bank account",
      "Exclusively for women/senior citizens",
      "Nov 2026 automated tax withholding"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "govt-tin-mash-3y",
    "bankName": "Government of Bangladesh",
    "productName": "3-Month Profit Sanchaypatra",
    "type": "Sanchaypatra",
    "interestRate": 11.04,
    "tenureMonths": 36,
    "minAmount": 5000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bangladesh.gov.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Quarterly",
    "features": [
      "Quarterly profit disbursement",
      "Government sovereign guarantee",
      "Direct bank BEFTN/NPSB payout",
      "Nov 2026 e-KYC instant link"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "govt-pensioner-5y",
    "bankName": "Government of Bangladesh",
    "productName": "Pensioner Sanchaypatra",
    "type": "Sanchaypatra",
    "interestRate": 11.28,
    "tenureMonths": 60,
    "minAmount": 50000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bangladesh.gov.bd&sz=128",
    "safetyRating": "Safe",
    "taxApplicable": true,
    "earlyEncashmentPenalty": "1.5% principal",
    "payoutFrequency": "Quarterly",
    "lastUpdated": "November 2026",
    "features": [
      "For retired govt/defence/semi-govt officers",
      "Quarterly profit payout",
      "Highest sovereign security",
      "TIN linked automated tax rebate cert"
    ]
  },
  {
    "id": "govt-bangladesh-5y",
    "bankName": "Government of Bangladesh",
    "productName": "5-Year Bangladesh Sanchaypatra",
    "type": "Sanchaypatra",
    "interestRate": 11.76,
    "tenureMonths": 60,
    "minAmount": 10000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bangladesh.gov.bd&sz=128",
    "safetyRating": "Safe",
    "taxApplicable": true,
    "earlyEncashmentPenalty": "2% principal",
    "payoutFrequency": "At Maturity",
    "lastUpdated": "November 2026",
    "features": [
      "Highest yield among national savings instruments",
      "Full sovereign guarantee of Bangladesh",
      "Open to all adult citizens & recognized entities",
      "Compound profit reinvestment"
    ]
  },
  {
    "id": "dbbl-savings",
    "bankName": "Dutch-Bangla Bank",
    "productName": "Regular Savings",
    "type": "Savings",
    "interestRate": 5.75,
    "tenureMonths": 0,
    "minAmount": 500,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dbbl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Widest ATM network",
      "Mobile banking integration",
      "Safe & Reliable",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "dbbl-fdr-1y",
    "bankName": "Dutch-Bangla Bank",
    "productName": "FDR 1 Year",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dbbl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Instant loan facility",
      "Strong security",
      "Flexible tenure",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "scb-savings",
    "bankName": "Standard Chartered",
    "productName": "Hasaab Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sc.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "International standards",
      "Global banking",
      "Premium service",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "scb-fdr-1y",
    "bankName": "Standard Chartered",
    "productName": "Fixed Deposit",
    "type": "FDR",
    "interestRate": 9.75,
    "tenureMonths": 12,
    "minAmount": 100000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sc.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Highest credit rating",
      "Multi-currency support",
      "Priority banking",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "prime-savings",
    "bankName": "Prime Bank",
    "productName": "General Savings",
    "type": "Savings",
    "interestRate": 6.5,
    "tenureMonths": 0,
    "minAmount": 2000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=primebank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Online transactions",
      "Prime portal access",
      "Competitive rates",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "prime-fdr-1y",
    "bankName": "Prime Bank",
    "productName": "FDR Periodic Profit",
    "type": "FDR",
    "interestRate": 11,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=primebank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Monthly income",
      "Automated renewal",
      "Loan against FDR",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sonali-savings",
    "bankName": "Sonali Bank",
    "productName": "Savings Account",
    "type": "Savings",
    "interestRate": 5.5,
    "tenureMonths": 0,
    "minAmount": 500,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sonalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Government security",
      "Extensive reach",
      "Reliable service",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sonali-fdr-1y",
    "bankName": "Sonali Bank",
    "productName": "FDR 1 Year",
    "type": "FDR",
    "interestRate": 9.85,
    "tenureMonths": 12,
    "minAmount": 10000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sonalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Fully government backed",
      "Low risk",
      "Simple process",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ucb-savings",
    "bankName": "United Commercial Bank (UCB)",
    "productName": "UCB Savings Account",
    "type": "Savings",
    "interestRate": 6,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ucb.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "High tech banking",
      "Broad coverage",
      "Multiple bill pay options",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "pubali-fdr-1y",
    "bankName": "Pubali Bank",
    "productName": "Fixed Deposit Receipt",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pubalibangla.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Oldest private bank",
      "Reliable track record",
      "Personalized care",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-fdr-3m",
    "bankName": "BRAC Bank",
    "productName": "Short Term FDR (3M)",
    "type": "FDR",
    "interestRate": 9.5,
    "tenureMonths": 3,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Fast liquidity",
      "Digital opening",
      "Auto-renewal",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-fdr-6m",
    "bankName": "BRAC Bank",
    "productName": "Mid Term FDR (6M)",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 6,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Competitive rates",
      "Loan facility",
      "Secure returns",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-fdr-monthly",
    "bankName": "The City Bank",
    "productName": "Monthly Profit FDR",
    "type": "FDR",
    "interestRate": 10.75,
    "tenureMonths": 12,
    "minAmount": 100000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Monthly income",
      "Amex Platinum benefits",
      "Priority service",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-dps-3y",
    "bankName": "The City Bank",
    "productName": "City Excellence DPS",
    "type": "DPS",
    "interestRate": 9.75,
    "tenureMonths": 36,
    "minAmount": 2000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Flexible installments",
      "High yield",
      "Special rewards",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "dbbl-dps-5y",
    "bankName": "Dutch-Bangla Bank",
    "productName": "DBBL Millionaire Project",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 5000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dbbl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Wealth building",
      "Safe government-linked",
      "Automated collection",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "mtb-savings-premium",
    "bankName": "Mutual Trust Bank (MTB)",
    "productName": "MTB Inspire Savings",
    "type": "Savings",
    "interestRate": 7,
    "tenureMonths": 0,
    "minAmount": 10000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mutualtrustbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "High interest on low balance",
      "Insurance perks",
      "Free cheque book",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "idlc-dps-wealth",
    "bankName": "IDLC Finance",
    "productName": "Wealth Builder DPS",
    "type": "DPS",
    "interestRate": 10.75,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "NBFC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=idlc.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "At Maturity",
    "features": [
      "Compound returns",
      "NBFIs leader",
      "Tax efficient",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-dps-5y",
    "bankName": "BRAC Bank",
    "productName": "Probashi DPS",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 5000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Remittance focus",
      "High returns",
      "Tax benefits",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-savings",
    "bankName": "The City Bank",
    "productName": "City High Interest Savings",
    "type": "Savings",
    "interestRate": 7.25,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Daily interest",
      "Priority service",
      "American Express links",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "islami-savings",
    "bankName": "Islami Bank Bangladesh PLC",
    "productName": "Mudaraba Savings",
    "type": "Savings",
    "interestRate": 5.85,
    "tenureMonths": 0,
    "minAmount": 500,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=islamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "isShariahCompliant": true,
    "features": [
      "Shariah compliant",
      "Profit sharing",
      "Widest network",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "janata-savings",
    "bankName": "Janata Bank",
    "productName": "Regular Savings",
    "type": "Savings",
    "interestRate": 5.5,
    "tenureMonths": 0,
    "minAmount": 500,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=janatabank-bd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "State security",
      "Safe & Reliable",
      "Nationwide branches",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "agrani-savings",
    "bankName": "Agrani Bank",
    "productName": "Savings Account",
    "type": "Savings",
    "interestRate": 5.5,
    "tenureMonths": 0,
    "minAmount": 500,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=agranibank.org&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Government backing",
      "Secure investment",
      "Wide reach",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "rupali-savings",
    "bankName": "Rupali Bank",
    "productName": "Savings Prokolpo",
    "type": "Savings",
    "interestRate": 5.5,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=rupalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Safe assets",
      "Reliable service",
      "Public trust",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ab-savings",
    "bankName": "AB Bank",
    "productName": "Smart Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=abbl.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Flexible transactions",
      "High yield",
      "Stable bank",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "nbl-savings",
    "bankName": "National Bank Limited",
    "productName": "NBL Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 500,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Oldest private bank",
      "Reliable legacy",
      "Consistent profit",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "pubali-savings",
    "bankName": "Pubali Bank",
    "productName": "Savings Account",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pubalibangla.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Trustworthy history",
      "Largest private network",
      "Simple banking",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "uttara-savings",
    "bankName": "Uttara Bank",
    "productName": "Savings Prokolpo",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 500,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=uttarabank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Legacy of trust",
      "Accessible banking",
      "Safe and secure",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-savings",
    "bankName": "Eastern Bank (EBL)",
    "productName": "EBL Savings Account",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Modern tech",
      "Tiered interest",
      "Excellent digital app",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "southeast-savings",
    "bankName": "Southeast Bank",
    "productName": "Regular Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=southeastbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Strong financials",
      "Good service quality",
      "Reliable",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "dhaka-savings",
    "bankName": "Dhaka Bank",
    "productName": "Dhaka Bank Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dhakabankltd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Superior tech",
      "Personalized care",
      "Stable returns",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "alarafah-savings",
    "bankName": "Al-Arafah Islami Bank",
    "productName": "Mudaraba Savings",
    "type": "Savings",
    "interestRate": 5.85,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=al-arafahbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "isShariahCompliant": true,
    "features": [
      "Halal profit",
      "Growing shariah bank",
      "Secure",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sibl-savings",
    "bankName": "Social Islami Bank (SIBL)",
    "productName": "SIBL Savings Account",
    "type": "Savings",
    "interestRate": 5.85,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=siblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "isShariahCompliant": true,
    "features": [
      "Islamic values",
      "High profit sharing",
      "Branch banking",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "standard-bk-savings",
    "bankName": "Standard Bank",
    "productName": "SBL Savings",
    "type": "Savings",
    "interestRate": 5.85,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=standardbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Reliable management",
      "Secure growth",
      "Transparent",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "mercantile-savings",
    "bankName": "Mercantile Bank",
    "productName": "MBL Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Innovative tech",
      "Progressive banking",
      "Strong returns",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "jamuna-savings",
    "bankName": "Jamuna Bank",
    "productName": "Jamuna Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=jamunabankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Top priority service",
      "Secure returns",
      "Modern facilities",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shahjalal-savings",
    "bankName": "Shahjalal Islami Bank",
    "productName": "Mudaraba Savings",
    "type": "Savings",
    "interestRate": 5.85,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sjiblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "isShariahCompliant": true,
    "features": [
      "Transparent banking",
      "Ethics-based profit",
      "Growing network",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "trust-savings",
    "bankName": "Trust Bank",
    "productName": "Trust High Interest Savings",
    "type": "Savings",
    "interestRate": 6.85,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Maximum security",
      "Elite services",
      "Digital access",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "exim-savings",
    "bankName": "EXIM Bank",
    "productName": "Mudaraba Savings",
    "type": "Savings",
    "interestRate": 5.85,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=eximbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "isShariahCompliant": true,
    "features": [
      "Corporate grade security",
      "Global Islamic standards",
      "Reliable",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ific-savings",
    "bankName": "IFIC Bank",
    "productName": "IFIC Shohoj Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 100,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ificbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Lowest entry barrier",
      "One-stop service",
      "Large footprint",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "one-bank-savings",
    "bankName": "One Bank",
    "productName": "One Bank Savings Account",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=onebank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "User focused",
      "High profit potential",
      "Digitally enabled",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "premier-savings-acc",
    "bankName": "Premier Bank",
    "productName": "Premier Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=premierbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Service excellence",
      "Competitive rate",
      "Secure banking",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bankasia-savings",
    "bankName": "Bank Asia",
    "productName": "Consumer Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bankasia-bd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Smart banking",
      "Widespread access points",
      "Consistently safe",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "nrcb-savings",
    "bankName": "NRB Commercial Bank",
    "productName": "NRBC Regular Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nrbcbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Cutting edge tech",
      "Expat friendly",
      "High reliability",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sbac-savings",
    "bankName": "South Bangla Agriculture & Commerce (SBAC)",
    "productName": "SBAC Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sbacbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Focus on safe growth",
      "Reliable regional bank",
      "Secure",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shimanto-savings",
    "bankName": "Shimanto Bank",
    "productName": "Shimanto Regular Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=shimantobank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Strong BGB affiliation",
      "Highly secure",
      "Personal touch",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "modhumoti-savings",
    "bankName": "Modhumoti Bank",
    "productName": "Modhumoti High Yield Savings",
    "type": "Savings",
    "interestRate": 7,
    "tenureMonths": 0,
    "minAmount": 2000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=modhumotibank.net&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Premium interest",
      "Superior digital service",
      "Reliable",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "nrb-bk-savings",
    "bankName": "NRB Bank",
    "productName": "NRB General Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nrbbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "International quality service",
      "Secure & transparent",
      "Growth focus",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "global-islami-savings",
    "bankName": "Global Islami Bank",
    "productName": "Mudaraba Savings account",
    "type": "Savings",
    "interestRate": 5.85,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=globalislamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "isShariahCompliant": true,
    "features": [
      "Shariah based",
      "Community centric",
      "Profit sharing",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "union-bk-savings",
    "bankName": "Union Bank",
    "productName": "Mudaraba Regular Savings",
    "type": "Savings",
    "interestRate": 5.85,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=unionbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "isShariahCompliant": true,
    "features": [
      "Islamic values",
      "Secure profits",
      "Consistent performance",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "midland-savings",
    "bankName": "Midland Bank",
    "productName": "MDB e-Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 0,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=midlandbankbd.net&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Fully digital account",
      "Higher interest rate",
      "Zero initial deposit",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "meghna-savings",
    "bankName": "Meghna Bank",
    "productName": "Meghna Regular Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=meghnabank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Quality service",
      "Stable management",
      "Secure returns",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "community-savings",
    "bankName": "Community Bank Bangladesh",
    "productName": "Community Regular Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=communitybankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Highest safety standards",
      "Modern banking app",
      "Police welfare ties",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bengal-savings",
    "bankName": "Bengal Commercial Bank",
    "productName": "Bengal Regular Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bgcb.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Agile service",
      "Customer happiness focused",
      "Secure growth",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "citizens-savings",
    "bankName": "Citizens Bank",
    "productName": "Citizens Regular Savings",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=citizensbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Customer first approach",
      "Solid financials",
      "Stable history",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "padma-bk-savings",
    "bankName": "Padma Bank",
    "productName": "Padma High Interest Savings",
    "type": "Savings",
    "interestRate": 7.75,
    "tenureMonths": 0,
    "minAmount": 2000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=padmabankbd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Monthly",
    "features": [
      "Top-tier interest rate",
      "Flexible payout",
      "Priority service",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "icbislamic-savings",
    "bankName": "ICB Islamic Bank",
    "productName": "Mudaraba Savings",
    "type": "Savings",
    "interestRate": 5.85,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=icbislamic-bd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Half-Yearly",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "compoundFrequency": "Daily",
    "features": [
      "Islamic tradition",
      "Strong values",
      "Conservative profit",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "basic-savings",
    "bankName": "BASIC Bank",
    "productName": "Savings Account",
    "type": "Savings",
    "interestRate": 5.5,
    "tenureMonths": 0,
    "minAmount": 500,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=basicbanklimited.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Public sector trust",
      "Government backed",
      "Industrial focused",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bdbl-savings-acc",
    "bankName": "Bangladesh Development Bank (BDBL)",
    "productName": "BDBL Regular Savings",
    "type": "Savings",
    "interestRate": 5.5,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bdbl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Half-Yearly",
    "features": [
      "Development focus",
      "Safe government bank",
      "Reliable",
      "Nov 2026 verified profit rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "mtb-dps-5y",
    "bankName": "Mutual Trust Bank (MTB)",
    "productName": "MTB Ruby",
    "type": "DPS",
    "interestRate": 10,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mutualtrustbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Monthly savings",
      "Insurance coverage incl.",
      "Automatic transfers",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "islami-dps-5y",
    "bankName": "Islami Bank Bangladesh PLC",
    "productName": "Mudaraba Savings (MPS)",
    "type": "DPS",
    "interestRate": 10.15,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=islamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Shariah compliant",
      "Profit-loss sharing",
      "Widespread branch network",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sonali-dps-5y",
    "bankName": "Sonali Bank",
    "productName": "Education Deposit Scheme",
    "type": "DPS",
    "interestRate": 9.6,
    "tenureMonths": 60,
    "minAmount": 500,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sonalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Government backed",
      "Low entry point",
      "Student focused",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "janata-dps-5y",
    "bankName": "Janata Bank",
    "productName": "Janata DPS",
    "type": "DPS",
    "interestRate": 9.6,
    "tenureMonths": 60,
    "minAmount": 500,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=janatabank-bd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "High security",
      "Nationwide coverage",
      "Easy terms",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "agrani-dps-5y",
    "bankName": "Agrani Bank",
    "productName": "Agrani Sanchay Scheme",
    "type": "DPS",
    "interestRate": 9.6,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=agranibank.org&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Public sector trust",
      "Flexible installments",
      "High yield",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "rupali-dps-5y",
    "bankName": "Rupali Bank",
    "productName": "Rupali Deposit Pillar",
    "type": "DPS",
    "interestRate": 9.6,
    "tenureMonths": 60,
    "minAmount": 500,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=rupalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Secure savings",
      "Easy withdrawal rules",
      "Reliable",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ab-dps-5y",
    "bankName": "AB Bank",
    "productName": "AB Monthly Savings",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=abbl.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Competitive interest",
      "Pioneer private bank",
      "Loan against deposit",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "nbl-dps-5y",
    "bankName": "National Bank Limited",
    "productName": "NBL Monthly Deposit",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 500,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Established heritage",
      "Broad service base",
      "High returns",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ucb-dps-5y",
    "bankName": "United Commercial Bank (UCB)",
    "productName": "UCB Eponjori DPS",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ucb.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Digital management",
      "High yield",
      "Multi-payment channels",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "pubali-dps-5y",
    "bankName": "Pubali Bank",
    "productName": "Pubali Sanchay Prokolpo",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pubalibangla.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Vast network",
      "Trusted legacy",
      "Personalized service",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "uttara-dps-5y",
    "bankName": "Uttara Bank",
    "productName": "Uttara Monthly Scheme",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 500,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=uttarabank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Safety and growth",
      "Simple account opening",
      "Flexible",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-dps-5y",
    "bankName": "Eastern Bank (EBL)",
    "productName": "EBL Millionaire Scheme",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 2000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Modern banking",
      "Goal-based savings",
      "Priority service",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "southeast-dps-5y",
    "bankName": "Southeast Bank",
    "productName": "SEBL Millionaire Scheme",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 2000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=southeastbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "High returns",
      "Convenient banking",
      "Strong financials",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "dhaka-dps-5y",
    "bankName": "Dhaka Bank",
    "productName": "Dhaka Bank Excel DPS",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dhakabankltd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Flexible installments",
      "Insurance coverage",
      "Digital tracking",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "alarafah-dps-5y",
    "bankName": "Al-Arafah Islami Bank",
    "productName": "Mudaraba Term Deposit",
    "type": "DPS",
    "interestRate": 10.1,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=al-arafahbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Shariah compliant",
      "Halal profit",
      "Growing bank",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sibl-dps-5y",
    "bankName": "Social Islami Bank (SIBL)",
    "productName": "SIBL Millionaire Scheme",
    "type": "DPS",
    "interestRate": 10.1,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=siblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Islamic values",
      "High returns",
      "Community focused",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "standard-dps-5y",
    "bankName": "Standard Bank",
    "productName": "SBL Crorepoty Scheme",
    "type": "DPS",
    "interestRate": 10.1,
    "tenureMonths": 60,
    "minAmount": 5000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=standardbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Wealth creation",
      "Secure management",
      "High dividends",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "mercantile-dps-5y",
    "bankName": "Mercantile Bank",
    "productName": "MBL Sanchay Dhan",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Progressive banking",
      "Stable returns",
      "Efficiency",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "jamuna-dps-5y",
    "bankName": "Jamuna Bank",
    "productName": "Jamuna Lakhpoti Scheme",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=jamunabankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Exceptional rates",
      "Customer first",
      "Secure",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shahjalal-dps-5y",
    "bankName": "Shahjalal Islami Bank",
    "productName": "Mudaraba Deposit Scheme",
    "type": "DPS",
    "interestRate": 10.1,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sjiblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Ethical banking",
      "Transparent profit",
      "Strong growth",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "trust-dps-5y",
    "bankName": "Trust Bank",
    "productName": "Trust Sanchay Prokolpo",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Reliable management",
      "Defense personnel links",
      "High safety",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "exim-dps-5y",
    "bankName": "EXIM Bank",
    "productName": "EXIM Millionaire Scheme",
    "type": "DPS",
    "interestRate": 10.1,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=eximbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Export-import focus",
      "Islamic banking",
      "Consistent returns",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ific-dps-5y",
    "bankName": "IFIC Bank",
    "productName": "IFIC Shohoj DPS",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 500,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ificbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Easy installments",
      "Online banking",
      "Stable history",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "one-bank-dps-5y",
    "bankName": "One Bank",
    "productName": "One Bank Millionaire",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1500,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=onebank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Smart banking",
      "High interest rates",
      "Responsive service",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "premier-dps-5y",
    "bankName": "Premier Bank",
    "productName": "Premier Millionaire",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=premierbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Service first",
      "Consistent performance",
      "Secure returns",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bankasia-dps-5y",
    "bankName": "Bank Asia",
    "productName": "Bank Asia DPS",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bankasia-bd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Agent banking leader",
      "Digitally advanced",
      "High reliability",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "nrcb-dps-5y",
    "bankName": "NRB Commercial Bank",
    "productName": "NRBC Millionaire",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nrbcbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Modern services",
      "Tech-driven banking",
      "Consistent growth",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sbac-dps-5y",
    "bankName": "South Bangla Agriculture & Commerce (SBAC)",
    "productName": "SBAC DPS",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sbacbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Agricultural focus",
      "Regional strength",
      "Secure",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shimanto-dps-5y",
    "bankName": "Shimanto Bank",
    "productName": "Shimanto Sanchay",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=shimantobank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "BGB priority",
      "Safe and reliable",
      "Easy accessibility",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "modhumoti-dps-5y",
    "bankName": "Modhumoti Bank",
    "productName": "Modhumoti DPS",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=modhumotibank.net&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Fourth generation bank",
      "Efficient service",
      "Good returns",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "nrb-dps-5y",
    "bankName": "NRB Bank",
    "productName": "NRB Savings Scheme",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nrbbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Remittance centric",
      "Global and local link",
      "Secure",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "global-islami-dps-5y",
    "bankName": "Global Islami Bank",
    "productName": "GIB Mudaraba Scheme",
    "type": "DPS",
    "interestRate": 10.1,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=globalislamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Islamic banking",
      "Profit sharing",
      "Fair returns",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "union-dps-5y",
    "bankName": "Union Bank",
    "productName": "Union Bank DPS",
    "type": "DPS",
    "interestRate": 10.1,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=unionbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Community focus",
      "Islamic shariah",
      "Growing presence",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "midland-dps-5y",
    "bankName": "Midland Bank",
    "productName": "Midland Target Savings",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=midlandbankbd.net&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "User friendly digital banking",
      "Stable management",
      "Competitive rates",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "meghna-dps-5y",
    "bankName": "Meghna Bank",
    "productName": "Meghna Wealth Builder",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=meghnabank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Innovative products",
      "Quality service",
      "Secure investment",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "community-dps-5y",
    "bankName": "Community Bank Bangladesh",
    "productName": "Community Sanchay",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=communitybankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Police welfare link",
      "High safety",
      "Modern technology",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bengal-dps-5y",
    "bankName": "Bengal Commercial Bank",
    "productName": "Bengal Prosperity DPS",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bgcb.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "New generation bank",
      "Efficient customer care",
      "Flexible",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "citizens-dps-5y",
    "bankName": "Citizens Bank",
    "productName": "Citizens Target Savings",
    "type": "DPS",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=citizensbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Customer centric",
      "Strong management",
      "Secure returns",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "padma-dps-5y",
    "bankName": "Padma Bank",
    "productName": "Padma Projonmo DPS",
    "type": "DPS",
    "interestRate": 10.75,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=padmabankbd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "At Maturity",
    "features": [
      "Competitive interest",
      "Easy opening",
      "Flexible installments",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "icbislamic-dps-5y",
    "bankName": "ICB Islamic Bank",
    "productName": "Mudaraba Savings",
    "type": "DPS",
    "interestRate": 10.1,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=icbislamic-bd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Shariah compliant",
      "Long history",
      "Pure Islamic banking",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "basic-dps-5y",
    "bankName": "BASIC Bank",
    "productName": "BASIC Small Savings",
    "type": "DPS",
    "interestRate": 9.6,
    "tenureMonths": 60,
    "minAmount": 500,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=basicbanklimited.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Industrial focus",
      "Government backing",
      "Stable returns",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bdbl-dps-5y",
    "bankName": "Bangladesh Development Bank (BDBL)",
    "productName": "BDBL Sanchay",
    "type": "DPS",
    "interestRate": 9.6,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bdbl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Development focus",
      "Safe government bank",
      "Reliable",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-fdr-1y",
    "bankName": "Eastern Bank (EBL)",
    "productName": "EBL Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Established reputation",
      "Skybanking app",
      "High credit rating",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "islami-fdr-1y",
    "bankName": "Islami Bank Bangladesh PLC",
    "productName": "Mudaraba Term Deposit (MTDR)",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 10000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=islamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Shariah compliant",
      "Profit sharing",
      "Highest branch network",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "janata-fdr-1y",
    "bankName": "Janata Bank",
    "productName": "Fixed Deposit Receipt",
    "type": "FDR",
    "interestRate": 9.75,
    "tenureMonths": 12,
    "minAmount": 5000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=janatabank-bd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "State-owned security",
      "Low risk",
      "Simple documentation",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "agrani-fdr-1y",
    "bankName": "Agrani Bank",
    "productName": "FDR 12 Months",
    "type": "FDR",
    "interestRate": 9.75,
    "tenureMonths": 12,
    "minAmount": 10000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=agranibank.org&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Government guarantee",
      "Online banking",
      "High trust",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "rupali-fdr-1y",
    "bankName": "Rupali Bank",
    "productName": "Fixed Deposit",
    "type": "FDR",
    "interestRate": 9.75,
    "tenureMonths": 12,
    "minAmount": 10000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=rupalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Safe investment",
      "Easy encashment",
      "Reliable",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ab-fdr-1y",
    "bankName": "AB Bank",
    "productName": "Fixed Deposit (12M)",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=abbl.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Competitive returns",
      "Flexible options",
      "Loan facility",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "nbl-fdr-1y",
    "bankName": "National Bank Limited",
    "productName": "NBL Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 25000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Stable history",
      "Wide coverage",
      "Good yield",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "southeast-fdr-1y",
    "bankName": "Southeast Bank",
    "productName": "Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=southeastbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "High interest",
      "Strong fundamentals",
      "Instant loan",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "dhaka-fdr-1y",
    "bankName": "Dhaka Bank",
    "productName": "FDR Daily Profit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 100000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dhakabankltd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Flexible payout",
      "Digital banking",
      "Trusted brand",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "alarafah-fdr-1y",
    "bankName": "Al-Arafah Islami Bank",
    "productName": "MTDR (1 Year)",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 20000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=al-arafahbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Islamic profit",
      "Shariah board audited",
      "Secure",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sibl-fdr-1y",
    "bankName": "Social Islami Bank (SIBL)",
    "productName": "Sanchayee FDR",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=siblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "High profit rate",
      "Community service",
      "Islamic banking",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "standard-fdr-1y",
    "bankName": "Standard Bank",
    "productName": "SBL Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=standardbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Stable returns",
      "Professional management",
      "Customer care",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "mercantile-fdr-1y",
    "bankName": "Mercantile Bank",
    "productName": "MBL Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Reliable service",
      "Progressive tech",
      "Secure returns",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "jamuna-fdr-1y",
    "bankName": "Jamuna Bank",
    "productName": "Jamuna Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=jamunabankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Top-tier interest",
      "Fast processing",
      "Customer happiness",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shahjalal-fdr-1y",
    "bankName": "Shahjalal Islami Bank",
    "productName": "MTDR 1 Year",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sjiblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Ethics based",
      "Transparent profit",
      "Strong growth",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "trust-fdr-1y",
    "bankName": "Trust Bank",
    "productName": "Trust Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "High safety",
      "Defense personnel choice",
      "Standard service",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "exim-fdr-1y",
    "bankName": "EXIM Bank",
    "productName": "EXIM Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=eximbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Islamic banking",
      "Corporate favorite",
      "Global reach",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ific-fdr-1y",
    "bankName": "IFIC Bank",
    "productName": "FDR 1 Year",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ificbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Strong legacy",
      "Digital onboarding",
      "Easy management",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "one-bank-fdr-1y",
    "bankName": "One Bank",
    "productName": "OBL Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=onebank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Premium rates",
      "Smart banking",
      "Secure",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "premier-fdr-1y",
    "bankName": "Premier Bank",
    "productName": "Fixed Deposit (12M)",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=premierbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Service excellence",
      "Competitive yield",
      "Automated renewal",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bankasia-fdr-1y",
    "bankName": "Bank Asia",
    "productName": "FDR 1 Year",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bankasia-bd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Innovative banking",
      "Widespread access",
      "Reliable",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "nrcb-fdr-1y",
    "bankName": "NRB Commercial Bank",
    "productName": "NRBC Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nrbcbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Modern tech",
      "Expat friendly",
      "High returns",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sbac-fdr-1y",
    "bankName": "South Bangla Agriculture & Commerce (SBAC)",
    "productName": "SBAC FDR",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sbacbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Development focus",
      "Strong liquidity",
      "Secure",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shimanto-fdr-1y",
    "bankName": "Shimanto Bank",
    "productName": "FDR 1 Year",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=shimantobank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "BGB link",
      "Top safety",
      "Efficient service",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "modhumoti-fdr-1y",
    "bankName": "Modhumoti Bank",
    "productName": "Modhumoti Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=modhumotibank.net&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Exceptional yield",
      "Modern banking",
      "Fast processing",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "nrb-fdr-1y",
    "bankName": "NRB Bank",
    "productName": "NRB Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nrbbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Global network",
      "Secure investment",
      "Competitive",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "global-islami-fdr-1y",
    "bankName": "Global Islami Bank",
    "productName": "GIB MTDR",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=globalislamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Islamic principles",
      "Profit sharing",
      "Fair returns",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "union-fdr-1y",
    "bankName": "Union Bank",
    "productName": "Union Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=unionbank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Islamic values",
      "Secure and growing",
      "Reliable",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "midland-fdr-1y",
    "bankName": "Midland Bank",
    "productName": "Midland Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=midlandbankbd.net&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Leading digital bank",
      "High yield",
      "User friendly",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "meghna-fdr-1y",
    "bankName": "Meghna Bank",
    "productName": "Meghna FDR",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=meghnabank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Stable management",
      "Quality service",
      "Secure",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "community-fdr-1y",
    "bankName": "Community Bank Bangladesh",
    "productName": "Community Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=communitybankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Trust of Forces",
      "Modern technology",
      "Excellent support",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bengal-fdr-1y",
    "bankName": "Bengal Commercial Bank",
    "productName": "Bengal Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bgcb.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Innovation driven",
      "Agile banking",
      "High returns",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "citizens-fdr-1y",
    "bankName": "Citizens Bank",
    "productName": "Citizens Fixed Deposit",
    "type": "FDR",
    "interestRate": 10.5,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=citizensbankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Customer focused",
      "Secure growth",
      "Reliable",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "padma-fdr-1y",
    "bankName": "Padma Bank",
    "productName": "Padma Fixed Deposit",
    "type": "FDR",
    "interestRate": 11.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=padmabankbd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "At Maturity",
    "features": [
      "Top-tier interest",
      "Easy renewal",
      "Flexible tenure",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "icbislamic-fdr-1y",
    "bankName": "ICB Islamic Bank",
    "productName": "Mudaraba Term Deposit",
    "type": "FDR",
    "interestRate": 10.25,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=icbislamic-bd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "Shariah compliant",
      "Transparent profit sharing",
      "Islamic",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "basic-fdr-1y",
    "bankName": "BASIC Bank",
    "productName": "Fixed Deposit (1Y)",
    "type": "FDR",
    "interestRate": 9.75,
    "tenureMonths": 12,
    "minAmount": 25000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=basicbanklimited.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Industrial backing",
      "Government owned",
      "Secure",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bdbl-fdr-1y",
    "bankName": "Bangladesh Development Bank (BDBL)",
    "productName": "BDBL Fixed Deposit",
    "type": "FDR",
    "interestRate": 9.75,
    "tenureMonths": 12,
    "minAmount": 10000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bdbl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Safe development bank",
      "Low risk",
      "Reliable history",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "idlc-term-1y",
    "bankName": "IDLC Finance",
    "productName": "Term Deposit",
    "type": "FDR",
    "interestRate": 11.5,
    "tenureMonths": 12,
    "minAmount": 25000,
    "category": "NBFC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=idlc.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Quarterly",
    "features": [
      "Institutional strength",
      "Flexible payouts",
      "No hidden charges",
      "Nov 2026 rate revision (10% repo regime)"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ipdc-dps-3y",
    "bankName": "IPDC Finance",
    "productName": "DPS Millennium",
    "type": "DPS",
    "interestRate": 10.75,
    "tenureMonths": 36,
    "minAmount": 500,
    "category": "NBFC",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ipdcbd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "At Maturity",
    "features": [
      "Long history",
      "Personalized service",
      "Easy maturity",
      "Nov 2026 auto-debit & e-KYC linked"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "metlife-alico-1",
    "bankName": "MetLife Bangladesh",
    "productName": "Wealth Management Plan",
    "type": "Insurance",
    "interestRate": 8.25,
    "tenureMonths": 120,
    "minAmount": 2000,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=metlife.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "coverageAmount": "৳25L Life + Bonus",
    "benefitType": "Life & Wealth",
    "features": [
      "Global backing with 150+ years heritage",
      "Dual benefits: life coverage + wealth growth",
      "Tax efficient under Income Tax Act Sec 44",
      "Nov 2026 updated benefit schedule"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "metlife-health-1",
    "bankName": "MetLife Bangladesh",
    "productName": "Health Care Plus",
    "type": "Insurance",
    "interestRate": 0,
    "tenureMonths": 12,
    "minAmount": 5000,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=metlife.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Claim Basis",
    "coverageAmount": "৳10L Health Shield",
    "benefitType": "Comprehensive Health",
    "features": [
      "Cashless treatment at 500+ top hospitals",
      "Critical illness coverage up to 32 conditions",
      "Worldwide emergency hospitalization support",
      "Nov 2026 updated benefit schedule"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "delta-health-1",
    "bankName": "Delta Life Insurance",
    "productName": "Hospital Care Plan",
    "type": "Insurance",
    "interestRate": 0,
    "tenureMonths": 12,
    "minAmount": 3000,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=deltalife.org&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Reimbursement",
    "coverageAmount": "৳5L Hospital Cover",
    "benefitType": "Hospital Care",
    "features": [
      "Low starting annual premium",
      "Accidental surgery & emergency room coverage",
      "Maternity and post-hospitalization benefits",
      "Nov 2026 updated benefit schedule"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "green-delta-digital",
    "bankName": "Green Delta Insurance",
    "productName": "Digital Health Shield",
    "type": "Insurance",
    "interestRate": 0,
    "tenureMonths": 1,
    "minAmount": 500,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=gdicbd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Instant Claim",
    "coverageAmount": "৳2L Digital Cover",
    "benefitType": "OPD & Telemedicine",
    "features": [
      "Monthly micro-subscription from ৳500",
      "OPD specialist doctor consult reimbursements",
      "24/7 dedicated telemedicine video helpline",
      "Nov 2026 updated benefit schedule"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "jiban-bima-pension",
    "bankName": "Jiban Bima Corporation",
    "productName": "Jeevan Bima Pension & Endowment",
    "type": "Insurance",
    "interestRate": 8.5,
    "tenureMonths": 180,
    "minAmount": 1500,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=jbc.gov.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "coverageAmount": "৳20L Sovereign Cover",
    "benefitType": "Govt Pension & Life",
    "features": [
      "100% Sovereign Government of Bangladesh backing",
      "Guaranteed lifetime annuity pension upon maturity",
      "Reversionary bonus and full life coverage",
      "Nov 2026 verified state insurer scheme"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "pragati-islami-takaful",
    "bankName": "Pragati Life Insurance",
    "productName": "Pragati Islami Takaful DPS Plan",
    "type": "Insurance",
    "interestRate": 8.0,
    "tenureMonths": 120,
    "minAmount": 2000,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pragatilife.com&sz=128",
    "safetyRating": "Safe",
    "isShariahCompliant": true,
    "payoutFrequency": "At Maturity",
    "coverageAmount": "৳15L Takaful Shield",
    "benefitType": "Halal Takaful",
    "features": [
      "100% Shariah Compliant Mudaraba model",
      "Surplus profit distribution to policyholders",
      "Full family financial protection upon unforeseen events",
      "Nov 2026 verified Shariah board certified"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "guardian-easylife-shield",
    "bankName": "Guardian Life Insurance",
    "productName": "EasyLife Term & Critical Care",
    "type": "Insurance",
    "interestRate": 0,
    "tenureMonths": 12,
    "minAmount": 1800,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=guardianlife.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Claim Basis",
    "coverageAmount": "৳30L Life + Health",
    "benefitType": "Digital Term Life",
    "features": [
      "Instant 10-minute digital policy issuance via e-KYC",
      "High sum assured life cover up to ৳30,00,000",
      "Dedicated fast-track claim settlement within 5 days",
      "Nov 2026 updated benefit schedule"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "idlc-am-aml-1",
    "bankName": "IDLC Asset Management",
    "productName": "IDLC AML Income Fund",
    "type": "Mutual Fund",
    "interestRate": 10.2,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=idlc.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Annually",
    "features": [
      "Managed by experts",
      "High dividend history",
      "Easy encashment",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "idlc-am-balanced",
    "bankName": "IDLC Asset Management",
    "productName": "IDLC Balanced Fund",
    "type": "Mutual Fund",
    "interestRate": 11.2,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=idlc.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Annually",
    "features": [
      "Equity & Debt mix",
      "Stable growth",
      "Professional management",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "idlc-am-growth",
    "bankName": "IDLC Asset Management",
    "productName": "IDLC Growth Fund",
    "type": "Mutual Fund",
    "interestRate": 13.5,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=idlc.com&sz=128",
    "safetyRating": "Risky",
    "payoutFrequency": "Annually",
    "features": [
      "Capital appreciation",
      "Equity focused",
      "Long term wealth",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "idlc-am-monthly",
    "bankName": "IDLC Asset Management",
    "productName": "IDLC Monthly Income Fund",
    "type": "Mutual Fund",
    "interestRate": 8.75,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=idlc.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Stable monthly cash",
      "Low risk profile",
      "Automated payout",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shanta-am-1",
    "bankName": "Shanta Asset Management",
    "productName": "Shanta Amanah Fund",
    "type": "Mutual Fund",
    "interestRate": 8.5,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=shanta-aml.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Quarterly",
    "features": [
      "Shariah compliant",
      "Transparent reporting",
      "Growing AUM",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shanta-equity-unit",
    "bankName": "Shanta Asset Management",
    "productName": "Shanta Equity Unit Fund",
    "type": "Mutual Fund",
    "interestRate": 12.5,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=shanta-aml.com&sz=128",
    "safetyRating": "Risky",
    "payoutFrequency": "Annually",
    "features": [
      "Stock market exposure",
      "Active management",
      "High return potential",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shanta-fixed-income",
    "bankName": "Shanta Asset Management",
    "productName": "Shanta Fixed Income Fund",
    "type": "Mutual Fund",
    "interestRate": 9.2,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=shanta-aml.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "features": [
      "Low volatility",
      "Regular income",
      "Bond & Cash focus",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "shanta-conservative",
    "bankName": "Shanta Asset Management",
    "productName": "Shanta Conservative Fund",
    "type": "Mutual Fund",
    "interestRate": 7.8,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=shanta-aml.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Annually",
    "features": [
      "Capital protection",
      "Short term debt",
      "Highly liquid",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "capm-am-1",
    "bankName": "CAPM Advisory",
    "productName": "CAPM Unit Fund",
    "type": "Mutual Fund",
    "interestRate": 10.2,
    "tenureMonths": 0,
    "minAmount": 1000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=capm-bd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Quarterly",
    "features": [
      "Dynamic allocation",
      "Capital gain focus",
      "Quarterly dividends",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "capm-am-ibf",
    "bankName": "CAPM Advisory",
    "productName": "CAPM IBBL Islamic Fund",
    "type": "Mutual Fund",
    "interestRate": 8.8,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=capm-bd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Annually",
    "isShariahCompliant": true,
    "features": [
      "Shariah compliant",
      "Partnership with IBBL",
      "Tax efficient",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "vipb-se-1",
    "bankName": "VIPB Asset Management",
    "productName": "VIPB SEBL 1st Unit Fund",
    "type": "Mutual Fund",
    "interestRate": 11.8,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=vipbamcl.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Annually",
    "features": [
      "High alpha potential",
      "Diversified portfolio",
      "Quarterly updates",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "vipb-nbl-1",
    "bankName": "VIPB Asset Management",
    "productName": "NBL 1st Mutual Fund",
    "type": "Mutual Fund",
    "interestRate": 10.9,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=vipbamcl.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Annually",
    "features": [
      "Trustee: ICB",
      "Long term growth",
      "Regular audits",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "edge-am-1",
    "bankName": "EDGE Asset Management",
    "productName": "EDGE High Quality Equity Fund",
    "type": "Mutual Fund",
    "interestRate": 12.6,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=edgeamcl.com&sz=128",
    "safetyRating": "Risky",
    "payoutFrequency": "Annually",
    "features": [
      "Growth focused",
      "Performance driven",
      "Professional research",
      "Nov 2026 audited dividend yield"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-exclusive-kotipoti",
    "bankName": "Eastern Bank (EBL)",
    "productName": "EBL Exclusive Kotipoti Scheme",
    "type": "Exclusive",
    "interestRate": 10.5,
    "tenureMonths": 120,
    "minAmount": 5000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Become a kotipoti (10M BDT) in structured tenure",
      "Flexible monthly installments",
      "Loan facility up to 90%",
      "Highly attractive interest yields",
      "Nov 2026 revised yield structure"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "dbbl-exclusive-millionaire",
    "bankName": "Dutch-Bangla Bank",
    "productName": "DBBL VIP Millionaire Scheme",
    "type": "Exclusive",
    "interestRate": 10.25,
    "tenureMonths": 60,
    "minAmount": 10000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dbbl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Guaranteed millionaire status",
      "Auto-debit from existing DBBL accounts",
      "Highest level of security & convenience",
      "Nov 2026 revised yield structure"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-exclusive-kotipoti",
    "bankName": "The City Bank",
    "productName": "City Kotipoti Prokolpo",
    "type": "Exclusive",
    "interestRate": 10.75,
    "tenureMonths": 84,
    "minAmount": 4000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Premium returns for large net-worth goals",
      "AMEX Credit Card privilege links",
      "Dedicated priority manager",
      "Nov 2026 revised yield structure"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sonali-exclusive-marriage",
    "bankName": "Sonali Bank",
    "productName": "Sonali Marriage Deposit Scheme",
    "type": "Exclusive",
    "interestRate": 9.95,
    "tenureMonths": 120,
    "minAmount": 1000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sonalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Perfect long-term savings for family milestones",
      "Government-backed absolute security",
      "Extremely low initial minimum deposit",
      "Nov 2026 revised yield structure"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "islami-exclusive-millionaire",
    "bankName": "Islami Bank Bangladesh PLC",
    "productName": "Mudaraba Millionaire Scheme",
    "type": "Exclusive",
    "interestRate": 10.5,
    "tenureMonths": 60,
    "minAmount": 8500,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=islamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "features": [
      "100% Shariah-compliant high yield structure",
      "Ideal for ethical household asset building",
      "Highest profit sharing ratio among Islami banks",
      "Nov 2026 revised yield structure"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "prime-exclusive-double",
    "bankName": "Prime Bank",
    "productName": "Prime Double Benefit Deposit Scheme",
    "type": "Exclusive",
    "interestRate": 10.8,
    "tenureMonths": 72,
    "minAmount": 50000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=primebank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Double your principal investment in just 6 years",
      "Loan facility up to 90% against your deposit",
      "Automatic renewal option on maturity",
      "Nov 2026 revised yield structure"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-exclusive-golden",
    "bankName": "BRAC Bank",
    "productName": "Probashi Golden Scheme",
    "type": "Exclusive",
    "interestRate": 10.5,
    "tenureMonths": 60,
    "minAmount": 5000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Premium interest rates specifically for NRBs / Expats",
      "Direct dual currency conversion options",
      "Dedicated expat support helpline",
      "Nov 2026 revised yield structure"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "mtb-exclusive-double",
    "bankName": "Mutual Trust Bank (MTB)",
    "productName": "MTB Double Return Deposit",
    "type": "Exclusive",
    "interestRate": 10.9,
    "tenureMonths": 72,
    "minAmount": 100000,
    "category": "Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mutualtrustbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "features": [
      "Doubling of accumulated funds on maturity",
      "Complimentary life insurance coverage included",
      "Flexible pre-encashment guidelines",
      "Nov 2026 revised yield structure"
    ],
    "lastUpdated": "November 2026"
  },

  {
    "id": "city-islamic-savings",
    "bankName": "City Bank (City Islamic)",
    "productName": "Manarah Islamic Savings Account",
    "type": "Savings",
    "interestRate": 7.00,
    "tenureMonths": 0,
    "minAmount": 2500,
    "category": "Islamic Window",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "isShariahCompliant": true,
    "compoundFrequency": "Daily",
    "taxApplicable": true,
    "features": [
      "100% Shariah compliant Mudaraba daily balance profit",
      "Citytouch digital banking with Islamic Qibla & Zakat tools",
      "Free Islamic debit card with merchant discounts",
      "CSBIB & AAOIFI Shariah standards certified"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-islamic-dps",
    "bankName": "City Bank (City Islamic)",
    "productName": "Manarah Islamic DPS",
    "type": "DPS",
    "interestRate": 11.25,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Islamic Window",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "features": [
      "Market-leading Islamic DPS provisional profit rate",
      "Flexible monthly installments from ৳1,000 to ৳1,00,000",
      "Auto-debit from Manarah Savings with zero hassle",
      "Eligible for 90% Quard-e-Hasana facility"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-islamic-mtdr",
    "bankName": "City Bank (City Islamic)",
    "productName": "Manarah Mudaraba Term Deposit (1 Year)",
    "type": "FDR",
    "interestRate": 11.50,
    "tenureMonths": 12,
    "minAmount": 50000,
    "category": "Islamic Window",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "features": [
      "High Mudaraba weightage factor with locked-in profit share",
      "Monthly or maturity profit withdrawal flexibility",
      "Separate Shariah fund pool audited by scholars",
      "Nov 2026 verified top Islamic FDR rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "scb-saadiq-savings",
    "bankName": "Standard Chartered (Saadiq)",
    "productName": "Saadiq Islamic Savings Account",
    "type": "Savings",
    "interestRate": 6.25,
    "tenureMonths": 0,
    "minAmount": 25000,
    "category": "Foreign Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sc.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "isShariahCompliant": true,
    "compoundFrequency": "Daily",
    "taxApplicable": true,
    "features": [
      "Global Islamic banking expertise with AAOIFI standards",
      "International Islamic debit card with airport lounge access",
      "Segregated Halal treasury pool with zero Riba",
      "Seamless SC Mobile banking with biometric security"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "scb-saadiq-term",
    "bankName": "Standard Chartered (Saadiq)",
    "productName": "Saadiq Mudaraba Term Deposit (1 Year)",
    "type": "FDR",
    "interestRate": 10.50,
    "tenureMonths": 12,
    "minAmount": 100000,
    "category": "Foreign Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sc.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "features": [
      "Highest credit safety rating (AAA) in Bangladesh",
      "Mudaraba profit sharing based on verified weightage",
      "Flexible 3, 6, and 12-month tenures",
      "World-class Islamic wealth advisory"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-najiyah-savings",
    "bankName": "BRAC Bank (Najiyah)",
    "productName": "Najiyah Islamic Savings Account",
    "type": "Savings",
    "interestRate": 6.80,
    "tenureMonths": 0,
    "minAmount": 2000,
    "category": "Islamic Window",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "features": [
      "Dedicated Islamic banking window of BRAC Bank",
      "Astha App full Islamic suite with daily profit tracker",
      "Independent Shariah Supervisory Board certified",
      "Unrestricted 100% on-demand liquidity"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-najiyah-dps",
    "bankName": "BRAC Bank (Najiyah)",
    "productName": "Najiyah Islamic DPS",
    "type": "DPS",
    "interestRate": 11.15,
    "tenureMonths": 60,
    "minAmount": 1000,
    "category": "Islamic Window",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "features": [
      "Disciplined monthly Halal wealth building",
      "Tenure options from 1 to 10 years",
      "Instant paperless opening via Astha App",
      "Profit compounded in line with Shariah principles"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ibbl-mohor-dps",
    "bankName": "Islami Bank Bangladesh PLC",
    "productName": "Mudaraba Mohor Savings Scheme",
    "type": "DPS",
    "interestRate": 11.00,
    "tenureMonths": 60,
    "minAmount": 500,
    "category": "Islamic Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=islamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "schemeTarget": "Dower Fulfillment",
    "features": [
      "Pioneering scheme specifically designed for fulfilling bride's Mohor",
      "Affordable monthly installments starting from only ৳500",
      "High Mudaraba profit sharing ratio (PSR)",
      "Official certificate of Mohor fulfillment provided upon completion"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ibbl-hajj-savings",
    "bankName": "Islami Bank Bangladesh PLC",
    "productName": "Mudaraba Hajj Savings Account",
    "type": "DPS",
    "interestRate": 10.50,
    "tenureMonths": 36,
    "minAmount": 2000,
    "category": "Islamic Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=islamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "schemeTarget": "Holy Hajj Pilgrimage",
    "features": [
      "Specialized scheme to fulfill dream of Holy Hajj & Umrah",
      "Priority processing with registered Hajj agencies & visa desks",
      "Pure Halal profit accrual with zero Riba",
      "Flexible accumulation horizon from 1 to 10 years"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "aibl-kotipoti",
    "bankName": "Al-Arafah Islami Bank",
    "productName": "Mudaraba Kotipoti Scheme",
    "type": "Exclusive",
    "interestRate": 11.20,
    "tenureMonths": 120,
    "minAmount": 3500,
    "category": "Islamic Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=aibl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "schemeTarget": "৳1 Crore Halal Target",
    "features": [
      "Target ৳1 Crore Halal corpus milestone over 10-15 years",
      "Strictly ethical investments screened by Shariah Board",
      "VIP priority banking service and Islamic relationship manager",
      "Nov 2026 high profit rate commitment"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sjibl-double-return",
    "bankName": "Shahjalal Islami Bank",
    "productName": "Mudaraba Double Return Deposit Scheme (MDRDS)",
    "type": "Exclusive",
    "interestRate": 11.10,
    "tenureMonths": 72,
    "minAmount": 50000,
    "category": "Islamic Bank",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sjiblbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "schemeTarget": "Double Principal in 6 Years",
    "features": [
      "Doubles lump-sum placement in approximately 6 years",
      "100% Shariah compliant Mudaraba investment",
      "Fixed weightage factor locked in at deposit placement",
      "High stability in private Islamic banking sector"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "seml-ibbl-shariah",
    "bankName": "SEML Asset Management",
    "productName": "SEML IBBL Shariah Fund",
    "type": "Mutual Fund",
    "interestRate": 12.00,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=semlbd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Annually",
    "isShariahCompliant": true,
    "taxApplicable": false,
    "features": [
      "Top performing Shariah mutual fund on Dhaka Stock Exchange (DSE)",
      "Strict screening excluding interest debt, alcohol, gambling & haram sectors",
      "Monthly SIP facility starting from ৳1,000/month",
      "Annual cash dividend or Cumulative Investment Plan (CIP) units"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "aibl-1st-islamic",
    "bankName": "LR Global Bangladesh",
    "productName": "AIBL 1st Islamic Mutual Fund",
    "type": "Mutual Fund",
    "interestRate": 11.50,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=lrglobalbd.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Annually",
    "isShariahCompliant": true,
    "taxApplicable": false,
    "features": [
      "Pioneering institutional Islamic mutual fund in Bangladesh",
      "Portfolio aligned with DSEX Shariah Index (DSES)",
      "Disciplined value investing with audited financial track record",
      "Tax rebate eligible under Section 44 Income Tax Act"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "vipb-shariah-unit",
    "bankName": "VIPB Asset Management",
    "productName": "VIPB Shariah Unit Fund",
    "type": "Mutual Fund",
    "interestRate": 12.20,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=vipbamc.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Annually",
    "isShariahCompliant": true,
    "taxApplicable": false,
    "features": [
      "Open-ended Shariah unit fund redeemable weekly at published NAV",
      "Invests in cash-rich, low-debt, high-governance Shariah compliant companies",
      "Zero entry load fee with flexible monthly SIP",
      "Dedicated Shariah Supervisory Board audit report published yearly"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "idlc-shariah-fund",
    "bankName": "IDLC Asset Management",
    "productName": "IDLC Shariah Union Fund",
    "type": "Mutual Fund",
    "interestRate": 11.90,
    "tenureMonths": 0,
    "minAmount": 5000,
    "category": "Asset Manager",
    "logoUrl": "https://www.google.com/s2/favicons?domain=idlc.com&sz=128",
    "safetyRating": "Moderate",
    "payoutFrequency": "Annually",
    "isShariahCompliant": true,
    "taxApplicable": false,
    "features": [
      "Managed by premier institutional asset manager IDLC",
      "Shariah Advisory Board led by renowned Islamic finance scholars",
      "Strict screening criteria: Debt-to-assets ratio < 33%",
      "Monthly SIP from ৳2,000/month with online portfolio monitoring"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "govt-sukuk-ijarah",
    "bankName": "Government of Bangladesh",
    "productName": "Bangladesh Government Investment Sukuk (BGIS - Ijarah)",
    "type": "Sanchaypatra",
    "interestRate": 9.85,
    "tenureMonths": 60,
    "minAmount": 100000,
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bb.org.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Semi-Annually",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "features": [
      "Asset-backed sovereign Islamic security issued by Bangladesh Bank",
      "Underlying tangible government assets (water supply/rural infrastructure)",
      "Semi-annual rental yield credited directly to investor bank account",
      "Zero default risk backed by sovereign government guarantee"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "prime-islami-takaful",
    "bankName": "Prime Islami Life Insurance",
    "productName": "Prime Islami Life Takaful Plan",
    "type": "Insurance",
    "interestRate": 8.50,
    "tenureMonths": 120,
    "minAmount": 1500,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=primeislamilife.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity",
    "isShariahCompliant": true,
    "taxApplicable": true,
    "coverageAmount": "৳20L Takaful Pool",
    "benefitType": "Halal Takaful",
    "features": [
      "100% Shariah compliant Mudaraba & Tabarru risk-sharing model",
      "Surplus profit distribution among participant policyholders",
      "Comprehensive family life, hospitalization & critical illness cover",
      "Eligible for 15% income tax rebate under Section 44"
    ],
    "lastUpdated": "November 2026"
  },
  // --- LOAN PRODUCTS (BANGLADESHI BANKS) ---
  {
    "id": "brac-personal-loan",
    "bankName": "BRAC Bank",
    "productName": "BRAC Bank Quick Personal Loan",
    "type": "Loan",
    "loanSubCategory": "Personal",
    "interestRate": 11.50,
    "tenureMonths": 60,
    "minAmount": 50000,
    "maxLoanLimit": "৳20 Lakh",
    "processingFee": "0.5% (Max ৳10,000)",
    "emiExample": "৳2,199 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "No security or guarantor required for salaried corporate executives",
      "Flexible repayment tenure from 12 to 60 months",
      "Quick disbursement within 48 to 72 business hours",
      "Early settlement & partial payment options available at low fee"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-personal-loan",
    "bankName": "The City Bank",
    "productName": "City Personal Loan",
    "type": "Loan",
    "loanSubCategory": "Personal",
    "interestRate": 11.75,
    "tenureMonths": 60,
    "minAmount": 50000,
    "maxLoanLimit": "৳20 Lakh",
    "processingFee": "0.5% to 1.0%",
    "emiExample": "৳2,212 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Any legal consumer purpose: medical, wedding, travel, home renovation",
      "Attractive interest rates for Citytouch internet banking users",
      "Hassle-free documentation and auto-debit facility from salary account",
      "Complimentary life insurance coverage for outstanding loan amount"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "scb-personal-loan",
    "bankName": "Standard Chartered Bank",
    "productName": "StanChart Personal Loan",
    "type": "Loan",
    "loanSubCategory": "Personal",
    "interestRate": 11.25,
    "tenureMonths": 60,
    "minAmount": 100000,
    "maxLoanLimit": "৳30 Lakh",
    "processingFee": "0.5% of approved limit",
    "emiExample": "৳2,187 / Lakh",
    "category": "Foreign",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sc.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Highest borrowing ceiling up to ৳30 Lakh without collateral",
      "Digital in-app top-up loan facility for existing credit customers",
      "Priority banking preferential rate discount of 0.50%",
      "World-class customer service with transparent repayment schedule"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-personal-loan",
    "bankName": "Eastern Bank PLC",
    "productName": "EBL Fast Personal Loan",
    "type": "Loan",
    "loanSubCategory": "Personal",
    "interestRate": 11.50,
    "tenureMonths": 60,
    "minAmount": 50000,
    "maxLoanLimit": "৳20 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳2,199 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Speedy approval with digital pre-assessment tool",
      "Available for salaried professionals, doctors, teachers & self-employed",
      "Takeover loan facility from other banks with 0% processing fee",
      "Free EBL Mastercard Titanium debit card with fee waiver"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "dbbl-personal-loan",
    "bankName": "Dutch-Bangla Bank",
    "productName": "DBBL Consumer Personal Loan",
    "type": "Loan",
    "loanSubCategory": "Personal",
    "interestRate": 11.00,
    "tenureMonths": 60,
    "minAmount": 50000,
    "maxLoanLimit": "৳15 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳2,174 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=dutchbanglabank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Lowest processing rate with nationwide branch & fast-track network",
      "Repayment via Rocket mobile wallet and DBBL NexusPay app",
      "Competitive interest rate linked to Bangladesh Bank SMART formula",
      "Simple guarantor criteria and fast salary deduction verification"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sonali-personal-loan",
    "bankName": "Sonali Bank PLC",
    "productName": "Sonali General Consumer Loan",
    "type": "Loan",
    "loanSubCategory": "Personal",
    "interestRate": 10.50,
    "tenureMonths": 60,
    "minAmount": 30000,
    "maxLoanLimit": "৳10 Lakh",
    "processingFee": "0.3%",
    "emiExample": "৳2,149 / Lakh",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sonalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Special subsidized terms for government, semi-govt & autonomous employees",
      "Lowest interest rates among all personal loan providers in Bangladesh",
      "Minimal fee structure with no hidden prepayment penalty",
      "Nationwide service across all 1,230+ branches"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "dbh-home-loan",
    "bankName": "DBH Finance PLC",
    "productName": "DBH Prime Home Loan",
    "type": "Loan",
    "loanSubCategory": "Home",
    "interestRate": 9.99,
    "tenureMonths": 300,
    "minAmount": 500000,
    "maxLoanLimit": "৳2 Crore",
    "processingFee": "0.5% (Max ৳25,000)",
    "emiExample": "৳908 / Lakh (25 Yrs)",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=deltabrache.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Pioneer housing finance institution with AAA credit rating for 18 years",
      "Up to 80% financing of total apartment/building property value",
      "Extended tenure up to 25 years for manageable monthly installments",
      "Expert in-house legal and technical property vetting team"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-home-loan",
    "bankName": "BRAC Bank",
    "productName": "BRAC Bank Apon Nibash Home Loan",
    "type": "Loan",
    "loanSubCategory": "Home",
    "interestRate": 10.50,
    "tenureMonths": 300,
    "minAmount": 500000,
    "maxLoanLimit": "৳2 Crore",
    "processingFee": "0.5%",
    "emiExample": "৳944 / Lakh (25 Yrs)",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Financing for ready flat purchase, home construction & renovation",
      "Balance transfer facility from other banks with 50% discount on fees",
      "Special home loans for non-resident Bangladeshis (NRB Home Loan)",
      "Dedicated relationship manager for end-to-end title registration"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-home-loan",
    "bankName": "The City Bank",
    "productName": "City Home Loan",
    "type": "Loan",
    "loanSubCategory": "Home",
    "interestRate": 10.75,
    "tenureMonths": 300,
    "minAmount": 500000,
    "maxLoanLimit": "৳2 Crore",
    "processingFee": "0.5%",
    "emiExample": "৳963 / Lakh (25 Yrs)",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Apartment purchase, independent house building and semi-pucca financing",
      "Step-up EMI option allowing lower initial payments for young buyers",
      "Combined income of co-applicants (spouse/parents) allowed for higher limit",
      "Pre-approved home loans for verified developer project units"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ibbl-hpsm-home",
    "bankName": "Islami Bank Bangladesh",
    "productName": "IBBL Shirkatul Melk (HPSM) Home Finance",
    "type": "Loan",
    "loanSubCategory": "Home",
    "interestRate": 10.50,
    "tenureMonths": 300,
    "minAmount": 500000,
    "maxLoanLimit": "৳2 Crore",
    "processingFee": "0.5%",
    "emiExample": "৳944 / Lakh",
    "isShariahCompliant": true,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=islamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Rent / Installment",
    "features": [
      "100% Shariah compliant Hire Purchase under Shirkatul Melk model",
      "Bank and client co-own the property with gradual share transfer",
      "Fixed rental rate formula with no compounding riba or punitive fines",
      "Approved for ready flats, commercial floors, and rural house construction"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-auto-loan",
    "bankName": "BRAC Bank",
    "productName": "BRAC Bank Wheel Deal Auto Loan",
    "type": "Loan",
    "loanSubCategory": "Car",
    "interestRate": 11.50,
    "tenureMonths": 72,
    "minAmount": 300000,
    "maxLoanLimit": "৳40 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳1,930 / Lakh (6 Yrs)",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Financing up to 50% for brand new, reconditioned & electric vehicles (EV)",
      "Maximum tenure up to 6 years for lower monthly installment burden",
      "Tie-ups with leading automobile dealerships in Dhaka, Chattogram & Sylhet",
      "Fast-track processing within 48 hours with spot approvals"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-car-loan",
    "bankName": "The City Bank",
    "productName": "City Car Loan",
    "type": "Loan",
    "loanSubCategory": "Car",
    "interestRate": 11.50,
    "tenureMonths": 72,
    "minAmount": 300000,
    "maxLoanLimit": "৳40 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳1,930 / Lakh (6 Yrs)",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Attractive financing for sedans, SUVs, MPVs and commercial microbuses",
      "Free vehicle tracker installation and first year insurance premium discount",
      "Fast documentation with minimum paperwork for verified salary accounts",
      "Zero hidden pre-closure fees after 12 completed monthly installments"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-auto-loan",
    "bankName": "Eastern Bank PLC",
    "productName": "EBL Auto Loan",
    "type": "Loan",
    "loanSubCategory": "Car",
    "interestRate": 11.75,
    "tenureMonths": 72,
    "minAmount": 300000,
    "maxLoanLimit": "৳40 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳1,944 / Lakh (6 Yrs)",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Quick loan approval for both salaried and registered business owners",
      "Finance available up to 50% of quotation price as per BB circular",
      "Special discounts on green hybrid and fully electric vehicle financing",
      "Complimentary priority servicing and road assistance package"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-anonno-sme",
    "bankName": "BRAC Bank",
    "productName": "BRAC Bank Anonno SME Loan",
    "type": "Loan",
    "loanSubCategory": "SME",
    "interestRate": 11.50,
    "tenureMonths": 60,
    "minAmount": 300000,
    "maxLoanLimit": "৳30 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳2,199 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Collateral-free business loan designed for cottage, micro and small traders",
      "Financing working capital, shop inventory stocking & machinery setup",
      "Over 450 SME Unit Offices nationwide providing doorstep relationship service",
      "Flexible revenue-based assessment without audited balance sheets"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-tara-sme",
    "bankName": "The City Bank",
    "productName": "City Tara Women SME Loan",
    "type": "Loan",
    "loanSubCategory": "SME",
    "interestRate": 10.00,
    "tenureMonths": 60,
    "minAmount": 100000,
    "maxLoanLimit": "৳50 Lakh",
    "processingFee": "0.25%",
    "emiExample": "৳2,125 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Bangladesh Bank refinance scheme subsidized rate for women entrepreneurs",
      "Collateral-free loan up to ৳25 Lakh for registered women-led businesses",
      "Free entrepreneurship workshop and financial literacy mentoring",
      "Dedicated Tara Women Banking counter across all branches"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-udayan-sme",
    "bankName": "Eastern Bank PLC",
    "productName": "EBL Udayan SME Enterprise Loan",
    "type": "Loan",
    "loanSubCategory": "SME",
    "interestRate": 11.75,
    "tenureMonths": 60,
    "minAmount": 500000,
    "maxLoanLimit": "৳50 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳2,212 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Structured financing for manufacturing, service, and trading businesses",
      "Both term loan and revolving overdraft limits available under one umbrella",
      "Fast cash flow assessment method tailored for local wholesalers",
      "Low documentation hurdles with competitive processing lead times"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bkb-krishi-rin",
    "bankName": "Bangladesh Krishi Bank",
    "productName": "BKB General Crop & Krishi Rin",
    "type": "Loan",
    "loanSubCategory": "Agriculture",
    "interestRate": 8.00,
    "tenureMonths": 12,
    "minAmount": 20000,
    "maxLoanLimit": "৳10 Lakh",
    "processingFee": "Nominal (0.1%)",
    "emiExample": "Bullet / Harvest Settlement",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=krishibank.org.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Seasonal / Crop Cycle",
    "features": [
      "Special 8% interest rate subsidized under Bangladesh Bank Agriculture Policy",
      "Financing seed, fertilizer, irrigation, harvesting for paddy, wheat, potato",
      "Repayment linked directly to crop harvest timing (no monthly stress)",
      "Dedicated agricultural officers serving union and upazila grassroots"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "rakub-krishi-loan",
    "bankName": "Rajshahi Krishi Unnayan Bank",
    "productName": "RAKUB Agri-Machinery & Farm Loan",
    "type": "Loan",
    "loanSubCategory": "Agriculture",
    "interestRate": 8.00,
    "tenureMonths": 36,
    "minAmount": 30000,
    "maxLoanLimit": "৳15 Lakh",
    "processingFee": "0.1%",
    "emiExample": "Semi-Annual Installment",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=rakub.org.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Semi-Annually",
    "features": [
      "Dedicated agricultural development bank covering Rajshahi & Rangpur divisions",
      "Financing power tillers, harvesters, solar irrigation pumps & greenhouse tech",
      "Simple land possession certificate (Khatian) based credit verification",
      "Special incentives and interest rebates for timely repayment"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sonali-dairy-poultry",
    "bankName": "Sonali Bank PLC",
    "productName": "Sonali Dairy, Fishery & Poultry Loan",
    "type": "Loan",
    "loanSubCategory": "Agriculture",
    "interestRate": 8.00,
    "tenureMonths": 24,
    "minAmount": 50000,
    "maxLoanLimit": "৳10 Lakh",
    "processingFee": "0.2%",
    "emiExample": "Quarterly Repayment",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sonalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Quarterly",
    "features": [
      "Supporting rural dairy farms, cattle fattening, fish culture & broiler poultry",
      "Government interest subsidy for livestock farmers with low collateral",
      "Repayment schedules synced with livestock rearing and milk sale cycles",
      "Zero prepayment penalty and free advisory support from upazila branches"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-corporate-wc",
    "bankName": "Eastern Bank PLC",
    "productName": "EBL Corporate Working Capital & Syndication",
    "type": "Loan",
    "loanSubCategory": "Corporate",
    "interestRate": 11.00,
    "tenureMonths": 36,
    "minAmount": 5000000,
    "maxLoanLimit": "৳50 Crore",
    "processingFee": "0.25% - 0.50%",
    "emiExample": "Structured Term",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly / Quarterly",
    "features": [
      "Large-scale trade finance, working capital revolving limits, and import L/C",
      "Syndicated loan arrangement for major infrastructure, power, and RMG units",
      "Foreign currency offshore banking unit (OBU) financing available",
      "Experienced corporate relationship managers with bespoke treasury solutions"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "scb-corporate-finance",
    "bankName": "Standard Chartered Bank",
    "productName": "StanChart Commercial Banking Facility",
    "type": "Loan",
    "loanSubCategory": "Corporate",
    "interestRate": 10.75,
    "tenureMonths": 60,
    "minAmount": 10000000,
    "maxLoanLimit": "৳100 Crore",
    "processingFee": "Negotiable",
    "emiExample": "Custom Corporate Schedule",
    "category": "Foreign",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sc.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Quarterly",
    "features": [
      "Global cross-border commercial lending for top conglomerates in Bangladesh",
      "Supply chain financing, invoice discounting & digital vendor financing",
      "Green financing and ESG-linked corporate loans at discounted benchmark spreads",
      "Comprehensive digital corporate portal (Straight2Bank) for instant drawdown"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-student-loan",
    "bankName": "Eastern Bank PLC",
    "productName": "EBL Higher Education Student Loan",
    "type": "Loan",
    "loanSubCategory": "Education",
    "interestRate": 10.50,
    "tenureMonths": 60,
    "minAmount": 100000,
    "maxLoanLimit": "৳20 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳2,149 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Covers admission fees, tuition, living expenses for overseas & local degrees",
      "Moratorium (grace) period during study course duration before full EMI starts",
      "Parents or legal guardians act as co-borrowers for smooth sanction",
      "Student file opening and outward tuition remittance handled seamlessly"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-student-loan",
    "bankName": "BRAC Bank",
    "productName": "BRAC Bank Study Abroad Education Loan",
    "type": "Loan",
    "loanSubCategory": "Education",
    "interestRate": 11.00,
    "tenureMonths": 60,
    "minAmount": 100000,
    "maxLoanLimit": "৳25 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳2,174 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Tailored for UK, USA, Canada, Australia, and European university admissions",
      "High sanction limit up to ৳25 Lakh without requiring mortgage collateral",
      "Fast student visa solvency certificate issuance within 24 hours",
      "Flexible repayment terms up to 5 years starting post-graduation"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-doctor-loan",
    "bankName": "The City Bank",
    "productName": "City Doctor & Medical Professional Loan",
    "type": "Loan",
    "loanSubCategory": "Professional",
    "interestRate": 11.25,
    "tenureMonths": 60,
    "minAmount": 100000,
    "maxLoanLimit": "৳30 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳2,187 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Custom loan tailored for registered doctors, clinic owners & dentists",
      "Financing chamber setup, diagnostic equipment, Ultrasound & ultrasound probes",
      "BMDC registration card serves as key professional qualification document",
      "No real-estate mortgage collateral required up to ৳30 Lakh"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-professional-loan",
    "bankName": "BRAC Bank",
    "productName": "BRAC Bank Professional Executive Loan",
    "type": "Loan",
    "loanSubCategory": "Professional",
    "interestRate": 11.50,
    "tenureMonths": 60,
    "minAmount": 100000,
    "maxLoanLimit": "৳25 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳2,199 / Lakh",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly EMI",
    "features": [
      "Exclusively for Chartered Accountants (CA), Architects, Engineers & IT Consultants",
      "Firm expansion, professional software licensing & office infrastructure setup",
      "Higher debt-burden ratio allowed based on verified practitioner income",
      "Priority processing with zero hidden documentation costs"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ibbl-murabaha-consumer",
    "bankName": "Islami Bank Bangladesh",
    "productName": "IBBL Bai-Murabaha Consumer Financing",
    "type": "Loan",
    "loanSubCategory": "Islamic",
    "interestRate": 11.00,
    "tenureMonths": 48,
    "minAmount": 50000,
    "maxLoanLimit": "৳20 Lakh",
    "processingFee": "0.5%",
    "emiExample": "৳2,584 / Lakh (4 Yrs)",
    "isShariahCompliant": true,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=islamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Cost + Profit Installment",
    "features": [
      "100% Shariah compliant Bai-Murabaha goods purchase agreement",
      "Purchase household consumer durables, electronics, furniture, computers",
      "Transparent cost-plus profit margin disclosed up front with zero compounding",
      "Halal alternative to conventional consumer personal loans"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "bkb-gold-swarna",
    "bankName": "Bangladesh Krishi Bank",
    "productName": "BKB Swarna Rin (Gold Pledge Advance)",
    "type": "Loan",
    "loanSubCategory": "Secured",
    "interestRate": 9.50,
    "tenureMonths": 12,
    "minAmount": 20000,
    "maxLoanLimit": "৳5 Lakh",
    "processingFee": "Nominal appraisal fee",
    "emiExample": "Lump-sum / Monthly Interest",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=krishibank.org.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "At Maturity / Monthly",
    "features": [
      "Immediate instant cash against pledge of verified gold jewelry / ornaments",
      "Low borrowing rate at 9.50% compared to non-bank gold lenders",
      "Certified bank assayer evaluates gold purity inside the branch premises",
      "High security bank vault storage for customer gold ornaments"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "pubali-secured-advance",
    "bankName": "Pubali Bank",
    "productName": "Pubali Loan Against Deposit (SOD / Secured Advance)",
    "type": "Loan",
    "loanSubCategory": "Secured",
    "interestRate": 8.50,
    "tenureMonths": 36,
    "minAmount": 50000,
    "maxLoanLimit": "৳50 Lakh (90% of Deposit)",
    "processingFee": "0.2%",
    "emiExample": "Deposit Rate + 2.0% Spread",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pubalibangla.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Interest / Revolving",
    "features": [
      "Instant loan against pledge of Fixed Deposit (FDR), DPS or Sanchaypatra",
      "Borrow up to 90% of principal deposit value without breaking FDR interest",
      "Interest charged solely as FDR Rate + 2.0% margin (lowest loan rate in BD)",
      "Zero paperwork and same-day instant disbursement to current account"
    ],
    "lastUpdated": "November 2026"
  },

  // --- PENSION SCHEMES (NATIONAL PENSION AUTHORITY & BD BANKS) ---
  {
    "id": "upa-pragati-pension",
    "bankName": "National Pension Authority",
    "productName": "Universal Pension Scheme - Pragati (প্রগতি)",
    "type": "Pension",
    "pensionSubCategory": "National",
    "interestRate": 10.50,
    "tenureMonths": 360,
    "minAmount": 2000,
    "monthlyPensionBenefit": "Up to ৳62,300/mo",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=upension.gov.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Lifelong Post-60",
    "features": [
      "Official Universal Pension Scheme for private sector corporate and NGO employees",
      "Monthly contribution options: ৳2,000 / ৳3,000 / ৳5,000 / ৳10,000 per month",
      "Guaranteed monthly lifelong pension credited to bank account from age 60",
      "100% sovereign government guarantee with income tax exemption under Sec 44"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "upa-surokkha-pension",
    "bankName": "National Pension Authority",
    "productName": "Universal Pension Scheme - Surokkha (সুরক্ষা)",
    "type": "Pension",
    "pensionSubCategory": "National",
    "interestRate": 10.50,
    "tenureMonths": 360,
    "minAmount": 1000,
    "monthlyPensionBenefit": "Up to ৳62,300/mo",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=upension.gov.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Lifelong Post-60",
    "features": [
      "Created for informal sector workers: freelancers, self-employed, farmers, traders",
      "Monthly contribution options: ৳1,000 / ৳2,000 / ৳3,000 / ৳5,000 per month",
      "Direct digital enrollment via upension.gov.bd or Sonali Bank / bKash / Nagad",
      "If contributor dies before 75, nominee receives monthly pension until 75 years"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "upa-samata-pension",
    "bankName": "National Pension Authority",
    "productName": "Universal Pension Scheme - Samata (সমতা)",
    "type": "Pension",
    "pensionSubCategory": "National",
    "interestRate": 11.00,
    "tenureMonths": 360,
    "minAmount": 1000,
    "monthlyPensionBenefit": "৳7,651 to ৳34,465/mo",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=upension.gov.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Lifelong Post-60",
    "features": [
      "Sovereign social security scheme for low-income citizens (income < ৳60,000/yr)",
      "50% Government Matching Subsidy: Depositor pays ৳500, Bangladesh Govt pays ৳500",
      "Ensures dignified retirement income for day laborers, rickshaw pullers, domestic help",
      "Zero management deductions with full sovereign treasury guarantee"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "upa-probash-pension",
    "bankName": "National Pension Authority",
    "productName": "Universal Pension Scheme - Probash (প্রবাসী)",
    "type": "Pension",
    "pensionSubCategory": "SeniorCitizen",
    "interestRate": 10.50,
    "tenureMonths": 360,
    "minAmount": 5000,
    "monthlyPensionBenefit": "Up to ৳62,300/mo",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=upension.gov.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Lifelong Post-60",
    "features": [
      "Exclusive pension for Non-Resident Bangladeshis (NRBs) working abroad",
      "Contribution tiers: ৳5,000 / ৳7,500 / ৳10,000 per month in foreign currency or BDT",
      "Option to repatriate monthly pension in foreign currency upon return or retirement",
      "Convenient online card & exchange house auto-debit payments worldwide"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "upa-prottoy-pension",
    "bankName": "National Pension Authority",
    "productName": "Universal Pension Scheme - Prottoy (প্রত্যয়)",
    "type": "Pension",
    "pensionSubCategory": "National",
    "interestRate": 10.50,
    "tenureMonths": 360,
    "minAmount": 2500,
    "monthlyPensionBenefit": "Up to ৳62,300/mo",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=upension.gov.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Lifelong Post-60",
    "features": [
      "Tailored for employees of autonomous, state corporations, and public bodies",
      "Structured employer-employee contribution matching model",
      "Higher compound return trajectory backed by national infrastructure bonds",
      "Digital pension management dashboard with live corpus accumulation tracker"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "sonali-pension-scheme",
    "bankName": "Sonali Bank PLC",
    "productName": "Sonali Pension Scheme (SPS)",
    "type": "Pension",
    "pensionSubCategory": "BankPension",
    "interestRate": 10.25,
    "tenureMonths": 240,
    "minAmount": 1000,
    "monthlyPensionBenefit": "Fixed Monthly Pension",
    "category": "Government",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sonalibank.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Pension Payout",
    "features": [
      "State-backed bank pension deposit scheme for 10, 15, or 20 years accumulation",
      "Guaranteed fixed monthly pension payout upon maturity for up to 25 years",
      "Monthly deposit installment from ৳1,000 to ৳25,000 in convenient multiples",
      "Emergency advance up to 80% of accumulated balance available at low rate"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "brac-retirement-dps",
    "bankName": "BRAC Bank",
    "productName": "BRAC Bank Golden Life Retirement Plan",
    "type": "Pension",
    "pensionSubCategory": "BankPension",
    "interestRate": 10.50,
    "tenureMonths": 240,
    "minAmount": 2000,
    "monthlyPensionBenefit": "Monthly Retirement Income",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bracbank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Pension Annuity",
    "features": [
      "Two-phase retirement plan: Accumulation phase (5-20 yrs) + Monthly Annuity phase",
      "Monthly installments from ৳2,000 to ৳50,000 with high compounding yields",
      "Complimentary life insurance covers remaining installments in case of untimely death",
      "Auto-debit from salary/savings account with online Astha app management"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ibbl-mudaraba-pension",
    "bankName": "Islami Bank Bangladesh",
    "productName": "IBBL Mudaraba Pension Deposit Scheme (MPS)",
    "type": "Pension",
    "pensionSubCategory": "BankPension",
    "interestRate": 10.75,
    "tenureMonths": 240,
    "minAmount": 1000,
    "monthlyPensionBenefit": "Halal Monthly Pension",
    "isShariahCompliant": true,
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=islamibankbd.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Profit Payout",
    "features": [
      "100% Shariah compliant Mudaraba retirement scheme certified by Shariah Board",
      "Accumulate over 10 to 20 years to enjoy high monthly halal retirement profit",
      "Profit calculated with weighted Mudaraba investment ratio for senior citizens",
      "Nominee designated for full ongoing pension rights post policyholder demise"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "city-retirement-pps",
    "bankName": "The City Bank",
    "productName": "City Retirement Pension DPS",
    "type": "Pension",
    "pensionSubCategory": "BankPension",
    "interestRate": 10.25,
    "tenureMonths": 180,
    "minAmount": 2000,
    "monthlyPensionBenefit": "Monthly Annuity",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=thecitybank.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Annuity",
    "features": [
      "Structured retirement wealth builder with tenure options of 10, 15, or 20 years",
      "Choice of lump-sum payout or monthly retirement salary credit upon maturity",
      "Full exemption from capital gains and eligible for annual personal tax rebate",
      "Automatic loan facility up to 90% of accumulated balance during emergencies"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "ebl-senior-retirement",
    "bankName": "Eastern Bank PLC",
    "productName": "EBL Senior Citizen & Pension Wealth Scheme",
    "type": "Pension",
    "pensionSubCategory": "SeniorCitizen",
    "interestRate": 10.50,
    "tenureMonths": 180,
    "minAmount": 3000,
    "monthlyPensionBenefit": "Monthly Living Allowance",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=ebl.com.bd&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Credit",
    "features": [
      "Premium retirement planning scheme for mid-career professionals and seniors",
      "Dedicated senior citizen medical partner discounts and health checkup vouchers",
      "Flexible contribution amounts from ৳3,000 upwards with monthly auto-transfer",
      "Priority teller & lounge services at all EBL branches across Bangladesh"
    ],
    "lastUpdated": "November 2026"
  },
  {
    "id": "pubali-pension-savings",
    "bankName": "Pubali Bank",
    "productName": "Pubali Bank Pension Scheme (PBPS)",
    "type": "Pension",
    "pensionSubCategory": "BankPension",
    "interestRate": 10.25,
    "tenureMonths": 240,
    "minAmount": 1000,
    "monthlyPensionBenefit": "Monthly Pension Post-60",
    "category": "Private",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pubalibangla.com&sz=128",
    "safetyRating": "Safe",
    "payoutFrequency": "Monthly Pension Payout",
    "features": [
      "Nationwide trusted bank pension scheme providing secure old-age financial support",
      "Installment tenure of 10, 15, or 20 years yielding fixed lifelong monthly returns",
      "No account maintenance fees and simplified nominee transition protocol",
      "Backed by Pubali Bank's robust 65-year legacy and 500+ branch footprint"
    ],
    "lastUpdated": "November 2026"
  }
];
