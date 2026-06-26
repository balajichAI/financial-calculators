import React, { useState, useMemo, useEffect } from 'react';
import { TenureUnit } from '../types';
import { calculateLoan, formatIndianCurrency, formatIndianWord } from '../utils/calculatorMath';
import SliderWithInput from './SliderWithInput';
import DonutChart from './DonutChart';
import DetailedMonthlyTable from './DetailedMonthlyTable';
import { ShieldCheck, Info, Sparkles, AlertCircle } from 'lucide-react';

interface LoanCalculatorViewProps {
  loanType: 'PERSONAL' | 'HOME';
}

export default function LoanCalculatorView({ loanType }: LoanCalculatorViewProps) {
  const isPersonal = loanType === 'PERSONAL';

  // State configurations based on loan type
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('YEARS');
  
  // Initial default states
  const [loanAmount, setLoanAmount] = useState<number>(isPersonal ? 500000 : 4000000); // 5L default for PL, 40L for HL
  const [interestRate, setInterestRate] = useState<number>(isPersonal ? 12 : 8.5); // 12% for PL, 8.5% for HL
  const [tenure, setTenure] = useState<number>(isPersonal ? 5 : 20); // 5 Yrs for PL, 20 Yrs for HL

  // Re-initialize default states if loanType changes (e.g., switching calculators)
  useEffect(() => {
    setLoanAmount(isPersonal ? 500000 : 4000000);
    setInterestRate(isPersonal ? 12 : 8.5);
    setTenure(isPersonal ? 5 : 20);
    setTenureUnit('YEARS');
  }, [loanType]);

  // Set limits dynamically
  const limits = useMemo(() => {
    if (isPersonal) {
      return {
        amount: { min: 10000, max: 5000000, step: 5000 }, // PL limit: 50 Lakhs
        rate: { min: 5, max: 36, step: 0.1 }, // 5% to 36%
        tenure: {
          YEARS: { min: 1, max: 7, step: 1 }, // up to 7 years
          MONTHS: { min: 6, max: 84, step: 1 }, // 6 to 84 months
        }
      };
    } else {
      return {
        amount: { min: 100000, max: 100000000, step: 50000 }, // HL limit: 10 Crores
        rate: { min: 5, max: 20, step: 0.1 }, // 5% to 20%
        tenure: {
          YEARS: { min: 1, max: 30, step: 1 }, // up to 30 years
          MONTHS: { min: 12, max: 360, step: 1 }, // 12 to 360 months
        }
      };
    }
  }, [isPersonal]);

  // Tenure Unit toggle (Years to Months and vice versa)
  const handleUnitToggle = (unit: TenureUnit) => {
    if (unit === tenureUnit) return;

    if (unit === 'MONTHS') {
      const nextMonths = Math.min(
        limits.tenure.MONTHS.max,
        Math.max(limits.tenure.MONTHS.min, tenure * 12)
      );
      setTenure(nextMonths);
    } else {
      const nextYears = Math.min(
        limits.tenure.YEARS.max,
        Math.max(limits.tenure.YEARS.min, Math.round(tenure / 12))
      );
      setTenure(nextYears);
    }
    setTenureUnit(unit);
  };

  const totalMonths = tenureUnit === 'YEARS' ? tenure * 12 : tenure;

  // Run EMI and Amortization calculation
  const results = useMemo(() => {
    return calculateLoan(loanAmount, interestRate, totalMonths);
  }, [loanAmount, interestRate, totalMonths]);

  // Donut chart segments
  const chartSegments = [
    {
      name: 'Principal Amount',
      value: loanAmount,
      color: '#0f172a', // Dark slate
    },
    {
      name: 'Total Interest',
      value: results.totalInterestPayable,
      color: '#00D09C', // Groww Emerald
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in" id={`${loanType.toLowerCase()}-loan-calculator`}>
      {/* Two Column Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Sliders and Toggles */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm shadow-slate-50" id="loan-calculator-inputs">
          <div className="space-y-6">
            
            {/* Input Slider 1: Loan Amount */}
            <SliderWithInput
              idPrefix={`${loanType.toLowerCase()}-amount`}
              label="Loan Amount"
              value={loanAmount}
              min={limits.amount.min}
              max={limits.amount.max}
              step={limits.amount.step}
              onChange={setLoanAmount}
              isCurrency={true}
            />

            {/* Input Slider 2: Interest Rate */}
            <SliderWithInput
              idPrefix={`${loanType.toLowerCase()}-rate`}
              label="Rate of Interest (p.a.)"
              value={interestRate}
              min={limits.rate.min}
              max={limits.rate.max}
              step={limits.rate.step}
              onChange={setInterestRate}
              isPercent={true}
            />

            {/* Input Slider 3: Loan Tenure with Duration Toggle */}
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row justify-between items-center select-none">
                <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest">
                  Duration Setting
                </span>
                
                {/* Duration Toggle (Years/Months) */}
                <div className="bg-slate-100 p-0.5 rounded-lg flex flex-row items-center" id="loan-duration-toggle">
                  <button
                    id={`btn-${loanType.toLowerCase()}-years`}
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
                    id={`btn-${loanType.toLowerCase()}-months`}
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
                idPrefix={`${loanType.toLowerCase()}-tenure`}
                label="Loan Tenure"
                value={tenure}
                min={tenureUnit === 'YEARS' ? limits.tenure.YEARS.min : limits.tenure.MONTHS.min}
                max={tenureUnit === 'YEARS' ? limits.tenure.YEARS.max : limits.tenure.MONTHS.max}
                step={1}
                onChange={setTenure}
                isTenure={true}
                tenureUnit={tenureUnit}
              />
            </div>
          </div>

          {/* Quick Informational note for interest rate warnings */}
          <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2.5 mt-6 border border-slate-100/50">
            {isPersonal ? (
              <>
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-[11px] font-sans font-medium text-slate-500 leading-normal">
                  Personal loans are unsecured. Interest rates vary significantly based on your credit score (CIBIL), ranging between 10.5% to 24% for prime customers.
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-groww-green shrink-0 mt-0.5" />
                <span className="text-[11px] font-sans font-medium text-slate-500 leading-normal">
                  Home Loans can be linked to floating rates (repo rate linked), which makes EMIs subject to change depending on RBI monetary policy announcements.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Calculations & Hero EMI Display Card */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-xs" id="loan-calculator-outputs">
          <div>
            <h3 className="text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mb-4">
              Calculation Summary
            </h3>
            
            {/* Highly visible Monthly EMI HERO CARD (resolving any visual layout hierarchy issues from previous versions) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-2xl p-5 mb-5 shadow-md shadow-slate-200 border border-slate-800 relative overflow-hidden" id="hero-emi-card">
              <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider">
                  Equated Monthly Installment (EMI)
                </span>
                <span className="text-2xl md:text-3.5xl font-mono font-extrabold text-groww-green tracking-tight leading-none pt-1">
                  {formatIndianCurrency(results.monthlyEmi)}
                </span>
                <span className="text-[11px] font-sans text-slate-400 font-medium pt-1.5">
                  Monthly installment payable till tenure ends
                </span>
              </div>
            </div>

            {/* Sub-summaries with clean spacing */}
            <div className="space-y-3.5 mb-6">
              
              {/* Principal Amount Card */}
              <div className="bg-white rounded-xl p-3 border border-slate-100 flex justify-between items-center">
                <span className="text-xs font-sans font-medium text-slate-500">Principal Loan Amount</span>
                <span className="text-sm font-mono font-bold text-slate-900">
                  {formatIndianCurrency(loanAmount)}
                </span>
              </div>

              {/* Total Interest Payable Card */}
              <div className="bg-white rounded-xl p-3 border border-slate-100 flex justify-between items-center">
                <span className="text-xs font-sans font-medium text-slate-500">Total Interest Payable</span>
                <span className="text-sm font-mono font-bold text-rose-500">
                  {formatIndianCurrency(results.totalInterestPayable)}
                </span>
              </div>

              {/* Total Payment Highlight Box */}
              <div className="bg-emerald-50/20 rounded-xl p-3 border border-emerald-100/30 flex justify-between items-center">
                <span className="text-xs font-sans font-semibold text-slate-700">Total Payment (Principal + Interest)</span>
                <span className="text-sm font-mono font-bold text-slate-900">
                  {formatIndianCurrency(results.totalPayment)}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Donut chart displaying split */}
          <div className="border-t border-slate-200/60 pt-4 flex-1 flex flex-col justify-center">
            <DonutChart
              segments={chartSegments}
              centerLabel="Total Repayment"
              centerValue={results.totalPayment}
            />
          </div>
        </div>
      </div>

      {/* Expandable detailed monthly amortization list ledger */}
      <DetailedMonthlyTable
        type="LOAN"
        loanRows={results.schedule}
      />
    </div>
  );
}
