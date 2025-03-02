
import React, { useState, useEffect } from 'react';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import CalculatorCard from '@/components/ui-elements/CalculatorCard';
import CalculatorInput from '@/components/ui-elements/CalculatorInput';
import ResultDisplay from '@/components/ui-elements/ResultDisplay';
import CalculatorTabs, { Tab } from '@/components/ui-elements/CalculatorTabs';
import LineChart from '@/components/charts/LineChart';

const CreditScoreCalculator: React.FC = () => {
  // Payment History (35% impact)
  const [paymentHistory, setPaymentHistory] = useState(100); // % of on-time payments
  
  // Credit Utilization (30% impact)
  const [totalCredit, setTotalCredit] = useState(200000); // Total available credit
  const [usedCredit, setUsedCredit] = useState(60000); // Credit used
  
  // Credit Age (15% impact)
  const [creditAge, setCreditAge] = useState(36); // In months
  
  // Credit Mix (10% impact)
  const [creditMixScore, setCreditMixScore] = useState(8); // Out of 10
  
  // Credit Inquiries (10% impact)
  const [inquiries, setInquiries] = useState(1); // Number of hard inquiries in last 2 years
  
  // Calculated score
  const [creditScore, setCreditScore] = useState(0);
  const [scoreCategory, setScoreCategory] = useState('');
  const [scoreColor, setScoreColor] = useState('');
  
  // Calculate credit score
  useEffect(() => {
    // Payment History (35% weight)
    const paymentScore = Math.min(100, paymentHistory) * 3.5;
    
    // Credit Utilization (30% weight)
    const utilizationRatio = (usedCredit / totalCredit) * 100;
    // Lower utilization is better (less than 30% is ideal)
    const utilizationScore = Math.max(0, 100 - (utilizationRatio * 3)) * 3;
    
    // Credit Age (15% weight)
    // Credit age increases score (up to 7 years or 84 months for max score)
    const ageScore = Math.min(84, creditAge) / 84 * 150;
    
    // Credit Mix (10% weight)
    const mixScore = creditMixScore * 10;
    
    // Credit Inquiries (10% weight)
    // Fewer inquiries is better (0 is ideal, more than 5 is bad)
    const inquiryScore = Math.max(0, 100 - (inquiries * 20)) * 1;
    
    // Calculate total score (out of 850)
    const rawScore = 300 + ((paymentScore + utilizationScore + ageScore + mixScore + inquiryScore) / 100) * 550;
    const finalScore = Math.round(Math.min(850, Math.max(300, rawScore)));
    setCreditScore(finalScore);
    
    // Determine score category
    if (finalScore >= 800) {
      setScoreCategory('Excellent');
      setScoreColor('bg-green-500/10');
    } else if (finalScore >= 740) {
      setScoreCategory('Very Good');
      setScoreColor('bg-emerald-500/10');
    } else if (finalScore >= 670) {
      setScoreCategory('Good');
      setScoreColor('bg-blue-500/10');
    } else if (finalScore >= 580) {
      setScoreCategory('Fair');
      setScoreColor('bg-yellow-500/10');
    } else {
      setScoreCategory('Poor');
      setScoreColor('bg-red-500/10');
    }
  }, [paymentHistory, totalCredit, usedCredit, creditAge, creditMixScore, inquiries]);

  // Chart data for score factor breakdown
  const chartData = [
    {
      name: 'Payment History (35%)',
      value: 35,
      score: Math.round((paymentHistory / 100) * 35),
    },
    {
      name: 'Credit Utilization (30%)',
      value: 30,
      score: Math.round(Math.max(0, 30 - ((usedCredit / totalCredit) * 100 * 0.9))),
    },
    {
      name: 'Credit Age (15%)',
      value: 15,
      score: Math.round(Math.min(15, (creditAge / 84) * 15)),
    },
    {
      name: 'Credit Mix (10%)',
      value: 10,
      score: Math.round((creditMixScore / 10) * 10),
    },
    {
      name: 'Credit Inquiries (10%)',
      value: 10,
      score: Math.round(Math.max(0, 10 - (inquiries * 2))),
    },
  ];

  const formattedChartData = chartData.map(item => ({
    name: item.name,
    'Maximum Impact': item.value,
    'Your Score': item.score,
  }));

  // Credit utilization ratio
  const utilizationRatio = (usedCredit / totalCredit) * 100;

  // Simple recommendations based on the score
  const getRecommendations = () => {
    const recommendations = [];
    
    if (paymentHistory < 100) {
      recommendations.push("Aim for 100% on-time payments to improve your payment history");
    }
    
    if (utilizationRatio > 30) {
      recommendations.push("Try to keep your credit utilization below 30%");
    }
    
    if (creditAge < 24) {
      recommendations.push("Keep your oldest credit accounts open to increase average credit age");
    }
    
    if (creditMixScore < 7) {
      recommendations.push("Consider diversifying your credit mix with different types of accounts");
    }
    
    if (inquiries > 2) {
      recommendations.push("Limit new credit applications to reduce the number of hard inquiries");
    }
    
    return recommendations.length > 0 
      ? recommendations 
      : ["Your credit score is in good standing. Continue your current credit habits."];
  };

  // Main calculator tab
  const calculatorTab = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <CalculatorCard 
          title="Credit Factors" 
          description="Adjust these factors to calculate your potential credit score"
        >
          <div className="space-y-1">
            <CalculatorInput 
              id="payment-history"
              label="Payment History"
              description="Percentage of on-time payments"
              value={paymentHistory}
              onChange={setPaymentHistory}
              min={0}
              max={100}
              step={1}
              suffix="%"
            />
            
            <CalculatorInput 
              id="total-credit"
              label="Total Credit Limit"
              value={totalCredit}
              onChange={setTotalCredit}
              min={1000}
              max={1000000}
              step={1000}
              prefix="₹"
            />
            
            <CalculatorInput 
              id="used-credit"
              label="Current Credit Usage"
              value={usedCredit}
              onChange={val => setUsedCredit(Math.min(val, totalCredit))}
              min={0}
              max={totalCredit}
              step={1000}
              prefix="₹"
            />
            
            <CalculatorInput 
              id="credit-age"
              label="Average Credit Age"
              description="In months"
              value={creditAge}
              onChange={setCreditAge}
              min={0}
              max={360}
              step={1}
              suffix=" months"
            />
            
            <CalculatorInput 
              id="credit-mix"
              label="Credit Mix Score"
              description="Credit diversity (1-10)"
              value={creditMixScore}
              onChange={setCreditMixScore}
              min={1}
              max={10}
              step={1}
              suffix="/10"
            />
            
            <CalculatorInput 
              id="inquiries"
              label="Recent Hard Inquiries"
              description="Last 24 months"
              value={inquiries}
              onChange={setInquiries}
              min={0}
              max={10}
              step={1}
            />
          </div>
        </CalculatorCard>
      </div>
      
      <div className="space-y-6">
        <CalculatorCard 
          title="Your Credit Score" 
          highlight={true}
        >
          <div className="text-center py-4">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${scoreColor} mb-4`}>
              <span className="text-4xl font-bold">{creditScore}</span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">{scoreCategory}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Range: 300-850
            </p>
            
            <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${((creditScore - 300) / 550) * 100}%`,
                  background: 'linear-gradient(to right, #ef4444, #f59e0b, #22c55e)'
                }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor<br/>300</span>
              <span>Fair<br/>580</span>
              <span>Good<br/>670</span>
              <span>Very Good<br/>740</span>
              <span>Excellent<br/>800</span>
            </div>
          </div>
        </CalculatorCard>
        
        <CalculatorCard 
          title="Utilization Ratio" 
          description="Credit used vs. available credit"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Ratio</span>
              <span className={`text-lg font-semibold ${utilizationRatio > 30 ? 'text-red-500' : 'text-green-500'}`}>
                {utilizationRatio.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  utilizationRatio > 70 ? 'bg-red-500' : 
                  utilizationRatio > 30 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, utilizationRatio)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0% (Ideal)</span>
              <span>30% (Good)</span>
              <span>70% (High)</span>
              <span>100%</span>
            </div>
          </div>
        </CalculatorCard>
      </div>
      
      <div className="lg:col-span-2">
        <LineChart
          title="Credit Score Factors"
          type="bar"
          data={formattedChartData}
          series={[
            { name: 'Maximum Impact', dataKey: 'Maximum Impact', color: '#94a3b8' },
            { name: 'Your Score', dataKey: 'Your Score', color: '#8b5cf6' }
          ]}
          yAxisFormatter={(value) => `${value}%`}
          tooltipFormatter={(value) => `${value}%`}
        />
      </div>
    </div>
  );

  // Recommendations tab
  const recommendationsTab = (
    <CalculatorCard title="Recommendations to Improve Your Score">
      <ul className="space-y-3 py-2">
        {getRecommendations().map((recommendation, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>{recommendation}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            This calculator provides an estimate based on common credit scoring factors. 
            Actual credit scores may vary based on specific credit bureau algorithms and additional factors.
          </p>
        </div>
      </div>
    </CalculatorCard>
  );
  
  // Define tabs
  const tabs: Tab[] = [
    { id: 'calculator', label: 'Calculator', content: calculatorTab },
    { id: 'recommendations', label: 'Recommendations', content: recommendationsTab },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Credit Score Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Estimate your credit score based on key financial factors that lenders consider.
      </p>
      
      <CalculatorTabs tabs={tabs} defaultTab="calculator" />
    </div>
  );
};

export default CreditScoreCalculator;
