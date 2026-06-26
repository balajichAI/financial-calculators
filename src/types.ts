export type CalculatorType = 'SIP_LUMPSUM' | 'PERSONAL_LOAN' | 'HOME_LOAN';

export type InvestmentType = 'SIP' | 'LUMPSUM';

export type TenureUnit = 'YEARS' | 'MONTHS';

export interface SipLumpsumRow {
  month: number;
  year: number;
  beginningBalance: number;
  monthlyDeposit: number;
  interestEarned: number;
  endingBalance: number;
}

export interface LoanAmortizationRow {
  month: number;
  year: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface ChartDataSegment {
  name: string;
  value: number;
  color: string;
}
