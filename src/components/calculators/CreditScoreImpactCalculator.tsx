
import React, { useState, useEffect } from 'react';
import { CreditCard, PieChart, TrendingUp, TrendingDown, Info } from 'lucide-react';
import CalculatorCard from '@/components/ui-elements/CalculatorCard';
import CalculatorInput from '@/components/ui-elements/CalculatorInput';
import ResultDisplay from '@/components/ui-elements/ResultDisplay';
import CalculatorTabs, { Tab } from '@/components/ui-elements/CalculatorTabs';
import LineChart from '@/components/charts/LineChart';

const CreditScoreImpactCalculator: React.FC = () => {
  // Current credit score
  const [currentScore, setCurrentScore] = useState(720);
  
  // Actions that impact credit score
  const [missedPayments, setMissedPayments] = useState(0);
  const [newCreditCards, setNewCreditCards] = useState(0);
  const [creditInquiries, setCreditInquiries] = useState(0);
  const [creditUtilizationChange, setCreditUtilizationChange] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState(100);
  const [closedAccount, setClosedAccount] = useState(0);
  
  // Calculated impact
  const [projectedScore, setProjectedScore] = useState(0);
  const [scoreImpact, setScoreImpact] = useState(0);
  const [scoreCategory, setScoreCategory] = useState('');
  const [newScoreCategory, setNewScoreCategory] = useState('');
  
  // For chart data
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Calculate impact on credit score
  useEffect(() => {
    // Impact values based on credit score research
    const missedPaymentImpact = -40; // Each missed payment can drop score by 40-80 points
    const newCreditCardImpact = -5; // Each new card can temporarily drop score by 5-10 points
    const inquiryImpact = -5; // Each inquiry can drop score by 5-10 points
    const utilizationImpactPerPercent = -2; // Each 1% increase in utilization can drop score by ~2 points
    const paymentHistoryImpactPerPercent = -3; // Each 1% decrease in on-time payments
    const closedAccountImpact = -20; // Closing old accounts can drop score by 10-30 points

    // Calculate total impact
    const impact = (
      (missedPayments * missedPaymentImpact) +
      (newCreditCards * newCreditCardImpact) +
      (creditInquiries * inquiryImpact) +
      (creditUtilizationChange * utilizationImpactPerPercent) +
      ((100 - paymentHistory) * paymentHistoryImpactPerPercent) +
      (closedAccount * closedAccountImpact)
    );
    
    setScoreImpact(impact);
    
    // Calculate new projected score
    const newScore = Math.max(300, Math.min(850, currentScore + impact));
    setProjectedScore(Math.round(newScore));
    
    // Update score categories
    setCategoryFromScore(currentScore, setScoreCategory);
    setCategoryFromScore(newScore, setNewScoreCategory);
    
    // Generate historical data for chart
    generateChartData(currentScore, newScore);
  }, [currentScore, missedPayments, newCreditCards, creditInquiries, creditUtilizationChange, paymentHistory, closedAccount]);

  // Helper function to determine credit score category
  const setCategoryFromScore = (score: number, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (score >= 800) {
      setter('Excellent');
    } else if (score >= 740) {
      setter('Very Good');
    } else if (score >= 670) {
      setter('Good');
    } else if (score >= 580) {
      setter('Fair');
    } else {
      setter('Poor');
    }
  };
  
  // Generate chart data
  const generateChartData = (currentScore: number, projectedScore: number) => {
    // Generate data for line chart - showing the impact over time
    const data = [
      { name: 'Current', score: currentScore },
      { name: '1 Month', score: Math.round(currentScore + (scoreImpact * 0.5)) },
      { name: '3 Months', score: Math.round(currentScore + (scoreImpact * 0.7)) },
      { name: '6 Months', score: Math.round(currentScore + (scoreImpact * 0.9)) },
      { name: '12 Months', score: projectedScore }
    ];
    
    setChartData(data);
  };

  // Get color based on impact
  const getImpactColor = (impact: number) => {
    if (impact >= 0) return 'bg-green-500/10';
    if (impact >= -20) return 'bg-amber-500/10';
    if (impact >= -50) return 'bg-orange-500/10';
    return 'bg-red-500/10';
  };
  
  // Get action breakdown for chart
  const getActionBreakdown = () => {
    const actions = [
      {
        name: 'Missed Payments',
        impact: missedPayments * -40,
        value: missedPayments
      },
      {
        name: 'New Credit Cards',
        impact: newCreditCards * -5,
        value: newCreditCards
      },
      {
        name: 'Credit Inquiries',
        impact: creditInquiries * -5,
        value: creditInquiries
      },
      {
        name: 'Utilization Change',
        impact: creditUtilizationChange * -2,
        value: `${creditUtilizationChange}%`
      },
      {
        name: 'Payment History',
        impact: (100 - paymentHistory) * -3,
        value: `${paymentHistory}%`
      },
      {
        name: 'Closed Accounts',
        impact: closedAccount * -20,
        value: closedAccount
      }
    ].filter(item => item.impact !== 0);
    
    return actions;
  };
  
  // Format action impact for display
  const formatImpact = (impact: number) => {
    if (impact === 0) return "0";
    return impact > 0 ? `+${impact}` : `${impact}`;
  };
  
  // Get recommendations to improve credit score
  const getRecommendations = () => {
    const recommendations = [];
    
    if (missedPayments > 0) {
      recommendations.push("Catch up on missed payments and set up automatic payments to avoid future missed payments");
    }
    
    if (creditUtilizationChange > 0) {
      recommendations.push("Work on reducing your credit utilization ratio by paying down balances or requesting credit limit increases");
    }
    
    if (newCreditCards > 0 || creditInquiries > 0) {
      recommendations.push("Limit new credit applications and avoid opening multiple new accounts in a short period");
    }
    
    if (paymentHistory < 100) {
      recommendations.push("Focus on making all payments on time going forward as payment history is the most important factor");
    }
    
    if (closedAccount > 0) {
      recommendations.push("Keep old credit accounts open, even if you're not using them, to maintain a longer credit history");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Your current actions are not negatively impacting your credit score. Continue your good credit habits.");
    }
    
    return recommendations;
  };
  
  // Create chart data for impact breakdown
  const impactBreakdownData = () => {
    const actions = getActionBreakdown();
    if (actions.length === 0) return [];
    
    return actions.map(action => ({
      name: action.name,
      'Score Impact': Math.abs(action.impact),
      'isNegative': action.impact < 0
    }));
  };

  // Impact simulator tab content
  const simulatorTab = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <CalculatorCard 
          title="Current Credit Profile" 
          description="Enter your current credit information"
        >
          <div className="space-y-1">
            <CalculatorInput 
              id="current-score"
              label="Current Credit Score"
              value={currentScore}
              onChange={setCurrentScore}
              min={300}
              max={850}
              step={1}
            />
            
            <CalculatorInput 
              id="payment-history"
              label="On-Time Payment Percentage"
              description="Percentage of payments made on time"
              value={paymentHistory}
              onChange={setPaymentHistory}
              min={0}
              max={100}
              step={1}
              suffix="%"
            />
          </div>
        </CalculatorCard>
        
        <CalculatorCard 
          title="Credit Actions" 
          description="Simulate actions that impact your credit score"
        >
          <div className="space-y-1">
            <CalculatorInput 
              id="missed-payments"
              label="Missed Payments"
              description="Number of payments missed in last 6 months"
              value={missedPayments}
              onChange={setMissedPayments}
              min={0}
              max={6}
              step={1}
            />
            
            <CalculatorInput 
              id="new-credit-cards"
              label="New Credit Cards"
              description="Number of new cards opened in last 6 months"
              value={newCreditCards}
              onChange={setNewCreditCards}
              min={0}
              max={5}
              step={1}
            />
            
            <CalculatorInput 
              id="credit-inquiries"
              label="Hard Credit Inquiries"
              description="Number of inquiries in last 6 months"
              value={creditInquiries}
              onChange={setCreditInquiries}
              min={0}
              max={10}
              step={1}
            />
            
            <CalculatorInput 
              id="utilization-change"
              label="Utilization Ratio Change"
              description="Percentage points increase in utilization"
              value={creditUtilizationChange}
              onChange={setCreditUtilizationChange}
              min={0}
              max={100}
              step={1}
              suffix="%"
            />
            
            <CalculatorInput 
              id="closed-accounts"
              label="Closed Old Accounts"
              description="Number of accounts closed in last 6 months"
              value={closedAccount}
              onChange={setClosedAccount}
              min={0}
              max={5}
              step={1}
            />
          </div>
        </CalculatorCard>
      </div>
      
      <div className="space-y-6">
        <CalculatorCard 
          title="Credit Score Impact" 
          highlight={true}
        >
          <div className="text-center py-4">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium text-muted-foreground mb-1">Current Score</div>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-500/10 mb-2">
                  <span className="text-3xl font-semibold">{currentScore}</span>
                </div>
                <span className="text-sm font-medium">{scoreCategory}</span>
              </div>
              
              <div className="flex items-center justify-center">
                <div className={`flex items-center justify-center px-3 py-1 rounded-full ${
                  scoreImpact >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                }`}>
                  {scoreImpact >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span className="font-medium text-sm">{formatImpact(scoreImpact)} pts</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium text-muted-foreground mb-1">Projected Score</div>
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getImpactColor(scoreImpact)} mb-2`}>
                  <span className="text-3xl font-semibold">{projectedScore}</span>
                </div>
                <span className="text-sm font-medium">{newScoreCategory}</span>
              </div>
            </div>
            
            <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden mt-6 mb-2">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${((projectedScore - 300) / 550) * 100}%`,
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
          title="Impact Breakdown" 
          description="How each action affects your credit score"
        >
          <div className="space-y-3">
            {getActionBreakdown().length > 0 ? (
              getActionBreakdown().map((action, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b border-border/60 last:border-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{action.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({action.value})</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    action.impact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatImpact(action.impact)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-2">No actions selected that impact your score</p>
            )}
          </div>
        </CalculatorCard>
      </div>
      
      <div className="lg:col-span-2">
        <CalculatorCard 
          title="Projected Score Over Time" 
          description="How your credit score may change over the next 12 months"
        >
          <div className="h-80">
            <LineChart
              data={chartData}
              series={[
                { name: 'Credit Score', dataKey: 'score', color: '#8b5cf6' }
              ]}
              yAxisFormatter={(value) => `${value}`}
              tooltipFormatter={(value) => `${value}`}
            />
          </div>
        </CalculatorCard>
      </div>
    </div>
  );

  // Recommendations tab
  const recommendationsTab = (
    <CalculatorCard title="Recommendations to Improve Your Score">
      <div className="space-y-6">
        <ul className="space-y-3 py-2">
          {getRecommendations().map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
        
        {impactBreakdownData().length > 0 && (
          <div className="pt-4">
            <h3 className="text-lg font-medium mb-4">Impact Severity Chart</h3>
            <div className="h-72">
              <LineChart
                type="bar"
                data={impactBreakdownData()}
                series={[{ 
                  name: 'Score Impact', 
                  dataKey: 'Score Impact',
                  color: '#8b5cf6',
                  colorSelector: (entry) => entry.isNegative ? '#ef4444' : '#22c55e'
                }]}
                yAxisFormatter={(value) => `${value} pts`}
                tooltipFormatter={(value) => `${value} pts`}
              />
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              This calculator provides an estimate of how your actions might impact your credit score.
              Actual impacts may vary based on your specific credit history, the scoring model used,
              and other factors unique to your credit profile.
            </p>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
  
  // Define tabs
  const tabs: Tab[] = [
    { id: 'simulator', label: 'Impact Simulator', content: simulatorTab },
    { id: 'recommendations', label: 'Recommendations', content: recommendationsTab },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Credit Score Impact Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Simulate how different financial actions could impact your credit score over time.
      </p>
      
      <CalculatorTabs tabs={tabs} defaultTab="simulator" />
    </div>
  );
};

export default CreditScoreImpactCalculator;
