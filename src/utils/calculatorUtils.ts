// Finance calculation functions

// EMI calculation
export const calculateEMI = (principal: number, rate: number, time: number): number => {
  // Convert interest rate from percentage to decimal and to monthly rate
  const monthlyRate = rate / 12 / 100;
  // Convert time from years to months
  const months = time * 12;
  
  // Handle edge cases
  if (principal <= 0 || rate <= 0 || time <= 0) return 0;
  
  // EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  
  return numerator / denominator;
};

// Calculate loan amount based on EMI
export const calculateLoanAmount = (emi: number, rate: number, time: number): number => {
  // Convert interest rate from percentage to decimal and to monthly rate
  const monthlyRate = rate / 12 / 100;
  // Convert time from years to months
  const months = time * 12;
  
  // Handle edge cases
  if (emi <= 0 || rate <= 0 || time <= 0) return 0;
  
  // Loan Amount formula: [EMI * ((1+R)^N - 1)] / [R * (1+R)^N]
  const numerator = emi * (Math.pow(1 + monthlyRate, months) - 1);
  const denominator = monthlyRate * Math.pow(1 + monthlyRate, months);
  
  return numerator / denominator;
};

// Calculate interest rate (approximation using binary search)
export const calculateInterestRate = (emi: number, principal: number, time: number): number => {
  // Handle edge cases
  if (emi <= 0 || principal <= 0 || time <= 0) return 0;
  
  // Binary search to find interest rate
  let low = 0;
  let high = 100;
  let mid;
  let calculatedEMI;
  
  // Set a limit for iterations and precision
  const maxIterations = 100;
  const precision = 0.01;
  
  for (let i = 0; i < maxIterations; i++) {
    mid = (low + high) / 2;
    calculatedEMI = calculateEMI(principal, mid, time);
    
    if (Math.abs(calculatedEMI - emi) < precision) {
      return Number(mid.toFixed(2));
    } else if (calculatedEMI < emi) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return Number(mid!.toFixed(2));
};

// Calculate time period (approximation using binary search)
export const calculateTimePeriod = (emi: number, principal: number, rate: number): number => {
  // Handle edge cases
  if (emi <= 0 || principal <= 0 || rate <= 0) return 0;
  
  // Binary search to find time period
  let low = 0;
  let high = 30; // 30 years as upper limit
  let mid;
  let calculatedEMI;
  
  // Set a limit for iterations and precision
  const maxIterations = 100;
  const precision = 0.01;
  
  for (let i = 0; i < maxIterations; i++) {
    mid = (low + high) / 2;
    calculatedEMI = calculateEMI(principal, rate, mid);
    
    if (Math.abs(calculatedEMI - emi) < precision) {
      return Number(mid.toFixed(2));
    } else if (calculatedEMI > emi) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return Number(mid!.toFixed(2));
};

// Calculate SIP returns
export const calculateSIP = (
  monthlyInvestment: number,
  expectedReturnRate: number,
  timePeriodYears: number
): number => {
  const monthlyRate = expectedReturnRate / 12 / 100;
  const months = timePeriodYears * 12;
  
  // Handle edge cases
  if (monthlyInvestment <= 0 || expectedReturnRate <= 0 || timePeriodYears <= 0) return 0;
  
  // SIP Formula: P × ({[1 + r]^n - 1} / r) × (1 + r)
  const amount = monthlyInvestment * 
                ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
                (1 + monthlyRate);
                
  return amount;
};

// Calculate GST
export const calculateGST = (amount: number, rate: number): { 
  gstAmount: number;
  totalAmount: number;
  amountWithoutGST: number;
} => {
  // Handle edge cases
  if (amount <= 0 || rate < 0) {
    return {
      gstAmount: 0,
      totalAmount: 0,
      amountWithoutGST: 0
    };
  }
  
  // Calculate GST amount and total
  const gstAmount = amount * (rate / 100);
  const totalAmount = amount + gstAmount;
  
  return {
    gstAmount,
    totalAmount,
    amountWithoutGST: amount
  };
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate amortization schedule for loan
export const calculateAmortizationSchedule = (
  principal: number,
  rate: number,
  time: number
): Array<{
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}> => {
  const emi = calculateEMI(principal, rate, time);
  const monthlyRate = rate / 12 / 100;
  const totalMonths = time * 12;
  
  let balance = principal;
  const schedule = [];
  
  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    
    schedule.push({
      month,
      emi,
      principal: principalPaid,
      interest,
      balance: balance > 0 ? balance : 0
    });
    
    if (balance <= 0) break;
  }
  
  return schedule;
};

// Generate chart data for EMI visualization
export const generateEMIChartData = (
  principal: number,
  rate: number,
  time: number
): {
  labels: string[];
  principal: number[];
  interest: number[];
} => {
  const schedule = calculateAmortizationSchedule(principal, rate, time);
  // Take data points at regular intervals to keep chart clean
  const interval = Math.max(1, Math.floor(schedule.length / 12));
  
  const filteredSchedule = schedule.filter((_, index) => index % interval === 0 || index === schedule.length - 1);
  
  return {
    labels: filteredSchedule.map(item => `Month ${item.month}`),
    principal: filteredSchedule.map(item => principal - item.balance),
    interest: filteredSchedule.map((item, index, array) => {
      // Calculate cumulative interest paid until this point
      const monthIndex = array.findIndex(a => a.month === item.month);
      return array.slice(0, monthIndex + 1).reduce((total, current) => total + current.interest, 0);
    })
  };
};

// Generate chart data for SIP visualization
export const generateSIPChartData = (
  monthlyInvestment: number,
  expectedReturnRate: number,
  timePeriodYears: number
): {
  labels: string[];
  investedAmount: number[];
  wealthGained: number[];
} => {
  const totalMonths = timePeriodYears * 12;
  const monthlyRate = expectedReturnRate / 12 / 100;
  
  const yearlyData = [];
  
  for (let year = 1; year <= timePeriodYears; year++) {
    const months = year * 12;
    const investedAmount = monthlyInvestment * months;
    const futureValue = monthlyInvestment * 
                      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
                      (1 + monthlyRate);
    
    yearlyData.push({
      year,
      investedAmount,
      futureValue,
      wealthGained: futureValue - investedAmount
    });
  }
  
  return {
    labels: yearlyData.map(item => `Year ${item.year}`),
    investedAmount: yearlyData.map(item => item.investedAmount),
    wealthGained: yearlyData.map(item => item.wealthGained)
  };
};
