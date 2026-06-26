import React, { useState, useMemo, useEffect } from 'react';
import { InvestmentType, TenureUnit } from '../types';
import { calculateSip, calculateLumpsum, formatIndianCurrency } from '../utils/calculatorMath';
import SliderWithInput from './SliderWithInput';
import DonutChart from './DonutChart';
import DetailedMonthlyTable from './DetailedMonthlyTable';
import { Landmark, TrendingUp, Sparkles, HelpCircle } from 'lucide-react';

export default function SipLumpsumView() {
  const [investType, setInvestType] = useState<InvestmentType>('SIP');
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('YEARS');
  
  // State variables
  const [amount, setAmount] = useState<number>(25000); // Default 25k
  const [returnRate, setReturnRate] = useState<number>(12); // Default 12%
  const [tenure, setTenure] = useState<number>(10); // Default 10 Years

  // Adjust amount and tenure bounds when investment type or unit switches
  useEffect(() => {
    if (investType === 'SIP') {
      // SIP Amount bounds: 500 to 10 Lakhs. If current amount is out, clamp it
      if (amount < 500) setAmount(500);
      else if (amount > 1000000) setAmount(1000000);
    } else {
      // Lumpsum Amount bounds: 5,000 to 50 Lakhs.
      if (amount < 5000) setAmount(5000);
      else if (amount > 5000000) setAmount(5000000);
    }
  }, [investType]);

  // Handle Years/Months toggle
  const handleUnitToggle = (unit: TenureUnit) => {
    if (unit === tenureUnit) return;
    
    if (unit === 'MONTHS') {
      // Years to Months
      const nextMonths = Math.min(480, Math.max(1, tenure * 12));
      setTenure(nextMonths);
    } else {
      // Months to Years
      const nextYears = Math.min(40, Math.max(1, Math.round(tenure / 12)));
      setTenure(nextYears);
    }
    setTenureUnit(unit);
  };

  // Perform calculations
  const totalMonths = tenureUnit === 'YEARS' ? tenure * 12 : tenure;

  const results = useMemo(() => {
    if (investType === 'SIP') {
      return calculateSip(amount, returnRate, totalMonths);
    } else {
      return calculateLumpsum(amount, returnRate, totalMonths);
    }
  }, [investType, amount, returnRate, totalMonths]);

  // Donut chart segments
  const chartSegments = [
    {
      name: 'Invested Amount',
      value: results.investedAmount,
      color: '#0f172a', // Dark slate
    },
    {
      name: 'Estimated Returns',
      value: results.estimatedReturns,
      color: '#00D09C', // Groww Green
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="sip-lumpsum-calculator">
      {/* Two Column Layout for Calculator Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Sliders and Toggles */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm shadow-slate-50" id="sip-calculator-inputs">
          <div className="space-y-6">
            
            {/* Investment Type Tab Slider (SIP vs Lumpsum) */}
            <div className="flex flex-col space-y-2">
              <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest">
                Investment Structure
              </span>
              <div className="bg-slate-100 p-1 rounded-xl flex flex-row items-center w-full" id="sip-lumpsum-toggle">
                <button
                  id="tab-sip"
                  onClick={() => setInvestType('SIP')}
                  className={`text-sm font-sans font-bold px-4 py-2.5 rounded-lg transition-all duration-300 flex-1 flex items-center justify-center gap-2 ${
                    investType === 'SIP'
                      ? 'bg-white text-groww-dark shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-groww-green" />
                  Monthly SIP
                </button>
                <button
                  id="tab-lumpsum"
                  onClick={() => setInvestType('LUMPSUM')}
                  className={`text-sm font-sans font-bold px-4 py-2.5 rounded-lg transition-all duration-300 flex-1 flex items-center justify-center gap-2 ${
                    investType === 'LUMPSUM'
                      ? 'bg-white text-groww-dark shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-emerald-500" />
                  Lumpsum Investment
                </button>
              </div>
            </div>

            {/* Input Slider 1: Investment Amount */}
            <SliderWithInput
              idPrefix="sip-amount"
              label={investType === 'SIP' ? 'Monthly Investment' : 'Total Investment'}
              value={amount}
              min={investType === 'SIP' ? 500 : 5000}
              max={investType === 'SIP' ? 1000000 : 5000000}
              step={investType === 'SIP' ? 500 : 5000}
              onChange={setAmount}
              isCurrency={true}
            />

            {/* Input Slider 2: Expected Return Rate */}
            <SliderWithInput
              idPrefix="sip-rate"
              label="Expected Return Rate (p.a.)"
              value={returnRate}
              min={1}
              max={30}
              step={0.5}
              onChange={setReturnRate}
              isPercent={true}
            />

            {/* Input Slider 3: Time Period with Integrated Unit Toggle */}
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row justify-between items-center select-none">
                <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest">
                  Duration Setting
                </span>
                
                {/* Duration Toggle (Years/Months) */}
                <div className="bg-slate-100 p-0.5 rounded-lg flex flex-row items-center" id="sip-duration-toggle">
                  <button
                    id="btn-sip-years"
                    onClick={() => handleUnitToggle('YEARS')}
                    className={`text-[10px] font-sans font-extrabold px-2 py-1 rounded transition-colors ${
                      tenureUnit === 'YEARS'
                        ? 'bg-white text-groww-dark shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Years
                  </button>
                  <button
                    id="btn-sip-months"
                    onClick={() => handleUnitToggle('MONTHS')}
                    className={`text-[10px] font-sans font-extrabold px-2 py-1 rounded transition-colors ${
                      tenureUnit === 'MONTHS'
                        ? 'bg-white text-groww-dark shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Months
                  </button>
                </div>
              </div>

              <SliderWithInput
                idPrefix="sip-tenure"
                label="Time Period"
                value={tenure}
                min={1}
                max={tenureUnit === 'YEARS' ? 40 : 480}
                step={1}
                onChange={setTenure}
                isTenure={true}
                tenureUnit={tenureUnit}
              />
            </div>
          </div>

          {/* Quick Informational footer for value proposition */}
          <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2.5 mt-6 border border-slate-100/50">
            <Sparkles className="w-4 h-4 text-groww-green shrink-0 mt-0.5" />
            <span className="text-[11px] font-sans font-medium text-slate-500 leading-normal">
              Based on historical trends, equity SIPs compounding over long tenures (10Y+) have consistently beaten inflation, yielding stable average annual returns of 12% to 15%.
            </span>
          </div>
        </div>

        {/* Right Column: Visualization, Summaries, and Donut */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-xs" id="sip-calculator-outputs">
          <div>
            <h3 className="text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mb-4">
              Calculation Summary
            </h3>
            
            {/* Primary Display Cards with clean spacing and typography */}
            <div className="space-y-3.5 mb-6">
              
              {/* Invested Amount Card */}
              <div className="bg-white rounded-xl p-3 border border-slate-100 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-sans font-medium text-slate-500">Invested Amount</span>
                </div>
                <span className="text-base font-mono font-bold text-slate-900">
                  {formatIndianCurrency(results.investedAmount)}
                </span>
              </div>

              {/* Estimated Returns Card */}
              <div className="bg-white rounded-xl p-3 border border-slate-100 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-sans font-medium text-slate-500">Est. Returns</span>
                </div>
                <span className="text-base font-mono font-bold text-groww-green">
                  +{formatIndianCurrency(results.estimatedReturns)}
                </span>
              </div>

              {/* Total Future Value Highlight Box */}
              <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100/40 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-sans font-semibold text-slate-700">Total Value</span>
                  <span className="text-[10px] text-slate-400 font-sans mt-0.5">Principal + Returns</span>
                </div>
                <span className="text-xl font-mono font-bold text-slate-900">
                  {formatIndianCurrency(results.totalValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Clean custom interactive donut chart */}
          <div className="border-t border-slate-200/60 pt-4 flex-1 flex flex-col justify-center">
            <DonutChart
              segments={chartSegments}
              centerLabel="Total Value"
              centerValue={results.totalValue}
            />
          </div>
        </div>
      </div>

      {/* Expandable detailed monthly list ledger */}
      <DetailedMonthlyTable
        type="SIP_LUMPSUM"
        sipRows={results.schedule}
      />
    </div>
  );
}
