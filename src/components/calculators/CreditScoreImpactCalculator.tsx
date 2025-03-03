
// Import the required components and utils
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CalculatorInput from '../ui-elements/CalculatorInput';
import CalculatorCard from '../ui-elements/CalculatorCard';
import LineChart from '../charts/LineChart';
import ResultDisplay from '../ui-elements/ResultDisplay';

// Define the CreditScoreImpactCalculator component
const CreditScoreImpactCalculator: React.FC = () => {
  // State for the score and factors
  const [currentScore, setCurrentScore] = useState(650);
  const [factors, setFactors] = useState([
    { id: 'late_payment', name: 'Late Payment', impact: -50, selected: false },
    { id: 'credit_inquiry', name: 'Credit Inquiry', impact: -10, selected: false },
    { id: 'new_credit_card', name: 'New Credit Card', impact: -25, selected: false },
    { id: 'loan_application', name: 'Loan Application', impact: -20, selected: false },
    { id: 'debt_settlement', name: 'Debt Settlement', impact: -45, selected: false },
    { id: 'bankruptcy', name: 'Bankruptcy', impact: -150, selected: false },
    { id: 'on_time_payments', name: 'Consistent On-Time Payments', impact: 30, selected: false },
    { id: 'credit_limit_increase', name: 'Credit Limit Increase', impact: 15, selected: false },
    { id: 'pay_down_debt', name: 'Pay Down Debt', impact: 40, selected: false },
    { id: 'old_account', name: 'Keep Old Accounts Open', impact: 25, selected: false },
  ]);

  // Calculate the projected score
  const [projectedScore, setProjectedScore] = useState(currentScore);
  
  // Calculate the score impact
  useEffect(() => {
    let impact = 0;
    factors.forEach(factor => {
      if (factor.selected) {
        impact += factor.impact;
      }
    });
    
    // Make sure the score stays within the valid range (300-850)
    const newScore = Math.min(850, Math.max(300, currentScore + impact));
    setProjectedScore(newScore);
  }, [currentScore, factors]);

  // Toggle factor selection
  const toggleFactor = (id: string) => {
    setFactors(factors.map(factor => 
      factor.id === id ? { ...factor, selected: !factor.selected } : factor
    ));
  };

  // Reset all selections
  const resetSelections = () => {
    setFactors(factors.map(factor => ({ ...factor, selected: false })));
  };

  // Prepare data for the chart
  const chartData = factors
    .filter(factor => factor.selected)
    .map(factor => ({
      name: factor.name,
      'Score Impact': Math.abs(factor.impact),
      value: Math.abs(factor.impact),
      isPositive: factor.impact > 0
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <CalculatorCard 
          title="Credit Score Impact Calculator" 
          description="Estimate how your actions might affect your credit score"
        >
          <div className="space-y-6">
            <CalculatorInput
              id="credit-score"
              label="Current Credit Score"
              value={currentScore}
              onChange={setCurrentScore}
              min={300}
              max={850}
              step={1}
              showSlider={true}
              placeholder="Enter your current credit score"
            />
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Select factors that apply:</h3>
              
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-red-500">Negative Factors</h4>
                {factors.filter(f => f.impact < 0).map(factor => (
                  <div
                    key={factor.id}
                    className={`p-2 rounded-md flex items-center justify-between cursor-pointer border transition-colors ${
                      factor.selected
                        ? 'border-red-400 bg-red-50 dark:bg-red-950 dark:border-red-800'
                        : 'border-muted hover:border-muted-foreground'
                    }`}
                    onClick={() => toggleFactor(factor.id)}
                  >
                    <span className="text-sm">{factor.name}</span>
                    <span className={`text-sm font-medium ${factor.selected ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                      {factor.impact}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-green-500">Positive Factors</h4>
                {factors.filter(f => f.impact > 0).map(factor => (
                  <div
                    key={factor.id}
                    className={`p-2 rounded-md flex items-center justify-between cursor-pointer border transition-colors ${
                      factor.selected
                        ? 'border-green-400 bg-green-50 dark:bg-green-950 dark:border-green-800'
                        : 'border-muted hover:border-muted-foreground'
                    }`}
                    onClick={() => toggleFactor(factor.id)}
                  >
                    <span className="text-sm">{factor.name}</span>
                    <span className={`text-sm font-medium ${factor.selected ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      +{factor.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={resetSelections}>
                Reset Selections
              </Button>
            </div>
          </div>
        </CalculatorCard>
      </div>
      
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ResultDisplay
            label="Current Score"
            value={currentScore.toString()}
            highlightColor="bg-primary/10"
          />
          <ResultDisplay
            label="Projected Score"
            value={projectedScore.toString()}
            highlightColor={projectedScore > currentScore ? "bg-green-500/10" : projectedScore < currentScore ? "bg-red-500/10" : "bg-primary/10"}
          />
        </div>
        
        {chartData.length > 0 && (
          <LineChart
            title="Credit Score Impact Factors"
            data={chartData.map(item => ({
              name: item.name,
              'Score Impact': item.value,
            }))}
            series={[
              { 
                name: 'Score Impact', 
                dataKey: 'Score Impact', 
                color: '#6366F1' 
              }
            ]}
            type="bar"
            yAxisFormatter={(value) => value.toString()}
            tooltipFormatter={(value) => `${value} points`}
          />
        )}
      </div>
    </div>
  );
};

export default CreditScoreImpactCalculator;
