import { SipLumpsumRow, LoanAmortizationRow } from '../types';

/**
 * Format currency in Indian Numbering System (en-IN)
 * e.g., ₹10,00,000 instead of ₹1,000,000
 */
export function formatIndianCurrency(amount: number, includeDecimals = false): string {
  if (isNaN(amount) || !isFinite(amount)) return '₹0';
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });
  
  return formatter.format(amount);
}

/**
 * Helper to display values in Lakhs or Crores in input labels
 * e.g., 10,00,000 => 10 Lakh, 1,50,00,000 => 1.5 Crore
 */
export function formatIndianWord(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    return `${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }
  return formatIndianCurrency(amount);
}

/**
 * Calculate SIP Future Value and breakdown
 * Formula: FV = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
 */
export function calculateSip(
  monthlyInvestment: number,
  expectedReturnAnnual: number,
  months: number
): {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  schedule: SipLumpsumRow[];
} {
  const investedAmount = monthlyInvestment * months;
  
  if (expectedReturnAnnual === 0) {
    const schedule: SipLumpsumRow[] = [];
    let currentBalance = 0;
    for (let m = 1; m <= months; m++) {
      const beg = currentBalance;
      currentBalance += monthlyInvestment;
      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        beginningBalance: beg,
        monthlyDeposit: monthlyInvestment,
        interestEarned: 0,
        endingBalance: currentBalance,
      });
    }
    return {
      investedAmount,
      estimatedReturns: 0,
      totalValue: investedAmount,
      schedule,
    };
  }

  const i = expectedReturnAnnual / 12 / 100;
  
  // High-precision step-by-step monthly compilation
  const schedule: SipLumpsumRow[] = [];
  let currentBalance = 0;
  
  for (let m = 1; m <= months; m++) {
    const beg = currentBalance;
    const active = beg + monthlyInvestment;
    const interest = active * i;
    const end = active + interest;
    
    schedule.push({
      month: m,
      year: Math.ceil(m / 12),
      beginningBalance: Number(beg.toFixed(2)),
      monthlyDeposit: monthlyInvestment,
      interestEarned: Number(interest.toFixed(2)),
      endingBalance: Number(end.toFixed(2)),
    });
    
    currentBalance = end;
  }
  
  const totalValue = currentBalance;
  const estimatedReturns = Math.max(0, totalValue - investedAmount);
  
  return {
    investedAmount,
    estimatedReturns: Number(estimatedReturns.toFixed(2)),
    totalValue: Number(totalValue.toFixed(2)),
    schedule,
  };
}

/**
 * Calculate Lumpsum Future Value and breakdown
 * Formula: FV = P * (1 + r/100)^t
 */
export function calculateLumpsum(
  investmentAmount: number,
  expectedReturnAnnual: number,
  months: number
): {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  schedule: SipLumpsumRow[];
} {
  const investedAmount = investmentAmount;
  
  if (expectedReturnAnnual === 0) {
    const schedule: SipLumpsumRow[] = [];
    for (let m = 1; m <= months; m++) {
      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        beginningBalance: investmentAmount,
        monthlyDeposit: 0,
        interestEarned: 0,
        endingBalance: investmentAmount,
      });
    }
    return {
      investedAmount,
      estimatedReturns: 0,
      totalValue: investmentAmount,
      schedule,
    };
  }

  // Equivalent monthly growth rate to match annual compound rate: (1 + r)^(1/12) - 1
  const annualRateDecimal = expectedReturnAnnual / 100;
  const monthlyRate = Math.pow(1 + annualRateDecimal, 1 / 12) - 1;
  
  const schedule: SipLumpsumRow[] = [];
  let currentBalance = investmentAmount;
  
  for (let m = 1; m <= months; m++) {
    const beg = currentBalance;
    const interest = beg * monthlyRate;
    const end = beg + interest;
    
    schedule.push({
      month: m,
      year: Math.ceil(m / 12),
      beginningBalance: Number(beg.toFixed(2)),
      monthlyDeposit: 0,
      interestEarned: Number(interest.toFixed(2)),
      endingBalance: Number(end.toFixed(2)),
    });
    
    currentBalance = end;
  }
  
  const totalValue = currentBalance;
  const estimatedReturns = Math.max(0, totalValue - investedAmount);
  
  return {
    investedAmount,
    estimatedReturns: Number(estimatedReturns.toFixed(2)),
    totalValue: Number(totalValue.toFixed(2)),
    schedule,
  };
}

/**
 * Calculate Loan EMI and Amortization Schedule
 * Formula: EMI = P * i * (1 + i)^n / ((1 + i)^n - 1)
 */
export function calculateLoan(
  loanAmount: number,
  annualInterestRate: number,
  months: number
): {
  monthlyEmi: number;
  totalInterestPayable: number;
  totalPayment: number;
  schedule: LoanAmortizationRow[];
} {
  if (annualInterestRate === 0) {
    const emi = loanAmount / months;
    const schedule: LoanAmortizationRow[] = [];
    let balance = loanAmount;
    
    for (let m = 1; m <= months; m++) {
      const open = balance;
      const principal = emi;
      balance = Math.max(0, balance - principal);
      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        openingBalance: Number(open.toFixed(2)),
        emi: Number(emi.toFixed(2)),
        principalPaid: Number(principal.toFixed(2)),
        interestPaid: 0,
        closingBalance: Number(balance.toFixed(2)),
      });
    }
    
    return {
      monthlyEmi: emi,
      totalInterestPayable: 0,
      totalPayment: loanAmount,
      schedule,
    };
  }

  const i = annualInterestRate / 12 / 100;
  const emiNumerator = loanAmount * i * Math.pow(1 + i, months);
  const emiDenominator = Math.pow(1 + i, months) - 1;
  const monthlyEmi = emiNumerator / emiDenominator;
  
  const schedule: LoanAmortizationRow[] = [];
  let balance = loanAmount;
  let totalInterestPayable = 0;
  
  for (let m = 1; m <= months; m++) {
    const open = balance;
    const interest = open * i;
    let principal = monthlyEmi - interest;
    
    // Guard against floating point residuals on the final month
    if (m === months || principal > balance) {
      principal = balance;
    }
    
    balance = Math.max(0, balance - principal);
    totalInterestPayable += interest;
    
    schedule.push({
      month: m,
      year: Math.ceil(m / 12),
      openingBalance: Number(open.toFixed(2)),
      emi: Number((principal + interest).toFixed(2)),
      principalPaid: Number(principal.toFixed(2)),
      interestPaid: Number(interest.toFixed(2)),
      closingBalance: Number(balance.toFixed(2)),
    });
  }
  
  const totalPayment = loanAmount + totalInterestPayable;
  
  return {
    monthlyEmi: Number(monthlyEmi.toFixed(2)),
    totalInterestPayable: Number(totalInterestPayable.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2)),
    schedule,
  };
}
