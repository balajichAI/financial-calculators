import React, { useState } from 'react';
import { CalculatorType } from './types';
import SipLumpsumView from './components/SipLumpsumView';
import LoanCalculatorView from './components/LoanCalculatorView';
import WealthCalcCopilot from './components/WealthCalcCopilot';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  User, 
  Home, 
  Calculator, 
  Coins, 
  ArrowUpRight, 
  HelpCircle,
  FileSpreadsheet,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<CalculatorType>('SIP_LUMPSUM');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // Default open first item for SEO bots

  const faqData = [
    {
      question: "What is a Systematic Investment Plan (SIP) and how does a SIP Calculator work?",
      answer: "A Systematic Investment Plan (SIP) is a mutual fund investment method where you invest a fixed amount of money at regular intervals (such as weekly, monthly, or quarterly) rather than a lump sum. This instills financial discipline and utilizes rupee-cost averaging. Our free, interactive SIP Calculator helps you compute the future value of your monthly investments over your target timeline, demonstrating the compounding effect on mutual fund returns.",
      keywords: "SIP Calculator, systematic investment plan, mutual fund returns, wealth builder"
    },
    {
      question: "How do I calculate SIP mutual fund returns? What is the formula?",
      answer: "The future value of your systematic investment plan is calculated using the Future Value of Annuity formula: FV = P × [((1 + i)^n - 1) / i] × (1 + i), where 'FV' is the estimated future wealth, 'P' is the monthly investment amount, 'i' is the periodic rate of return (annual return rate divided by 12, then divided by 100), and 'n' is the total number of payments (tenure in years × 12). WealthCalc's SIP Calculator automates this complex compound interest calculation instantly.",
      keywords: "SIP return calculation, SIP formula, future value of annuity, compound interest"
    },
    {
      question: "What is a Lumpsum investment and how is it different from a SIP?",
      answer: "A Lumpsum investment is a single, one-time deposit of principal into mutual funds, equity markets, or fixed deposits, whereas a SIP spreads the investment over multiple periodic deposits. In a lumpsum investment, your entire principal amount compounds from Day 1, which can yield higher absolute wealth in a sustained bull market. The compounding formula used is: A = P × (1 + r/100)^t, where 'A' is the maturity amount, 'P' is the principal, 'r' is the estimated rate of return, and 't' is the duration in years.",
      keywords: "lumpsum return calculator, lumpsum mutual fund, lumpsum compounding formula"
    },
    {
      question: "How does a Home Loan EMI Calculator work?",
      answer: "A Home Loan EMI Calculator computes the equated monthly installment (EMI) needed to repay your property mortgage over a long tenure. It uses the standard amortization formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1], where 'P' is the principal home loan amount, 'r' is the monthly interest rate (annual interest rate / 12 / 100), and 'n' is the tenure in months. WealthCalc provides a fully detailed, month-on-month amortization schedule so you can trace your outstanding balance, interest payable, and principal repayment splits.",
      keywords: "home loan emi calculator, home mortgage calculator, loan amortization schedule"
    },
    {
      question: "How is a Personal Loan EMI computed?",
      answer: "A Personal Loan EMI uses the same reducing-balance amortizing loan formula as a home loan mortgage, but typically features shorter tenures (ranging from 12 to 60 months) and higher interest rates due to being unsecured. Our Personal Loan EMI Calculator lets you model different interest rates and durations to find an installment that perfectly aligns with your monthly disposable income.",
      keywords: "personal loan emi calculator, unsecured bank loan calculator, monthly installments"
    },
    {
      question: "What is a Loan Amortization Schedule and why should I track it?",
      answer: "An amortization schedule is an exhaustive periodic ledger of your loan repayments. In the initial years of a long-term loan (like a home loan), a substantial portion of your EMI goes towards paying the outstanding interest, while only a small slice reduces the actual principal. Tracking this helps you evaluate prepayment strategies (paying off lump sums to reduce the loan principal directly), reducing your total interest burden and tenure.",
      keywords: "amortization schedule table, loan prepayment, loan outstanding balance, interest payable"
    }
  ];

  const navTabs = [
    {
      id: 'SIP_LUMPSUM' as CalculatorType,
      label: 'SIP & Lumpsum Calculator',
      icon: TrendingUp,
      description: 'SIP and Lumpsum mutual fund return calculator',
    },
    {
      id: 'PERSONAL_LOAN' as CalculatorType,
      label: 'Personal Loan EMI Calculator',
      icon: User,
      description: 'Unsecured personal loan installment calculator',
    },
    {
      id: 'HOME_LOAN' as CalculatorType,
      label: 'Home Loan EMI Calculator',
      icon: Home,
      description: 'Home mortgage property loan scheduler',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-800" id="app-root">
      
      {/* Groww-inspired Top Navigation Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Group */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-200">
                <Calculator className="w-5.5 h-5.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-display font-extrabold tracking-tight text-slate-950 flex items-center gap-1.5">
                  WealthCalc <span className="text-groww-green font-normal text-sm font-sans px-1.5 py-0.5 bg-emerald-50 rounded-md">calculators</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">HIGH-FIDELITY SIMULATIONS</span>
              </div>
            </div>

            {/* Support and Quick Action Badges */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsCopilotOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 hover:scale-[1.02] active:scale-[0.98] transition-all border border-emerald-100/50 cursor-pointer shadow-sm shadow-emerald-100/20"
                id="header-copilot-trigger"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse animate-duration-1000" />
                <span>Ask AI Copilot</span>
              </button>
              <span className="hidden sm:inline text-xs font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">v4.2 Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full" id="app-main-content">
        
        {/* Page Title & Slogan */}
        <div className="mb-8 text-center sm:text-left select-none" id="dashboard-hero-header">
          <h1 className="text-2xl md:text-3.5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            SIP, Lumpsum & Loan EMI Calculator Suite
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1.5 max-w-2xl font-sans leading-relaxed">
            Free high-precision <strong className="font-semibold text-slate-800">SIP Calculator</strong>, <strong className="font-semibold text-slate-800">Lumpsum Compound Interest Calculator</strong>, <strong className="font-semibold text-slate-800">Home Loan EMI Calculator</strong>, and <strong className="font-semibold text-slate-800">Personal Loan Calculator</strong>. Plan investments and amortizations with instant interactive charts.
          </p>
        </div>

        {/* Dynamic Calculator Navigation Pills */}
        <div className="bg-white border border-slate-100 p-2 rounded-2xl shadow-sm mb-8" id="navigation-tabs-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {navTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id.toLowerCase()}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-start gap-3.5 p-3.5 rounded-xl transition-all duration-300 text-left outline-none cursor-pointer select-none ${
                    isActive 
                      ? 'bg-emerald-50/60 border border-emerald-100/50 shadow-xs' 
                      : 'hover:bg-slate-50/60 border border-transparent'
                  }`}
                >
                  {/* Visual Indicator Pill for Active Tab */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-emerald-50/50 rounded-xl border border-emerald-100/70 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Icon Frame */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive 
                      ? 'bg-groww-green text-white shadow-sm shadow-emerald-200' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Text Description */}
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs md:text-sm font-sans font-bold leading-tight transition-colors ${
                      isActive ? 'text-slate-950' : 'text-slate-700'
                    }`}>
                      {tab.label}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 truncate leading-none">
                      {tab.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic View Swapper */}
        <div className="relative" id="active-calculator-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'SIP_LUMPSUM' && <SipLumpsumView />}
              {activeTab === 'PERSONAL_LOAN' && <LoanCalculatorView loanType="PERSONAL" />}
              {activeTab === 'HOME_LOAN' && <LoanCalculatorView loanType="HOME" />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic SEO Financial Reference Guide & FAQ Accordion Section */}
        <section className="mt-12 space-y-8" id="faq-help-section">
          
          {/* Section Heading */}
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-5 md:w-6 h-5 md:h-6 text-groww-green shrink-0" />
              Ultimate Guide to SIP, Lumpsum Mutual Funds, and Loan EMIs
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-1 leading-relaxed">
              Explore professional insights, formulas, and FAQs compiled by WealthCalc to help you master systematic compounding, interest calculations, and amortization schedules.
            </p>
          </div>

          {/* Quick Mathematical Formulas Grid for Search Crawlers and Advanced Users */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="formulas-grid">
            
            {/* Box 1: SIP Formula */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-sans font-extrabold text-slate-950">SIP Wealth Calculator Formula</h3>
                </div>
                <p className="text-slate-500 text-[11px] md:text-xs leading-relaxed">
                  Used by mutual fund houses to determine future returns of Systematic Investment Plans (annuity compounding):
                </p>
                <div className="bg-slate-50 rounded-xl p-3 text-center my-3 border border-slate-100/50">
                  <code className="text-xs md:text-sm font-mono font-bold text-slate-800 tracking-wide">
                    FV = P × [((1 + i)ⁿ - 1) / i] × (1 + i)
                  </code>
                </div>
              </div>
              <div className="border-t border-slate-50 pt-3 mt-3 text-[10px] text-slate-400 space-y-1">
                <p><strong>P</strong>: Monthly Systematic Deposit Amount</p>
                <p><strong>i</strong>: Monthly interest rate (r / 12 / 100)</p>
                <p><strong>n</strong>: Total months invested (Years × 12)</p>
              </div>
            </div>

            {/* Box 2: Lumpsum Compound Formula */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="text-sm font-sans font-extrabold text-slate-950">Lumpsum Return Formula</h3>
                </div>
                <p className="text-slate-500 text-[11px] md:text-xs leading-relaxed">
                  Calculates compound interest for one-time capital investments over any standard investment horizon:
                </p>
                <div className="bg-slate-50 rounded-xl p-3 text-center my-3 border border-slate-100/50">
                  <code className="text-xs md:text-sm font-mono font-bold text-slate-800 tracking-wide">
                    A = P × (1 + r / 100)ᵗ
                  </code>
                </div>
              </div>
              <div className="border-t border-slate-50 pt-3 mt-3 text-[10px] text-slate-400 space-y-1">
                <p><strong>A</strong>: Final Maturity/Future Value Amount</p>
                <p><strong>P</strong>: Initial Capital/Lumpsum Principal</p>
                <p><strong>r</strong>: Estimated Annual compounding rate</p>
                <p><strong>t</strong>: Duration of holding in Years</p>
              </div>
            </div>

            {/* Box 3: Amortized EMI Formula */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  <h3 className="text-sm font-sans font-extrabold text-slate-950">Amortized Loan EMI Formula</h3>
                </div>
                <p className="text-slate-500 text-[11px] md:text-xs leading-relaxed">
                  Used globally by commercial banks for Home Loans and Personal Loans using a reducing interest balance:
                </p>
                <div className="bg-slate-50 rounded-xl p-3 text-center my-3 border border-slate-100/50">
                  <code className="text-xs md:text-sm font-mono font-bold text-slate-800 tracking-wide">
                    EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ - 1]
                  </code>
                </div>
              </div>
              <div className="border-t border-slate-50 pt-3 mt-3 text-[10px] text-slate-400 space-y-1">
                <p><strong>P</strong>: Principal Loan Amount borrowed</p>
                <p><strong>r</strong>: Monthly rate (Annual rate / 12 / 100)</p>
                <p><strong>n</strong>: Loan amortization tenure in Months</p>
              </div>
            </div>

          </div>

          {/* Interactive FAQ Accordion */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs" id="interactive-faq-accordion">
            <h3 className="text-base font-sans font-extrabold text-slate-900 mb-5 flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-groww-green" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-3.5" id="faq-list">
              {faqData.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className={`border rounded-xl transition-all duration-300 ${
                      isOpen 
                        ? 'border-emerald-100 bg-emerald-50/10' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left p-4 md:p-5 flex justify-between items-center gap-4 cursor-pointer outline-none select-none"
                    >
                      <span className={`text-xs md:text-sm font-sans font-bold transition-colors ${
                        isOpen ? 'text-emerald-950' : 'text-slate-850'
                      }`}>
                        {faq.question}
                      </span>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-450'
                      }`}>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 md:p-5 pt-0 border-t border-slate-50 text-xs md:text-[13px] text-slate-600 leading-relaxed font-sans space-y-3">
                            <p>{faq.answer}</p>
                            <div className="flex flex-wrap gap-1.5 items-center pt-2">
                              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1">Target Keywords:</span>
                              {faq.keywords.split(', ').map((kw, kwIdx) => (
                                <span 
                                  key={kwIdx} 
                                  className="text-[10px] font-medium font-sans bg-slate-50 text-slate-500 border border-slate-100/80 px-2 py-0.5 rounded-md"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expert Compounding & Loan Planning Advice (High Keyword Density Content Block) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-md shadow-slate-950/10" id="seo-expert-advice">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-4xl space-y-4">
              <span className="text-[10px] font-mono font-extrabold text-groww-green uppercase tracking-widest px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                Wealth-Building Advisory Column
              </span>
              <h3 className="text-base md:text-lg font-display font-extrabold text-white tracking-tight">
                Maximizing Financial Returns: SIP, Lumpsum Mutual Funds, and Debt Elimination
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                Whether you utilize a <strong className="text-white font-semibold">SIP Calculator</strong> to estimate systematic wealth generation, a <strong className="text-white font-semibold">Lumpsum Compound Return Calculator</strong> to measure fixed-income compounding, or a <strong className="text-white font-semibold">Mortgage Loan EMI Calculator</strong> to structure home payments, smart planning is the key to personal liberty. 
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs text-slate-400 font-sans leading-normal">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-groww-green shrink-0 mt-0.5" />
                  <span>
                    <strong>SIP Power of Compounding</strong>: Regular monthly systematic investments harness rupee-cost averaging, absorbing market volatility while compounding gains exponentially over 10, 20, or 30-year tenures.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-groww-green shrink-0 mt-0.5" />
                  <span>
                    <strong>Reducing Loan Interest Outflow</strong>: Making yearly or quarterly loan prepayments towards the home loan principal reduces the total interest burden enormously, shedding years off your repayment timeline.
                  </span>
                </div>
              </div>
            </div>
          </div>

        </section>

      </main>

      {/* Footer Disclaimer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center select-none" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-widest">
            WEALTHCALC FINANCIAL CALCULATORS DECK
          </span>
          <p className="text-[10px] text-slate-400 mt-2 max-w-xl mx-auto font-sans leading-normal">
            Disclaimer: These calculators are built for illustrative and planning purposes only. Mutual fund investments are subject to market risks. Loan approvals and exact interest rates are solely determined by banks and financial institutions.
          </p>
        </div>
      </footer>

      {/* Floating Co-pilot trigger button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.03] active:scale-[0.97] text-white rounded-full transition-all cursor-pointer shadow-lg shadow-emerald-600/30 font-sans font-bold text-xs"
          id="floating-copilot-trigger"
        >
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span>Ask AI Copilot</span>
        </button>
      </div>

      {/* WealthCalc Search Grounded Copilot Drawer */}
      <WealthCalcCopilot isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />

    </div>
  );
}
