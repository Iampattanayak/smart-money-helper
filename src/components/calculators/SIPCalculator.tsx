
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RotateCcw } from 'lucide-react';
import CalculatorInput from '../ui-elements/CalculatorInput';
import CalculatorCard from '../ui-elements/CalculatorCard';
import ResultDisplay from '../ui-elements/ResultDisplay';
import LineChart from '../charts/LineChart';
import {
  calculateSIP,
  formatCurrency,
  generateSIPChartData
} from '@/utils/calculatorUtils';

const SIPCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  
  const [maturityValue, setMaturityValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [wealthGained, setWealthGained] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Calculate SIP results
  useEffect(() => {
    const calculateResults = () => {
      const sipValue = calculateSIP(monthlyInvestment, expectedReturn, timePeriod);
      const totalInvested = monthlyInvestment * timePeriod * 12;
      
      setMaturityValue(sipValue);
      setTotalInvestment(totalInvested);
      setWealthGained(sipValue - totalInvested);
      
      // Generate chart data
      const chartData = generateSIPChartData(monthlyInvestment, expectedReturn, timePeriod);
      setChartData(
        chartData.labels.map((label, index) => ({
          name: label,
          'Invested Amount': chartData.investedAmount[index],
          'Wealth Gained': chartData.wealthGained[index],
        }))
      );
    };
    
    calculateResults();
  }, [monthlyInvestment, expectedReturn, timePeriod]);
  
  const handleReset = () => {
    setMonthlyInvestment(10000);
    setExpectedReturn(12);
    setTimePeriod(10);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <CalculatorCard title="SIP Calculator" description="Calculate returns on Systematic Investment Plan">
          <div className="space-y-4">
            <CalculatorInput
              id="monthly-investment"
              label="Monthly Investment"
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              min={500}
              max={100000}
              step={500}
              prefix="₹"
              showSlider={true}
              placeholder="Enter monthly investment"
            />
            
            <CalculatorInput
              id="expected-return"
              label="Expected Return Rate"
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={1}
              max={30}
              step={0.5}
              suffix="%"
              showSlider={true}
              placeholder="Enter expected annual return"
            />
            
            <CalculatorInput
              id="time-period"
              label="Time Period"
              value={timePeriod}
              onChange={setTimePeriod}
              min={1}
              max={30}
              step={1}
              suffix="Years"
              showSlider={true}
              placeholder="Enter investment duration"
            />
            
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>
          </div>
        </CalculatorCard>
      </div>
      
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ResultDisplay
            label="Invested Amount"
            value={formatCurrency(totalInvestment)}
            highlightColor="bg-blue-500/10"
            className="sm:col-span-1"
          />
          <ResultDisplay
            label="Estimated Returns"
            value={formatCurrency(wealthGained)}
            highlightColor="bg-green-500/10"
            className="sm:col-span-1"
          />
          <ResultDisplay
            label="Total Value"
            value={formatCurrency(maturityValue)}
            highlightColor="bg-primary/10"
            className="sm:col-span-1"
          />
        </div>
        
        {chartData.length > 0 && (
          <LineChart
            title="Investment Growth"
            data={chartData}
            series={[
              { name: 'Invested Amount', dataKey: 'Invested Amount', color: '#1E90FF', stackId: 'a' },
              { name: 'Wealth Gained', dataKey: 'Wealth Gained', color: '#4CAF50', stackId: 'a' }
            ]}
            type="bar"
            yAxisFormatter={(value) => `₹${Math.round(value / 1000)}K`}
            tooltipFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          />
        )}
      </div>
    </div>
  );
};

export default SIPCalculator;
