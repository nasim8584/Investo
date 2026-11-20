import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Info, Sparkles, TrendingUp, PiggyBank, Zap, Calculator, Briefcase, FileText, CheckCircle, ArrowRight, HeartPulse, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FinancialProduct, ProductType, getProductPointers, ProductPointer } from '../data/financialProducts';

interface PackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: FinancialProduct | null;
  onCompare: (product: FinancialProduct) => void;
  isComparing: boolean;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  onCompare, 
  isComparing 
}) => {
  const [amount, setAmount] = useState<number>(10000);
  const [hasTIN, setHasTIN] = useState<boolean>(true);
  const [customTenure, setCustomTenure] = useState<number>(10);
  const [mfMode, setMfMode] = useState<'sip' | 'lump'>('sip');

  useEffect(() => {
    if (product) {
      if (product.type === 'Loan') {
        setAmount(500000); // 5 Lakh default for Loan
        setCustomTenure(product.tenureMonths > 0 ? Math.ceil(product.tenureMonths / 12) : 5);
      } else if (product.type === 'Pension') {
        setAmount(product.minAmount || 5000); // ৳5,000 / month default for Pension
        setCustomTenure(15); // 15 years default accumulation horizon
      } else if (product.type === 'FDR' || product.type === 'Sanchaypatra') {
        setAmount(100000); // 1 Lakh initial for FDR / Sanchaypatra
        setCustomTenure(product.tenureMonths > 0 ? (product.tenureMonths / 12) : (product.type === 'Sanchaypatra' ? 5 : 1));
      } else if (product.type === 'Mutual Fund') {
        setMfMode('sip');
        setAmount(product.minAmount || 2000); // Default to monthly SIP e.g. ৳2,000 / month
        setCustomTenure(10); // 10 years default for Mutual Fund SIP
      } else if (product.type === 'Insurance') {
        setAmount(product.minAmount || 3000);
        setCustomTenure(product.tenureMonths > 0 ? Math.ceil(product.tenureMonths / 12) : 10);
      } else if (product.type === 'Savings') {
        setAmount(50000); // Typical savings average balance
        setCustomTenure(1); // 1 year projection for open-ended savings
      } else {
        setAmount(product.minAmount || 5000); // 5k monthly for DPS or Exclusive
        setCustomTenure(product.tenureMonths > 0 ? Math.ceil(product.tenureMonths / 12) : 5);
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const pointers: ProductPointer[] = getProductPointers(product);
  const isLoan = product.type === 'Loan';
  const isPension = product.type === 'Pension';
  const isMonthlyType = product.type === 'DPS' || product.type === 'Exclusive' || isPension;
  const isInsurance = product.type === 'Insurance';
  const isSavings = product.type === 'Savings';
  const isMutualFund = product.type === 'Mutual Fund';
  const isSip = (isMutualFund && mfMode === 'sip') || isMonthlyType;
  const displayTenureYears = customTenure;

  // Type-tailored calculations - fully reactive to amount, customTenure (horizon), and hasTIN (tax status)
  const calculateResult = () => {
    const rate = product.interestRate;
    // months is strictly driven by user's chosen customTenure horizon
    const months = Math.max(1, Math.round(customTenure * 12));

    if (isLoan) {
      // Loan EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1)
      // Tax status impact: Clean CIB & e-TIN verified gives 0.5% fee; without e-TIN gives 1.0% standard fee
      const procFeeRate = hasTIN ? 0.005 : 0.01;
      const effectiveRate = hasTIN ? rate : (rate + 0.25);
      const monthlyRate = (effectiveRate / 100) / 12;
      const principal = amount;
      let monthlyEmi = 0;
      if (monthlyRate > 0) {
        monthlyEmi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      } else {
        monthlyEmi = principal / months;
      }
      const totalRepayable = monthlyEmi * months;
      const totalInterest = Math.max(0, totalRepayable - principal);
      const processingFee = principal * procFeeRate;
      return {
        totalInvested: principal,
        grossEarnings: totalInterest,
        taxAmount: processingFee,
        taxRebate: 0,
        netPayout: monthlyEmi,
        estimatedCoverage: totalRepayable,
        taxRate: procFeeRate,
        totalMonths: months
      };
    }

    if (isPension) {
      // Universal Pension Scheme & Bank Retirement calculation
      // monthlyRate compounded for exact chosen horizon
      const monthlyRate = (rate / 100) / 12;
      const totalInvested = amount * months;
      let corpus = 0;
      if (monthlyRate > 0) {
        corpus = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        corpus = totalInvested;
      }
      const grossEarnings = Math.max(0, corpus - totalInvested);
      // Lifelong monthly annuity post 60: standard ~8.5% annual pension payout on accumulated corpus
      // Tax status impact:
      // With e-TIN: 100% tax-free receipts on pension (0% withholding) & full 15% Sec 44 direct tax rebate on annual contributions
      // Without e-TIN: 10% Source Tax (AIT) withholding on pension annuity & reduced 10% Sec 44 direct tax rebate
      const grossMonthlyPension = (corpus * 0.085) / 12;
      const taxRate = hasTIN ? 0 : 0.10;
      const pensionTaxDeduction = grossMonthlyPension * taxRate;
      const estimatedMonthlyPension = grossMonthlyPension - pensionTaxDeduction;
      const taxRebate = (amount * 12) * (hasTIN ? 0.15 : 0.10);
      return {
        totalInvested,
        grossEarnings,
        taxAmount: pensionTaxDeduction,
        taxRebate,
        netPayout: corpus,
        estimatedCoverage: estimatedMonthlyPension,
        taxRate,
        totalMonths: months
      };
    }

    if (isInsurance) {
      // Insurance estimation: Premium, Coverage Multiple, and Tax Rebate
      const annualPremium = amount * 12;
      const taxRebate = annualPremium * (hasTIN ? 0.15 : 0.10); // Up to 15% with e-TIN under Sec 44
      const coverageMultiple = product.interestRate > 0 ? 15 : 25; // Endowment vs Pure health/term
      const estimatedCoverage = Math.max(100000, annualPremium * coverageMultiple);
      const grossEarnings = product.interestRate > 0 ? (annualPremium * (product.interestRate / 100) * customTenure) : 0;
      return {
        totalInvested: annualPremium * customTenure,
        grossEarnings,
        taxAmount: 0,
        taxRebate,
        netPayout: (annualPremium * customTenure) + grossEarnings,
        estimatedCoverage,
        taxRate: hasTIN ? 0.15 : 0.10,
        totalMonths: months
      };
    }
    
    if (isSip) {
      // Monthly SIP / DPS Installment calculation (Monthly compounding annuity-due)
      const monthlyRate = (rate / 100) / 12;
      const totalInvested = amount * months;
      let balance = 0;
      if (monthlyRate > 0) {
        balance = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        balance = totalInvested;
      }
      const grossEarnings = Math.max(0, balance - totalInvested);
      const taxRate = hasTIN ? 0.10 : 0.15; // 10% AIT with TIN, 15% without
      const taxAmount = grossEarnings * taxRate;
      const netPayout = totalInvested + grossEarnings - taxAmount;
      return { totalInvested, grossEarnings, taxAmount, taxRebate: 0, netPayout, estimatedCoverage: 0, taxRate, totalMonths: months };
    } else {
      // Savings, FDR, Sanchaypatra, or Mutual Fund Lump-Sum
      const years = customTenure;
      const totalInvested = amount;
      const balance = amount * Math.pow(1 + (rate / 100), years);
      const grossEarnings = Math.max(0, balance - totalInvested);
      const taxRate = hasTIN ? 0.10 : 0.15;
      const taxAmount = grossEarnings * taxRate;
      const netPayout = totalInvested + grossEarnings - taxAmount;
      return { totalInvested, grossEarnings, taxAmount, taxRebate: 0, netPayout, estimatedCoverage: 0, taxRate, totalMonths: months };
    }
  };

  const { totalInvested, grossEarnings, taxAmount, taxRebate, netPayout, estimatedCoverage, taxRate, totalMonths } = calculateResult();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Content Card */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-4xl w-full relative z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-slate-100 overflow-hidden shadow-sm shrink-0">
                {product.logoUrl ? (
                  <img src={product.logoUrl} alt={product.bankName} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-sm font-bold text-slate-700">
                    {product.bankName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">{product.bankName}</h2>
                  <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    {product.type}
                  </span>
                  {product.isShariahCompliant && (
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border border-emerald-100">
                      <ShieldCheck size={9} />
                      HALAL
                    </span>
                  )}
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border border-emerald-100">
                    Nov 2026 Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold">{product.productName}</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
            {/* Quick Stats Grid - Tailored to Category */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {product.type} Key Pointers
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${
                    product.safetyRating === 'Safe' ? 'bg-emerald-500' : 
                    product.safetyRating === 'Moderate' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  <span className="text-[9px] font-bold text-slate-700">{product.safetyRating} Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pointers.map((ptr, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                      {ptr.label}
                    </span>
                    <span className={`text-xl font-black ${
                      ptr.isHighlight ? 'text-emerald-600' : 'text-slate-900'
                    } tracking-tight`}>
                      {ptr.value}
                    </span>
                    {ptr.sub && (
                      <span className="text-[9px] text-slate-500 font-medium mt-1">
                        {ptr.sub}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Easily Understandable Explainer Section */}
            <div className="bg-gradient-to-br from-indigo-50/40 via-white to-transparent border border-slate-100 rounded-2xl p-5 md:p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">How This Scheme Works</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {product.isShariahCompliant && (
                  <span className="block mb-2 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs">
                    ☪ Shariah Certified: This instrument strictly adheres to Islamic banking principles audited by independent Shariah Supervisory Committees. It is 100% Riba-Free and operates under Mudaraba (profit & loss sharing), Wakalah bil Istithmar, or Sukuk asset-backed structures. Earnings represent halal profit-sharing ratios rather than interest.
                  </span>
                )}
                {product.type === 'Loan' && `This credit facility provides structured borrowing under the Bangladesh Bank policy regime (SMART & Repo linked, 10.00% benchmark). Repayment is amortized into Equal Monthly Installments (EMI) across your chosen tenure with transparent processing fees and zero hidden charges.`}
                {product.type === 'Pension' && `Under the National Universal Pension Scheme (NPS / সর্বজনীন পেনশন স্কিম by the National Pension Authority) and Premier Bank Pension DPS, you contribute monthly during your productive years (ages 18-50). Upon reaching age 60, you receive guaranteed lifelong monthly pensions with 100% tax exemption under Section 44 of the Income Tax Act.`}
                {product.type === 'Exclusive' && `This is an exclusive high-tier wealth creation package designed for ambitious targets (such as Kotipoti or Double Benefit targets) with structured bank guarantees and relationship privileges.`}
                {product.type === 'DPS' && `DPS (Deposit Pension Scheme) is a disciplined monthly savings plan where you invest a fixed sum at the start of each month. Your money accumulates with compound profit returns over a defined horizon.`}
                {product.type === 'FDR' && `Fixed Deposit Receipt (FDR) allows you to lock a lump-sum deposit for a fixed tenure (from 3 months to 5 years), offering guaranteed interest payouts superior to standard savings accounts.`}
                {product.type === 'Savings' && `This high-yield savings account offers unconditional, 100% instant liquidity with zero lock-in period. Interest is computed on your daily closing balance and credited monthly or half-yearly.`}
                {product.type === 'Mutual Fund' && `This open-ended mutual fund offers both Monthly SIP (disciplined monthly wealth-building with compounding over 1 to 30 years) and Lump-Sum unit purchase. Professionally managed by licensed asset managers, units can be redeemed anytime at the published Net Asset Value (NAV).`}
                {product.type === 'Insurance' && `This comprehensive insurance package provides life and health protection, hospitalization coverage, and tax rebate advantages under Section 44 of the Income Tax Act 2023.`}
                {product.type === 'Sanchaypatra' && `Backed 100% by the sovereign Government of Bangladesh, National Savings Certificates offer the ultimate risk-free investment with monthly or quarterly coupon transfers directly to your bank account.`}
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Projection / Estimator Section */}
            <div className="border border-slate-200 rounded-3xl p-6 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Calculator size={18} />
                  </div>
                  <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                    {isLoan ? 'Loan Equal Monthly Installment (EMI) Estimator' :
                     isPension ? 'Universal Pension & Retirement Annuity Estimator' :
                     isInsurance ? 'Insurance Protection & Tax Rebate Estimator' : 
                     isSavings ? 'Savings Daily Accrual Estimator (Zero Lock-in)' : 
                     isMutualFund ? (mfMode === 'sip' ? 'Mutual Fund Systematic Investment Plan (SIP) Projection' : 'Mutual Fund Lump-Sum Growth & Dividend Projection') : 
                     'Maturity Projection (Live Example)'}
                  </h3>
                </div>

                {/* Mutual Fund Investment Mode Selector */}
                {isMutualFund && (
                  <div className="mb-6 p-1.5 bg-slate-800/90 border border-slate-700 rounded-2xl flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 px-3 tracking-wider">Investment Mode:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMfMode('sip');
                        setAmount(product.minAmount || 2000);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        mfMode === 'sip'
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                    >
                      <TrendingUp size={14} className="text-white" />
                      <span>Monthly SIP (Systematic Plan)</span>
                      <span className="text-[8px] bg-emerald-600/70 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Recommended</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMfMode('lump');
                        setAmount(50000);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        mfMode === 'lump'
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                    >
                      <Zap size={14} className="text-white" />
                      <span>Lump Sum (One-Time / FD Style)</span>
                    </button>
                  </div>
                )}

                {/* Calculator settings */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
                  <div className={`${isSavings || isInsurance ? 'md:col-span-6' : 'md:col-span-6'} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                        {isLoan ? 'Loan Principal Amount Requested' :
                         isPension ? 'Monthly Pension Contribution' :
                         isInsurance ? (product.tenureMonths <= 12 ? 'Annual Premium Amount' : 'Monthly Premium Amount') :
                         isMutualFund && mfMode === 'sip' ? 'Monthly SIP Installment Amount' :
                         isMutualFund && mfMode === 'lump' ? 'Initial Lump-Sum Investment Principal' :
                         isMonthlyType ? 'Monthly Installment Amount' : 
                         isSavings ? 'Average Balance Maintained (Liquid)' : 'Initial Investment Principal'}
                      </label>
                      {isMutualFund && (
                        <span className="text-[9px] font-bold text-emerald-400">
                          {mfMode === 'sip' ? `Min SIP: ৳${(product.minAmount || 1000).toLocaleString('en-IN')}/mo` : `Min Entry: ৳${(product.minAmount || 5000).toLocaleString('en-IN')}`}
                        </span>
                      )}
                      {isLoan && product.maxLoanLimit && (
                        <span className="text-[9px] font-bold text-amber-400">
                          Max Limit: ৳{(product.maxLoanLimit).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-3 border border-slate-700">
                      <span className="text-slate-400 text-sm font-bold">BDT</span>
                      <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="bg-transparent text-white font-mono font-bold text-lg focus:outline-none w-full"
                        min={product.minAmount || 500}
                        step={isLoan ? "50000" : isInsurance ? "1000" : (isMonthlyType || (isMutualFund && mfMode === 'sip')) ? "500" : "5000"}
                      />
                    </div>

                    {/* Quick Presets */}
                    {isLoan && (
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">Quick:</span>
                        {[100000, 300000, 500000, 1000000, 2000000, 5000000].map(preset => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setAmount(preset)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                              amount === preset 
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
                            }`}
                          >
                            ৳{preset >= 100000 ? `${preset / 100000}L` : `${preset / 1000}k`}
                          </button>
                        ))}
                      </div>
                    )}

                    {isPension && (
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">Quick:</span>
                        {[1000, 2000, 3000, 5000, 10000].map(preset => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setAmount(preset)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                              amount === preset 
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' 
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
                            }`}
                          >
                            ৳{preset >= 1000 ? `${preset / 1000}k` : preset}/mo
                          </button>
                        ))}
                      </div>
                    )}

                    {isMutualFund && (
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">Quick:</span>
                        {mfMode === 'sip' ? (
                          [1000, 2000, 5000, 10000, 25000].map(preset => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setAmount(preset)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                                amount === preset 
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
                              }`}
                            >
                              ৳{preset >= 1000 ? `${preset / 1000}k` : preset}/mo
                            </button>
                          ))
                        ) : (
                          [25000, 50000, 100000, 500000].map(preset => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setAmount(preset)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                                amount === preset 
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
                              }`}
                            >
                              ৳{preset >= 100000 ? `${preset / 100000}L` : `${preset / 1000}k`}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tenure or Duration selector - Always available and reactive for all products */}
                  <div className="md:col-span-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                        {isLoan ? 'Loan Tenure Horizon' :
                         isPension ? 'Contribution Horizon (Age 60)' :
                         isSavings ? 'Holding Horizon (No Lock-in)' : 
                         isMutualFund ? (mfMode === 'sip' ? 'SIP Horizon (Up to 30 Yrs)' : 'Holding Horizon') : 
                         product.type === 'FDR' ? 'Fixed Deposit Lock-in Term' :
                         product.type === 'DPS' || product.type === 'Exclusive' ? 'DPS Target Tenure' :
                         product.type === 'Sanchaypatra' ? 'Govt Certificate Term' :
                         product.type === 'Insurance' ? 'Policy Protection Horizon' :
                         'Investment Horizon'}
                      </label>
                      <span className="text-xs font-bold font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30">
                        {customTenure} {customTenure === 1 ? 'Year' : 'Years'} ({Math.round(customTenure * 12)} mo)
                      </span>
                    </div>

                    <select 
                      value={customTenure} 
                      onChange={(e) => setCustomTenure(Number(e.target.value))}
                      className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none w-full cursor-pointer hover:border-slate-500 transition-colors"
                    >
                      {isLoan ? (
                        [
                          { y: 1, label: '1 Year (12 Mo)' },
                          { y: 2, label: '2 Years (24 Mo)' },
                          { y: 3, label: '3 Years (36 Mo)' },
                          { y: 5, label: '5 Years (Standard EMI)' },
                          { y: 7, label: '7 Years (Medium Term)' },
                          { y: 10, label: '10 Years (Extended Term)' },
                          { y: 15, label: '15 Years (Home Mortgage)' },
                          { y: 20, label: '20 Years (Home Loan)' },
                          { y: 25, label: '25 Years (Max Housing)' },
                        ].map(opt => (
                          <option key={opt.y} value={opt.y}>{opt.label}</option>
                        ))
                      ) : isPension ? (
                        [
                          { y: 5, label: '5 Years' },
                          { y: 10, label: '10 Years (Min NPS Tier)' },
                          { y: 15, label: '15 Years' },
                          { y: 20, label: '20 Years (Recommended)' },
                          { y: 25, label: '25 Years' },
                          { y: 30, label: '30 Years' },
                          { y: 35, label: '35 Years' },
                          { y: 42, label: '42 Years (Age 18 to 60)' },
                        ].map(opt => (
                          <option key={opt.y} value={opt.y}>{opt.label}</option>
                        ))
                      ) : isMutualFund ? (
                        [
                          { y: 1, label: '1 Year' },
                          { y: 2, label: '2 Years' },
                          { y: 3, label: '3 Years' },
                          { y: 5, label: '5 Years (Medium Term)' },
                          { y: 7, label: '7 Years' },
                          { y: 10, label: '10 Years (Decade Growth)' },
                          { y: 15, label: '15 Years (Long-Term SIP)' },
                          { y: 20, label: '20 Years (Wealth Creation)' },
                          { y: 25, label: '25 Years (Retirement Corpus)' },
                          { y: 30, label: '30 Years (Generational Wealth)' },
                        ].map(opt => (
                          <option key={opt.y} value={opt.y}>{opt.label}</option>
                        ))
                      ) : product.type === 'FDR' ? (
                        [
                          { y: 0.25, label: '3 Months (Quarterly)' },
                          { y: 0.5, label: '6 Months (Half-Yearly)' },
                          { y: 1, label: '1 Year (Annual Maturity)' },
                          { y: 2, label: '2 Years' },
                          { y: 3, label: '3 Years' },
                          { y: 5, label: '5 Years (Max FDR Term)' },
                        ].map(opt => (
                          <option key={opt.y} value={opt.y}>{opt.label}</option>
                        ))
                      ) : product.type === 'Sanchaypatra' ? (
                        [
                          { y: 3, label: '3 Years (Statutory)' },
                          { y: 5, label: '5 Years (Govt Term)' },
                        ].map(opt => (
                          <option key={opt.y} value={opt.y}>{opt.label}</option>
                        ))
                      ) : product.type === 'DPS' || product.type === 'Exclusive' ? (
                        [
                          { y: 1, label: '1 Year' },
                          { y: 2, label: '2 Years' },
                          { y: 3, label: '3 Years' },
                          { y: 5, label: '5 Years (Standard DPS)' },
                          { y: 7, label: '7 Years' },
                          { y: 10, label: '10 Years (Milestone)' },
                          { y: 15, label: '15 Years' },
                          { y: 20, label: '20 Years' },
                        ].map(opt => (
                          <option key={opt.y} value={opt.y}>{opt.label}</option>
                        ))
                      ) : (
                        [1, 2, 3, 5, 7, 10, 15, 20].map(y => (
                          <option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'}</option>
                        ))
                      )}
                    </select>

                    {/* Quick clickable Horizon Chips for instant reactivity */}
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">Horizon:</span>
                      {(isPension
                        ? [5, 10, 15, 20, 25, 30, 35, 42]
                        : isLoan
                        ? [1, 2, 3, 5, 7, 10, 15, 20, 25]
                        : isMutualFund
                        ? [1, 3, 5, 10, 15, 20, 25, 30]
                        : product.type === 'FDR'
                        ? [0.25, 0.5, 1, 2, 3, 5]
                        : product.type === 'Sanchaypatra'
                        ? [3, 5]
                        : product.type === 'DPS' || product.type === 'Exclusive'
                        ? [1, 2, 3, 5, 7, 10, 15, 20]
                        : [1, 2, 3, 5, 7, 10]
                      ).map(h => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setCustomTenure(h)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all ${
                            customTenure === h
                              ? (isPension ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                                 : isLoan ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                                 : 'bg-emerald-600 text-white border-emerald-400 shadow-sm')
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500 hover:bg-slate-700/80'
                          }`}
                        >
                          {h === 0.25 ? '3Mo' : h === 0.5 ? '6Mo' : `${h}Y`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tax Status Selector & Instant Toggle Buttons */}
                  <div className="md:col-span-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                        {isLoan ? 'CIB & Verification Status' : 'Tax Status (e-TIN Certificate)'}
                      </label>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        hasTIN 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {hasTIN ? '✓ Verified e-TIN' : '⚠ No e-TIN'}
                      </span>
                    </div>

                    {/* Interactive 2-Option Pill Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setHasTIN(true)}
                        className={`p-2.5 rounded-xl text-left border transition-all flex flex-col gap-0.5 ${
                          hasTIN 
                            ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 text-white' 
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${hasTIN ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                          {isLoan ? 'Clean CIB & e-TIN' : 'With e-TIN'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          {isLoan ? '0.5% Fee (Best Rate)' : isPension ? '15% Rebate • 0% AIT' : isInsurance ? '15% Sec 44 Rebate' : '10% AIT Tax Rate'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHasTIN(false)}
                        className={`p-2.5 rounded-xl text-left border transition-all flex flex-col gap-0.5 ${
                          !hasTIN 
                            ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/20 text-white' 
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${!hasTIN ? 'bg-rose-400' : 'bg-slate-500'}`} />
                          {isLoan ? 'Standard CIB' : 'No e-TIN'}
                        </span>
                        <span className="text-[10px] text-rose-300 font-medium">
                          {isLoan ? '1.0% Fee Standard' : isPension ? '10% Rebate • 10% AIT' : isInsurance ? '10% Sec 44 Rebate' : '15% AIT Tax Rate'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Parameters Ribbon */}
                <div className="mb-6 px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Current Simulation:</span>
                    <span className="font-bold text-white">৳{amount.toLocaleString('en-IN')}{isMonthlyType ? '/month' : ''}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-bold text-purple-300">{customTenure} Years ({Math.round(customTenure * 12)} months)</span>
                    <span className="text-slate-500">•</span>
                    <span className={`font-bold ${hasTIN ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {hasTIN ? 'With e-TIN (15% Max Benefit)' : 'Without e-TIN (Standard Tax)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Updates live on every change</span>
                </div>

                {/* Calculated Values Summary Cards */}
                {isLoan ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 border-b border-slate-800 pb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Principal Loan Sanction</p>
                      <p className="text-xl font-bold font-mono text-slate-200">৳ {totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                      <p className="text-[9px] text-amber-400 font-semibold mt-0.5">{totalMonths} monthly installments</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Total Borrowing Interest</p>
                      <p className="text-xl font-bold font-mono text-amber-400">+ ৳ {grossEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">@ {product.interestRate}% annual rate</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Est. Processing Fee (1%)</p>
                      <p className="text-xl font-bold font-mono text-rose-400">৳ {taxAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">One-off deduction upon disbursement</p>
                    </div>
                  </div>
                ) : isPension ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 border-b border-slate-800 pb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Total Pension Contributions</p>
                      <p className="text-xl font-bold font-mono text-slate-200">৳ {totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                      <p className="text-[9px] text-purple-400 font-semibold mt-0.5">৳{amount.toLocaleString('en-IN')}/mo × {totalMonths} months</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Profit Accrued / Govt Share</p>
                      <p className="text-xl font-bold font-mono text-emerald-400">+ ৳ {grossEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">@ {product.interestRate}% compounding return</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Sec 44 Direct Tax Rebate</p>
                      <p className="text-xl font-bold font-mono text-emerald-400">৳ {taxRebate.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / yr</p>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">15% rebate on annual contributions</p>
                    </div>
                  </div>
                ) : isInsurance ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 border-b border-slate-800 pb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Annual Premium Commitment</p>
                      <p className="text-xl font-bold font-mono text-slate-200">৳ {totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Est. Protection Pool / Cover</p>
                      <p className="text-xl font-bold font-mono text-blue-400">৳ {estimatedCoverage.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Sec 44 Direct Tax Rebate</p>
                      <p className="text-xl font-bold font-mono text-emerald-400">৳ {taxRebate.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / yr</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 border-b border-slate-800 pb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                        {isSavings ? 'Average Balance Maintained' : 
                         isMutualFund && mfMode === 'sip' ? 'Total Monthly SIP Invested' : 
                         'Total Invested Principal'}
                      </p>
                      <p className="text-xl font-bold font-mono text-slate-200">৳ {totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                      {isMutualFund && mfMode === 'sip' && (
                        <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">
                          ৳{amount.toLocaleString('en-IN')}/mo × {totalMonths} installments
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                        {isMutualFund ? 'Gross Compounded Profit' : 'Gross Return Profit'}
                      </p>
                      <p className="text-xl font-bold font-mono text-emerald-400">+ ৳ {grossEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                      {isMutualFund && (
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                          @ {product.interestRate}% expected annual return
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">AIT Tax Deducted ({taxRate * 100}%)</p>
                      <p className="text-xl font-bold font-mono text-rose-400">- ৳ {taxAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                        {hasTIN ? '10% with e-TIN' : '15% standard withholding'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Final Net Amount */}
                <div className={`rounded-2xl p-5 border ${
                  isLoan ? 'bg-amber-500/10 border-amber-500/20' :
                  isPension ? 'bg-purple-500/10 border-purple-500/20' :
                  'bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className={`text-[11px] uppercase tracking-widest font-black mb-1 ${
                        isLoan ? 'text-amber-400' : isPension ? 'text-purple-400' : 'text-emerald-400'
                      }`}>
                        {isLoan ? 'Estimated Monthly EMI Repayment' :
                         isPension ? 'Estimated Lifelong Monthly Pension (Post 60)' :
                         isInsurance ? 'Estimated Protection & Benefit (Net)' : 
                         isSavings ? 'Net Balance with Accrued Profit' : 
                         isMutualFund && mfMode === 'sip' ? 'Estimated SIP Wealth Corpus (Net)' :
                         isMutualFund ? 'Estimated Net Mutual Fund Payout' :
                         'Estimated Total Net Payout'}
                      </p>
                      <p className={`text-3xl font-black font-mono ${
                        isLoan ? 'text-amber-400' : isPension ? 'text-purple-400' : 'text-emerald-400'
                      }`}>
                        ৳ {isLoan ? `${netPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / mo` :
                           isPension ? `${estimatedCoverage.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / mo` :
                           isInsurance && estimatedCoverage > 0 ? estimatedCoverage.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 
                           netPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      {isLoan && (
                        <p className="text-xs text-slate-300 font-medium mt-1">
                          Total Repayment: <strong className="text-white">৳ {estimatedCoverage.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
                        </p>
                      )}
                      {isPension && (
                        <p className="text-xs text-slate-300 font-medium mt-1">
                          Accumulated Corpus at Age 60: <strong className="text-white">৳ {netPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
                        </p>
                      )}
                    </div>
                    <div className="max-w-md text-xs text-slate-300 leading-relaxed font-medium">
                      {isLoan ? (
                        <span>Borrowing <span className="text-white font-bold">৳ {amount.toLocaleString('en-IN')}</span> for <span className="text-amber-300 font-bold">{customTenure} Years</span> ({totalMonths} months) at <span className="text-white font-bold">{product.interestRate}%</span> results in a monthly EMI of <span className="text-amber-300 font-bold">৳ {netPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo</span>. Total interest over tenure is <span className="text-slate-200 font-bold">৳ {grossEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>.</span>
                      ) : isPension ? (
                        <span>Contributing <span className="text-white font-bold">৳ {amount.toLocaleString('en-IN')}/mo</span> for <span className="text-purple-300 font-bold">{customTenure} Years</span> ({totalMonths} months) builds an accumulated pension fund of <span className="text-white font-bold">৳ {netPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>, yielding an estimated guaranteed <span className="text-purple-300 font-bold">৳ {estimatedCoverage.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/month</span> lifelong pension post age 60 with <span className="text-emerald-300 font-bold">{hasTIN ? '100% tax exemption' : '10% Source Tax (AIT) withholding'}</span>.</span>
                      ) : isInsurance ? (
                        <span>For a premium of <span className="text-white font-bold">৳ {amount.toLocaleString('en-IN')}</span>, you secure up to <span className="text-blue-300 font-bold">৳ {estimatedCoverage.toLocaleString('en-IN')}</span> in family coverage with <span className="text-emerald-400 font-bold">৳ {taxRebate.toLocaleString('en-IN')}</span> direct tax savings per year.</span>
                      ) : isSavings ? (
                        <span>Maintaining an average balance of <span className="text-white font-bold">৳ {amount.toLocaleString('en-IN')}</span> generates an estimated <span className="text-emerald-400 font-bold">৳ {(grossEarnings - taxAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span> in net profits while keeping your money <span className="text-emerald-300 font-bold">100% accessible anytime</span> without lock-in penalties.</span>
                      ) : isMutualFund && mfMode === 'sip' ? (
                        <span>Investing <span className="text-white font-bold">৳ {amount.toLocaleString('en-IN')}</span> monthly via SIP for <span className="text-white font-bold">{customTenure} Years</span> ({totalMonths} monthly installments) at <span className="text-white font-bold">{product.interestRate}%</span> expected return builds an estimated wealth corpus of <span className="text-emerald-400 font-bold">৳ {netPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })} BDT</span> (generating <span className="text-emerald-300 font-bold">৳ {grossEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span> in compound profit).</span>
                      ) : isMutualFund && mfMode === 'lump' ? (
                        <span>Investing <span className="text-white font-bold">৳ {amount.toLocaleString('en-IN')}</span> one-time (Lump Sum) for <span className="text-white font-bold">{customTenure} Years</span> at <span className="text-white font-bold">{product.interestRate}%</span> yields an estimated net payout of <span className="text-emerald-400 font-bold">৳ {netPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })} BDT</span>.</span>
                      ) : (
                        <span>Investing <span className="text-white font-bold">৳ {amount.toLocaleString('en-IN')}</span> {isMonthlyType ? 'monthly' : 'one-time'} for <span className="text-white font-bold">{displayTenureYears} Years</span> at <span className="text-white font-bold">{product.interestRate}%</span> yields an estimated net payout of <span className="text-emerald-400 font-bold">৳ {netPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })} BDT</span>.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpful Guide / Requisite Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-600" />
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-widest">Required Documents Checklist</h4>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                  {[
                    '2 copies of recent passport size photograph of Key Saver / Policyholder',
                    'NID card photocopy or SMART Card (NID is mandatory across all institutions)',
                    'Passport / Birth Registration photocopy (if NID unavailable for minors)',
                    '1 copy of Nominee photograph and Nominee NID photocopy',
                    'e-TIN certificate photocopy (Crucial to reduce tax deduction from 15% to 10%)',
                    'A valid utility bill photocopy (for address proof checks)'
                  ].map((doc, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-slate-600" />
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-widest">Eligibility & Rules</h4>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 text-xs text-slate-600 leading-relaxed">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">Age Limits</span>
                    Must be 18 years or older. Minor accounts may be activated under joint configuration with lawful legal guardian supervision.
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">Taxation Guidelines</span>
                    {isInsurance ? 'Insurance premiums are eligible for direct investment tax rebates up to 15% under Section 44 of the Income Tax Act 2023.' : 'Source Tax (AIT) of 10% (with e-TIN) or 15% (without e-TIN) is automatically withheld upon profit disbursement.'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">Liquidity & Early Exit</span>
                    {isSavings ? '100% Instant Liquidity. Zero early withdrawal penalty: funds are accessible 24/7 via ATM, NPSB, or counter.' :
                     isInsurance ? 'Free-look period of 15 days upon policy delivery. Surrender value available after minimum policy tenure according to IDRA regulations.' :
                     isMutualFund ? 'Open-ended fund: units can be purchased or redeemed anytime at the published NAV without exit penalties.' :
                     product.earlyEncashmentPenalty ? `Note: Early closure is permitted but subject to a penalty of "${product.earlyEncashmentPenalty}". Interest will recalculate on savings rate.` : 'Allowed after completing 1 year of deposit tenure. Accrued interest is modified back to basic savings rate penalties.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer action */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onCompare(product)}
                className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                  isComparing 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-800'
                }`}
              >
                {isComparing ? 'Remove from Tray' : 'Compare Rates'}
              </button>
              <button 
                onClick={onClose}
                className="flex-1 sm:flex-initial bg-slate-950 hover:bg-slate-800 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Close Details
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium">
              * Rates & terms might be altered by the respective institution or Bangladesh Bank. Please verify beforehand.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
