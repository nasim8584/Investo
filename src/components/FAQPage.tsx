import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ArrowLeft, 
  Sparkles, 
  X, 
  Calculator, 
  Bot, 
  ArrowUpRight,
  BadgeDollarSign, 
  Wallet, 
  Moon, 
  Users, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  Landmark,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS_DATA, FAQ_CATEGORIES, FAQCategory, FAQItem } from '../data/faqs';
import { HoverFullText } from './HoverFullText';

interface FAQPageProps {
  activeCategory: 'all' | FAQCategory;
  onCategoryChange: (cat: 'all' | FAQCategory) => void;
  onFilterChange: (f: any) => void;
  onOpenCalc: () => void;
  onOpenAI: () => void;
  onBackToHome: () => void;
}

export const FAQPage = ({
  activeCategory,
  onCategoryChange,
  onFilterChange,
  onOpenCalc,
  onOpenAI,
  onBackToHome
}: FAQPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-loan-1');

  // Find active category info
  const categoryInfo = useMemo(() => {
    return FAQ_CATEGORIES.find(c => c.id === activeCategory) || FAQ_CATEGORIES[0];
  }, [activeCategory]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesSearch = 
        faq.question.toLowerCase().includes(q) ||
        faq.briefAnswer.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.categoryLabel.toLowerCase().includes(q) ||
        faq.bullets.some(b => b.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getCategoryIcon = (catId: 'all' | FAQCategory) => {
    switch (catId) {
      case 'loans': return BadgeDollarSign;
      case 'savings': return Wallet;
      case 'shariah': return Moon;
      case 'pension': return Users;
      case 'mutual-funds': return Zap;
      case 'insurance': return ShieldCheck;
      default: return HelpCircle;
    }
  };

  const getCategoryBadgeClass = (cat: FAQCategory) => {
    switch (cat) {
      case 'savings': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'loans': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'shariah': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'pension': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'mutual-funds': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'insurance': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const quickPillTags = [
    'Repo Rate 10%',
    'CIB Criteria',
    'FDR vs DPS',
    'Mudaraba PSR',
    'Universal Pension NPS',
    'SIP Mutual Funds',
    'Takaful Insurance',
    'Section 44 Tax Rebate'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Back Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button 
            type="button" 
            onClick={onBackToHome}
            className="hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`cursor-pointer transition-colors ${activeCategory === 'all' ? 'text-slate-950 font-bold' : 'hover:text-slate-900'}`}
          >
            FAQ Knowledge Base
          </button>
          {activeCategory !== 'all' && (
            <>
              <span>/</span>
              <HoverFullText as="span" fullText={categoryInfo.shortLabel} className="inline-flex min-w-0">
                <span className="text-slate-950 font-extrabold truncate max-w-[200px]">
                  {categoryInfo.shortLabel}
                </span>
              </HoverFullText>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 w-fit cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Homepage</span>
        </button>
      </div>

      {/* Main Sub-Page Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-[#0A2A4D] to-slate-900 rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Landmark size={12} className="text-emerald-400" />
                  {categoryInfo.badge}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {filteredFaqs.length} Questions Available
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                {categoryInfo.label}
              </h1>
              <p className="text-slate-300 text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
                {categoryInfo.description}
              </p>
            </div>

            {/* If subcategory has an associated marketplace filter */}
            {activeCategory !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  if (activeCategory === 'loans') onFilterChange('Loan');
                  else if (activeCategory === 'savings') onFilterChange('RegularSavings');
                  else if (activeCategory === 'shariah') onFilterChange('Shariah');
                  else if (activeCategory === 'pension') onFilterChange('Pension');
                  else if (activeCategory === 'mutual-funds') onFilterChange('Mutual Fund');
                  else if (activeCategory === 'insurance') onFilterChange('Insurance');
                }}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 shadow-lg cursor-pointer self-start md:self-auto"
              >
                <span>Browse {categoryInfo.shortLabel} Marketplace</span>
                <ArrowUpRight size={15} />
              </button>
            )}
          </div>

          {/* Regulatory Quick-Facts Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
            {categoryInfo.quickFacts.map((fact, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                  {fact.label}
                </span>
                <span className="text-xl font-black text-white tracking-tight my-1">
                  {fact.value}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {fact.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subpage Category Tabs Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider px-1">
          <span>Explore Financial Domains &amp; Sub-Pages:</span>
          <span>7 Categories</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {FAQ_CATEGORIES.map(tab => {
            const Icon = getCategoryIcon(tab.id);
            const count = tab.id === 'all' 
              ? FAQS_DATA.length 
              : FAQS_DATA.filter(f => f.category === tab.id).length;
            const isActive = activeCategory === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onCategoryChange(tab.id);
                  setSearchQuery('');
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                <span>{tab.shortLabel}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input & Quick Tags */}
      <div className="space-y-3 bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${categoryInfo.shortLabel} questions (e.g. CIB, EMI, repo rate, Mudaraba, NPS, SIP, Takaful)...`}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs md:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Quick Tag Suggestions */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">
            Common Topics:
          </span>
          {quickPillTags.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSearchQuery(tag.split(' ')[0])}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500">
          <span>Showing {filteredFaqs.length} of {FAQS_DATA.length} Questions</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-emerald-600 hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
            <HelpCircle size={36} className="mx-auto text-slate-300" />
            <h4 className="text-base font-extrabold text-slate-900">No questions found matching your search</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo; in {categoryInfo.shortLabel}. Try searching for broader terms or switch category tabs.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onCategoryChange('all');
              }}
              className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className={`bg-white border rounded-2xl transition-all overflow-hidden ${
                  isOpen 
                    ? 'border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/10' 
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-start md:items-center gap-3 min-w-0">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 border mt-0.5 md:mt-0 ${getCategoryBadgeClass(faq.category)}`}>
                      {faq.categoryLabel}
                    </span>
                    <span className="text-sm md:text-base font-extrabold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                {/* Brief preview snippet when closed */}
                {!isOpen && (
                  <div className="px-5 pb-4 -mt-1">
                    <HoverFullText fullText={faq.briefAnswer}>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        <span className="font-semibold text-slate-600">Summary: </span>
                        {faq.briefAnswer}
                      </p>
                    </HoverFullText>
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 pt-2 text-xs md:text-sm text-slate-600 space-y-4 border-t border-slate-100">
                        {/* Summary highlight */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-800 font-medium leading-relaxed">
                          {faq.answer}
                        </div>

                        {/* Bullets */}
                        <ul className="space-y-2.5 pl-1">
                          {faq.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 leading-relaxed text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Pro-Tip Callout */}
                        {faq.tip && (
                          <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/80 rounded-xl text-emerald-950 text-xs font-semibold leading-relaxed flex items-center gap-2.5">
                            <Sparkles size={16} className="text-emerald-600 shrink-0" />
                            <span>{faq.tip}</span>
                          </div>
                        )}

                        {/* Direct action link to marketplace */}
                        {faq.filterTarget && (
                          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                            <span className="text-[11px] text-slate-500 font-medium">
                              Ready to compare interest rates and calculate exact payouts?
                            </span>
                            <button
                              type="button"
                              onClick={() => onFilterChange(faq.filterTarget)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer w-fit"
                            >
                              <span>Explore {faq.categoryLabel} in Marketplace</span>
                              <ArrowUpRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Assistance Callout */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-[#0A2A4D] to-slate-900 text-white rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <BookOpen size={14} />
            <span>Need Personal Advisory?</span>
          </div>
          <h4 className="text-lg md:text-xl font-black">
            Have questions about loan eligibility, tax brackets, or pension annuities?
          </h4>
          <p className="text-xs text-slate-300 font-medium max-w-xl">
            Use our interactive financial calculators or consult our AI financial advisor to simulate exact post-tax returns.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenCalc}
            className="px-5 py-3 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Calculator size={15} className="text-blue-600" />
            <span>Returns Calculator</span>
          </button>
          <button
            type="button"
            onClick={onOpenAI}
            className="px-5 py-3 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Bot size={15} />
            <span>Ask AI Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
