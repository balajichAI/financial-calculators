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
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<CalculatorType>('SIP_LUMPSUM');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const navTabs = [
    {
      id: 'SIP_LUMPSUM' as CalculatorType,
      label: 'SIP & Lumpsum',
      icon: TrendingUp,
      description: 'Wealth multiplier & mutual fund returns',
    },
    {
      id: 'PERSONAL_LOAN' as CalculatorType,
      label: 'Personal Loan EMI',
      icon: User,
      description: 'Unsecured debt & installment calculation',
    },
    {
      id: 'HOME_LOAN' as CalculatorType,
      label: 'Home Loan EMI',
      icon: Home,
      description: 'Property mortgage & long-term schedule',
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
            Financial Calculator Suite
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1.5 max-w-2xl font-sans leading-relaxed">
            Plan your mutual fund investments, systematic deposits, or home and personal loan debt schedules with instant, precise visualizations and monthly breakdowns.
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

        {/* Quick Help & FAQ Widget Area */}
        <section className="mt-12 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm shadow-slate-50" id="faq-help-section">
          <h3 className="text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-groww-green" />
            Understanding the Calculations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 font-sans leading-relaxed">
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/50">
              <span className="font-bold text-slate-800">1. Systematic Investment (SIP)</span>
              <p className="text-slate-500">
                A SIP utilizes rupee-cost averaging. By investing a fixed amount regularly, you buy more mutual fund units when prices are low and fewer when they are high, lowering your average cost.
              </p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/50">
              <span className="font-bold text-slate-800">2. Lumpsum Compounding</span>
              <p className="text-slate-500">
                Unlike SIP, Lumpsum invests the entire principal at Day 1. It benefits maximally from compound interest because the whole sum accumulates returns over the entire timeline.
              </p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/50">
              <span className="font-bold text-slate-800">3. Equated Monthly Installment (EMI)</span>
              <p className="text-slate-500">
                In the early years of your loan tenure, a significant portion of your EMI goes towards paying the interest. Over time, the balance shifts and the EMI increasingly reduces the principal amount.
              </p>
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
