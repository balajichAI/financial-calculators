import React, { useState, useMemo } from 'react';
import { SipLumpsumRow, LoanAmortizationRow } from '../types';
import { formatIndianCurrency } from '../utils/calculatorMath';
import { ChevronDown, ChevronRight, Search, Calendar, Landmark, Coins } from 'lucide-react';

interface DetailedMonthlyTableProps {
  type: 'SIP_LUMPSUM' | 'LOAN';
  sipRows?: SipLumpsumRow[];
  loanRows?: LoanAmortizationRow[];
}

export default function DetailedMonthlyTable({ type, sipRows = [], loanRows = [] }: DetailedMonthlyTableProps) {
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({ 1: true }); // Expand year 1 by default

  // Group monthly rows into years
  const yearlyData = useMemo(() => {
    if (type === 'SIP_LUMPSUM') {
      const groups: Record<number, SipLumpsumRow[]> = {};
      sipRows.forEach(row => {
        if (!groups[row.year]) groups[row.year] = [];
        groups[row.year].push(row);
      });

      return Object.entries(groups).map(([yearStr, rows]) => {
        const year = parseInt(yearStr);
        const beginningBalance = rows[0].beginningBalance;
        const totalDeposit = rows.reduce((sum, r) => sum + r.monthlyDeposit, 0);
        const totalInterest = rows.reduce((sum, r) => sum + r.interestEarned, 0);
        const endingBalance = rows[rows.length - 1].endingBalance;

        return {
          year,
          beginningBalance,
          deposit: totalDeposit,
          interest: totalInterest,
          endingBalance,
          months: rows,
        };
      });
    } else {
      const groups: Record<number, LoanAmortizationRow[]> = {};
      loanRows.forEach(row => {
        if (!groups[row.year]) groups[row.year] = [];
        groups[row.year].push(row);
      });

      return Object.entries(groups).map(([yearStr, rows]) => {
        const year = parseInt(yearStr);
        const openingBalance = rows[0].openingBalance;
        const totalEmi = rows.reduce((sum, r) => sum + r.emi, 0);
        const totalPrincipal = rows.reduce((sum, r) => sum + r.principalPaid, 0);
        const totalInterest = rows.reduce((sum, r) => sum + r.interestPaid, 0);
        const closingBalance = rows[rows.length - 1].closingBalance;

        return {
          year,
          openingBalance,
          emi: totalEmi,
          principal: totalPrincipal,
          interest: totalInterest,
          closingBalance,
          months: rows,
        };
      });
    }
  }, [type, sipRows, loanRows]);

  const toggleYear = (year: number) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const toggleAllYears = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    yearlyData.forEach(y => {
      next[y.year] = expand;
    });
    setExpandedYears(next);
  };

  // Filter based on search query
  const filteredYearlyData = useMemo(() => {
    if (!searchQuery) return yearlyData;
    const query = searchQuery.toLowerCase();
    return yearlyData.filter(y => {
      const yearMatches = `year ${y.year}`.includes(query) || y.year.toString().includes(query);
      if (yearMatches) return true;
      
      // Also check if any month in the year matches
      const monthMatches = y.months.some(m => 
        `month ${m.month}`.includes(query) || m.month.toString().includes(query)
      );
      return monthMatches;
    });
  }, [yearlyData, searchQuery]);

  // Flat list of months for monthly view filtered
  const filteredMonthlyData = useMemo(() => {
    if (type === 'SIP_LUMPSUM') {
      if (!searchQuery) return sipRows;
      const query = searchQuery.toLowerCase();
      return sipRows.filter(m => 
        `month ${m.month}`.includes(query) || m.month.toString().includes(query) || `year ${m.year}`.includes(query)
      );
    } else {
      if (!searchQuery) return loanRows;
      const query = searchQuery.toLowerCase();
      return loanRows.filter(m => 
        `month ${m.month}`.includes(query) || m.month.toString().includes(query) || `year ${m.year}`.includes(query)
      );
    }
  }, [type, sipRows, loanRows, searchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 md:p-6 shadow-sm shadow-slate-50 mt-8" id="detailed-breakdown-section">
      {/* Table Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-groww-green" />
            Amortization & Growth Ledger
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological progression of your {type === 'SIP_LUMPSUM' ? 'investments & wealth accumulation' : 'loan balances & debt repayments'}.
          </p>
        </div>

        {/* Segmented Controller to switch Yearly vs Monthly view */}
        <div className="flex flex-row items-center gap-2 w-full md:w-auto self-stretch">
          <div className="bg-slate-100 p-1 rounded-xl flex flex-row items-center flex-1 md:flex-initial">
            <button
              id="btn-view-yearly"
              onClick={() => { setViewMode('yearly'); }}
              className={`text-xs font-sans font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex-1 md:flex-initial ${
                viewMode === 'yearly'
                  ? 'bg-white text-groww-dark shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Yearly View
            </button>
            <button
              id="btn-view-monthly"
              onClick={() => { setViewMode('monthly'); }}
              className={`text-xs font-sans font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex-1 md:flex-initial ${
                viewMode === 'monthly'
                  ? 'bg-white text-groww-dark shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Monthly View
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Accordion Global Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="table-search-input"
            type="text"
            placeholder="Search by Month or Year (e.g. 'Year 2', 'Month 12')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-groww-green focus:bg-white transition-all duration-200"
          />
        </div>

        {viewMode === 'yearly' && (
          <div className="flex flex-row gap-2 w-full sm:w-auto shrink-0 justify-end">
            <button
              id="btn-expand-all"
              onClick={() => toggleAllYears(true)}
              className="text-[11px] font-sans font-semibold text-groww-dark hover:text-groww-green bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <button
              id="btn-collapse-all"
              onClick={() => toggleAllYears(false)}
              className="text-[11px] font-sans font-semibold text-groww-dark hover:text-groww-green bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        )}
      </div>

      {/* RENDER TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 max-h-[460px] overflow-y-auto relative shadow-inner">
        {type === 'SIP_LUMPSUM' ? (
          /* SIP & LUMPSUM TABLE */
          <table className="w-full text-left border-collapse" id="table-wealth-ledger">
            <thead className="sticky top-0 bg-slate-900 text-white select-none z-10">
              <tr>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider">Timeline</th>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider text-right">Beginning Balance</th>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider text-right">Deposits</th>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider text-right text-emerald-300">Interest Earned</th>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider text-right">Ending Balance</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-700">
              {viewMode === 'yearly' ? (
                /* YEARLY COLLAPSIBLE RENDER */
                filteredYearlyData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-400 font-sans">
                      No matching yearly ledger found.
                    </td>
                  </tr>
                ) : (
                  filteredYearlyData.map((y) => {
                    const isExpanded = !!expandedYears[y.year];
                    return (
                      <React.Fragment key={`yearly-sip-${y.year}`}>
                        {/* Parent Year Header Row */}
                        <tr 
                          onClick={() => toggleYear(y.year)}
                          className="bg-slate-50 hover:bg-emerald-50/20 cursor-pointer font-sans font-semibold text-slate-900 transition-colors"
                        >
                          <td className="p-3 flex items-center gap-2 select-none">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <span className="flex items-center gap-1.5 text-slate-800">
                              <Landmark className="w-3.5 h-3.5 text-groww-green" />
                              Year {y.year}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono text-xs text-slate-600">
                            {formatIndianCurrency(y.beginningBalance)}
                          </td>
                          <td className="p-3 text-right font-mono text-xs text-slate-600">
                            {formatIndianCurrency(y.deposit)}
                          </td>
                          <td className="p-3 text-right font-mono text-xs text-emerald-600">
                            +{formatIndianCurrency(y.interest)}
                          </td>
                          <td className="p-3 text-right font-mono text-xs text-slate-900 font-bold">
                            {formatIndianCurrency(y.endingBalance)}
                          </td>
                        </tr>

                        {/* Collapsible Monthly Children */}
                        {isExpanded && y.months.map((m) => (
                          <tr 
                            key={`monthly-sip-${m.month}`}
                            className="bg-white hover:bg-slate-50/50 transition-colors border-l-2 border-emerald-400"
                          >
                            <td className="pl-9 pr-3 py-2 text-slate-500 font-sans text-xs flex items-center gap-1.5">
                              <Coins className="w-3 h-3 text-slate-400" />
                              Month {m.month}
                            </td>
                            <td className="p-2 text-right text-slate-500 font-mono">
                              {formatIndianCurrency(m.beginningBalance)}
                            </td>
                            <td className="p-2 text-right text-slate-500 font-mono">
                              {formatIndianCurrency(m.monthlyDeposit)}
                            </td>
                            <td className="p-2 text-right text-emerald-600/80 font-mono">
                              +{formatIndianCurrency(m.interestEarned)}
                            </td>
                            <td className="p-2 text-right text-slate-700 font-bold font-mono">
                              {formatIndianCurrency(m.endingBalance)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                )
              ) : (
                /* FLAT MONTHLY SCHEDULE RENDER */
                filteredMonthlyData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-400 font-sans">
                      No matching monthly schedule found.
                    </td>
                  </tr>
                ) : (
                  (filteredMonthlyData as SipLumpsumRow[]).map((m) => (
                    <tr key={`flat-sip-${m.month}`} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-sans text-xs text-slate-900 font-medium">
                        Month {m.month} <span className="text-slate-400 text-[10px] ml-1.5">(Year {m.year})</span>
                      </td>
                      <td className="p-3 text-right text-slate-500">
                        {formatIndianCurrency(m.beginningBalance)}
                      </td>
                      <td className="p-3 text-right text-slate-500">
                        {formatIndianCurrency(m.monthlyDeposit)}
                      </td>
                      <td className="p-3 text-right text-emerald-600">
                        +{formatIndianCurrency(m.interestEarned)}
                      </td>
                      <td className="p-3 text-right text-slate-900 font-bold">
                        {formatIndianCurrency(m.endingBalance)}
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        ) : (
          /* LOAN REPAYMENT TABLE */
          <table className="w-full text-left border-collapse" id="table-loan-ledger">
            <thead className="sticky top-0 bg-slate-900 text-white select-none z-10">
              <tr>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider">Timeline</th>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider text-right">Opening Balance</th>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider text-right text-emerald-300">EMI Paid</th>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider text-right text-blue-400">Principal Paid</th>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider text-right text-rose-400">Interest Paid</th>
                <th className="p-3 text-xs font-sans font-semibold tracking-wider text-right">Closing Balance</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-700">
              {viewMode === 'yearly' ? (
                /* YEARLY COLLAPSIBLE RENDER */
                filteredYearlyData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-400 font-sans">
                      No matching yearly ledger found.
                    </td>
                  </tr>
                ) : (
                  filteredYearlyData.map((y) => {
                    const isExpanded = !!expandedYears[y.year];
                    return (
                      <React.Fragment key={`yearly-loan-${y.year}`}>
                        {/* Parent Year Header Row */}
                        <tr 
                          onClick={() => toggleYear(y.year)}
                          className="bg-slate-50 hover:bg-emerald-50/20 cursor-pointer font-sans font-semibold text-slate-900 transition-colors"
                        >
                          <td className="p-3 flex items-center gap-2 select-none">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <span className="flex items-center gap-1.5 text-slate-800">
                              <Landmark className="w-3.5 h-3.5 text-groww-green" />
                              Year {y.year}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono text-xs text-slate-600">
                            {formatIndianCurrency(y.openingBalance)}
                          </td>
                          <td className="p-3 text-right font-mono text-xs text-emerald-600 font-bold">
                            {formatIndianCurrency(y.emi)}
                          </td>
                          <td className="p-3 text-right font-mono text-xs text-blue-600">
                            {formatIndianCurrency(y.principal)}
                          </td>
                          <td className="p-3 text-right font-mono text-xs text-rose-600">
                            {formatIndianCurrency(y.interest)}
                          </td>
                          <td className="p-3 text-right font-mono text-xs text-slate-900 font-bold">
                            {formatIndianCurrency(y.closingBalance)}
                          </td>
                        </tr>

                        {/* Collapsible Monthly Children */}
                        {isExpanded && y.months.map((m) => (
                          <tr 
                            key={`monthly-loan-${m.month}`}
                            className="bg-white hover:bg-slate-50/50 transition-colors border-l-2 border-emerald-400"
                          >
                            <td className="pl-9 pr-3 py-2 text-slate-500 font-sans text-xs flex items-center gap-1.5">
                              <Coins className="w-3 h-3 text-slate-400" />
                              Month {m.month}
                            </td>
                            <td className="p-2 text-right text-slate-500 font-mono">
                              {formatIndianCurrency(m.openingBalance)}
                            </td>
                            <td className="p-2 text-right text-emerald-600/80 font-mono">
                              {formatIndianCurrency(m.emi)}
                            </td>
                            <td className="p-2 text-right text-blue-600/80 font-mono">
                              {formatIndianCurrency(m.principalPaid)}
                            </td>
                            <td className="p-2 text-right text-rose-500 font-mono">
                              {formatIndianCurrency(m.interestPaid)}
                            </td>
                            <td className="p-2 text-right text-slate-700 font-bold font-mono">
                              {formatIndianCurrency(m.closingBalance)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                )
              ) : (
                /* FLAT MONTHLY SCHEDULE RENDER */
                filteredMonthlyData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-400 font-sans">
                      No matching monthly schedule found.
                    </td>
                  </tr>
                ) : (
                  (filteredMonthlyData as LoanAmortizationRow[]).map((m) => (
                    <tr key={`flat-loan-${m.month}`} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-sans text-xs text-slate-900 font-medium">
                        Month {m.month} <span className="text-slate-400 text-[10px] ml-1.5">(Year {m.year})</span>
                      </td>
                      <td className="p-3 text-right text-slate-500">
                        {formatIndianCurrency(m.openingBalance)}
                      </td>
                      <td className="p-3 text-right text-emerald-600 font-semibold">
                        {formatIndianCurrency(m.emi)}
                      </td>
                      <td className="p-3 text-right text-blue-600">
                        {formatIndianCurrency(m.principalPaid)}
                      </td>
                      <td className="p-3 text-right text-rose-600">
                        {formatIndianCurrency(m.interestPaid)}
                      </td>
                      <td className="p-3 text-right text-slate-900 font-bold">
                        {formatIndianCurrency(m.closingBalance)}
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
