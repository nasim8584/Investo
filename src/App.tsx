/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, ShieldCheck, PiggyBank, ArrowRightLeft, Search, ChevronRight, ChevronDown, Calculator, MessageSquare, X, Plus, Minus, ArrowUpRight, Info, Menu, Filter, Home, Newspaper, RefreshCw, Zap, ShoppingBag, Sparkles, Moon, Clock, Timer, Copy, Check, Maximize2, Minimize2, RotateCcw, Bot, Landmark, Wallet, CreditCard, Car, Building2, Store, Sprout, GraduationCap, Briefcase, Users, Coins, BadgeDollarSign, HelpCircle, BookOpen, Compass, Umbrella, PieChart } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { financialProducts, FinancialProduct, ProductType, getProductPointers, ProductPointer } from './data/financialProducts';
import { PackageDetailModal } from './components/PackageDetailModal';
import { FAQPage } from './components/FAQPage';
import { FAQS_DATA, FAQCategory } from './data/faqs';
import { HoverFullText } from './components/HoverFullText';

export type AppFilter = ProductType | 'All' | 'Home' | 'Shariah' | 'RegularSavings' | 'FAQ';

// --- News & Market Pulse Components ---

let cachedPulseData: { title: string; summary: string; impact: string; category: string }[] | null = null;
let cachedIsFallback = false;

const HorizontalSlider = ({ children, className = "", gridClassName = "md:grid-cols-3" }: { children: React.ReactNode; className?: string; gridClassName?: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = React.useState({ left: 0, right: 0 });
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const updateConstraints = () => {
        const { scrollWidth, offsetWidth } = containerRef.current!;
        setConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
        setShowHint(scrollWidth > offsetWidth);
      };
      
      updateConstraints();
      window.addEventListener('resize', updateConstraints);
      return () => window.removeEventListener('resize', updateConstraints);
    }
  }, [children]);

  return (
    <div className={`relative group/slider -mx-4 px-4 md:mx-0 md:px-0 overflow-hidden ${className}`}>
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.1}
        onDragStart={() => setShowHint(false)}
        className={`flex md:grid gap-6 cursor-grab active:cursor-grabbing py-2 ${gridClassName}`}
        style={{ touchAction: 'pan-y' }}
      >
        {children}
      </motion.div>

      {/* Subtle Swipe Hint for Mobile */}
      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 0.5, x: [0, 8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute right-2 top-11 md:hidden pointer-events-none flex flex-col items-center gap-0.5"
          >
            <div className="bg-emerald-500/20 p-1.5 rounded-full backdrop-blur-sm">
              <ChevronRight size={20} className="text-emerald-500" />
            </div>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-600/60 rotate-90 origin-center translate-y-6">Slide</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MarketPulse = () => {
  const [pulseData, setPulseData] = useState<{ title: string; summary: string; impact: string; category: string }[]>(cachedPulseData || []);
  const [loading, setLoading] = useState(!cachedPulseData);
  const [isFallback, setIsFallback] = useState(cachedIsFallback);
  const [error, setError] = useState(false);

  const FALLBACK_PULSE = [
    {
      title: "Bangladesh Bank Policy Rate Anchored at 10.00%",
      summary: "Entering mid-Q4 2026, Bangladesh Bank sustains its anti-inflationary monetary policy stance with the benchmark repo rate held at 10.00% (SLF 11.50%, SDF 8.50%), keeping commercial bank FDR yields competitive at 10.50% - 12.00% across scheduled lenders.",
      impact: "Retail investors can lock in peak multi-year FDR and DPS yields across premier private commercial banks.",
      category: "Policy"
    },
    {
      title: "Banking Governance & Restructuring",
      summary: "Bangladesh Bank's strengthened oversight, liquidity mechanisms through the Islamic Banks Liquidity Facility (IBLF), and independent board governance restore depositor stability across all scheduled lenders.",
      impact: "Enhanced depositor confidence and competitive profit-sharing ratios on Mudaraba and conventional term deposits.",
      category: "Banking"
    },
    {
      title: "National Savings & UPension Automation",
      summary: "Automated BEFTN/NPSB coupon settlements for Sanchaypatra (up to 11.76% p.a.) and real-time contribution tracking on the Universal Pension Scheme (UPension) portal streamline retail wealth management.",
      impact: "Direct digital crediting of monthly profits and retirement annuities without branch visits.",
      category: "Market"
    }
  ];

  const fetchPulse = async (forceSearch = false) => {
    if (!forceSearch && cachedPulseData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    setIsFallback(false);
    try {
      const res = await fetch('/api/market-pulse');
      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }
      const data = await res.json();
      if (data.pulse && Array.isArray(data.pulse) && data.pulse.length > 0) {
        setPulseData(data.pulse);
        cachedPulseData = data.pulse;
        setIsFallback(Boolean(data.isFallback));
        cachedIsFallback = Boolean(data.isFallback);
      } else {
        setPulseData(FALLBACK_PULSE);
        cachedPulseData = FALLBACK_PULSE;
        setIsFallback(true);
        cachedIsFallback = true;
      }
    } catch {
      // Seamlessly fallback without throwing console errors
      setPulseData(FALLBACK_PULSE);
      cachedPulseData = FALLBACK_PULSE;
      setIsFallback(true);
      cachedIsFallback = true;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPulse();
  }, []);

  if (loading) {
    return (
      <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-44 bg-slate-200/50 rounded-3xl animate-pulse border border-slate-100" />
        ))}
      </div>
    );
  }

  if (error && pulseData.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#4CAF50] rounded-lg text-white shadow-lg shadow-[#4CAF50]/20">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Daily Market Pulse</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {isFallback ? 'General Market Insights' : 'AI-Powered Financial Insights'}
              </p>
              {isFallback && (
                <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 font-bold uppercase">Cached</span>
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={() => fetchPulse(true)}
          className="p-2 text-slate-400 hover:text-[#4CAF50] transition-colors bg-white border border-slate-200 rounded-xl shadow-sm group"
          title="Refresh Pulse"
        >
          <RefreshCw size={14} className="group-active:rotate-180 transition-transform duration-500" />
        </button>
      </div>
      <HorizontalSlider>
        {pulseData.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group flex-shrink-0 w-[85vw] sm:w-[400px] md:w-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col relative overflow-hidden select-none"
          >
            <div className="absolute top-0 right-0 p-3">
              <Newspaper size={40} className="text-slate-50 group-hover:text-emerald-50 transition-colors" />
            </div>
            <div className="mb-4">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest border border-slate-200">
                {item.category}
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-2 leading-tight group-hover:text-[#4CAF50] transition-colors pr-8">
              {item.title}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
              {item.summary}
            </p>
            <div className="pt-4 border-t border-slate-50 mt-auto">
              <p className="text-[9px] font-bold text-[#4CAF50] uppercase tracking-widest mb-1">Investor Impact</p>
              <p className="text-[10px] text-slate-400 font-medium italic">"{item.impact}"</p>
            </div>
          </motion.div>
        ))}
      </HorizontalSlider>
    </div>
  );
};

// --- Components ---

const BankTankLogo = ({ className = "w-8 h-8", showText = true, textSize = "text-xl", lightText = false }: { className?: string; showText?: boolean; textSize?: string; lightText?: boolean }) => (
  <div className="flex items-center gap-2.5">
    <div className={className}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Shield */}
        <path d="M50 10L15 25V55C15 75 50 90 50 90C50 90 85 75 85 55V25L50 10Z" fill="#0A2A4D" />
        <path d="M51.5 15.5L80.5 28V55C80.5 71.5 54.5 84 51.5 85.5L48.5 84C45.5 82.5 19.5 70 19.5 55V28L48.5 15.5H51.5Z" fill="white" />
        {/* Arrow Path */}
        <path d="M25 60L45 42L58 55L78 30" stroke="#4CAF50" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M62 30H78V46" stroke="#4CAF50" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    {showText && (
      <h1 className={`${textSize} font-black tracking-tighter flex items-center`}>
        <span className={lightText ? "text-white" : "text-[#0A2A4D]"}>BANK</span>
        <span className="text-[#4CAF50]">TANK</span>
      </h1>
    )}
  </div>
);

export const REGULAR_SUB_ITEMS: { 
  id: 'All' | 'Savings' | 'FDR' | 'DPS' | 'Exclusive' | 'Sanchaypatra'; 
  label: string; 
  countKey: 'all' | 'savings' | 'fdr' | 'dps' | 'schemes' | 'nationalSavings'; 
  icon: any;
}[] = [
  { id: 'All', label: 'All Regular Savings', countKey: 'all', icon: Wallet },
  { id: 'Savings', label: 'Basic Saving Account', countKey: 'savings', icon: PiggyBank },
  { id: 'FDR', label: 'Fixed Deposit (FD)', countKey: 'fdr', icon: ShieldCheck },
  { id: 'DPS', label: 'DPS Packages', countKey: 'dps', icon: TrendingUp },
  { id: 'Exclusive', label: 'Schemes', countKey: 'schemes', icon: Sparkles },
  { id: 'Sanchaypatra', label: 'National Savings', countKey: 'nationalSavings', icon: Landmark },
];

export const SHARIAH_SUB_ITEMS: { 
  id: 'All' | 'Savings' | 'DPS' | 'FDR' | 'Mutual Fund' | 'Other'; 
  label: string; 
  countKey: 'all' | 'savings' | 'dps' | 'fdr' | 'funds' | 'other'; 
  icon: any;
}[] = [
  { id: 'All', label: 'All Shariah Plans', countKey: 'all', icon: Moon },
  { id: 'Savings', label: 'Islamic Savings (MSA)', countKey: 'savings', icon: PiggyBank },
  { id: 'DPS', label: 'Islamic DPS (MDPS)', countKey: 'dps', icon: TrendingUp },
  { id: 'FDR', label: 'Islamic Term (MTDR)', countKey: 'fdr', icon: ShieldCheck },
  { id: 'Mutual Fund', label: 'Shariah Mutual Funds', countKey: 'funds', icon: Zap },
  { id: 'Other', label: 'Sukuk & Takaful', countKey: 'other', icon: Sparkles },
];

export const LOAN_SUB_ITEMS: { 
  id: 'All' | 'Personal' | 'Home' | 'Car' | 'SME' | 'Agriculture' | 'Corporate' | 'Education' | 'Professional' | 'Islamic' | 'Secured'; 
  label: string; 
  countKey: 'all' | 'personal' | 'home' | 'car' | 'sme' | 'agriculture' | 'corporate' | 'education' | 'professional' | 'islamic' | 'secured'; 
  icon: any;
}[] = [
  { id: 'All', label: 'All Bank Loans', countKey: 'all', icon: BadgeDollarSign },
  { id: 'Personal', label: 'Personal Loan', countKey: 'personal', icon: CreditCard },
  { id: 'Home', label: 'Home / House Loan', countKey: 'home', icon: Home },
  { id: 'Car', label: 'Car / Auto Loan', countKey: 'car', icon: Car },
  { id: 'SME', label: 'SME Business Loan', countKey: 'sme', icon: Store },
  { id: 'Agriculture', label: 'Agriculture Loan (Krishi)', countKey: 'agriculture', icon: Sprout },
  { id: 'Corporate', label: 'Corporate & Commercial', countKey: 'corporate', icon: Building2 },
  { id: 'Education', label: 'Education Loan', countKey: 'education', icon: GraduationCap },
  { id: 'Professional', label: 'Doctor & Professional', countKey: 'professional', icon: Briefcase },
  { id: 'Islamic', label: 'Islamic Financing', countKey: 'islamic', icon: Moon },
  { id: 'Secured', label: 'Gold & Secured Loan', countKey: 'secured', icon: Coins },
];

export const PENSION_SUB_ITEMS: { 
  id: 'All' | 'National' | 'BankPension' | 'SeniorCitizen'; 
  label: string; 
  countKey: 'all' | 'national' | 'bankPension' | 'seniorCitizen'; 
  icon: any;
}[] = [
  { id: 'All', label: 'All Pension Schemes', countKey: 'all', icon: Users },
  { id: 'National', label: 'National Pension Scheme (NPS)', countKey: 'national', icon: Landmark },
  { id: 'BankPension', label: 'Bank Pension Schemes (DPS)', countKey: 'bankPension', icon: PiggyBank },
  { id: 'SeniorCitizen', label: 'Probashi & Senior Pension', countKey: 'seniorCitizen', icon: ShieldCheck },
];

interface SidebarProps {
  currentFilter: string;
  onFilterChange: (f: AppFilter) => void;
  onMarketplaceClick: () => void;
  regularSubFilter?: 'All' | 'Savings' | 'FDR' | 'DPS' | 'Exclusive' | 'Sanchaypatra';
  onRegularSubFilterChange?: (sub: 'All' | 'Savings' | 'FDR' | 'DPS' | 'Exclusive' | 'Sanchaypatra') => void;
  regularCounts?: { all: number; savings: number; fdr: number; dps: number; schemes: number; nationalSavings: number };
  shariahSubFilter?: 'All' | 'Savings' | 'DPS' | 'FDR' | 'Mutual Fund' | 'Other';
  onShariahSubFilterChange?: (sub: 'All' | 'Savings' | 'DPS' | 'FDR' | 'Mutual Fund' | 'Other') => void;
  shariahCounts?: { all: number; savings: number; dps: number; fdr: number; funds: number; other: number };
  loanSubFilter?: 'All' | 'Personal' | 'Home' | 'Car' | 'SME' | 'Agriculture' | 'Corporate' | 'Education' | 'Professional' | 'Islamic' | 'Secured';
  onLoanSubFilterChange?: (sub: 'All' | 'Personal' | 'Home' | 'Car' | 'SME' | 'Agriculture' | 'Corporate' | 'Education' | 'Professional' | 'Islamic' | 'Secured') => void;
  loanCounts?: { all: number; personal: number; home: number; car: number; sme: number; agriculture: number; corporate: number; education: number; professional: number; islamic: number; secured: number };
  pensionSubFilter?: 'All' | 'National' | 'BankPension' | 'SeniorCitizen';
  onPensionSubFilterChange?: (sub: 'All' | 'National' | 'BankPension' | 'SeniorCitizen') => void;
  pensionCounts?: { all: number; national: number; bankPension: number; seniorCitizen: number };
}

const Sidebar = ({ 
  currentFilter, 
  onFilterChange, 
  onMarketplaceClick,
  regularSubFilter = 'All',
  onRegularSubFilterChange,
  regularCounts = { all: 126, savings: 38, fdr: 38, dps: 39, schemes: 7, nationalSavings: 4 },
  shariahSubFilter = 'All',
  onShariahSubFilterChange,
  shariahCounts = { all: 44, savings: 11, dps: 12, fdr: 11, funds: 5, other: 5 },
  loanSubFilter = 'All',
  onLoanSubFilterChange,
  loanCounts = { all: 28, personal: 6, home: 6, car: 5, sme: 5, agriculture: 5, corporate: 4, education: 3, professional: 2, islamic: 2, secured: 3 },
  pensionSubFilter = 'All',
  onPensionSubFilterChange,
  pensionCounts = { all: 11, national: 5, bankPension: 6, seniorCitizen: 2 }
}: SidebarProps) => {
  const [regularOpen, setRegularOpen] = useState(false);
  const [shariahOpen, setShariahOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [pensionOpen, setPensionOpen] = useState(false);

  return (
    <aside className="hidden lg:flex w-72 bg-[#0A2A4D] text-white flex-col border-r border-[#1a3a5d]">
      <div className="p-8 cursor-pointer" onClick={() => onFilterChange('Home')}>
        <BankTankLogo className="w-8 h-8" lightText={true} />
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {[
          { id: 'Home', label: 'Home', icon: Home },
          { id: 'All', label: 'Marketplace', icon: ShoppingBag },
          { id: 'RegularSavings', label: 'Regular Savings', icon: Wallet, badge: '126 Plans', hasSubMenu: true },
          { id: 'Shariah', label: 'Shariah Savings', icon: Moon, badge: 'Halal', hasSubMenu: true },
          { id: 'Loan', label: 'Bank Loans', icon: BadgeDollarSign, badge: `${loanCounts.all} Loans`, hasSubMenu: true },
          { id: 'Pension', label: 'Pension Schemes', icon: Users, badge: `${pensionCounts.all} Plans`, hasSubMenu: true },
          { id: 'Mutual Fund', label: 'Mutual Funds', icon: Zap },
          { id: 'Insurance', label: 'Insurance Plans', icon: ShieldCheck },
          { id: 'FAQ', label: 'FAQ & Knowledge Hub', icon: HelpCircle }
        ].map((item) => {
          if (item.id === 'RegularSavings') {
            const isRegularActive = currentFilter === 'RegularSavings' || 
              currentFilter === 'Savings' || 
              currentFilter === 'FDR' || 
              currentFilter === 'DPS' || 
              currentFilter === 'Exclusive' || 
              currentFilter === 'Sanchaypatra';

            return (
              <div key={item.id} className="space-y-1">
                <div className={`w-full rounded-xl flex items-center transition-all ${
                  isRegularActive
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                  <HoverFullText fullText={item.label} badge={`${regularCounts.all} Plans`} className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        onFilterChange('RegularSavings');
                        if (onRegularSubFilterChange) onRegularSubFilterChange('All');
                      }}
                      className="w-full pl-3.5 pr-1.5 py-3 flex items-center gap-2.5 text-left min-w-0"
                    >
                      <Wallet size={18} className={`shrink-0 ${isRegularActive ? 'text-white' : 'text-blue-400'}`} />
                      <span className="text-sm font-semibold truncate">{item.label}</span>
                      <span className={`ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center ${
                        isRegularActive ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {regularCounts.all} Plans
                      </span>
                    </button>
                  </HoverFullText>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRegularOpen(!regularOpen);
                    }}
                    className="pr-3 pl-1 py-3 text-slate-400 hover:text-white transition-transform shrink-0"
                    title={regularOpen ? "Collapse sub-menus" : "Expand sub-menus"}
                  >
                    <ChevronDown size={15} className={`transition-transform duration-200 ${regularOpen ? 'rotate-180 text-blue-300' : ''}`} />
                  </button>
                </div>

                {/* Regular Sub Menu Items */}
                <AnimatePresence initial={false}>
                  {regularOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 pr-1 py-1 space-y-1 border-l-2 border-blue-500/40 ml-4 my-1 bg-white/[0.03] rounded-r-xl"
                    >
                      <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest text-blue-400/80 flex items-center justify-between">
                        <span>Sub Menus:</span>
                        <span>{regularCounts.all} Plans</span>
                      </div>
                      {REGULAR_SUB_ITEMS.map((sub) => {
                        const isSubActive = (currentFilter === 'RegularSavings' && regularSubFilter === sub.id) || (sub.id !== 'All' && currentFilter === sub.id);
                        const SubIcon = sub.icon;
                        return (
                          <HoverFullText key={sub.id} fullText={sub.label} badge={regularCounts[sub.countKey]} className="w-full min-w-0">
                            <button
                              onClick={() => {
                                onFilterChange('RegularSavings');
                                if (onRegularSubFilterChange) onRegularSubFilterChange(sub.id);
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-all ${
                                isSubActive
                                  ? 'bg-blue-500 text-white font-bold shadow-sm'
                                  : 'text-slate-300 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <SubIcon size={13} className={`shrink-0 ${isSubActive ? 'text-white' : 'text-blue-400'}`} />
                                <span className="truncate">{sub.label}</span>
                              </div>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                                isSubActive ? 'bg-blue-700 text-white' : 'bg-white/10 text-slate-400'
                              }`}>
                                {regularCounts[sub.countKey]}
                              </span>
                            </button>
                          </HoverFullText>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          if (item.id === 'Shariah') {
            const isShariahActive = currentFilter === 'Shariah';
            return (
              <div key={item.id} className="space-y-1">
                <div className={`w-full rounded-xl flex items-center transition-all ${
                  isShariahActive
                    ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                  <HoverFullText fullText={item.label} badge="Halal" className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        onFilterChange('Shariah');
                      }}
                      className="w-full pl-3.5 pr-1.5 py-3 flex items-center gap-2.5 text-left min-w-0"
                    >
                      <Moon size={18} className={`shrink-0 ${isShariahActive ? 'text-white' : 'text-emerald-400'}`} />
                      <span className="text-sm font-semibold truncate">{item.label}</span>
                      <span className={`ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center ${
                        isShariahActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        Halal
                      </span>
                    </button>
                  </HoverFullText>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShariahOpen(!shariahOpen);
                    }}
                    className="pr-3 pl-1 py-3 text-slate-400 hover:text-white transition-transform shrink-0"
                    title={shariahOpen ? "Collapse sub-menus" : "Expand sub-menus"}
                  >
                    <ChevronDown size={15} className={`transition-transform duration-200 ${shariahOpen ? 'rotate-180 text-emerald-300' : ''}`} />
                  </button>
                </div>

                {/* Sub Menu Items */}
                <AnimatePresence initial={false}>
                  {shariahOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 pr-1 py-1 space-y-1 border-l-2 border-emerald-500/40 ml-4 my-1 bg-white/[0.03] rounded-r-xl"
                    >
                      <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest text-emerald-400/80 flex items-center justify-between">
                        <span>Sub Menus:</span>
                        <span>{shariahCounts.all} Plans</span>
                      </div>
                      {SHARIAH_SUB_ITEMS.map((sub) => {
                        const isSubActive = isShariahActive && shariahSubFilter === sub.id;
                        return (
                          <HoverFullText key={sub.id} fullText={sub.label} badge={shariahCounts[sub.countKey]} className="w-full min-w-0">
                            <button
                              onClick={() => {
                                onFilterChange('Shariah');
                                if (onShariahSubFilterChange) onShariahSubFilterChange(sub.id);
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 text-xs transition-all ${
                                isSubActive
                                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                                  : 'text-slate-300 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <span className="truncate">{sub.label}</span>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                                isSubActive ? 'bg-slate-950/30 text-white' : 'bg-white/10 text-slate-400'
                              }`}>
                                {shariahCounts[sub.countKey]}
                              </span>
                            </button>
                          </HoverFullText>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          if (item.id === 'Loan') {
            const isLoanActive = currentFilter === 'Loan';

            return (
              <div key={item.id} className="space-y-1">
                <div className={`w-full rounded-xl flex items-center transition-all ${
                  isLoanActive
                    ? 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                  <HoverFullText fullText={item.label} badge={`${loanCounts.all} Loans`} className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        onFilterChange('Loan');
                        if (onLoanSubFilterChange) onLoanSubFilterChange('All');
                      }}
                      className="w-full pl-3.5 pr-1.5 py-3 flex items-center gap-2.5 text-left min-w-0"
                    >
                      <BadgeDollarSign size={18} className={`shrink-0 ${isLoanActive ? 'text-white' : 'text-amber-400'}`} />
                      <span className="text-sm font-semibold truncate">{item.label}</span>
                      <span className={`ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center ${
                        isLoanActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {loanCounts.all} Loans
                      </span>
                    </button>
                  </HoverFullText>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoanOpen(!loanOpen);
                    }}
                    className="pr-3 pl-1 py-3 text-slate-400 hover:text-white transition-transform shrink-0"
                    title={loanOpen ? "Collapse sub-menus" : "Expand sub-menus"}
                  >
                    <ChevronDown size={15} className={`transition-transform duration-200 ${loanOpen ? 'rotate-180 text-amber-300' : ''}`} />
                  </button>
                </div>

                {/* Loan Sub Menu Items */}
                <AnimatePresence initial={false}>
                  {loanOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 pr-1 py-1 space-y-1 border-l-2 border-amber-500/40 ml-4 my-1 bg-white/[0.03] rounded-r-xl"
                    >
                      <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest text-amber-400/80 flex items-center justify-between">
                        <span>Loan Options:</span>
                        <span>{loanCounts.all} Plans</span>
                      </div>
                      {LOAN_SUB_ITEMS.map((sub) => {
                        const isSubActive = isLoanActive && loanSubFilter === sub.id;
                        const SubIcon = sub.icon;
                        return (
                          <HoverFullText key={sub.id} fullText={sub.label} badge={loanCounts[sub.countKey]} className="w-full min-w-0">
                            <button
                              onClick={() => {
                                onFilterChange('Loan');
                                if (onLoanSubFilterChange) onLoanSubFilterChange(sub.id);
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-all ${
                                isSubActive
                                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                                  : 'text-slate-300 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <SubIcon size={13} className={`shrink-0 ${isSubActive ? 'text-slate-950' : 'text-amber-400'}`} />
                                <span className="truncate">{sub.label}</span>
                              </div>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                                isSubActive ? 'bg-slate-950/30 text-slate-950' : 'bg-white/10 text-slate-400'
                              }`}>
                                {loanCounts[sub.countKey]}
                              </span>
                            </button>
                          </HoverFullText>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          if (item.id === 'Pension') {
            const isPensionActive = currentFilter === 'Pension';

            return (
              <div key={item.id} className="space-y-1">
                <div className={`w-full rounded-xl flex items-center transition-all ${
                  isPensionActive
                    ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                  <HoverFullText fullText={item.label} badge={`${pensionCounts.all} Plans`} className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        onFilterChange('Pension');
                        if (onPensionSubFilterChange) onPensionSubFilterChange('All');
                      }}
                      className="w-full pl-3.5 pr-1.5 py-3 flex items-center gap-2.5 text-left min-w-0"
                    >
                      <Users size={18} className={`shrink-0 ${isPensionActive ? 'text-white' : 'text-purple-400'}`} />
                      <span className="text-sm font-semibold truncate">{item.label}</span>
                      <span className={`ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center ${
                        isPensionActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {pensionCounts.all} Plans
                      </span>
                    </button>
                  </HoverFullText>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPensionOpen(!pensionOpen);
                    }}
                    className="pr-3 pl-1 py-3 text-slate-400 hover:text-white transition-transform shrink-0"
                    title={pensionOpen ? "Collapse sub-menus" : "Expand sub-menus"}
                  >
                    <ChevronDown size={15} className={`transition-transform duration-200 ${pensionOpen ? 'rotate-180 text-purple-300' : ''}`} />
                  </button>
                </div>

                {/* Pension Sub Menu Items */}
                <AnimatePresence initial={false}>
                  {pensionOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 pr-1 py-1 space-y-1 border-l-2 border-purple-500/40 ml-4 my-1 bg-white/[0.03] rounded-r-xl"
                    >
                      <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest text-purple-400/80 flex items-center justify-between">
                        <span>Pension Schemes:</span>
                        <span>{pensionCounts.all} Plans</span>
                      </div>
                      {PENSION_SUB_ITEMS.map((sub) => {
                        const isSubActive = isPensionActive && pensionSubFilter === sub.id;
                        const SubIcon = sub.icon;
                        return (
                          <HoverFullText key={sub.id} fullText={sub.label} badge={pensionCounts[sub.countKey]} className="w-full min-w-0">
                            <button
                              onClick={() => {
                                onFilterChange('Pension');
                                if (onPensionSubFilterChange) onPensionSubFilterChange(sub.id);
                              }}
                              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-all ${
                                isSubActive
                                  ? 'bg-purple-500 text-white font-bold shadow-sm'
                                  : 'text-slate-300 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <SubIcon size={13} className={`shrink-0 ${isSubActive ? 'text-white' : 'text-purple-400'}`} />
                                <span className="truncate">{sub.label}</span>
                              </div>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                                isSubActive ? 'bg-purple-800 text-white' : 'bg-white/10 text-slate-400'
                              }`}>
                                {pensionCounts[sub.countKey]}
                              </span>
                            </button>
                          </HoverFullText>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <HoverFullText key={item.id} fullText={item.label} badge={item.badge} className="w-full min-w-0">
              <button
                onClick={() => {
                  onFilterChange(item.id as any);
                }}
                className={`w-full pl-3.5 pr-3 py-3 rounded-xl flex items-center gap-2.5 transition-all text-left min-w-0 ${
                  currentFilter === item.id 
                    ? 'bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon && <item.icon size={18} className={`shrink-0 ${currentFilter === item.id ? 'text-white' : 'text-slate-400'}`} />}
                <span className="text-sm font-semibold truncate">{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center ${
                    currentFilter === item.id ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </HoverFullText>
          );
        })}
      </nav>
    </aside>
  );
};

const MobileNavigation = ({ onOpenAI, onFilterChange, onOpenAbout, onMarketplaceClick }: { 
  onOpenAI: () => void; 
  onFilterChange: (f: AppFilter) => void;
  onOpenAbout: () => void;
  onMarketplaceClick: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', icon: Home, filter: 'Home' },
    { label: 'Marketplace', icon: ShoppingBag, filter: 'All' },
    { label: 'Regular Savings', icon: Wallet, filter: 'RegularSavings' },
    { label: 'Shariah Savings', icon: Moon, filter: 'Shariah' },
    { label: 'Bank Loans', icon: BadgeDollarSign, filter: 'Loan' },
    { label: 'Pension Schemes', icon: Users, filter: 'Pension' },
    { label: 'About Us', icon: Info, action: onOpenAbout },
    { label: 'Market Advisor', icon: MessageSquare, action: onOpenAI, primary: true },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] md:hidden">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 mb-4 flex flex-col gap-3 items-end">
            {menuItems.map((item, idx) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ delay: (menuItems.length - idx) * 0.05 }}
                onClick={() => {
                  if (item.filter) onFilterChange(item.filter as any);
                  if (item.action) item.action();
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl whitespace-nowrap ${
                  item.primary ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white text-slate-600 font-medium'
                }`}
              >
                <item.icon size={18} className={item.primary ? 'text-slate-950' : 'text-emerald-500'} />
                {item.label}
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
          isOpen ? 'bg-slate-950 text-white' : 'bg-emerald-500 text-slate-950'
        }`}
      >
        {isOpen ? <X size={24} /> : <Zap size={24} className="animate-pulse" />}
      </motion.button>
    </div>
  );
};

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: string;
  onFilterChange: (f: AppFilter) => void;
  onMarketplaceClick: () => void;
  regularSubFilter?: 'All' | 'Savings' | 'FDR' | 'DPS' | 'Exclusive' | 'Sanchaypatra';
  onRegularSubFilterChange?: (sub: 'All' | 'Savings' | 'FDR' | 'DPS' | 'Exclusive' | 'Sanchaypatra') => void;
  regularCounts?: { all: number; savings: number; fdr: number; dps: number; schemes: number; nationalSavings: number };
  shariahSubFilter?: 'All' | 'Savings' | 'DPS' | 'FDR' | 'Mutual Fund' | 'Other';
  onShariahSubFilterChange?: (sub: 'All' | 'Savings' | 'DPS' | 'FDR' | 'Mutual Fund' | 'Other') => void;
  shariahCounts?: { all: number; savings: number; dps: number; fdr: number; funds: number; other: number };
  loanSubFilter?: 'All' | 'Personal' | 'Home' | 'Car' | 'SME' | 'Agriculture' | 'Corporate' | 'Education' | 'Professional' | 'Islamic' | 'Secured';
  onLoanSubFilterChange?: (sub: 'All' | 'Personal' | 'Home' | 'Car' | 'SME' | 'Agriculture' | 'Corporate' | 'Education' | 'Professional' | 'Islamic' | 'Secured') => void;
  loanCounts?: { all: number; personal: number; home: number; car: number; sme: number; agriculture: number; corporate: number; education: number; professional: number; islamic: number; secured: number };
  pensionSubFilter?: 'All' | 'National' | 'BankPension' | 'SeniorCitizen';
  onPensionSubFilterChange?: (sub: 'All' | 'National' | 'BankPension' | 'SeniorCitizen') => void;
  pensionCounts?: { all: number; national: number; bankPension: number; seniorCitizen: number };
}

const MobileDrawer = ({ 
  isOpen, 
  onClose, 
  currentFilter, 
  onFilterChange, 
  onMarketplaceClick,
  regularSubFilter = 'All',
  onRegularSubFilterChange,
  regularCounts = { all: 126, savings: 38, fdr: 38, dps: 39, schemes: 7, nationalSavings: 4 },
  shariahSubFilter = 'All',
  onShariahSubFilterChange,
  shariahCounts = { all: 44, savings: 11, dps: 12, fdr: 11, funds: 5, other: 5 },
  loanSubFilter = 'All',
  onLoanSubFilterChange,
  loanCounts = { all: 28, personal: 6, home: 6, car: 5, sme: 5, agriculture: 5, corporate: 4, education: 3, professional: 2, islamic: 2, secured: 3 },
  pensionSubFilter = 'All',
  onPensionSubFilterChange,
  pensionCounts = { all: 11, national: 5, bankPension: 6, seniorCitizen: 2 }
}: MobileDrawerProps) => {
  const [regularOpen, setRegularOpen] = useState(false);
  const [shariahOpen, setShariahOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [pensionOpen, setPensionOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] lg:hidden"
          />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#0A2A4D] text-white z-[80] flex flex-col lg:hidden overflow-y-auto"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                <div onClick={() => { onFilterChange('Home'); onClose(); }} className="cursor-pointer">
                  <BankTankLogo className="w-7 h-7" textSize="text-xl" lightText={true} />
                </div>
                <button onClick={onClose} className="text-slate-400 p-1 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1">
                {[
                  { id: 'Home', label: 'Home', icon: Home },
                  { id: 'All', label: 'Marketplace', icon: ShoppingBag },
                  { id: 'RegularSavings', label: 'Regular Savings', icon: Wallet, badge: '126 Plans', hasSubMenu: true },
                  { id: 'Shariah', label: 'Shariah Savings', icon: Moon, badge: 'Halal', hasSubMenu: true },
                  { id: 'Loan', label: 'Bank Loans', icon: BadgeDollarSign, badge: `${loanCounts.all} Loans`, hasSubMenu: true },
                  { id: 'Pension', label: 'Pension Schemes', icon: Users, badge: `${pensionCounts.all} Plans`, hasSubMenu: true },
                  { id: 'Mutual Fund', label: 'Mutual Funds', icon: Zap },
                  { id: 'Insurance', label: 'Insurance Plans', icon: ShieldCheck },
                  { id: 'FAQ', label: 'FAQ & Guides', icon: HelpCircle }
                ].map((item) => {
                  if (item.id === 'RegularSavings') {
                    const isRegularActive = currentFilter === 'RegularSavings' || 
                      currentFilter === 'Savings' || 
                      currentFilter === 'FDR' || 
                      currentFilter === 'DPS' || 
                      currentFilter === 'Exclusive' || 
                      currentFilter === 'Sanchaypatra';

                    return (
                      <div key={item.id} className="space-y-1">
                        <div className={`w-full rounded-xl flex items-center transition-all ${
                          isRegularActive
                            ? 'bg-blue-600 text-white font-bold' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}>
                          <HoverFullText fullText={item.label} badge={`${regularCounts.all} Plans`} className="flex-1 min-w-0">
                            <button
                              onClick={() => {
                                onFilterChange('RegularSavings');
                                if (onRegularSubFilterChange) onRegularSubFilterChange('All');
                                onClose();
                              }}
                              className="w-full pl-3.5 pr-1.5 py-3 flex items-center gap-2.5 text-left min-w-0"
                            >
                              <Wallet size={18} className={`shrink-0 ${isRegularActive ? 'text-white' : 'text-blue-400'}`} />
                              <span className="text-sm font-semibold truncate">{item.label}</span>
                              <span className="ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                {regularCounts.all} Plans
                              </span>
                            </button>
                          </HoverFullText>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRegularOpen(!regularOpen);
                            }}
                            className="pr-3 pl-1 py-3 text-slate-400 hover:text-white shrink-0"
                          >
                            <ChevronDown size={15} className={`transition-transform duration-200 ${regularOpen ? 'rotate-180 text-blue-300' : ''}`} />
                          </button>
                        </div>

                        {/* Mobile Regular Sub Menu Items */}
                        <AnimatePresence initial={false}>
                          {regularOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pl-4 pr-1 py-1 space-y-1 border-l-2 border-blue-500/40 ml-4 my-1 bg-white/[0.03] rounded-r-xl"
                            >
                              <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest text-blue-400/80 flex items-center justify-between">
                                <span>Sub Menus:</span>
                                <span>{regularCounts.all} Plans</span>
                              </div>
                              {REGULAR_SUB_ITEMS.map((sub) => {
                                const isSubActive = (currentFilter === 'RegularSavings' && regularSubFilter === sub.id) || (sub.id !== 'All' && currentFilter === sub.id);
                                const SubIcon = sub.icon;
                                return (
                                  <HoverFullText key={sub.id} fullText={sub.label} badge={regularCounts[sub.countKey]} className="w-full min-w-0">
                                    <button
                                      onClick={() => {
                                        onFilterChange('RegularSavings');
                                        if (onRegularSubFilterChange) onRegularSubFilterChange(sub.id);
                                        onClose();
                                      }}
                                      className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-all ${
                                        isSubActive
                                          ? 'bg-blue-500 text-white font-bold'
                                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <SubIcon size={13} className={`shrink-0 ${isSubActive ? 'text-white' : 'text-blue-400'}`} />
                                        <span className="truncate">{sub.label}</span>
                                      </div>
                                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                                        isSubActive ? 'bg-blue-700 text-white' : 'bg-white/10 text-slate-400'
                                      }`}>
                                        {regularCounts[sub.countKey]}
                                      </span>
                                    </button>
                                  </HoverFullText>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  if (item.id === 'Shariah') {
                    const isShariahActive = currentFilter === 'Shariah';
                    return (
                      <div key={item.id} className="space-y-1">
                        <div className={`w-full rounded-xl flex items-center transition-all ${
                          isShariahActive
                            ? 'bg-emerald-600 text-white font-bold' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}>
                          <HoverFullText fullText={item.label} badge="Halal" className="flex-1 min-w-0">
                            <button
                              onClick={() => {
                                onFilterChange('Shariah');
                                onClose();
                              }}
                              className="w-full pl-3.5 pr-1.5 py-3 flex items-center gap-2.5 text-left min-w-0"
                            >
                              <Moon size={18} className={`shrink-0 ${isShariahActive ? 'text-white' : 'text-emerald-400'}`} />
                              <span className="text-sm font-semibold truncate">{item.label}</span>
                              <span className="ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Halal
                              </span>
                            </button>
                          </HoverFullText>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShariahOpen(!shariahOpen);
                            }}
                            className="pr-3 pl-1 py-3 text-slate-400 hover:text-white shrink-0"
                          >
                            <ChevronDown size={15} className={`transition-transform duration-200 ${shariahOpen ? 'rotate-180 text-emerald-300' : ''}`} />
                          </button>
                        </div>

                        {/* Mobile Sub Menu Items */}
                        <AnimatePresence initial={false}>
                          {shariahOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pl-4 pr-1 py-1 space-y-1 border-l-2 border-emerald-500/40 ml-4 my-1 bg-white/[0.03] rounded-r-xl"
                            >
                              <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest text-emerald-400/80 flex items-center justify-between">
                                <span>Sub Menus:</span>
                                <span>{shariahCounts.all} Plans</span>
                              </div>
                              {SHARIAH_SUB_ITEMS.map((sub) => {
                                const isSubActive = isShariahActive && shariahSubFilter === sub.id;
                                return (
                                  <HoverFullText key={sub.id} fullText={sub.label} badge={shariahCounts[sub.countKey]} className="w-full min-w-0">
                                    <button
                                      onClick={() => {
                                        onFilterChange('Shariah');
                                        if (onShariahSubFilterChange) onShariahSubFilterChange(sub.id);
                                        onClose();
                                      }}
                                      className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between gap-2 text-xs transition-all ${
                                        isSubActive
                                          ? 'bg-emerald-500 text-slate-950 font-bold'
                                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                                      }`}
                                    >
                                      <span className="truncate">{sub.label}</span>
                                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                                        isSubActive ? 'bg-slate-950/30 text-white' : 'bg-white/10 text-slate-400'
                                      }`}>
                                        {shariahCounts[sub.countKey]}
                                      </span>
                                    </button>
                                  </HoverFullText>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  if (item.id === 'Loan') {
                    const isLoanActive = currentFilter === 'Loan';

                    return (
                      <div key={item.id} className="space-y-1">
                        <div className={`w-full rounded-xl flex items-center transition-all ${
                          isLoanActive
                            ? 'bg-amber-600 text-white font-bold' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}>
                          <HoverFullText fullText={item.label} badge={`${loanCounts.all} Loans`} className="flex-1 min-w-0">
                            <button
                              onClick={() => {
                                onFilterChange('Loan');
                                if (onLoanSubFilterChange) onLoanSubFilterChange('All');
                                onClose();
                              }}
                              className="w-full pl-3.5 pr-1.5 py-3 flex items-center gap-2.5 text-left min-w-0"
                            >
                              <BadgeDollarSign size={18} className={`shrink-0 ${isLoanActive ? 'text-white' : 'text-amber-400'}`} />
                              <span className="text-sm font-semibold truncate">{item.label}</span>
                              <span className="ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {loanCounts.all} Loans
                              </span>
                            </button>
                          </HoverFullText>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLoanOpen(!loanOpen);
                            }}
                            className="pr-3 pl-1 py-3 text-slate-400 hover:text-white shrink-0"
                          >
                            <ChevronDown size={15} className={`transition-transform duration-200 ${loanOpen ? 'rotate-180 text-amber-300' : ''}`} />
                          </button>
                        </div>

                        {/* Mobile Loan Sub Menu Items */}
                        <AnimatePresence initial={false}>
                          {loanOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pl-4 pr-1 py-1 space-y-1 border-l-2 border-amber-500/40 ml-4 my-1 bg-white/[0.03] rounded-r-xl"
                            >
                              <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest text-amber-400/80 flex items-center justify-between">
                                <span>Loan Options:</span>
                                <span>{loanCounts.all} Plans</span>
                              </div>
                              {LOAN_SUB_ITEMS.map((sub) => {
                                const isSubActive = isLoanActive && loanSubFilter === sub.id;
                                const SubIcon = sub.icon;
                                return (
                                  <HoverFullText key={sub.id} fullText={sub.label} badge={loanCounts[sub.countKey]} className="w-full min-w-0">
                                    <button
                                      onClick={() => {
                                        onFilterChange('Loan');
                                        if (onLoanSubFilterChange) onLoanSubFilterChange(sub.id);
                                        onClose();
                                      }}
                                      className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-all ${
                                        isSubActive
                                          ? 'bg-amber-500 text-slate-950 font-bold'
                                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <SubIcon size={13} className={`shrink-0 ${isSubActive ? 'text-slate-950' : 'text-amber-400'}`} />
                                        <span className="truncate">{sub.label}</span>
                                      </div>
                                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                                        isSubActive ? 'bg-slate-950/30 text-slate-950' : 'bg-white/10 text-slate-400'
                                      }`}>
                                        {loanCounts[sub.countKey]}
                                      </span>
                                    </button>
                                  </HoverFullText>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  if (item.id === 'Pension') {
                    const isPensionActive = currentFilter === 'Pension';

                    return (
                      <div key={item.id} className="space-y-1">
                        <div className={`w-full rounded-xl flex items-center transition-all ${
                          isPensionActive
                            ? 'bg-purple-600 text-white font-bold' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}>
                          <HoverFullText fullText={item.label} badge={`${pensionCounts.all} Plans`} className="flex-1 min-w-0">
                            <button
                              onClick={() => {
                                onFilterChange('Pension');
                                if (onPensionSubFilterChange) onPensionSubFilterChange('All');
                                onClose();
                              }}
                              className="w-full pl-3.5 pr-1.5 py-3 flex items-center gap-2.5 text-left min-w-0"
                            >
                              <Users size={18} className={`shrink-0 ${isPensionActive ? 'text-white' : 'text-purple-400'}`} />
                              <span className="text-sm font-semibold truncate">{item.label}</span>
                              <span className="ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {pensionCounts.all} Plans
                              </span>
                            </button>
                          </HoverFullText>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPensionOpen(!pensionOpen);
                            }}
                            className="pr-3 pl-1 py-3 text-slate-400 hover:text-white shrink-0"
                          >
                            <ChevronDown size={15} className={`transition-transform duration-200 ${pensionOpen ? 'rotate-180 text-purple-300' : ''}`} />
                          </button>
                        </div>

                        {/* Mobile Pension Sub Menu Items */}
                        <AnimatePresence initial={false}>
                          {pensionOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pl-4 pr-1 py-1 space-y-1 border-l-2 border-purple-500/40 ml-4 my-1 bg-white/[0.03] rounded-r-xl"
                            >
                              <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest text-purple-400/80 flex items-center justify-between">
                                <span>Pension Schemes:</span>
                                <span>{pensionCounts.all} Plans</span>
                              </div>
                              {PENSION_SUB_ITEMS.map((sub) => {
                                const isSubActive = isPensionActive && pensionSubFilter === sub.id;
                                const SubIcon = sub.icon;
                                return (
                                  <HoverFullText key={sub.id} fullText={sub.label} badge={pensionCounts[sub.countKey]} className="w-full min-w-0">
                                    <button
                                      onClick={() => {
                                        onFilterChange('Pension');
                                        if (onPensionSubFilterChange) onPensionSubFilterChange(sub.id);
                                        onClose();
                                      }}
                                      className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-all ${
                                        isSubActive
                                          ? 'bg-purple-500 text-white font-bold'
                                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <SubIcon size={13} className={`shrink-0 ${isSubActive ? 'text-white' : 'text-purple-400'}`} />
                                        <span className="truncate">{sub.label}</span>
                                      </div>
                                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                                        isSubActive ? 'bg-purple-800 text-white' : 'bg-white/10 text-slate-400'
                                      }`}>
                                        {pensionCounts[sub.countKey]}
                                      </span>
                                    </button>
                                  </HoverFullText>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <HoverFullText key={item.id} fullText={item.label} badge={item.badge} className="w-full min-w-0">
                      <button
                        onClick={() => {
                          onFilterChange(item.id as any);
                          onClose();
                        }}
                        className={`w-full pl-3.5 pr-3 py-3 rounded-xl flex items-center gap-2.5 transition-all text-left min-w-0 ${
                          currentFilter === item.id 
                            ? 'bg-emerald-500 text-white font-bold' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <item.icon size={18} className={`shrink-0 ${currentFilter === item.id ? 'text-white' : ''}`} />
                        <span className="text-sm font-semibold truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </HoverFullText>
                  );
                })}
              </nav>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Header = ({ search, setSearch, onOpenCalc, onOpenAI, onToggleSidebar }: { 
  search: string; 
  setSearch: (s: string) => void; 
  onOpenCalc: () => void; 
  onOpenAI: () => void;
  onToggleSidebar?: () => void;
}) => (
  <header className="h-16 md:h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-all">
    <div className="flex items-center gap-3 md:gap-6">
      {/* Mobile Logo & Menu */}
      <div className="flex items-center gap-2 lg:hidden">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <BankTankLogo className="w-7 h-7" showText={false} />
      </div>

      <div className="hidden xl:flex items-center gap-3">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">BD Registry</span>
        <div className="h-4 w-px bg-slate-200"></div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-green-700 rounded-sm"></div>
          <span className="text-xs font-bold text-slate-600">Local Market</span>
        </div>
      </div>

      {/* Search Bar - Compact on Mobile */}
      <div className="relative group min-w-0 md:min-w-[300px] flex-1 md:flex-none">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
        <input 
          type="text" 
          placeholder="Search..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all font-medium md:py-2.5 md:pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>

    <div className="hidden md:flex gap-3">
      <button 
        onClick={onOpenCalc}
        className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
      >
        <Calculator size={14} />
        Returns Calculator
      </button>
        <button 
          onClick={onOpenAI}
          className="px-4 py-2 bg-[#0A2A4D] text-white rounded-xl text-xs font-bold hover:bg-[#1a3a5d] transition-all active:scale-95 flex items-center gap-2"
        >
          <MessageSquare size={14} className="text-[#4CAF50]" />
          AI Market Advisor
        </button>
    </div>

    {/* Mobile Actions - Simplified */}
    <div className="flex md:hidden gap-1">
      <button 
        onClick={onOpenCalc}
        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        title="Calculator"
      >
        <Calculator size={20} />
      </button>
      <button 
        onClick={onOpenAI}
        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        title="AI Market Advisor"
      >
        <MessageSquare size={20} />
      </button>
    </div>
  </header>
);

const SummaryCard = ({ label, value, sub, colorClass }: { label: string; value: string; sub: string; colorClass?: string }) => (
  <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{label}</p>
    <div className="flex items-baseline gap-2">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <span className={`text-[10px] font-bold ${colorClass || 'text-slate-500'}`}>{sub}</span>
    </div>
  </div>
);

const CategoryPointersBanner = ({ filter }: { filter: AppFilter }) => {
  const guideInfo: Record<string, { title: string; desc: string; pointers: { label: string; detail: string; badge: string }[] }> = {
    RegularSavings: {
      title: "Regular Savings & Conventional Banking: Dynamic Pointers",
      desc: "Comprehensive portfolio of conventional banking deposit schemes and sovereign national savings certificates, spanning high-yield Fixed Deposits, monthly recurring DPS, instant basic savings, and government savings certificates.",
      pointers: [
        { label: "Top Fixed Rate", detail: "FDR and Sanchaypatra yield peaking up to 11.76% p.a. in November 2026 regime", badge: "Max Yield" },
        { label: "Sovereign Risk-Free", detail: "National Savings Certificates (Sanchaypatra) 100% backed by Govt of Bangladesh", badge: "Sovereign" },
        { label: "Monthly Compounding", detail: "DPS savings starting from ৳500/month with compound growth", badge: "Disciplined" },
        { label: "Daily Liquidity", detail: "Basic savings accounts with on-demand ATM, debit card & NPSB transfers", badge: "Liquidity" },
      ]
    },
    Shariah: {
      title: "Shariah Savings & Islamic Investments: Dynamic Pointers",
      desc: "Certified 100% Riba-Free Islamic banking contracts (Mudaraba, Wakalah, and Ijarah Sukuk) audited by the Central Shariah Board for Islamic Banks of Bangladesh (CSBIB) and AAOIFI standards.",
      pointers: [
        { label: "Expected Profit Rate", detail: "Provisional weightage / PSR (Rab-ul-Mal & Mudarib profit sharing)", badge: "Halal Profit" },
        { label: "Asset-Backed Horizon", detail: "Real-economy underlying assets; strictly zero Riba, Maysir & Gharar", badge: "Asset-Backed" },
        { label: "Profit Credit Cycle", detail: "Periodic disbursement from halal income pool (Monthly, Semi-Annual, At Maturity)", badge: "Disbursement" },
        { label: "CSBIB & AAOIFI Certified", detail: "Screened and certified by independent Shariah Supervisory Committee", badge: "Certified" },
      ]
    },
    Loan: {
      title: "Loans & Financing: Dynamic Pointers",
      desc: "Comprehensive credit registry across central & commercial banks in Bangladesh under the November 2026 Bangladesh Bank policy regime (10.00% repo). Spanning Personal, Home, Car, SME, Agriculture (Krishi), Corporate, Education, Professional, and Shariah loans.",
      pointers: [
        { label: "Interest Rate / Markup", detail: "Market benchmark (Repo/Treasury linked, 8.00% subsidized to 11.75% p.a.)", badge: "Borrowing Rate" },
        { label: "Max Loan Tenure", detail: "Repayment horizon (12 months up to 25 years for Home Loans)", badge: "Tenure" },
        { label: "Repayment Mode", detail: "Equal Monthly Installment (EMI) or seasonal harvest settlement", badge: "EMI" },
        { label: "Sanction Limit & DBR", detail: "Borrowing ceilings up to ৳2 Crore (Home) & 50% max Debt-Burden Ratio", badge: "Limit" },
      ]
    },
    Pension: {
      title: "Universal Pension Scheme & Bank Retirement Plans: Dynamic Pointers",
      desc: "Guaranteed old-age social security covering the National Pension Scheme (NPS / সর্বজনীন পেনশন স্কিম - Pragati, Surokkha, Samata, Probash, Prottoy) alongside premier bank pension DPS accounts.",
      pointers: [
        { label: "Monthly Pension Benefit", detail: "Lifelong monthly pension post age 60 (up to ৳62,300/mo guaranteed)", badge: "Post-60 Income" },
        { label: "Eligibility Age", detail: "Active accumulation between 18-50 years; pension starts from age 60", badge: "Age 60" },
        { label: "Govt Matching Subsidy", detail: "50% government subsidy for low-income citizens under Samata scheme", badge: "Govt Match" },
        { label: "Sec 44 Tax Exemption", detail: "100% tax rebate on contributions & tax-free lifelong pension receipts", badge: "Tax Free" },
      ]
    },
    Savings: {
      title: "Saving Accounts: Dynamic Pointers",
      desc: "Savings accounts provide 100% on-demand liquidity without any lock-in maturity duration. Profits accrue on your daily closing balance and credit directly to your account.",
      pointers: [
        { label: "Interest Rate", detail: "Daily closing balance basis (5.00% - 7.50% p.a.)", badge: "Return" },
        { label: "Zero Lock-in Term", detail: "Withdraw anytime via debit card, ATM, or NPSB", badge: "Liquidity" },
        { label: "Profit Credit Cycle", detail: "Monthly or half-yearly automated bank credit", badge: "Cycle" },
        { label: "Min Opening Balance", detail: "Initial deposit & minimum threshold (৳500 - ৳5,000)", badge: "Entry" },
      ]
    },
    Insurance: {
      title: "Insurance & Health Plans: Dynamic Pointers",
      desc: "Insurance policies provide family financial safety, hospitalization risk mitigation, and Section 44 income tax rebates rather than standard savings yields.",
      pointers: [
        { label: "Coverage & Sum Assured", detail: "Health hospitalization pool, Life cover, or OPD coverage", badge: "Protection" },
        { label: "Policy Term", detail: "Annual renewable policy or 10-20 year endowment horizon", badge: "Term" },
        { label: "Claim Settlement Mode", detail: "Cashless partner hospital network or direct claim settlement", badge: "Settlement" },
        { label: "Starting Premium & Tax Rebate", detail: "Direct tax rebate up to 15% under Sec 44 Income Tax Act", badge: "Benefit" },
      ]
    },
    'Mutual Fund': {
      title: "Mutual Funds: Dynamic Pointers",
      desc: "Open-ended pooled investment portfolios managed by licensed asset managers without fixed maturity dates.",
      pointers: [
        { label: "Audited Dividend Yield", detail: "Historical performance & annual dividend track record (10.0% - 13.5%)", badge: "Dividend" },
        { label: "Open-Ended Horizon", detail: "No lock-in maturity; redeem units anytime at official NAV", badge: "Horizon" },
        { label: "Dividend Distribution", detail: "Annual cash dividend or Cumulative Investment Plan (CIP) units", badge: "Payout" },
        { label: "Minimum Entry / SIP", detail: "Low entry ticket starting from ৳5,000 lump-sum or systematic SIP", badge: "Minimum" },
      ]
    },
    Exclusive: {
      title: "Exclusive Schemes: Dynamic Pointers",
      desc: "High-value milestone packages (Kotipoti, Millionaire, Double Benefit) with accelerated compounding for ambitious targets.",
      pointers: [
        { label: "Target Multiplier / Goal", detail: "Corpus milestone (e.g. ৳1 Crore Target, Double Principal)", badge: "Target" },
        { label: "Milestone Horizon", detail: "Structured 5 to 10-year disciplined accumulation period", badge: "Maturity" },
        { label: "Deposit Mode", detail: "Monthly automated installment or single lump-sum investment", badge: "Mode" },
        { label: "Exclusive Privileges", detail: "Dedicated relationship manager, priority banking & card perks", badge: "VIP" },
      ]
    },
    Sanchaypatra: {
      title: "National Savings Certificates: Dynamic Pointers",
      desc: "Government of Bangladesh sovereign savings instruments offering the highest guaranteed returns with zero credit default risk.",
      pointers: [
        { label: "Govt Sovereign Coupon", detail: "Fixed statutory rate up to 11.76% backed by the Ministry of Finance", badge: "Zero Risk" },
        { label: "Certificate Tenure", detail: "Statutory 3-year or 5-year fixed maturity", badge: "Tenure" },
        { label: "Coupon Payout Frequency", detail: "Monthly or quarterly automated BEFTN transfer to your bank", badge: "Disbursement" },
        { label: "Purchase Limits & Slabs", detail: "Individual ceilings (৳45L-50L) with automated tax certification", badge: "Ceiling" },
      ]
    },
    DPS: {
      title: "Deposit Pension Schemes (DPS): Dynamic Pointers",
      desc: "Systematic monthly savings plans with monthly interest compounding designed for future milestones and retirement.",
      pointers: [
        { label: "Compound Profit Rate", detail: "High yield rate (10.00% - 11.50% p.a.) compounded periodically", badge: "Compound" },
        { label: "Target Scheme Tenure", detail: "Flexible 3, 5, 7, or 10-year disciplined horizons", badge: "Horizon" },
        { label: "Installment Cycle", detail: "Monthly auto-debit starting from ৳500/month", badge: "Interval" },
        { label: "Loan Against Deposit", detail: "Eligible for credit facility up to 90% of accumulated balance", badge: "Facility" },
      ]
    },
    FDR: {
      title: "Fixed Deposits (FD / FDR): Dynamic Pointers",
      desc: "Lump-sum term deposits with locked-in interest rates for guaranteed stability in the current 10.00% policy repo regime.",
      pointers: [
        { label: "Fixed Deposit Yield", detail: "Contractual guaranteed annual return (9.50% - 11.75% p.a.)", badge: "Guaranteed" },
        { label: "Lock-in Tenure", detail: "Contractual period (3 months to 5 years)", badge: "Maturity" },
        { label: "Payout Interval", detail: "Profit disbursed at maturity, monthly, or quarterly", badge: "Frequency" },
        { label: "Lump-sum Principal", detail: "Single one-off deposit with automated renewal options", badge: "Principal" },
      ]
    }
  };

  const current = guideInfo[filter as string];
  if (!current) return null;

  return (
    <div className="mb-8 p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl border border-slate-700/60 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-sm font-black tracking-tight text-white uppercase">{current.title}</h4>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">{current.desc}</p>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
            Tailored Metrics Active
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-700/60">
          {current.pointers.map((p, idx) => (
            <div key={idx} className="bg-slate-800/70 rounded-2xl p-3 border border-slate-700/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-black uppercase tracking-wider text-emerald-400">{p.label}</p>
                <span className="text-[8px] font-bold text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">{p.badge}</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-snug">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryStatsBar = ({ filter, products }: { filter: AppFilter; products: FinancialProduct[] }) => {
  if (filter === 'RegularSavings') {
    const avg = products.length > 0 ? (products.reduce((acc, p) => acc + p.interestRate, 0) / products.length).toFixed(2) : '8.95';
    const top = products.length > 0 ? Math.max(...products.map(p => p.interestRate)) : 11.76;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Top Regular Return" 
          value={`${top}%`} 
          sub="Govt Sanchaypatra & Peak Bank FDR" 
          colorClass="text-blue-600"
        />
        <SummaryCard 
          label="Avg Portfolio Rate" 
          value={`${avg}%`} 
          sub="Daily Balance & Compounding Yields" 
          colorClass="text-emerald-600"
        />
        <SummaryCard 
          label="Conventional & Sovereign" 
          value={`${products.length} Verified Plans`} 
          sub="Basic Savings, FD, DPS, Schemes & Govt" 
          colorClass="text-indigo-600"
        />
      </div>
    );
  }

  if (filter === 'Shariah') {
    const avg = products.length > 0 ? (products.reduce((acc, p) => acc + p.interestRate, 0) / products.length).toFixed(2) : '10.20';
    const top = products.length > 0 ? Math.max(...products.map(p => p.interestRate)) : 12.2;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Top Expected Profit" 
          value={`${top}%`} 
          sub="VIPB, MTDR & City Islamic" 
          colorClass="text-emerald-600"
        />
        <SummaryCard 
          label="Halal Compliance" 
          value="100% Riba-Free" 
          sub="Mudaraba & Wakalah Principles" 
          colorClass="text-teal-600"
        />
        <SummaryCard 
          label="Islamic Options" 
          value={`${products.length} Verified Plans`} 
          sub="Savings, DPS, MTDR, Funds & Takaful" 
          colorClass="text-blue-600"
        />
      </div>
    );
  }

  if (filter === 'Insurance') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Coverage Scope" 
          value="Life, Health & OPD" 
          sub="Cashless & Direct Settlement" 
          colorClass="text-blue-600"
        />
        <SummaryCard 
          label="Tax Benefit" 
          value="Up to 15% Rebate" 
          sub="Income Tax Act Sec 44" 
          colorClass="text-emerald-600"
        />
        <SummaryCard 
          label="Starting Premium" 
          value="From ৳500 / mo" 
          sub={`${products.length} Verified Insurers`} 
          colorClass="text-indigo-600"
        />
      </div>
    );
  }

  if (filter === 'Loan') {
    const avg = products.length > 0 ? (products.reduce((acc, p) => acc + p.interestRate, 0) / products.length).toFixed(2) : '10.85';
    const lowest = products.length > 0 ? Math.min(...products.map(p => p.interestRate)) : 8.0;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Lowest Loan Rate" 
          value={`${lowest}%`} 
          sub="Agriculture Subsidized & Secured Advance" 
          colorClass="text-emerald-600"
        />
        <SummaryCard 
          label="Avg Borrowing Rate" 
          value={`${avg}%`} 
          sub="Commercial Banking Benchmark" 
          colorClass="text-amber-600"
        />
        <SummaryCard 
          label="Available Credit Facilities" 
          value={`${products.length} Loan Options`} 
          sub="Personal, Home, Car, SME, Agri & Corp" 
          colorClass="text-blue-600"
        />
      </div>
    );
  }

  if (filter === 'Pension') {
    const avg = products.length > 0 ? (products.reduce((acc, p) => acc + p.interestRate, 0) / products.length).toFixed(2) : '10.50';
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Top Monthly Pension" 
          value="৳62,300 / mo" 
          sub="Guaranteed Lifelong Income Post 60" 
          colorClass="text-purple-600"
        />
        <SummaryCard 
          label="Avg Pension Growth" 
          value={`${avg}%`} 
          sub="Universal NPS & Bank Pension DPS" 
          colorClass="text-emerald-600"
        />
        <SummaryCard 
          label="Retirement Options" 
          value={`${products.length} Schemes`} 
          sub="National Pension Authority & Top Banks" 
          colorClass="text-blue-600"
        />
      </div>
    );
  }

  if (filter === 'Savings') {
    const avg = products.length > 0 ? (products.reduce((acc, p) => acc + p.interestRate, 0) / products.length).toFixed(2) : '6.20';
    const top = products.length > 0 ? Math.max(...products.map(p => p.interestRate)) : 7.5;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Avg Savings Profit" 
          value={`${avg}%`} 
          sub="Daily Balance Basis" 
          colorClass="text-emerald-600"
        />
        <SummaryCard 
          label="Top Savings Rate" 
          value={`${top}%`} 
          sub="Prime, Meghna & SCB" 
          colorClass="text-amber-600"
        />
        <SummaryCard 
          label="Liquidity Status" 
          value="100% Instant" 
          sub="Zero Lock-in Period" 
          colorClass="text-blue-600"
        />
      </div>
    );
  }

  if (filter === 'Mutual Fund') {
    const avg = products.length > 0 ? (products.reduce((acc, p) => acc + p.interestRate, 0) / products.length).toFixed(2) : '11.50';
    const top = products.length > 0 ? Math.max(...products.map(p => p.interestRate)) : 13.5;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Avg Hist. Div Yield" 
          value={`${avg}%`} 
          sub="Audited Cash/CIP Dividend" 
          colorClass="text-rose-600"
        />
        <SummaryCard 
          label="Top Fund Return" 
          value={`${top}%`} 
          sub="Growth & Balanced Portfolios" 
          colorClass="text-amber-600"
        />
        <SummaryCard 
          label="Fund Structure" 
          value="Open-Ended" 
          sub="Redeemable Anytime at NAV" 
          colorClass="text-blue-600"
        />
      </div>
    );
  }

  if (filter === 'Exclusive') {
    const top = products.length > 0 ? Math.max(...products.map(p => p.interestRate)) : 11.0;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Top Scheme Yield" 
          value={`${top}%`} 
          sub="Target Wealth Benchmark" 
          colorClass="text-indigo-600"
        />
        <SummaryCard 
          label="Target Milestones" 
          value="৳1 Cr & Double Return" 
          sub="Kotipoti & VIP Schemes" 
          colorClass="text-amber-600"
        />
        <SummaryCard 
          label="Scheme Availability" 
          value={`${products.length} Plans`} 
          sub="EBL, City, DBBL & Sonali" 
          colorClass="text-blue-600"
        />
      </div>
    );
  }

  if (filter === 'Sanchaypatra') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Highest Sovereign Coupon" 
          value="11.76%" 
          sub="5-Year Bangladesh Certificate" 
          colorClass="text-amber-600"
        />
        <SummaryCard 
          label="Security Backing" 
          value="100% Guaranteed" 
          sub="Sovereign Risk-Free" 
          colorClass="text-emerald-600"
        />
        <SummaryCard 
          label="Payout Intervals" 
          value="Monthly / Quarterly" 
          sub="Direct BEFTN Bank Transfer" 
          colorClass="text-blue-600"
        />
      </div>
    );
  }

  if (filter === 'DPS') {
    const avg = products.length > 0 ? (products.reduce((acc, p) => acc + p.interestRate, 0) / products.length).toFixed(2) : '10.50';
    const top = products.length > 0 ? Math.max(...products.map(p => p.interestRate)) : 11.5;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard 
          label="Avg DPS Profit Rate" 
          value={`${avg}%`} 
          sub="Monthly Compounding" 
          colorClass="text-violet-600"
        />
        <SummaryCard 
          label="Top DPS Yield" 
          value={`${top}%`} 
          sub="Selection Peak" 
          colorClass="text-amber-600"
        />
        <SummaryCard 
          label="Tenure Horizons" 
          value="3 to 10 Years" 
          sub="From ৳500 / month" 
          colorClass="text-blue-600"
        />
      </div>
    );
  }

  // FDR or All
  const avg = products.length > 0 ? (products.reduce((acc, p) => acc + p.interestRate, 0) / products.length).toFixed(2) : '8.45';
  const top = products.length > 0 ? Math.max(...products.map(p => p.interestRate)) : 11.76;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <SummaryCard 
        label={filter === 'FDR' ? "Avg FDR Term Rate" : "Avg Category Rate"} 
        value={`${avg}%`} 
        sub="Nov 2026 Repo Regime" 
        colorClass="text-emerald-600"
      />
      <SummaryCard 
        label={filter === 'FDR' ? "Top FDR Yield" : "Market Peak Yield"} 
        value={`${top}%`} 
        sub="Commercial & Govt Peak" 
        colorClass="text-amber-600"
      />
      <SummaryCard 
        label="Available Packages" 
        value={`${products.length} Active`} 
        sub="Regulated Central Registry" 
        colorClass="text-blue-600"
      />
    </div>
  );
};

const FilterButton = ({ 
  active, 
  label, 
  onClick, 
  icon: Icon, 
  badge 
}: { 
  active: boolean; 
  label: string; 
  onClick: () => void;
  icon?: React.ComponentType<{ size: number; className?: string }>;
  badge?: string;
}) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center gap-1.5 ${
      active 
        ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900'
    }`}
  >
    {Icon && <Icon size={12} className={active ? 'text-emerald-400' : 'text-emerald-600'} />}
    <span>{label}</span>
    {badge && (
      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
        active ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

const FeaturedSlider = ({ title, type, accentColor, onCompare, compareItems, onSeeAll, onBankClick, onViewDetails }: { 
  title: string; 
  type: ProductType; 
  accentColor: string; 
  onCompare: (p: FinancialProduct) => void; 
  compareItems: FinancialProduct[];
  onSeeAll: () => void;
  onBankClick: (bank: string) => void;
  onViewDetails: (p: FinancialProduct) => void;
}) => {
  const products = financialProducts
    .filter(p => p.type === type)
    .sort((a, b) => b.interestRate - a.interestRate)
    .slice(0, 3);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = React.useState({ left: 0, right: 0 });
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const updateConstraints = () => {
        const { scrollWidth, offsetWidth } = containerRef.current!;
        setConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
        setShowHint(scrollWidth > offsetWidth);
      };
      updateConstraints();
      window.addEventListener('resize', updateConstraints);
      return () => window.removeEventListener('resize', updateConstraints);
    }
  }, []);

  const colors: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    violet: 'text-violet-600 bg-violet-50 border-violet-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100'
  };

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border hidden sm:block ${colors[accentColor]}`}>
            Top Picks
          </div>
        </div>
        <div className="flex-1 h-px bg-slate-200 hidden md:block" />
        <button 
          onClick={onSeeAll}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors uppercase tracking-widest px-4 py-2 bg-slate-100 rounded-xl w-fit"
        >
          See All Packages <ChevronRight size={14} />
        </button>
      </div>
      
      <div className="relative overflow-hidden -mx-4 px-4 md:mx-0 md:px-0">
        <motion.div
          ref={containerRef}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.1}
          onDragStart={() => setShowHint(false)}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-grab active:cursor-grabbing pb-6 md:pb-0"
          style={{ touchAction: 'pan-y' }}
        >
          {products.map(product => (
            <div key={product.id} className="flex-shrink-0 w-[85vw] sm:w-[380px] md:w-auto select-none">
              <ProductCard 
                product={product} 
                onCompare={onCompare}
                isComparing={compareItems.some(i => i.id === product.id)}
                onBankClick={onBankClick}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </motion.div>

        {/* Subtle Swipe Hint for Mobile */}
        <AnimatePresence>
          {showHint && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5, x: [0, 8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden pointer-events-none flex flex-col items-center gap-0.5"
            >
              <div className="bg-emerald-500/20 p-1.5 rounded-full backdrop-blur-sm">
                <ChevronRight size={20} className="text-emerald-500" />
              </div>
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-600/60 rotate-90 origin-center translate-y-6">Slide</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const FeaturedSection = FeaturedSlider;

interface ProductCardProps {
  product: FinancialProduct;
  onCompare: (p: FinancialProduct) => void;
  isComparing: boolean;
  onBankClick?: (bank: string) => void;
  onViewDetails?: (p: FinancialProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCompare, isComparing, onBankClick, onViewDetails }) => {
  const getRatingStyle = (rating: string) => {
    switch (rating) {
      case 'Safe': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'Moderate': return 'bg-amber-500 shadow-amber-500/50';
      case 'Risky': return 'bg-red-500 shadow-red-500/50';
      default: return 'bg-slate-300';
    }
  };

  const getRatingText = (rating: string) => {
    switch (rating) {
      case 'Safe': return 'Safe';
      case 'Moderate': return 'Moderate';
      case 'Risky': return 'Risky';
      default: return 'Unknown';
    }
  };

    const pointers = getProductPointers(product);

    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          borderColor: isComparing ? 'rgb(16, 185, 129)' : 'rgb(226, 232, 240)',
          backgroundColor: isComparing ? 'rgb(240, 253, 244)' : 'rgb(255, 255, 255)'
        }}
        className={`rounded-2xl p-6 border-2 transition-all group flex flex-col shadow-sm relative overflow-hidden ${
          isComparing ? 'ring-4 ring-emerald-500/10' : 'border-slate-200 hover:border-emerald-500/20 hover:bg-slate-50/50'
        }`}
      >
        {/* Selection Checkbox */}
        <button 
          onClick={() => onCompare(product)}
          className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-20 ${
            isComparing 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'bg-white border-slate-200 text-transparent hover:border-emerald-500 shadow-sm'
          }`}
        >
          <Plus size={14} className={`stroke-[3px] transition-transform ${isComparing ? 'rotate-45' : ''}`} />
        </button>

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onBankClick?.(product.bankName);
              }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer hover:shadow-lg transition-all active:scale-95 overflow-hidden border border-slate-100 bg-white`}
            >
              {product.logoUrl ? (
                <img src={product.logoUrl} alt={product.bankName} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${product.bankName === 'Government of Bangladesh' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {product.bankName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{product.bankName}</h3>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">{product.productName}</p>
              {product.isShariahCompliant && (
                <div className="flex items-center gap-1 mt-1 text-[8px] font-black text-emerald-600 uppercase tracking-tighter">
                  <ShieldCheck size={10} className="stroke-[3]" />
                  Shariah Compliant
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
              product.category === 'Government' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-100 rounded-md shadow-sm">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-sm ${getRatingStyle(product.safetyRating)}`} />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{getRatingText(product.safetyRating)} Signal</span>
            </div>
            <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              Nov 2026
            </span>
          </div>
        </div>

      {/* Dynamic 3-Pointer Metric Grid */}
      <div className="grid grid-cols-3 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100 mb-2.5">
        <div className="bg-white p-3 flex flex-col justify-between min-w-0">
          <HoverFullText fullText={pointers[0].label} className="min-w-0">
            <p className="text-[8px] text-slate-400 uppercase font-extrabold tracking-widest mb-1 truncate">
              {pointers[0].label}
            </p>
          </HoverFullText>
          <HoverFullText fullText={pointers[0].value} className="min-w-0">
            <p className={`text-base sm:text-lg font-black tracking-tight truncate ${
              product.type === 'Insurance' ? 'text-blue-600' : 'text-emerald-600 font-mono'
            }`}>
              {pointers[0].value}
            </p>
          </HoverFullText>
          {pointers[0].sub && (
            <HoverFullText fullText={pointers[0].sub} className="min-w-0">
              <p className="text-[8px] text-slate-400 font-medium truncate mt-0.5">{pointers[0].sub}</p>
            </HoverFullText>
          )}
        </div>
        <div className="bg-white p-3 flex flex-col justify-between min-w-0">
          <HoverFullText fullText={pointers[1].label} className="min-w-0">
            <p className="text-[8px] text-slate-400 uppercase font-extrabold tracking-widest mb-1 truncate">
              {pointers[1].label}
            </p>
          </HoverFullText>
          <HoverFullText fullText={pointers[1].value} className="min-w-0">
            <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
              {pointers[1].value}
            </p>
          </HoverFullText>
          {pointers[1].sub && (
            <HoverFullText fullText={pointers[1].sub} className="min-w-0">
              <p className="text-[8px] text-slate-400 font-medium truncate mt-0.5">{pointers[1].sub}</p>
            </HoverFullText>
          )}
        </div>
        <div className="bg-white p-3 flex flex-col justify-between min-w-0">
          <HoverFullText fullText={pointers[2].label} className="min-w-0">
            <p className="text-[8px] text-slate-400 uppercase font-extrabold tracking-widest mb-1 truncate">
              {pointers[2].label}
            </p>
          </HoverFullText>
          <HoverFullText fullText={pointers[2].value} className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight leading-tight truncate mt-0.5">
              {pointers[2].value}
            </p>
          </HoverFullText>
          {pointers[2].sub && (
            <HoverFullText fullText={pointers[2].sub} className="min-w-0">
              <p className="text-[8px] text-slate-400 font-medium truncate mt-0.5">{pointers[2].sub}</p>
            </HoverFullText>
          )}
        </div>
      </div>

      {/* 4th Pointer: Type-specific Requirement / Minimum / Limit Badge */}
      <div className="flex items-center justify-between text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 mb-6">
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">{pointers[3].label}:</span>
        <span className="font-bold text-slate-800">{pointers[3].value}</span>
        {pointers[3].sub && (
          <span className="text-[8px] font-semibold text-emerald-600 hidden sm:inline">{pointers[3].sub}</span>
        )}
      </div>

    <div className="flex-1 space-y-2 mb-8">
      {product.earlyEncashmentPenalty && (
        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-1 rounded-md w-fit tracking-tight border border-rose-100">
          <Info size={10} className="stroke-[3]" />
          Penalty: {product.earlyEncashmentPenalty}
        </div>
      )}
      {product.features.slice(0, 2).map((f, i) => (
        <HoverFullText key={i} fullText={f} className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium min-w-0">
            <div className="w-1 h-1 bg-emerald-500 rounded-full shrink-0" />
            <span className="truncate">{f}</span>
          </div>
        </HoverFullText>
      ))}
    </div>

    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
      <button 
        onClick={() => onCompare(product)}
        className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
          isComparing ? 'text-emerald-600' : 'text-slate-900 hover:text-emerald-600 underline underline-offset-4'
        }`}
      >
        <ArrowRightLeft size={12} className={isComparing ? 'text-emerald-500' : ''} />
        {isComparing ? 'In Comparison Tray' : 'Compare Rates'}
      </button>
      <button 
        onClick={() => onViewDetails?.(product)}
        className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-900/10"
        title="View Package Details"
      >
        <ArrowUpRight size={14} />
      </button>
    </div>
  </motion.div>
  );
};

const ComparisonTray = ({ products, onRemove, onCompare, onClear }: { products: FinancialProduct[]; onRemove: (id: string) => void; onCompare: () => void; onClear: () => void }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (products.length === 0) return null;

  return (
    <motion.div 
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: isMinimized ? 80 : 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white p-5 rounded-[2.5rem] shadow-2xl border border-slate-700 min-w-[320px] md:min-w-[650px] group"
    >
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl animate-bounce">
        {products.length === 1 ? 'Add one more to compare' : 'Ready to compare!'}
      </div>

      <div className="absolute -top-3 right-8 flex gap-2 z-10">
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="bg-slate-700 hover:bg-slate-600 text-white p-1.5 rounded-full border border-slate-600 shadow-lg transition-colors"
          title={isMinimized ? "Maximize" : "Minimize"}
        >
          {isMinimized ? <Plus size={12} /> : <Minus size={12} />}
        </button>
        <button 
          onClick={onClear}
          className="bg-rose-600 hover:bg-rose-500 text-white p-1.5 rounded-full border border-rose-500 shadow-lg transition-colors"
          title="Clear & Close"
        >
          <X size={12} />
        </button>
      </div>

      <div className={`flex items-center justify-between gap-8 py-2 ${isMinimized ? 'opacity-20 transition-opacity' : ''}`}>
        <div className="flex -space-x-3">
          {products.map((p) => (
            <div key={p.id} className="relative group/item">
              <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center font-bold text-xs">
                {p.bankName[0]}
              </div>
              <button 
                onClick={() => onRemove(p.id)}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {products.length < 3 && (
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-500">
              <Plus size={14} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="text-xs font-bold mb-0.5">Compare Products</p>
          <p className="text-[10px] text-slate-400">{products.length} of 3 items selected</p>
        </div>

        <button 
          onClick={onCompare}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            products.length >= 2 
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95' 
              : 'bg-slate-800 text-slate-500'
          }`}
          disabled={products.length < 2 || isMinimized}
        >
          View Comparison
        </button>
      </div>
      
      {isMinimized && (
        <div className="absolute inset-x-0 top-0 h-full flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Tray Minimized ({products.length})</span>
        </div>
      )}
    </motion.div>
  );
};

const ComparisonModal = ({ products, isOpen, onClose }: { products: FinancialProduct[]; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md overflow-y-auto"
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative my-8"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-xl font-bold">Side-by-Side Comparison</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="overflow-x-auto p-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b">Feature</th>
                  {products.map(p => (
                    <th key={p.id} className="py-4 px-4 border-b">
                      <div className="flex items-center gap-3 mb-2">
                        {p.logoUrl && <img src={p.logoUrl} alt={p.bankName} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />}
                        <p className="font-bold text-slate-900 leading-tight">{p.bankName}</p>
                      </div>
                      <p className="text-xs text-slate-500 font-normal">{p.productName}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-600 text-sm border-b">Category / Type</td>
                  {products.map(p => (
                    <td key={p.id} className="py-4 px-4 border-b text-sm">
                      <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">
                        {p.type}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-600 text-sm border-b">
                    <div>
                      <p>Return / Protection</p>
                      <span className="text-[10px] text-slate-400 font-normal">Category Specific Pointer</span>
                    </div>
                  </td>
                  {products.map(p => {
                    const ptrs = getProductPointers(p);
                    return (
                      <td key={p.id} className="py-4 px-4 border-b">
                        <span className={`font-bold text-base block ${p.type === 'Insurance' ? 'text-blue-600' : 'text-emerald-600 font-mono'}`}>
                          {ptrs[0].value}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          {ptrs[0].label} {ptrs[0].sub ? `• ${ptrs[0].sub}` : ''}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-600 text-sm border-b">
                    <div>
                      <p>Maturity / Lock-in</p>
                      <span className="text-[10px] text-slate-400 font-normal">Term or Liquidity Horizon</span>
                    </div>
                  </td>
                  {products.map(p => {
                    const ptrs = getProductPointers(p);
                    return (
                      <td key={p.id} className="py-4 px-4 border-b text-sm">
                        <span className="font-bold text-slate-800 block">{ptrs[1].value}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{ptrs[1].sub}</span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-600 text-sm border-b">
                    <div>
                      <p>Interval / Payout Cycle</p>
                      <span className="text-[10px] text-slate-400 font-normal">Payment or Credit Mode</span>
                    </div>
                  </td>
                  {products.map(p => {
                    const ptrs = getProductPointers(p);
                    return (
                      <td key={p.id} className="py-4 px-4 border-b text-sm">
                        <span className="font-bold text-slate-800 block">{ptrs[2].value}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{ptrs[2].label}: {ptrs[2].sub}</span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-600 text-sm border-b">
                    <div>
                      <p>Minimum Requirement</p>
                      <span className="text-[10px] text-slate-400 font-normal">Deposit or Premium Tier</span>
                    </div>
                  </td>
                  {products.map(p => {
                    const ptrs = getProductPointers(p);
                    return (
                      <td key={p.id} className="py-4 px-4 border-b text-sm">
                        <span className="font-bold text-slate-800 block">{ptrs[3].value}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{ptrs[3].label}</span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-600 text-sm border-b">Early Exit / Liquidity</td>
                  {products.map(p => (
                    <td key={p.id} className="py-4 px-4 border-b text-xs text-slate-600">
                      {p.type === 'Savings' && '100% Instant Liquidity. Withdraw anytime via ATM/NPSB without fee.'}
                      {p.type === 'Insurance' && '15-day free look period. Cash surrender value available per IDRA.'}
                      {p.type === 'Mutual Fund' && 'Open-ended fund. Redeem anytime at official NAV.'}
                      {p.type === 'FDR' && (p.earlyEncashmentPenalty ? `Penalty: ${p.earlyEncashmentPenalty}` : 'Loan against FDR up to 90% or savings rate recalculation.')}
                      {p.type === 'DPS' && 'Allowed after 1 year with savings rate adjustment.'}
                      {p.type === 'Sanchaypatra' && 'Encashment permitted subject to government penalty schedule.'}
                      {p.type === 'Exclusive' && 'Credit loan facility up to 90% against accumulated balance.'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-600 text-sm border-b">Tax Rules & Incentives</td>
                  {products.map(p => (
                    <td key={p.id} className="py-4 px-4 border-b text-xs text-slate-600">
                      {p.type === 'Insurance' ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 block w-fit">
                          Sec 44 Tax Rebate (Up to 15%)
                        </span>
                      ) : p.type === 'Mutual Fund' ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 block w-fit">
                          Dividend Tax-Exempt + Rebate
                        </span>
                      ) : (
                        <span>10% AIT with e-TIN (15% without TIN)</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-600 text-sm border-b">Safety Signal</td>
                  {products.map(p => (
                    <td key={p.id} className="py-4 px-4 border-b text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${
                          p.safetyRating === 'Safe' ? 'bg-emerald-500' :
                          p.safetyRating === 'Moderate' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span className="font-bold text-xs">{p.safetyRating}</span>
                        <span className="text-[10px] text-slate-400">
                          ({p.category === 'Government' ? 'Govt Sovereign' : 'Regulated'})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-600 text-sm border-b align-top">Top Features</td>
                  {products.map(p => (
                    <td key={p.id} className="py-4 px-4 border-b">
                      <ul className="space-y-1.5">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50 flex items-center justify-between">
             <button 
               onClick={onClose}
               className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group"
             >
               <Home size={18} className="group-hover:scale-110 transition-transform" />
               <span className="font-bold text-[10px] uppercase tracking-widest">Back to Home</span>
             </button>
            <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Done Analyzing</button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const CalculatorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedType, setSelectedType] = useState<ProductType | ''>('');
  const [selectedProduct, setSelectedProduct] = useState<FinancialProduct | null>(null);
  
  const [p, setP] = useState(100000);
  const [r, setR] = useState(9);
  const [years, setYears] = useState(1);
  const [months, setMonths] = useState(0);
  const [maxP, setMaxP] = useState(2000000);
  const [calcMode, setCalcMode] = useState<'lump' | 'sip'>('lump');
  
  const dynamicTicks = useMemo(() => {
    const ticks = [];
    // Ensure we always have human-friendly intervals
    let interval;
    if (maxP >= 10000000) interval = 2000000;      // 20L steps for 1CR
    else if (maxP >= 5000000) interval = 1000000;  // 10L steps for 50L
    else if (maxP >= 2000000) interval = 400000;   // 4L steps for 20L
    else if (maxP >= 1000000) interval = 200000;   // 2L steps for 10L
    else if (maxP >= 50000) interval = 10000;      // 10K steps for SIP
    else interval = 20000;                         // 20K steps for 1L
    
    for (let val = 0; val <= maxP; val += interval) {
      const actualVal = Math.max(1000, val);
      if (actualVal > maxP) break;
      
      let label;
      if (actualVal >= 10000000) label = `${actualVal / 10000000}CR`;
      else if (actualVal >= 100000) label = `${actualVal / 100000}L`;
      else label = `${actualVal / 1000}K`;
      
      ticks.push({ val: actualVal, label });
    }

    // Ensure the last tick is always the maxP if not already there
    if (ticks[ticks.length - 1].val !== maxP) {
      let label;
      if (maxP >= 10000000) label = `${maxP / 10000000}CR`;
      else if (maxP >= 100000) label = `${maxP / 100000}L`;
      else label = `${maxP / 1000}K`;
      ticks.push({ val: maxP, label });
    }
    
    return Array.from(new Map(ticks.map(t => [t.val, t])).values()).sort((a,b) => a.val - b.val);
  }, [maxP]);

  const getPosition = (val: number) => {
    return ((val - 1000) / (maxP - 1000)) * 100;
  };
  
  // Derived data
  const uniqueBanks = Array.from(new Set(financialProducts.map(p => p.bankName))).sort();
  const availableTypes = selectedBank 
    ? Array.from(new Set(financialProducts.filter(p => p.bankName === selectedBank).map(p => p.type)))
    : [];
  const availableProducts = (selectedBank && selectedType)
    ? financialProducts.filter(p => p.bankName === selectedBank && p.type === selectedType)
    : [];

  useEffect(() => {
    if (selectedType === 'Mutual Fund' || selectedType === 'DPS' || selectedType === 'Pension') {
      setCalcMode('sip');
      setP(selectedType === 'Pension' ? 5000 : 2000);
      setMaxP(50000);
      if (selectedType === 'Mutual Fund') {
        setYears(10);
      } else if (selectedType === 'Pension') {
        setYears(15);
      }
    } else if (selectedType === 'Loan') {
      setCalcMode('lump');
      setP(500000);
      setMaxP(5000000);
      setYears(5);
    } else if (selectedType) {
      setCalcMode('lump');
      setP(100000);
      setMaxP(2000000);
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedProduct) {
      setR(selectedProduct.interestRate);
      if (selectedProduct.tenureMonths > 0) {
        setYears(Math.floor(selectedProduct.tenureMonths / 12));
        setMonths(selectedProduct.tenureMonths % 12);
      } else if (selectedProduct.type === 'Mutual Fund') {
        setYears(10);
        setMonths(0);
      } else if (selectedProduct.type === 'Pension') {
        setYears(15);
        setMonths(0);
      } else {
        setYears(1);
        setMonths(0);
      }
      if (selectedProduct.type === 'Mutual Fund' || selectedProduct.type === 'DPS' || selectedProduct.type === 'Pension') {
        setCalcMode('sip');
        setP(selectedProduct.minAmount || (selectedProduct.type === 'Pension' ? 5000 : 2000));
        setMaxP(50000);
      }
    }
  }, [selectedProduct]);

  const totalTenureInYears = years + (months / 12);
  const totalMonths = Math.max(1, Math.round(totalTenureInYears * 12));
  const isSipCalc = calcMode === 'sip';
  const totalInvested = isSipCalc ? p * totalMonths : p;
  const monthlyRate = (r / 100) / 12;
  let futureValue = 0;
  if (isSipCalc) {
    futureValue = monthlyRate > 0 
      ? p * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
      : totalInvested;
  } else {
    futureValue = p * Math.pow(1 + r/100, totalTenureInYears);
  }
  const grossGain = Math.max(0, futureValue - totalInvested);
  const taxAmount = (selectedProduct?.taxApplicable !== false) ? grossGain * 0.10 : 0; 
  const netGain = grossGain - taxAmount;
  const totalValue = totalInvested + netGain;

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md overflow-y-auto"
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative my-8"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
          <h3 className="text-2xl font-bold mb-6">Returns Calculator</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-slate-100 pb-8">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Select Bank/Institution</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={selectedBank}
              onChange={(e) => {
                setSelectedBank(e.target.value);
                setSelectedType('');
                setSelectedProduct(null);
              }}
            >
              <option value="">Start by picking a bank...</option>
              {uniqueBanks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
             <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Product Category</label>
             <select 
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              value={selectedType}
              disabled={!selectedBank}
              onChange={(e) => {
                setSelectedType(e.target.value as any);
                setSelectedProduct(null);
              }}
            >
              <option value="">Select Category...</option>
              {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {selectedType && (
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Available Packages</label>
              <div className="flex flex-wrap gap-2">
                {availableProducts.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedProduct?.id === prod.id 
                        ? 'bg-emerald-500 text-white border-emerald-500' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {prod.productName} ({prod.interestRate}%)
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6 mb-10 pt-4">
          {selectedType === 'Insurance' ? (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-blue-600 tracking-widest">Protection & Tax Rebate Instrument</p>
                <p className="text-xs font-bold text-slate-900">Insurance plans provide family protection and up to 15% income tax credit under Section 44. Click "View Package Details" on any package for full sum-assured schedules.</p>
              </div>
            </div>
          ) : selectedType === 'Savings' ? (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <PiggyBank size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest">Zero Lock-in / 100% Liquid</p>
                <p className="text-xs font-bold text-slate-900">Savings accounts have no mandatory maturity term. The duration slider below simulates hypothetical holding periods while your money remains 100% accessible anytime.</p>
              </div>
            </div>
          ) : selectedProduct?.payoutFrequency ? (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <TrendingUp size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-emerald-500 tracking-widest">Profit Distribution</p>
                <p className="text-sm font-bold text-slate-900">Profits are credited {selectedProduct.payoutFrequency.toLowerCase()}</p>
              </div>
            </div>
          ) : null}
          {/* Mode Switcher for SIP vs Lump-Sum */}
          <div className="flex items-center gap-2 mb-6 p-1.5 bg-slate-100 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => {
                setCalcMode('sip');
                if (p > 50000) { setP(5000); setMaxP(50000); }
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                calcMode === 'sip'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp size={14} />
              <span>Monthly SIP / Installment</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCalcMode('lump');
                if (p < 50000) { setP(100000); setMaxP(2000000); }
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                calcMode === 'lump'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap size={14} />
              <span>Lump-Sum (One-Time)</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                  {calcMode === 'sip' ? 'Monthly Contribution (৳/Month)' : 'Investment Amount (৳)'}
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {calcMode === 'sip' ? (
                    [
                      { label: '1K', val: 1000 },
                      { label: '2K', val: 2000 },
                      { label: '5K', val: 5000 },
                      { label: '10K', val: 10000 },
                      { label: '25K', val: 25000 },
                      { label: '50K', val: 50000 }
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => {
                          setMaxP(50000);
                          setP(btn.val);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          p === btn.val 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))
                  ) : (
                    [
                      { label: '1L', val: 100000 },
                      { label: '10L', val: 1000000 },
                      { label: '20L', val: 2000000 },
                      { label: '50L', val: 5000000 },
                      { label: '1CR', val: 10000000 }
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => {
                          setMaxP(btn.val);
                          setP(btn.val);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          p === btn.val 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))
                  )}
                </div>
              </div>
              <span className="font-bold text-slate-900">৳{p.toLocaleString()}{calcMode === 'sip' ? '/mo' : ''}</span>
            </div>
            
            <div className="relative group pt-4">
              {/* Rail track background dots */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 pointer-events-none" />
              
              <input 
                type="range" min="1000" max={maxP} step={calcMode === 'sip' ? "500" : "1000"}
                value={p} onChange={e => setP(Number(e.target.value))}
                className="relative z-10 w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="relative h-6 mt-1">
                 {dynamicTicks.map((tick) => {
                   const pos = getPosition(tick.val);
                   const isActive = p >= tick.val;
                   return (
                     <div 
                       key={tick.label} 
                       className="absolute top-0 flex flex-col items-center cursor-pointer group/tick -translate-x-1/2" 
                       style={{ left: `${pos}%` }}
                       onClick={() => setP(tick.val)}
                     >
                       <div className={`w-2 h-2 rounded-full -mt-[1.125rem] transition-all border-2 ${
                         isActive ? 'bg-emerald-500 border-emerald-500 scale-125' : 'bg-white border-slate-300'
                       } group-hover/tick:scale-150 group-hover/tick:border-emerald-400`} />
                       <div className="h-1 w-px bg-slate-300 mt-2"></div>
                       <span className={`mt-1 text-[7px] font-black tracking-tighter transition-colors whitespace-nowrap ${
                         isActive ? 'text-emerald-600' : 'text-slate-400'
                       }`}>
                         {tick.label}
                       </span>
                     </div>
                   );
                 })}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Investment Horizon (Up to 30 Years)</label>
              <div className="flex items-center gap-1">
                {[1, 3, 5, 10, 15, 20, 25, 30].map(yr => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => { setYears(yr); setMonths(0); }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                      years === yr && months === 0
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {yr}Y
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Expected Return (%)</label>
                <input 
                  type="number" value={r} onChange={e => setR(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Years (1 - 30)</label>
                <input 
                  type="number" value={years} min="1" max="30" onChange={e => setYears(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Additional Months</label>
                <input 
                  type="number" value={months} min="0" max="11" onChange={e => setMonths(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium text-xs">
              {calcMode === 'sip' ? `Total Monthly SIP Invested (${totalMonths} installments)` : 'Total Invested Principal'}
            </span>
            <span className="text-slate-700 font-bold">৳{Math.round(totalInvested).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium text-xs">Estimated Gross Gain</span>
            <span className="text-slate-700 font-bold">৳{Math.round(grossGain).toLocaleString()}</span>
          </div>
          {taxAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-red-400 font-medium text-xs">AIT (10%)</span>
              <span className="text-red-500 font-bold">-৳{Math.round(taxAmount).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pb-4">
            <span className="text-slate-500 font-medium text-xs text-emerald-600">Net Profit (Post-Tax)</span>
            <span className="text-emerald-600 font-bold">+৳{Math.round(netGain).toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-slate-200">
             <div className="flex flex-col">
              <span className="text-slate-900 font-extrabold text-sm uppercase tracking-widest">
                {calcMode === 'sip' ? 'Estimated Wealth Corpus (Net)' : 'Maturity Value'}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">PROJECTION FOR {years}Y {months}M</span>
             </div>
            <span className="text-3xl font-black text-slate-950 tracking-tighter">৳{Math.round(totalValue).toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center border-t border-slate-100 pt-8">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all group"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[10px] uppercase tracking-widest">Back to Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  </motion.div>
  );
};

// --- Formatted AI Market Advisor Markdown Renderer ---

const parseInlineMarkdown = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/^([\s\S]*?)\*\*(.+?)\*\*([\s\S]*)$/);
    // Code / pill `text`
    const codeMatch = remaining.match(/^([\s\S]*?)`(.+?)`([\s\S]*)$/);

    if (boldMatch && (!codeMatch || (boldMatch.index ?? 0) <= (codeMatch.index ?? 0))) {
      const prefix = remaining.substring(0, remaining.indexOf('**'));
      const afterPrefix = remaining.substring(remaining.indexOf('**') + 2);
      const boldEnd = afterPrefix.indexOf('**');
      if (boldEnd !== -1) {
        if (prefix) parts.push(<span key={keyIndex++}>{prefix}</span>);
        const boldText = afterPrefix.substring(0, boldEnd);
        parts.push(<strong key={keyIndex++} className="font-bold text-slate-900">{boldText}</strong>);
        remaining = afterPrefix.substring(boldEnd + 2);
        continue;
      }
    }

    if (codeMatch) {
      const prefix = remaining.substring(0, remaining.indexOf('`'));
      const afterPrefix = remaining.substring(remaining.indexOf('`') + 1);
      const codeEnd = afterPrefix.indexOf('`');
      if (codeEnd !== -1) {
        if (prefix) parts.push(<span key={keyIndex++}>{prefix}</span>);
        const codeText = afterPrefix.substring(0, codeEnd);
        parts.push(
          <span key={keyIndex++} className="px-1.5 py-0.5 mx-0.5 bg-emerald-100/80 text-emerald-900 rounded font-mono text-xs font-semibold border border-emerald-200">
            {codeText}
          </span>
        );
        remaining = afterPrefix.substring(codeEnd + 1);
        continue;
      }
    }

    parts.push(<span key={keyIndex++}>{remaining}</span>);
    break;
  }

  return parts;
};

const FormattedAdvisorMessage = ({ content }: { content: string }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-2.5 text-[13.5px] leading-relaxed text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Horizontal divider
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="border-t border-slate-200 my-3" />;
        }

        // Header 3: ### Title
        if (trimmed.startsWith('### ')) {
          return (
            <div key={idx} className="pt-2 pb-1 border-b border-emerald-100 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block" />
              <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">
                {parseInlineMarkdown(trimmed.replace(/^###\s+/, ''))}
              </h4>
            </div>
          );
        }

        // Header 2: ## Title
        if (trimmed.startsWith('## ')) {
          return (
            <div key={idx} className="pt-3 pb-1 border-b border-slate-200">
              <h3 className="font-black text-slate-950 text-base tracking-tight">
                {parseInlineMarkdown(trimmed.replace(/^##\s+/, ''))}
              </h3>
            </div>
          );
        }

        // Bullet point: * or -
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const bulletContent = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-emerald-500 font-bold select-none text-base leading-tight mt-0.5">•</span>
              <div className="flex-1 text-slate-700">
                {parseInlineMarkdown(bulletContent)}
              </div>
            </div>
          );
        }

        // Numbered list: 1. 2. etc
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold mt-0.5 shrink-0">
                {numberedMatch[1]}
              </span>
              <div className="flex-1 text-slate-700">
                {parseInlineMarkdown(numberedMatch[2])}
              </div>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-slate-700">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export interface AdvisorChatMessage {
  role: 'user' | 'ai';
  content: string;
  timeTakenSec?: number;
  modelUsed?: string;
  timestamp?: string;
}

const InvestoAI = ({ isOpen, onClose, messages, setMessages }: { 
  isOpen: boolean; 
  onClose: () => void;
  messages: AdvisorChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<AdvisorChatMessage[]>>;
}) => {
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'quick' | 'comprehensive' | 'shariah'>('comprehensive');
  const [isExpanded, setIsExpanded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Stage details for the live progress calculation
  const ANALYSIS_STAGES = [
    { title: 'Scanning Financial Registry', desc: 'Evaluating 225+ banking, loan, DPS & Shariah schemes across 50+ Bangladesh institutions...' },
    { title: 'Regulatory & Policy Benchmarking', desc: 'Applying November 2026 BB 10.00% Policy Repo rate & 10%/15% AIT brackets...' },
    { title: 'Yield & Safety Modeling', desc: 'Computing compounding yields, risk-adjusted ratings & net returns...' },
    { title: 'Synthesizing Strategic Report', desc: 'Finalizing executive recommendations, math models & execution steps...' },
  ];

  const estimatedSeconds = analysisMode === 'quick' ? 3 : analysisMode === 'shariah' ? 4 : 5;

  useEffect(() => {
    if (!isTyping) {
      setElapsedTime(0);
      setCurrentStageIndex(0);
      return;
    }

    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setElapsedTime(Number(elapsed.toFixed(1)));

      if (elapsed < 1.2) {
        setCurrentStageIndex(0);
      } else if (elapsed < 2.6) {
        setCurrentStageIndex(1);
      } else if (elapsed < 4.0) {
        setCurrentStageIndex(2);
      } else {
        setCurrentStageIndex(3);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = textToSend.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp }]);
    setPrompt('');
    setIsTyping(true);

    const clientStartTime = Date.now();

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          mode: analysisMode
        }),
      });

      const data = await res.json();
      const actualSec = data.actualTimeMs 
        ? Number((data.actualTimeMs / 1000).toFixed(1))
        : Number(((Date.now() - clientStartTime) / 1000).toFixed(1));

      setMessages(prev => [
        ...prev, 
        { 
          role: 'ai', 
          content: data.reply || "I'm having trouble analyzing the financial markets right now. Please try again.",
          timeTakenSec: actualSec,
          modelUsed: data.modelUsed || 'BANKTANK Market Engine',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      const fallbackSec = Number(((Date.now() - clientStartTime) / 1000).toFixed(1));
      setMessages(prev => [
        ...prev, 
        { 
          role: 'ai', 
          content: "### 🎯 Strategic Banking Advisory: November 2026\n\n**Market Backdrop:** Bangladesh Bank has fixed the benchmark policy repo rate at **10.00%** (SLF: 11.50%, SDF: 8.50%).\n\n* **Top Fixed Deposits (FDR):** Yielding **10.50% - 12.00% p.a.** across scheduled commercial banks.\n* **National Savings Certificates (Sanchaypatra):** Yielding up to **11.76% p.a.** backed by 100% sovereign government guarantee.\n* **Islamic Mudaraba DPS:** Offering competitive expected profit rates between **10.25% - 11.50% p.a.**\n* **Tax Optimization:** 10% AIT applies for return filers with e-TIN; 15% for non-filers.\n\n*Explore our comparison table to filter and inspect all 225+ registered packages.*",
          timeTakenSec: fallbackSec,
          modelUsed: 'BANKTANK Backup Engine',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      { 
        role: 'ai', 
        content: "As-salamu alaykum! I am your **BANKTANK AI Market Advisor**, specialized as a Senior Banking Sector Strategist in Bangladesh (Scenario: **November 2026**).\n\nI deliver comprehensive, mathematically calculated investment analyses comparing **225+ banking, loan, DPS, FDR, Pension, and Shariah-compliant schemes**.\n\nAsk me anything in English or Bengali (e.g. *'Compare top 3 Islamic DPS for 5 years'*, *'Where to invest BDT 500,000 safely?'*, or *'5-Year Sanchaypatra vs 11.5% Bank FDR'*).\n\nChoose your analysis mode below — I will indicate the estimated calculation time and provide a thorough, structured consultation.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const PROMPT_SUGGESTIONS = [
    { label: 'Top Islamic DPS (5 Yrs)', mode: 'shariah' as const, prompt: 'Compare the top 3 Shariah-compliant Islamic DPS accounts for 5 years with expected profit rates and BDT 5,000/month return calculation.' },
    { label: 'BDT 500,000 Safe Investment', mode: 'comprehensive' as const, prompt: 'I want to invest BDT 500,000 for maximum safe return in Bangladesh. Provide a complete allocation between Sanchaypatra and AAA Bank FDR.' },
    { label: 'Sanchaypatra vs 11.5% FDR', mode: 'comprehensive' as const, prompt: 'Compare 5-Year Bangladesh Sanchaypatra (11.76%) vs 11.50% Bank FDR: show net earnings after 10% vs 15% tax and liquidity terms.' },
    { label: 'Highest Yield Islamic MTDR', mode: 'shariah' as const, prompt: 'What are the highest yield Islamic Mudaraba Term Deposit (MTDR) packages in Bangladesh with Shariah board certification?' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 500 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 500 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`fixed inset-y-0 right-0 ${
            isExpanded ? 'w-full md:w-[760px] lg:w-[860px]' : 'w-full md:w-[500px]'
          } bg-white shadow-2xl z-[60] border-l border-slate-200 flex flex-col transition-all duration-300`}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center font-black text-slate-950 shadow-md shadow-emerald-500/20">
                <Bot size={22} className="text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white tracking-tight">AI Market Advisor</h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Nov 2026 Live
                  </span>
                </div>
                <p className="text-[10.5px] text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Banking Sector Specialist • 225+ Products Indexed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse to standard width" : "Expand to wide view for detailed tables"}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden md:block"
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Mode Selector & Upfront Time Indicator Bar */}
          <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Timer size={14} className="text-emerald-400" />
              <span className="font-medium text-[11px] text-slate-300">Analysis Mode:</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAnalysisMode('comprehensive')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  analysisMode === 'comprehensive'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📊 Deep Comprehensive</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${analysisMode === 'comprehensive' ? 'bg-emerald-600/30 text-slate-950 font-black' : 'text-slate-400'}`}>
                  ~4-6s
                </span>
              </button>

              <button
                onClick={() => setAnalysisMode('shariah')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  analysisMode === 'shariah'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>☪️ Shariah Audit</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${analysisMode === 'shariah' ? 'bg-emerald-600/30 text-slate-950 font-black' : 'text-slate-400'}`}>
                  ~3-5s
                </span>
              </button>

              <button
                onClick={() => setAnalysisMode('quick')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  analysisMode === 'quick'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>⚡ Quick Scan</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${analysisMode === 'quick' ? 'bg-emerald-600/30 text-slate-950 font-black' : 'text-slate-400'}`}>
                  ~2-3s
                </span>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[92%] rounded-2xl p-4 md:p-5 transition-all shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-slate-950 text-white font-medium rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-slate-100'
                }`}>
                  {m.role === 'user' ? (
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  ) : (
                    <div>
                      {/* Meta badge header on AI responses */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <Zap size={12} className="text-emerald-500" />
                          <span>
                            {m.timeTakenSec 
                              ? `Analyzed in ${m.timeTakenSec}s • 225+ products` 
                              : 'AI Market Intelligence Engine'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {m.timestamp && <span className="text-[10px] text-slate-400">{m.timestamp}</span>}
                          <button
                            onClick={() => handleCopy(m.content, i)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            title="Copy advisory report"
                          >
                            {copiedIndex === i ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </div>

                      <FormattedAdvisorMessage content={m.content} />

                      {/* Advisory Disclaimer footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Scenario: November 2026 • Bangladesh Bank Repo: 10.00%</span>
                        <span className="font-semibold text-slate-500">BANKTANK Verified</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Progress Card when analyzing */}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-emerald-500/30 rounded-2xl p-5 shadow-lg shadow-emerald-500/5 max-w-[92%]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <RefreshCw size={16} className="animate-spin text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Financial Analysis in Progress</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Calculating
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Estimated time to answer: <strong className="text-emerald-700 font-bold">~{estimatedSeconds} seconds</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      <Clock size={12} className="text-emerald-500" />
                      <span>{elapsedTime.toFixed(1)}s</span>
                      <span className="text-slate-400 font-normal">/ ~{estimatedSeconds}s</span>
                    </div>
                  </div>
                </div>

                {/* Animated progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4 border border-slate-200/60">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full"
                    initial={{ width: '5%' }}
                    animate={{ 
                      width: `${Math.min(95, Math.max(15, (elapsedTime / estimatedSeconds) * 92))}%` 
                    }}
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                  />
                </div>

                {/* Dynamic Stages Tracker */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                    Analytical Pipeline ({currentStageIndex + 1}/4)
                  </p>
                  {ANALYSIS_STAGES.map((stage, idx) => {
                    const isDone = currentStageIndex > idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div 
                        key={idx} 
                        className={`flex items-start gap-2.5 text-xs transition-opacity ${
                          isCurrent 
                            ? 'opacity-100 font-semibold text-emerald-950' 
                            : isDone 
                              ? 'opacity-60 text-slate-500' 
                              : 'opacity-30 text-slate-400'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isDone ? (
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black">✓</div>
                          ) : isCurrent ? (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`text-[11px] ${isCurrent ? 'text-emerald-900 font-bold' : ''}`}>
                            {stage.title}
                          </span>
                          {isCurrent && (
                            <p className="text-[10.5px] text-slate-500 font-normal leading-tight mt-0.5">
                              {stage.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-5 py-2.5 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={12} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Advisory Inquiries (Click to run):
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAnalysisMode(item.mode);
                    handleSend(item.prompt);
                  }}
                  disabled={isTyping}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium whitespace-nowrap border border-slate-200 transition-all shrink-0 active:scale-95 disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-slate-200 bg-white shrink-0">
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  analysisMode === 'shariah'
                    ? "Ask about Islamic DPS, Mudaraba profit rates, Sukuk, Halal mutual funds..."
                    : "Ask about bank FDRs, Sanchaypatra, profit rates, taxes, or 5-year plans..."
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-24 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none min-h-[85px] max-h-[140px] block"
                rows={3}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!prompt.trim() || isTyping}
                className="absolute right-3 bottom-3 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                {isTyping ? (
                  <>
                    <RefreshCw size={13} className="animate-spin text-emerald-400" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Consult</span>
                    <ArrowRightLeft size={13} className="text-emerald-400" />
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Press <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[9px]">Enter</kbd> to submit</span>
              <span className="font-medium text-emerald-700">Expected time: ~{estimatedSeconds}s</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FAQSection = ({ 
  onNavigateToFAQ, 
}: { 
  onNavigateToFAQ: (cat?: 'all' | FAQCategory) => void;
  onOpenCalc?: () => void;
  onOpenAI?: () => void;
}) => {
  const categorySubpages = [
    { id: 'loans' as FAQCategory, label: 'Bank Loans FAQ', icon: BadgeDollarSign, count: 3, colorClass: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 hover:border-amber-300' },
    { id: 'savings' as FAQCategory, label: 'Savings & FDR FAQ', icon: Wallet, count: 3, colorClass: 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 hover:border-blue-300' },
    { id: 'shariah' as FAQCategory, label: 'Shariah Banking FAQ', icon: Moon, count: 3, colorClass: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300' },
    { id: 'pension' as FAQCategory, label: 'Pension Schemes FAQ', icon: Users, count: 3, colorClass: 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100 hover:border-purple-300' },
    { id: 'mutual-funds' as FAQCategory, label: 'Mutual Funds FAQ', icon: Zap, count: 4, colorClass: 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300' },
    { id: 'insurance' as FAQCategory, label: 'Insurance Plans FAQ', icon: ShieldCheck, count: 4, colorClass: 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100 hover:border-rose-300' },
  ];

  return (
    <section className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-6">
      {/* Heading with Transparent Explore Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-extrabold uppercase tracking-widest border border-emerald-100 mb-3 w-fit">
            <HelpCircle size={12} className="text-emerald-600" />
            Knowledge Base • Bangladesh Financial Registry
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1 max-w-xl">
            Have questions about bank loans, interest calculations, FDR tenors, Shariah guidelines, or pension rules? Explore our dedicated FAQ knowledge base.
          </p>
        </div>

        {/* Transparent Explore Button */}
        <button
          type="button"
          onClick={() => onNavigateToFAQ('all')}
          className="px-5 py-3 bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-900 border-2 border-slate-300 hover:border-slate-800 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs self-start md:self-auto shrink-0 tracking-wide"
        >
          <Compass size={15} className="text-emerald-600" />
          <span>Explore All FAQs &amp; Guides</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Category Sub-Page Quick Jump Links */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-500 px-1">
          <span>Click Any Domain to Open Its Dedicated FAQ Sub-Page:</span>
          <button 
            type="button" 
            onClick={() => onNavigateToFAQ('all')}
            className="text-emerald-600 hover:underline text-[11px] font-bold cursor-pointer"
          >
            View All 20 Questions →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categorySubpages.map(sub => {
            const Icon = sub.icon;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onNavigateToFAQ(sub.id)}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between gap-3 cursor-pointer ${sub.colorClass} hover:shadow-sm hover:scale-[1.02] active:scale-95`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={18} />
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-white/80 border border-slate-200/60">
                    {sub.count} Qs
                  </span>
                </div>
                <div>
                  <div className="text-xs font-extrabold leading-tight">
                    {sub.label}
                  </div>
                  <span className="text-[10px] font-semibold opacity-75 mt-0.5 inline-flex items-center gap-0.5">
                    Open sub-page →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transparent Explore Full FAQ Card Footer */}
      <div className="p-5 md:p-6 bg-slate-50/60 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs shrink-0">
            <BookOpen size={22} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-extrabold text-slate-900">
              Need comprehensive regulatory analysis or formulas?
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Browse all 20+ verified financial queries, search by topic, and compare policy rules on the dedicated FAQ page.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToFAQ('all')}
          className="px-5 py-2.5 bg-transparent hover:bg-slate-900 text-slate-900 hover:text-white border-2 border-slate-900 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <span>Open Main FAQ Page</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
  );
};

const HomePage = ({ 
  onFilterChange, 
  onNavigateToFAQ,
  onOpenAI, 
  onOpenCalc,
  regularCounts = { all: 126, savings: 38, fdr: 38, dps: 39, schemes: 7, nationalSavings: 4 },
  shariahCounts = { all: 44, savings: 11, dps: 12, fdr: 11, funds: 5, other: 5 },
  loanCounts = { all: 28, personal: 6, home: 6, car: 5, sme: 5, agriculture: 5, corporate: 4, education: 3, professional: 2, islamic: 2, secured: 3 },
  pensionCounts = { all: 11, national: 5, bankPension: 6, seniorCitizen: 2 },
  onRegularSubFilterChange,
  onShariahSubFilterChange,
  onLoanSubFilterChange,
  onPensionSubFilterChange
}: { 
  onFilterChange: (f: AppFilter) => void; 
  onNavigateToFAQ: (cat?: 'all' | FAQCategory) => void;
  onOpenAI: () => void; 
  onOpenCalc: () => void;
  regularCounts?: any;
  shariahCounts?: any;
  loanCounts?: any;
  pensionCounts?: any;
  onRegularSubFilterChange?: (s: any) => void;
  onShariahSubFilterChange?: (s: any) => void;
  onLoanSubFilterChange?: (s: any) => void;
  onPensionSubFilterChange?: (s: any) => void;
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const topYields = financialProducts
    .sort((a, b) => b.interestRate - a.interestRate)
    .slice(0, 4);

  const primaryCategories = [
    { 
      id: 'RegularSavings' as AppFilter, 
      faqCat: 'savings' as FAQCategory,
      label: 'Regular Savings', 
      icon: Wallet, 
      color: 'blue', 
      badge: `${regularCounts.all} Plans`, 
      description: 'Conventional Banking, FDR, DPS, Schemes & National Savings',
      subItems: [
        ...REGULAR_SUB_ITEMS.map(sub => ({
          id: sub.id,
          label: sub.label,
          count: regularCounts[sub.countKey],
          icon: sub.icon,
          action: () => {
            onFilterChange('RegularSavings');
            if (onRegularSubFilterChange) onRegularSubFilterChange(sub.id);
          }
        })),
        {
          id: 'reg-faq',
          label: 'Savings & FDR FAQs Guide',
          count: 'FAQs',
          icon: BookOpen,
          action: () => onNavigateToFAQ('savings')
        }
      ]
    },
    { 
      id: 'Shariah' as AppFilter, 
      faqCat: 'shariah' as FAQCategory,
      label: 'Shariah Savings', 
      icon: Moon, 
      color: 'emerald', 
      badge: '100% Halal', 
      description: 'CSBIB Certified Riba-Free Islamic Savings, Mudaraba, Sukuk & Takaful',
      subItems: [
        ...SHARIAH_SUB_ITEMS.map(sub => ({
          id: sub.id,
          label: sub.label,
          count: shariahCounts[sub.countKey],
          icon: sub.icon,
          action: () => {
            onFilterChange('Shariah');
            if (onShariahSubFilterChange) onShariahSubFilterChange(sub.id);
          }
        })),
        {
          id: 'sha-faq',
          label: 'Shariah Banking FAQs Guide',
          count: 'FAQs',
          icon: BookOpen,
          action: () => onNavigateToFAQ('shariah')
        }
      ]
    },
    { 
      id: 'Loan' as AppFilter, 
      faqCat: 'loans' as FAQCategory,
      label: 'Bank Loans', 
      icon: BadgeDollarSign, 
      color: 'amber', 
      badge: `${loanCounts.all} Loans`, 
      description: 'Personal, Auto, Mortgage, SME, Krishi & Corporate Financing',
      subItems: [
        ...LOAN_SUB_ITEMS.map(sub => ({
          id: sub.id,
          label: sub.label,
          count: loanCounts[sub.countKey],
          icon: sub.icon,
          action: () => {
            onFilterChange('Loan');
            if (onLoanSubFilterChange) onLoanSubFilterChange(sub.id);
          }
        })),
        {
          id: 'loan-faq',
          label: 'Bank Loans FAQs & Criteria Guide',
          count: 'FAQs',
          icon: BookOpen,
          action: () => onNavigateToFAQ('loans')
        }
      ]
    },
    { 
      id: 'Pension' as AppFilter, 
      faqCat: 'pension' as FAQCategory,
      label: 'Pension Schemes', 
      icon: Users, 
      color: 'purple', 
      badge: 'Universal NPS', 
      description: 'National Universal Pension Authority (NPA) & Bank Retirement DPS',
      subItems: [
        ...PENSION_SUB_ITEMS.map(sub => ({
          id: sub.id,
          label: sub.label,
          count: pensionCounts[sub.countKey],
          icon: sub.icon,
          action: () => {
            onFilterChange('Pension');
            if (onPensionSubFilterChange) onPensionSubFilterChange(sub.id);
          }
        })),
        {
          id: 'pen-faq',
          label: 'Universal Pension FAQs Guide',
          count: 'FAQs',
          icon: BookOpen,
          action: () => onNavigateToFAQ('pension')
        }
      ]
    },
    { 
      id: 'Mutual Fund' as AppFilter, 
      faqCat: 'mutual-funds' as FAQCategory,
      label: 'Mutual Funds', 
      icon: Zap, 
      color: 'cyan', 
      badge: 'Asset Mgmt', 
      description: 'SEBC Regulated Mutual Funds & Monthly SIP Wealth Accumulation',
      subItems: [
        {
          id: 'mf-all',
          label: 'Explore All Mutual Funds',
          count: 'All',
          icon: Zap,
          action: () => onFilterChange('Mutual Fund')
        },
        {
          id: 'mf-faq',
          label: 'Mutual Funds FAQs & SIP Guide',
          count: 'FAQs',
          icon: BookOpen,
          action: () => onNavigateToFAQ('mutual-funds')
        }
      ]
    },
    { 
      id: 'Insurance' as AppFilter, 
      faqCat: 'insurance' as FAQCategory,
      label: 'Insurance Plans', 
      icon: ShieldCheck, 
      color: 'rose', 
      badge: 'IDRA Certified', 
      description: 'Life, Health, Family Protection & Islamic Takaful Assurance',
      subItems: [
        {
          id: 'ins-all',
          label: 'Explore All Insurance Plans',
          count: 'All',
          icon: ShieldCheck,
          action: () => onFilterChange('Insurance')
        },
        {
          id: 'ins-faq',
          label: 'Insurance & Takaful FAQs Guide',
          count: 'FAQs',
          icon: BookOpen,
          action: () => onNavigateToFAQ('insurance')
        }
      ]
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="relative bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 overflow-hidden group shadow-sm hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 -skew-x-12 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-extrabold uppercase tracking-widest border border-emerald-100 w-fit">
              Intelligence-Led Wealth Management
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none">
              Build Your <span className="text-emerald-500">Wealth</span> with <br />
              Precision & Safety.
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
              Analyze, compare, and optimize your investments across 50+ central and commercial banks in Bangladesh. Powered by real-time data and AI-driven insights.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onOpenAI}
                className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl active:scale-95"
              >
                <MessageSquare size={18} className="text-emerald-400" />
                AI Market Advisor
              </button>
              <button 
                onClick={onOpenCalc}
                className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95"
              >
                <Calculator size={18} className="text-blue-500" />
                Investment Calculator
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-4 w-72">
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 rotate-2 group-hover:rotate-0 transition-transform shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">BB Policy Rate</p>
                <p className="text-2xl font-black text-slate-900">10.00%</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">NOV 2026 REPO</p>
             </div>
             <div className="bg-emerald-500 p-6 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform shadow-lg shadow-emerald-500/20">
                <p className="text-[10px] font-bold text-emerald-950/40 uppercase tracking-widest mb-1 text-white/60">Highest Yield</p>
                <p className="text-2xl font-black text-slate-950">11.76%</p>
                <p className="text-[10px] text-emerald-950/60 font-bold mt-1">GOVT SAVINGS</p>
             </div>
          </div>
        </div>
      </section>

      <MarketPulse />

      {/* Investment Categories - Starts with NO submenus open */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-950 tracking-tight">Investment Categories</h3>
            <p className="text-xs text-slate-500 font-medium">
              Click a category to browse all packages, or click the down arrow (▼) to reveal sub-menus
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {primaryCategories.map((cat) => {
            const hasSub = cat.subItems.length > 0;
            const isExpanded = expandedCategory === cat.id;

            return (
              <div 
                key={cat.id}
                className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                {/* Main Card Header / Action */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`p-4 rounded-2xl bg-${cat.color}-500/10 text-${cat.color}-600`}>
                      <cat.icon size={26} />
                    </div>

                    <div className="flex items-center gap-2">
                      {cat.badge && (
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          cat.id === 'Shariah'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : cat.id === 'Loan'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : cat.id === 'Pension'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                          {cat.badge}
                        </span>
                      )}

                      {/* Arrow Down button to toggle sub menus */}
                      {hasSub && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCategory(isExpanded ? null : cat.id);
                          }}
                          className={`p-2 rounded-xl transition-all border ${
                            isExpanded 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                          }`}
                          title={isExpanded ? "Collapse sub-menus" : "Click to view sub-menus"}
                        >
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-white' : ''}`} 
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={() => onNavigateToFAQ(cat.faqCat)}
                      className="text-left group/title cursor-pointer w-full"
                      title={`Click to open ${cat.label} FAQ Sub-Page`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-extrabold text-slate-950 uppercase tracking-tight group-hover/title:text-emerald-600 transition-colors">
                          {cat.label}
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-600 opacity-80 group-hover/title:opacity-100 transition-opacity flex items-center gap-0.5">
                          FAQ Guide <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </button>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                      {cat.description}
                    </p>
                  </div>

                  {/* Card bottom navigation actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToFAQ(cat.faqCat)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                        title={`Open dedicated ${cat.label} FAQ Sub-Page`}
                      >
                        <BookOpen size={13} className="text-emerald-400 group-hover:text-white" />
                        <span>{cat.label} FAQ</span>
                        <ArrowUpRight size={11} className="opacity-70" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onFilterChange(cat.id)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-0.5 cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100"
                        title={`Browse all ${cat.label} packages`}
                      >
                        <span>Plans</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    {hasSub && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCategory(isExpanded ? null : cat.id);
                        }}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                          isExpanded 
                            ? 'bg-slate-900 text-white' 
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <span>{isExpanded ? 'Hide' : 'Sub Menus'}</span>
                        <ChevronDown size={13} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Smooth Accordion Sub Menus Drawer - Appears on Down Arrow Click */}
                <AnimatePresence initial={false}>
                  {isExpanded && hasSub && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-slate-50 border-t border-slate-200/80 p-4 space-y-2 overflow-hidden"
                    >
                      <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-1">
                        <span>Select Sub-Category:</span>
                        <span>{cat.subItems.length} Options</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {cat.subItems.map((sub: any) => {
                          const SubIcon = sub.icon;
                          return (
                            <HoverFullText key={sub.id} fullText={sub.label} badge={sub.count} className="min-w-0 w-full">
                              <button
                                type="button"
                                onClick={() => sub.action()}
                                className="w-full px-3 py-2 rounded-xl bg-white hover:bg-emerald-50/40 hover:border-emerald-500/40 hover:shadow-xs border border-slate-200/90 text-left transition-all flex items-center justify-between gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 active:scale-95 shadow-2xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {SubIcon && <SubIcon size={14} className="text-slate-500 shrink-0" />}
                                  <span className="truncate">{sub.label}</span>
                                </div>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 border border-slate-200">
                                  {sub.count}
                                </span>
                              </button>
                            </HoverFullText>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 -mx-4 px-4 md:mx-0 md:px-0 py-12 md:py-0 md:bg-transparent">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-950 tracking-tight">Market Highlights</h3>
            <p className="text-xs text-slate-500 font-medium">The best performing instruments available today</p>
          </div>
          <button 
            onClick={() => onFilterChange('All')}
            className="text-xs font-bold text-emerald-600 uppercase tracking-widest hover:underline underline-offset-4"
          >
            Browse Marketplace
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topYields.map((product) => (
            <div key={product.id} className="relative group/card cursor-pointer" onClick={() => onFilterChange(product.type)}>
              <div className="absolute inset-0 bg-emerald-500 rounded-3xl opacity-0 translate-y-2 group-hover/card:opacity-10 group-hover/card:translate-y-4 transition-all" />
              <div className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center p-1 border border-slate-100 overflow-hidden shrink-0">
                    {product.logoUrl ? <img src={product.logoUrl} className="w-full h-full object-contain" /> : <BankTankLogo showText={false} className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <HoverFullText fullText={product.bankName} className="min-w-0">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase truncate tracking-widest">{product.bankName}</h4>
                    </HoverFullText>
                    <HoverFullText fullText={product.productName} className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-900 truncate tracking-tight uppercase leading-none">{product.productName}</p>
                    </HoverFullText>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                   <div className="flex items-baseline gap-1 mt-auto">
                      <span className="text-3xl font-black text-emerald-600 tracking-tighter">{product.interestRate}%</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Yield</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section - Concise with Transparent Explore Button */}
      <FAQSection 
        onNavigateToFAQ={onNavigateToFAQ}
        onOpenCalc={onOpenCalc}
        onOpenAI={onOpenAI}
      />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [filter, setFilter] = useState<AppFilter>('Home');
  const [faqCategory, setFaqCategory] = useState<'all' | FAQCategory>('all');
  const [regularSubFilter, setRegularSubFilter] = useState<'All' | 'Savings' | 'FDR' | 'DPS' | 'Exclusive' | 'Sanchaypatra'>('All');
  const [shariahSubFilter, setShariahSubFilter] = useState<'All' | 'Savings' | 'DPS' | 'FDR' | 'Mutual Fund' | 'Other'>('All');
  const [loanSubFilter, setLoanSubFilter] = useState<'All' | 'Personal' | 'Home' | 'Car' | 'SME' | 'Agriculture' | 'Corporate' | 'Education' | 'Professional' | 'Islamic' | 'Secured'>('All');
  const [pensionSubFilter, setPensionSubFilter] = useState<'All' | 'National' | 'BankPension' | 'SeniorCitizen'>('All');
  const [search, setSearch] = useState('');
  const [compareItems, setCompareItems] = useState<FinancialProduct[]>([]);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [legalType, setLegalType] = useState<'TOS' | 'Privacy' | 'Disclaimer'>('TOS');
  const [sortBy, setSortBy] = useState<'rate-desc' | 'rate-asc' | 'safety' | 'name'>('rate-desc');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<FinancialProduct | null>(null);

  const handleViewDetails = (product: FinancialProduct) => {
    setDetailProduct(product);
    setIsDetailOpen(true);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AdvisorChatMessage[]>([
    { 
      role: 'ai', 
      content: "As-salamu alaykum! I am your **BANKTANK AI Market Advisor**, specialized as a Senior Banking Sector Strategist in Bangladesh (Scenario: **November 2026**).\n\nI deliver comprehensive, mathematically calculated financial analyses comparing **225+ banking, loan, DPS, FDR, Pension, and Shariah-compliant schemes**.\n\nAsk me anything in English or Bengali (e.g. *'Compare lowest Home Loan rates vs DBH'*, *'Which Universal Pension Scheme fits me?'*, *'Personal loan vs loan against FDR'*, or *'Compare top 3 Islamic DPS for 5 years'*).\n\nChoose your analysis mode above — I will indicate the estimated calculation time and provide a thorough, structured consultation.",
      timestamp: 'November 2026'
    }
  ]);

  const mainScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToFAQ = (cat: 'all' | FAQCategory = 'all') => {
    setFaqCategory(cat);
    setFilter('FAQ');
    setSearch('');
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMarketplaceClick = () => {
    setIsAIOpen(true);
  };

  useEffect(() => {
    if (search !== '' && filter === 'Home') {
      setFilter('All');
    }
  }, [search, filter]);

  const regularCounts = useMemo(() => {
    const list = financialProducts.filter(p => !p.isShariahCompliant && ['Savings', 'FDR', 'DPS', 'Exclusive', 'Sanchaypatra'].includes(p.type));
    return {
      all: list.length,
      savings: list.filter(p => p.type === 'Savings').length,
      fdr: list.filter(p => p.type === 'FDR').length,
      dps: list.filter(p => p.type === 'DPS').length,
      schemes: list.filter(p => p.type === 'Exclusive').length,
      nationalSavings: list.filter(p => p.type === 'Sanchaypatra').length,
    };
  }, []);

  const shariahCounts = useMemo(() => {
    const list = financialProducts.filter(p => p.isShariahCompliant);
    return {
      all: list.length,
      savings: list.filter(p => p.type === 'Savings').length,
      dps: list.filter(p => p.type === 'DPS').length,
      fdr: list.filter(p => p.type === 'FDR').length,
      funds: list.filter(p => p.type === 'Mutual Fund').length,
      other: list.filter(p => p.type === 'Sanchaypatra' || p.type === 'Insurance' || p.type === 'Exclusive' || p.type === 'Loan' || p.type === 'Pension').length
    };
  }, []);

  const loanCounts = useMemo(() => {
    const list = financialProducts.filter(p => p.type === 'Loan');
    return {
      all: list.length,
      personal: list.filter(p => p.loanSubCategory === 'Personal').length,
      home: list.filter(p => p.loanSubCategory === 'Home').length,
      car: list.filter(p => p.loanSubCategory === 'Car').length,
      sme: list.filter(p => p.loanSubCategory === 'SME').length,
      agriculture: list.filter(p => p.loanSubCategory === 'Agriculture').length,
      corporate: list.filter(p => p.loanSubCategory === 'Corporate').length,
      education: list.filter(p => p.loanSubCategory === 'Education').length,
      professional: list.filter(p => p.loanSubCategory === 'Professional').length,
      islamic: list.filter(p => p.loanSubCategory === 'Islamic').length,
      secured: list.filter(p => p.loanSubCategory === 'Secured').length,
    };
  }, []);

  const pensionCounts = useMemo(() => {
    const list = financialProducts.filter(p => p.type === 'Pension');
    return {
      all: list.length,
      national: list.filter(p => p.pensionSubCategory === 'National').length,
      bankPension: list.filter(p => p.pensionSubCategory === 'BankPension').length,
      seniorCitizen: list.filter(p => p.pensionSubCategory === 'SeniorCitizen').length,
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = financialProducts.filter(p => {
      let matchFilter = false;
      if (filter === 'Home' || filter === 'All') {
        matchFilter = true;
      } else if (filter === 'RegularSavings') {
        if (p.isShariahCompliant) return false;
        if (!['Savings', 'FDR', 'DPS', 'Exclusive', 'Sanchaypatra'].includes(p.type)) return false;
        matchFilter = regularSubFilter === 'All' ? true : p.type === regularSubFilter;
      } else if (filter === 'Shariah') {
        if (!p.isShariahCompliant) return false;
        if (shariahSubFilter === 'All') {
          matchFilter = true;
        } else if (shariahSubFilter === 'Other') {
          matchFilter = p.type === 'Sanchaypatra' || p.type === 'Insurance' || p.type === 'Exclusive';
        } else {
          matchFilter = p.type === shariahSubFilter;
        }
      } else if (filter === 'Loan') {
        if (p.type !== 'Loan') return false;
        matchFilter = loanSubFilter === 'All' ? true : p.loanSubCategory === loanSubFilter;
      } else if (filter === 'Pension') {
        if (p.type !== 'Pension') return false;
        matchFilter = pensionSubFilter === 'All' ? true : p.pensionSubCategory === pensionSubFilter;
      } else {
        matchFilter = p.type === filter;
      }

      const matchSearch = p.bankName.toLowerCase().includes(search.toLowerCase()) || 
                          p.productName.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'rate-desc') return b.interestRate - a.interestRate;
      if (sortBy === 'rate-asc') return a.interestRate - b.interestRate;
      if (sortBy === 'name') return a.bankName.localeCompare(b.bankName);
      if (sortBy === 'safety') {
        const rank = { 'Safe': 0, 'Moderate': 1, 'Risky': 2 };
        return rank[a.safetyRating] - rank[b.safetyRating];
      }
      return 0;
    });

    return result;
  }, [filter, regularSubFilter, shariahSubFilter, loanSubFilter, pensionSubFilter, search, sortBy]);

  const groupedProducts = useMemo(() => {
    if (filter !== 'Mutual Fund' && search === '') return null;
    // If searching, we might want to just show the results plainly, or group them if Mutual Fund is active anyway.
    // For now, let's group only if Mutual Fund filter is active.
    if (filter !== 'Mutual Fund') return null;
    
    const groups: Record<string, FinancialProduct[]> = {};
    filteredProducts.forEach(p => {
      if (!groups[p.bankName]) groups[p.bankName] = [];
      groups[p.bankName].push(p);
    });
    return groups;
  }, [filter, filteredProducts, search]);

  const handleCompare = (product: FinancialProduct) => {
    if (compareItems.some(i => i.id === product.id)) {
      setCompareItems(compareItems.filter(i => i.id !== product.id));
      return;
    }
    if (compareItems.length >= 3) return;
    setCompareItems([...compareItems, product]);
  };

  const removeFromCompare = (id: string) => {
    setCompareItems(compareItems.filter(i => i.id !== id));
  };

  const handleBankClick = (bank: string) => {
    setSearch(bank);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-hidden">
      <Sidebar 
        currentFilter={filter} 
        onFilterChange={setFilter} 
        onMarketplaceClick={handleMarketplaceClick}
        regularSubFilter={regularSubFilter}
        onRegularSubFilterChange={setRegularSubFilter}
        regularCounts={regularCounts}
        shariahSubFilter={shariahSubFilter}
        onShariahSubFilterChange={setShariahSubFilter}
        shariahCounts={shariahCounts}
        loanSubFilter={loanSubFilter}
        onLoanSubFilterChange={setLoanSubFilter}
        loanCounts={loanCounts}
        pensionSubFilter={pensionSubFilter}
        onPensionSubFilterChange={setPensionSubFilter}
        pensionCounts={pensionCounts}
      />
      <MobileDrawer 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentFilter={filter} 
        onFilterChange={setFilter} 
        onMarketplaceClick={handleMarketplaceClick}
        regularSubFilter={regularSubFilter}
        onRegularSubFilterChange={setRegularSubFilter}
        regularCounts={regularCounts}
        shariahSubFilter={shariahSubFilter}
        onShariahSubFilterChange={setShariahSubFilter}
        shariahCounts={shariahCounts}
        loanSubFilter={loanSubFilter}
        onLoanSubFilterChange={setLoanSubFilter}
        loanCounts={loanCounts}
        pensionSubFilter={pensionSubFilter}
        onPensionSubFilterChange={setPensionSubFilter}
        pensionCounts={pensionCounts}
      />
      
      <div ref={mainScrollRef} className="flex-1 flex flex-col overflow-y-auto relative">
        <Header 
          search={search} 
          setSearch={setSearch} 
          onOpenCalc={() => setIsCalcOpen(true)}
          onOpenAI={() => setIsAIOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <main className="p-4 md:p-8 max-w-7xl w-full mx-auto pb-40">
          <MobileNavigation 
            onOpenAI={() => setIsAIOpen(true)} 
            onFilterChange={setFilter}
            onOpenAbout={() => setIsAboutOpen(true)}
            onMarketplaceClick={handleMarketplaceClick}
          />
          
          {filter === 'Home' && search === '' ? (
            <HomePage 
              onFilterChange={(f) => {
                setFilter(f);
              }}
              onNavigateToFAQ={handleNavigateToFAQ}
              onOpenAI={() => setIsAIOpen(true)}
              onOpenCalc={() => setIsCalcOpen(true)}
              regularCounts={regularCounts}
              shariahCounts={shariahCounts}
              loanCounts={loanCounts}
              pensionCounts={pensionCounts}
              onRegularSubFilterChange={(sub) => {
                setFilter('RegularSavings');
                setRegularSubFilter(sub);
              }}
              onShariahSubFilterChange={(sub) => {
                setFilter('Shariah');
                setShariahSubFilter(sub);
              }}
              onLoanSubFilterChange={(sub) => {
                setFilter('Loan');
                setLoanSubFilter(sub);
              }}
              onPensionSubFilterChange={(sub) => {
                setFilter('Pension');
                setPensionSubFilter(sub);
              }}
            />
          ) : filter === 'FAQ' && search === '' ? (
            <FAQPage
              activeCategory={faqCategory}
              onCategoryChange={setFaqCategory}
              onFilterChange={(f) => setFilter(f)}
              onOpenCalc={() => setIsCalcOpen(true)}
              onOpenAI={() => setIsAIOpen(true)}
              onBackToHome={() => {
                setFilter('Home');
                if (mainScrollRef.current) mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <>
              {/* Section Header */}
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-extrabold uppercase tracking-widest border border-emerald-100 mb-3 w-fit">
                    Live BD Financial Registry • November 2026 Edition
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight text-slate-950 mb-3 flex items-center gap-3 flex-wrap">
                    {filter === 'Shariah' ? (
                      <>
                        <span>Shariah Savings & Islamic Banking</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                          <Moon size={14} className="text-emerald-700" />
                          100% Riba-Free
                        </span>
                      </>
                    ) : filter === 'RegularSavings' ? (
                      <>
                        <span>Regular Savings & Conventional Banking</span>
                        <span className="text-xs bg-blue-100 text-blue-800 border border-blue-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                          <Wallet size={14} className="text-blue-700" />
                          126 Verified Plans
                        </span>
                      </>
                    ) : filter === 'Loan' ? (
                      <>
                        <span>Bank Loans & Credit Facilities</span>
                        <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                          <BadgeDollarSign size={14} className="text-amber-700" />
                          {loanCounts.all} Verified Facilities
                        </span>
                      </>
                    ) : filter === 'Pension' ? (
                      <>
                        <span>Pension & Retirement Schemes</span>
                        <span className="text-xs bg-purple-100 text-purple-800 border border-purple-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                          <Users size={14} className="text-purple-700" />
                          Universal NPS & Bank DPS
                        </span>
                      </>
                    ) : filter === 'All' ? 'Marketplace' : `${filter} Opportunities`}
                  </h2>
                  <p className="text-slate-500 text-sm max-w-xl font-medium leading-relaxed">
                    {filter === 'Shariah'
                      ? 'Certified Shariah-compliant Mudaraba, Wakalah, and Sukuk savings instruments across top Islamic banks and asset managers in Bangladesh. Zero interest (Riba-free) with transparent profit-sharing ratios.'
                      : filter === 'RegularSavings'
                      ? 'Comprehensive conventional banking savings portfolio across commercial and national institutions. Compare basic savings accounts, high-yield fixed deposits, monthly DPS, special wealth schemes, and government savings certificates.'
                      : filter === 'Loan'
                      ? 'Compare personal loans, auto financing, home mortgages, SME business credit, agricultural loans (Krishi Rin), corporate lines, and professional credit across scheduled banks in Bangladesh.'
                      : filter === 'Pension'
                      ? 'Official National Universal Pension Schemes (Pragati, Surokkha, Samata, Probash, Prottoy) by the National Pension Authority alongside top bank pension DPS schemes providing guaranteed monthly income post age 60.'
                      : 'Aggregating real-time rates from 50+ central and commercial banks. Compare packages based on yield, risk, and verified tenure.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterButton 
                    active={filter === 'All'} 
                    label="All" 
                    onClick={() => setFilter('All')} 
                  />
                  <FilterButton 
                    active={filter === 'RegularSavings' || filter === 'Savings' || filter === 'FDR' || filter === 'DPS' || filter === 'Exclusive' || filter === 'Sanchaypatra'} 
                    label="Regular Savings" 
                    icon={Wallet}
                    onClick={() => {
                      setFilter('RegularSavings');
                      setRegularSubFilter('All');
                    }} 
                  />
                  <FilterButton 
                    active={filter === 'Shariah'} 
                    label="Shariah Savings" 
                    icon={Moon}
                    badge="Halal"
                    onClick={() => {
                      setFilter('Shariah');
                      setShariahSubFilter('All');
                    }} 
                  />
                  <FilterButton 
                    active={filter === 'Loan'} 
                    label="Bank Loans" 
                    icon={BadgeDollarSign}
                    onClick={() => {
                      setFilter('Loan');
                      setLoanSubFilter('All');
                    }} 
                  />
                  <FilterButton 
                    active={filter === 'Pension'} 
                    label="Pension" 
                    icon={Users}
                    onClick={() => {
                      setFilter('Pension');
                      setPensionSubFilter('All');
                    }} 
                  />
                  <FilterButton 
                    active={filter === 'Mutual Fund'} 
                    label="Funds" 
                    onClick={() => setFilter('Mutual Fund')} 
                  />
                  <FilterButton 
                    active={filter === 'Insurance'} 
                    label="Insurance" 
                    onClick={() => setFilter('Insurance')} 
                  />
                </div>
              </div>

              {/* Dynamic Category Pointers Guide Banner */}
              <CategoryPointersBanner filter={filter} />

              {((filter === 'All' || filter === 'Home') && search === '') ? (
                <div className="space-y-20">
              {/* Shariah Savings Spotlight */}
              <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden border border-emerald-800/40 shadow-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
                        <Moon size={26} className="text-slate-950 fill-slate-950" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">Shariah Savings & Investments</h3>
                          <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">100% Riba-Free</span>
                        </div>
                        <p className="text-slate-300 text-xs font-medium mt-1">CSBIB Certified Mudaraba Savings, Islamic DPS, MTDR & Shariah Mutual Funds</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 mr-1">Sub Menus:</span>
                        {[
                          { id: 'Savings', label: 'Islamic Savings', count: shariahCounts.savings },
                          { id: 'DPS', label: 'Islamic DPS', count: shariahCounts.dps },
                          { id: 'FDR', label: 'Islamic MTDR', count: shariahCounts.fdr },
                          { id: 'Mutual Fund', label: 'Mutual Funds', count: shariahCounts.funds },
                          { id: 'Other', label: 'Sukuk & Takaful', count: shariahCounts.other },
                        ].map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setFilter('Shariah');
                              setShariahSubFilter(sub.id as any);
                            }}
                            className="px-2.5 py-1 bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-200 rounded-lg text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-1 active:scale-95"
                          >
                            <span>{sub.label}</span>
                            <span className="text-[9px] opacity-80 font-mono">({sub.count})</span>
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          setFilter('Shariah');
                          setShariahSubFilter('All');
                        }}
                        className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-white transition-colors uppercase tracking-widest px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl w-fit border border-white/10 shrink-0"
                      >
                        All 44 Plans <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <HorizontalSlider gridClassName="md:grid-cols-2 lg:grid-cols-3">
                    {financialProducts.filter(p => p.isShariahCompliant).slice(0, 3).map(product => (
                      <div key={product.id} className="flex-shrink-0 w-[85vw] sm:w-[380px] md:w-auto select-none">
                        <ProductCard 
                          product={product} 
                          onCompare={handleCompare}
                          isComparing={compareItems.some(i => i.id === product.id)}
                          onBankClick={handleBankClick}
                          onViewDetails={handleViewDetails}
                        />
                      </div>
                    ))}
                  </HorizontalSlider>
                </div>
              </section>

              {/* Featured Sections */}
              <FeaturedSection 
                title="Attractive Exclusive Schemes" 
                type="Exclusive" 
                accentColor="indigo" 
                onCompare={handleCompare}
                compareItems={compareItems}
                onSeeAll={() => setFilter('Exclusive')}
                onBankClick={handleBankClick}
                onViewDetails={handleViewDetails}
              />

              <FeaturedSection 
                title="Best FDR Rates (November 2026)" 
                type="FDR" 
                accentColor="blue" 
                onCompare={handleCompare}
                compareItems={compareItems}
                onSeeAll={() => setFilter('FDR')}
                onBankClick={handleBankClick}
                onViewDetails={handleViewDetails}
              />

              <FeaturedSection 
                title="Top Performing DPS" 
                type="DPS" 
                accentColor="violet" 
                onCompare={handleCompare}
                compareItems={compareItems}
                onSeeAll={() => setFilter('DPS')}
                onBankClick={handleBankClick}
                onViewDetails={handleViewDetails}
              />

              <FeaturedSection 
                title="Leading Mutual Funds" 
                type="Mutual Fund" 
                accentColor="rose" 
                onCompare={handleCompare}
                compareItems={compareItems}
                onSeeAll={() => setFilter('Mutual Fund')}
                onBankClick={handleBankClick}
                onViewDetails={handleViewDetails}
              />

              <FeaturedSection 
                title="High-Yield Savings" 
                type="Savings" 
                accentColor="emerald" 
                onCompare={handleCompare}
                compareItems={compareItems}
                onSeeAll={() => setFilter('Savings')}
                onBankClick={handleBankClick}
                onViewDetails={handleViewDetails}
              />

              <FeaturedSection 
                title="Healthcare & Insurance" 
                type="Insurance" 
                accentColor="blue" 
                onCompare={handleCompare}
                compareItems={compareItems}
                onSeeAll={() => setFilter('Insurance')}
                onBankClick={handleBankClick}
                onViewDetails={handleViewDetails}
              />

              {/* Sanchaypatra Spotlight */}
              <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold tracking-tight">Best Sanchaypatra Packages</h3>
                      <p className="text-slate-400 text-sm font-medium">Government Guaranteed Principal & Returns</p>
                    </div>
                  </div>

                  <HorizontalSlider gridClassName="md:grid-cols-2 lg:grid-cols-4">
                    {financialProducts.filter(p => p.type === 'Sanchaypatra').map(pkg => (
                      <div key={pkg.id} className="flex-shrink-0 w-[85vw] sm:w-[300px] md:w-auto bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors select-none">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-emerald-400 font-mono text-xl font-bold">{pkg.interestRate}%</span>
                          <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Govt</span>
                        </div>
                        <p className="font-bold text-sm mb-2">{pkg.productName}</p>
                        <ul className="space-y-2 mb-6">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="text-[10px] text-slate-400 flex items-start gap-2">
                              <div className="w-1 h-1 bg-amber-500 rounded-full mt-1" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => handleCompare(pkg)}
                          className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all"
                        >
                          Add to Compare
                        </button>
                      </div>
                    ))}
                  </HorizontalSlider>
                </div>
              </section>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing:</span>
                  <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">
                    {filter === 'Shariah' ? 'Shariah Savings' : filter === 'RegularSavings' ? 'Regular Savings' : filter === 'Loan' ? 'Bank Loans' : filter === 'Pension' ? 'Pension Schemes' : filter}
                  </span>
                  <span className="text-slate-300 mx-1">|</span>
                  <span className="text-xs text-slate-500 font-medium">{filteredProducts.length} Results</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Sort By:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 text-xs font-bold py-2 px-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {filter === 'Loan' ? (
                      <>
                        <option value="rate-asc">Lowest Interest Rate (Best for Borrowers)</option>
                        <option value="rate-desc">Highest Loan Limit / Rate</option>
                        <option value="safety">Safety / Bank Rating</option>
                        <option value="name">Bank Name (A-Z)</option>
                      </>
                    ) : filter === 'Pension' ? (
                      <>
                        <option value="rate-desc">Highest Projected Return</option>
                        <option value="rate-asc">Lowest Starting Installment</option>
                        <option value="safety">Sovereign / Safety Rating</option>
                        <option value="name">Scheme Name (A-Z)</option>
                      </>
                    ) : filter === 'Insurance' ? (
                      <>
                        <option value="rate-desc">Highest Coverage / Bonus</option>
                        <option value="rate-asc">Lowest Starting Premium</option>
                        <option value="safety">Safety Rating</option>
                        <option value="name">Alphabetical (A-Z)</option>
                      </>
                    ) : filter === 'Mutual Fund' ? (
                      <>
                        <option value="rate-desc">Highest Dividend Yield</option>
                        <option value="rate-asc">Lowest Entry Ticket</option>
                        <option value="safety">Safety Rating</option>
                        <option value="name">Alphabetical (A-Z)</option>
                      </>
                    ) : filter === 'Shariah' ? (
                      <>
                        <option value="rate-desc">Highest Expected Profit Rate</option>
                        <option value="rate-asc">Lowest Starting Deposit</option>
                        <option value="safety">Safety Signal</option>
                        <option value="name">Alphabetical (A-Z)</option>
                      </>
                    ) : (
                      <>
                        <option value="rate-desc">High Interest / Return Rate</option>
                        <option value="rate-asc">Low Interest Rate</option>
                        <option value="safety">Safety Rating</option>
                        <option value="name">Alphabetical (A-Z)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Regular Savings Sub-Category Tabs */}
              {(filter === 'RegularSavings' || filter === 'Savings' || filter === 'FDR' || filter === 'DPS' || filter === 'Exclusive' || filter === 'Sanchaypatra') && (
                <div className="mb-8 bg-white p-3.5 md:p-4 rounded-2xl border border-blue-200/80 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <Wallet size={14} className="text-blue-600" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Regular Savings Sub Menus & Segments
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Showing: <strong className="text-blue-700 font-bold">
                        {REGULAR_SUB_ITEMS.find(s => s.id === regularSubFilter)?.label || 'All Regular Savings'}
                      </strong> ({filteredProducts.length} plans)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {REGULAR_SUB_ITEMS.map((subTab) => {
                      const isActive = (filter === 'RegularSavings' && regularSubFilter === subTab.id) || (subTab.id !== 'All' && filter === subTab.id);
                      const Icon = subTab.icon;
                      return (
                        <button
                          key={subTab.id}
                          onClick={() => {
                            setFilter('RegularSavings');
                            setRegularSubFilter(subTab.id);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-2 ring-blue-600/20'
                              : 'bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/90'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-white' : 'text-blue-600'} />
                          <span>{subTab.label}</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {regularCounts[subTab.countKey]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shariah Sub-Category Tabs */}
              {filter === 'Shariah' && (
                <div className="mb-8 bg-white p-3.5 md:p-4 rounded-2xl border border-emerald-200/80 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <Moon size={14} className="fill-emerald-500 text-emerald-600" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                        Shariah Sub Menus & Segments
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Showing: <strong className="text-emerald-700 font-bold">{shariahSubFilter === 'All' ? 'All Shariah Schemes' : shariahSubFilter}</strong> ({filteredProducts.length} plans)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'All', label: 'All Shariah Plans', count: shariahCounts.all, icon: Moon },
                      { id: 'Savings', label: 'Islamic Savings (MSA)', count: shariahCounts.savings, icon: PiggyBank },
                      { id: 'DPS', label: 'Islamic DPS (MDPS)', count: shariahCounts.dps, icon: TrendingUp },
                      { id: 'FDR', label: 'Islamic Term (MTDR)', count: shariahCounts.fdr, icon: ShieldCheck },
                      { id: 'Mutual Fund', label: 'Shariah Mutual Funds', count: shariahCounts.funds, icon: Zap },
                      { id: 'Other', label: 'Sukuk & Takaful', count: shariahCounts.other, icon: Sparkles },
                    ].map((subTab) => {
                      const isActive = shariahSubFilter === subTab.id;
                      const Icon = subTab.icon;
                      return (
                        <button
                          key={subTab.id}
                          onClick={() => setShariahSubFilter(subTab.id as any)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-600/20'
                              : 'bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/90'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-white' : 'text-emerald-600'} />
                          <span>{subTab.label}</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {subTab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Loan Sub-Category Tabs */}
              {filter === 'Loan' && (
                <div className="mb-8 bg-white p-3.5 md:p-4 rounded-2xl border border-amber-200/80 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                        <BadgeDollarSign size={14} className="text-amber-600" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Loan Sub Menus & Facilities
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Showing: <strong className="text-amber-700 font-bold">
                        {LOAN_SUB_ITEMS.find(s => s.id === loanSubFilter)?.label || 'All Bank Loans'}
                      </strong> ({filteredProducts.length} facilities)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {LOAN_SUB_ITEMS.map((subTab) => {
                      const isActive = loanSubFilter === subTab.id;
                      const Icon = subTab.icon;
                      return (
                        <button
                          key={subTab.id}
                          onClick={() => setLoanSubFilter(subTab.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
                            isActive
                              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 ring-2 ring-amber-600/20'
                              : 'bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/90'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-white' : 'text-amber-600'} />
                          <span>{subTab.label}</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {loanCounts[subTab.countKey]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pension Sub-Category Tabs */}
              {filter === 'Pension' && (
                <div className="mb-8 bg-white p-3.5 md:p-4 rounded-2xl border border-purple-200/80 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                        <Users size={14} className="text-purple-600" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Pension Sub Menus & Schemes
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Showing: <strong className="text-purple-700 font-bold">
                        {PENSION_SUB_ITEMS.find(s => s.id === pensionSubFilter)?.label || 'All Pension Schemes'}
                      </strong> ({filteredProducts.length} schemes)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {PENSION_SUB_ITEMS.map((subTab) => {
                      const isActive = pensionSubFilter === subTab.id;
                      const Icon = subTab.icon;
                      return (
                        <button
                          key={subTab.id}
                          onClick={() => setPensionSubFilter(subTab.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
                            isActive
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 ring-2 ring-purple-600/20'
                              : 'bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/90'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-white' : 'text-purple-600'} />
                          <span>{subTab.label}</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-purple-700 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {pensionCounts[subTab.countKey]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Category Stats Bar */}
              <CategoryStatsBar filter={filter} products={filteredProducts} />

              {/* Results Grid */}
              {groupedProducts ? (
                <div className="space-y-16">
                  {Object.entries(groupedProducts).map(([bank, products]: [string, FinancialProduct[]]) => (
                    <div key={bank}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                          {bank.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{bank}</h3>
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{products.length} Funds Available</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {products.map(product => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onCompare={handleCompare}
                            isComparing={compareItems.some(i => i.id === product.id)}
                            onBankClick={handleBankClick}
                            onViewDetails={handleViewDetails}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onCompare={handleCompare}
                        isComparing={compareItems.some(i => i.id === product.id)}
                        onBankClick={handleBankClick}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <Info className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">No results found for "{search}"</p>
              <button 
                onClick={() => {setSearch(''); setFilter('All');}}
                className="mt-4 text-emerald-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </main>

      <ComparisonTray 
        products={compareItems} 
        onRemove={removeFromCompare} 
        onCompare={() => setIsCompareOpen(true)}
        onClear={() => setCompareItems([])}
      />
      <InvestoAI 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
        messages={aiMessages}
        setMessages={setAiMessages}
      />
       <PackageDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        product={detailProduct} 
        onCompare={handleCompare}
        isComparing={detailProduct ? compareItems.some(i => i.id === detailProduct.id) : false}
      />
      <ComparisonModal products={compareItems} isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
      <CalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
      <AboutUsModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <LegalModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} type={legalType} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <BankTankLogo className="w-8 h-8" textSize="text-xl" />
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
              Empowering Bangladeshis with transparent financial data. Our mission is to bridge the literacy gap and help you secure a resilient financial future.
            </p>
            <div className="flex gap-4">
              <a href="mailto:nasimulhasan86@gmail.com" className="text-xs font-bold text-slate-900 border-b border-slate-900 pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all">Contact Founder</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-6">Platform</h4>
            <ul className="text-sm text-slate-600 space-y-3 font-medium">
              <li><button onClick={() => setIsAboutOpen(true)} className="hover:text-emerald-600 transition-colors">Our Story</button></li>
              <li><button onClick={() => setIsCalcOpen(true)} className="hover:text-emerald-600 transition-colors">Yield Calculator</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-6">Legal</h4>
            <ul className="text-sm text-slate-600 space-y-3 font-medium">
              <li><button onClick={() => { setLegalType('TOS'); setIsTermsOpen(true); }} className="hover:text-emerald-600 transition-colors">Terms of Service</button></li>
              <li><button onClick={() => { setLegalType('Privacy'); setIsTermsOpen(true); }} className="hover:text-emerald-600 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => { setLegalType('Disclaimer'); setIsTermsOpen(true); }} className="hover:text-emerald-600 transition-colors">Data Disclaimer</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">© 2026 BANKTANK BANGLADESH • AN INDEPENDENT INITIATIVE.</p>
          <div className="flex gap-8">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Built for the Greater Good</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
);
}

const AboutUsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md overflow-y-auto"
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl relative my-8"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>

          <div className="space-y-8">
            <header>
              <BankTankLogo className="w-12 h-12" textSize="text-4xl" />
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 mt-6">Our Story</h2>
              <p className="text-[#4CAF50] font-bold uppercase tracking-[0.2em] text-[10px] mt-2">The Mission Behind BankTank</p>
            </header>

            <div className="prose prose-slate max-w-none space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                BANKTANK isn't a multinational corporation or a funded startup. It's a passion project born out of a simple observation in the heart of Dhaka.
              </p>
              
              <p className="text-slate-600 leading-relaxed">
                As a media professional and storyteller, I've spent years documenting the lives of people across Bangladesh. Along the way, I realized a recurring tragedy: many hardworking individuals were missing out on secure wealth-building opportunities—not because of a lack of money, but because of a <span className="font-bold text-slate-950">critical gap in financial literacy</span>.
              </p>

              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 italic text-slate-700">
                "We built this for the greater good. To ensure that whether you're a young professional in Chittagong or a retiree in Sylhet, you have the same clarity on your financial options as a private wealth manager."
              </div>

              <p className="text-slate-600 leading-relaxed">
                This app is a social advocacy tool. It's built to empower the youth, the families, and the dreamers who want to take control of their long-term wealth but find the maze of government savings schemes, DPS, and mutual funds overwhelming.
              </p>

              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-slate-950 mb-2">Let's Connect</h4>
                  <p className="text-sm text-slate-500 mb-4">We are always looking for feedback, collaborations, or simply a good conversation about the future of finance in Bangladesh.</p>
                  <a href="mailto:nasimulhasan86@gmail.com" className="inline-flex items-center gap-2 bg-slate-950 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95">
                    nasimulhasan86@gmail.com
                  </a>
                </div>
                <button 
                  onClick={onClose}
                  className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all group px-4 py-2"
                >
                  <Home size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[10px] uppercase tracking-widest">Back to Home</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const LegalModal = ({ isOpen, onClose, type }: { isOpen: boolean; onClose: () => void; type: 'TOS' | 'Privacy' | 'Disclaimer' }) => {
  if (!isOpen) return null;

  const content = {
    TOS: {
      title: 'Terms of Service',
      sections: [
        {
          title: '1. Informational Purpose Only',
          text: 'BANKTANK is an information-based financial and investment aggregator. All data, projections, and AI-generated advice are provided for educational and informational purposes only. BANKTANK is not a registered financial advisor, broker, or tax specialist under the Bangladesh Securities and Exchange Commission (BSEC) or Bangladesh Bank.'
        },
        {
          title: '2. No Liability',
          text: 'The application and its independent creator are not liable for any financial losses, investment failures, or market fluctuations. Users assume full responsibility for their financial decisions. We provide the tools to compare, but the decision to invest remains solely with the user.'
        },
        {
          title: '3. Accuracy of Data',
          text: 'While we strive for 100% accuracy, interest rates (especially for Sanchaypatra and Bank FDRs) and tax rules (AIT) in Bangladesh are subject to change by the government at any time. Users must verify final terms with the respective institutions before committing any capital.'
        },
        {
          title: '4. User Conduct & IP',
          text: 'The code, structure, and unique design of BANKTANK are protected. Users are prohibited from attempting to scrape, reverse engineer, or commercially exploit the platform\'s data without explicit written consent.'
        }
      ]
    },
    Privacy: {
      title: 'Privacy Policy',
      sections: [
        {
          title: '1. Data Collection',
          text: 'We do not collect personal identifiers like NID, bank account numbers, or passwords. Any information provided to "AI Market Advisor" is processed anonymously for the purpose of answering your financial queries.'
        },
        {
          title: '2. Cookies & Analytics',
          text: 'We use minimal cookies to remember your comparison tray and preferences. Performance analytics are used to improve the user experience across Bangladesh.'
        },
        {
          title: '3. Third-Party Links',
          text: 'Our platform contains links to official bank websites. We are not responsible for the privacy practices or content of these external sites.'
        }
      ]
    },
    Disclaimer: {
      title: 'Data Disclaimer',
      sections: [
        {
          title: '1. Source of Information',
          text: 'Data is aggregated from public institutional websites, gazettes, and official press releases from Bangladesh Bank. While we perform daily "Market Pulses", synchronization delays may occur.'
        },
        {
          title: '2. Calculator Projections',
          text: 'Calculations for maturity values are estimates based on standard compound/simple interest formulas used in Bangladesh. They do not account for future regulatory changes, unexpected tax hikes, or bank-specific processing fees.'
        },
        {
          title: '3. Not Financial Advice',
          text: 'Nothing on BANKTANK constitutes a recommendation to buy or sell any financial product. Always consult with a certified professional for personalized financial planning.'
        }
      ]
    }
  };

  const current = content[type];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md overflow-y-auto"
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2.5rem] w-full max-w-3xl p-10 shadow-2xl relative my-8"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>

          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">{current.title}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Last Updated: November 2026</p>
            </header>

            <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-6">
              {current.sections.map((section, idx) => (
                <section key={idx} className={idx === current.sections.length - 1 && type === 'TOS' ? 'bg-slate-50 p-6 rounded-2xl border border-slate-100' : ''}>
                  <h4 className="font-bold text-slate-950 text-base mb-2">{section.title}</h4>
                  <p dangerouslySetInnerHTML={{ __html: section.text.replace(/BANKTANK/g, '<span class="font-bold text-slate-950">BANKTANK</span>') }} />
                </section>
              ))}
              
              {type === 'TOS' && (
                <p className="text-[10px] text-slate-400 italic">Governed by the laws of the People's Republic of Bangladesh.</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
               <button 
                 onClick={onClose}
                 className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group"
               >
                 <Home size={18} className="group-hover:scale-110 transition-transform" />
                 <span className="font-bold text-[10px] uppercase tracking-widest">Back to Home</span>
               </button>
               <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all w-full sm:w-auto">I Understand</button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

